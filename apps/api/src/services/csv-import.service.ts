import fs from 'node:fs';
import path from 'node:path';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { csvImportJobs, user } from '../db/schema/index.js';
import {
  autoMapColumns,
  parseAmount,
  parseCSV,
  parseDate,
  parseStatus,
  type TargetColumn,
} from '../lib/csv-parser.js';
import { AppError, BadRequestError, ConflictError, NotFoundError } from '../lib/errors.js';
import { transactionSchema } from '../lib/schemas.js';
import { transactionService } from './transaction.service.js';

export const UPLOADS_DIR = path.resolve('uploads/csv');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const MAX_ROWS = 2000;
const REQUIRED: TargetColumn[] = ['date', 'salesAgentName', 'productName', 'quantity', 'unitPrice'];

const TEMPLATE = [
  'ID_Transaksi,Tanggal,Nama_Pelanggan,Nama_Sales,Nama_Produk,Kategori_Produk,Qty,Harga_Satuan,Status_Transaksi,Catatan',
  'TRX-CSV-001,2026-11-02,PT Contoh Jaya,Citra Dewi,Laptop Kantor,Elektronik,2,12500000,Sukses,Contoh baris',
  '',
].join('\n');

const storedFile = (jobId: string) => path.join(UPLOADS_DIR, `${jobId}.csv`);

export const csvImportService = {
  template: TEMPLATE,

  /** Store the file and suggest a column mapping. Nothing is imported yet. */
  async upload(file: Express.Multer.File, workspaceId: string, userId: string) {
    try {
      const { headers, rows } = parseCSV(fs.readFileSync(file.path, 'utf-8'));
      if (rows.length === 0) throw new BadRequestError('File CSV tidak berisi data');
      if (rows.length > MAX_ROWS) throw new BadRequestError(`Maksimal ${MAX_ROWS} baris per file`);

      const mapping = autoMapColumns(headers);
      const [job] = await db
        .insert(csvImportJobs)
        .values({
          workspaceId,
          uploadedBy: userId,
          fileName: file.originalname.slice(0, 255),
          status: 'mapping',
          mappingConfig: mapping,
          totalRows: rows.length,
        })
        .returning();
      fs.renameSync(file.path, storedFile(job.id));

      return {
        jobId: job.id,
        headers,
        mapping,
        totalRows: rows.length,
        sampleRows: rows.slice(0, 3),
      };
    } finally {
      // No-op after a successful rename; removes the temp file when validation failed.
      fs.rmSync(file.path, { force: true });
    }
  },

  async execute(jobId: string, mapping: Record<string, TargetColumn>, workspaceId: string) {
    const targets = Object.values(mapping);
    const missing = REQUIRED.filter((r) => !targets.includes(r));
    if (missing.length) {
      throw new BadRequestError(`Kolom wajib belum dipetakan: ${missing.join(', ')}`);
    }
    if (new Set(targets).size !== targets.length) {
      throw new BadRequestError('Satu kolom tujuan dipetakan lebih dari sekali');
    }

    const owned = and(eq(csvImportJobs.id, jobId), eq(csvImportJobs.workspaceId, workspaceId));
    const [existing] = await db.select().from(csvImportJobs).where(owned);
    if (!existing) throw new NotFoundError('Impor CSV');

    // Claim the job atomically so the same file cannot be imported twice.
    const [job] = await db
      .update(csvImportJobs)
      .set({ status: 'importing', mappingConfig: mapping })
      .where(and(owned, eq(csvImportJobs.status, 'mapping')))
      .returning();
    if (!job) throw new ConflictError('File ini sudah diproses');

    const { rows } = parseCSV(fs.readFileSync(storedFile(jobId), 'utf-8'));
    const members = await db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .where(and(eq(user.workspaceId, workspaceId), eq(user.isActive, true)));

    const records = rows.map((row, index) => {
      const record: Partial<Record<TargetColumn, string>> = {};
      for (const [source, target] of Object.entries(mapping)) record[target] = row[source] ?? '';
      return { line: index + 2, record };
    });
    // Oldest first, so tier totals build up in the order the sales happened.
    records.sort((a, b) =>
      parseDate(a.record.date ?? '').localeCompare(parseDate(b.record.date ?? ''))
    );

    const errors: { row: number; error: string }[] = [];
    let imported = 0;

    for (const { line, record } of records) {
      try {
        const agentKey = (record.salesAgentName ?? '').trim().toLowerCase();
        const agent = members.find(
          (m) => m.name.toLowerCase() === agentKey || m.email.toLowerCase() === agentKey
        );
        if (!agent) throw new BadRequestError(`Sales "${record.salesAgentName}" tidak ditemukan`);

        const status = parseStatus(record.status ?? '');
        if (!status) throw new BadRequestError(`Status "${record.status}" tidak dikenal`);

        const parsed = transactionSchema.safeParse({
          transactionCode: record.transactionCode || undefined,
          customerName: record.customerName || '-',
          date: parseDate(record.date ?? ''),
          salesAgentId: agent.id,
          productName: record.productName ?? '',
          productCategory: record.productCategory || undefined,
          quantity: parseAmount(record.quantity ?? ''),
          unitPrice: parseAmount(record.unitPrice ?? ''),
          notes: record.notes || undefined,
        });
        if (!parsed.success) {
          const issue = parsed.error.issues[0];
          throw new BadRequestError(`${issue.path.join('.')}: ${issue.message}`);
        }

        await transactionService.create(parsed.data, workspaceId, status);
        imported++;
      } catch (err) {
        if (!(err instanceof AppError)) console.error('[CSV]', err);
        errors.push({
          row: line,
          error: err instanceof AppError ? err.message : 'Baris gagal disimpan',
        });
      }
    }

    errors.sort((a, b) => a.row - b.row);
    await db
      .update(csvImportJobs)
      .set({
        status: imported === 0 ? 'failed' : 'completed',
        processedRows: imported,
        errorLog: errors.length ? errors : null,
        completedAt: new Date(),
      })
      .where(eq(csvImportJobs.id, jobId));
    fs.rmSync(storedFile(jobId), { force: true });

    return { imported, totalRows: rows.length, errors };
  },
};
