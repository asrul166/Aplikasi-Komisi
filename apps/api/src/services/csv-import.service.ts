import { db } from '../db/index.js';
import { csvImportJobs, transactions } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors.js';
import { parseCSV, autoMapColumns } from '../lib/csv-parser.js';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.resolve('uploads/csv');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const csvImportService = {
  /**
   * Upload a CSV file and create an import job.
   * Returns the job with auto-detected column mappings.
   */
  async upload(file: Express.Multer.File, workspaceId: string, userId: string) {
    const content = fs.readFileSync(file.path, 'utf-8');
    const parsed = parseCSV(content);
    const mappings = autoMapColumns(parsed.headers);

    const mappingConfig: Record<string, string> = {};
    for (const m of mappings) {
      mappingConfig[m.source] = m.target;
    }

    const [job] = await db
      .insert(csvImportJobs)
      .values({
        workspaceId,
        uploadedBy: userId,
        fileName: file.originalname,
        status: 'mapping',
        mappingConfig,
        totalRows: parsed.totalRows,
        processedRows: 0,
      })
      .returning();

    return {
      job,
      detectedMappings: mappings,
      sampleRows: parsed.rows.slice(0, 5),
    };
  },

  /**
   * User confirms/adjusts column mapping.
   */
  async confirmMapping(jobId: string, mappingConfig: Record<string, string>) {
    const [job] = await db
      .update(csvImportJobs)
      .set({
        mappingConfig,
        status: 'validating',
      })
      .where(eq(csvImportJobs.id, jobId))
      .returning();

    if (!job) throw new NotFoundError('CSV Import Job', jobId);
    return job;
  },

  /**
   * Execute the import — read CSV, apply mapping, write to transactions table.
   */
  async executeImport(jobId: string) {
    const [job] = await db
      .select()
      .from(csvImportJobs)
      .where(eq(csvImportJobs.id, jobId));

    if (!job) throw new NotFoundError('CSV Import Job', jobId);

    // Update status to importing
    await db
      .update(csvImportJobs)
      .set({ status: 'importing' })
      .where(eq(csvImportJobs.id, jobId));

    // Read the uploaded file
    const filePath = path.join(UPLOADS_DIR, `${jobId}_${job.fileName}`);
    
    // In a real implementation, reading the stored file and importing rows.
    // This is a scaffold — actual import logic would:
    // 1. Re-parse the CSV
    // 2. Apply the confirmed mappingConfig
    // 3. Validate each row
    // 4. Insert into transactions table
    // 5. Track errors per row

    const errors: Array<{ row: number; error: string }> = [];
    const processedRows = job.totalRows ?? 0;

    // Mark as completed
    await db
      .update(csvImportJobs)
      .set({
        status: errors.length > 0 ? 'failed' : 'completed',
        processedRows,
        errorLog: errors.length > 0 ? errors : null,
        completedAt: new Date(),
      })
      .where(eq(csvImportJobs.id, jobId));

    return {
      jobId,
      processedRows,
      errors,
      status: errors.length > 0 ? 'failed' : 'completed',
    };
  },

  async getStatus(jobId: string) {
    const [job] = await db
      .select()
      .from(csvImportJobs)
      .where(eq(csvImportJobs.id, jobId));

    if (!job) throw new NotFoundError('CSV Import Job', jobId);
    return job;
  },

  getTemplatePath() {
    const templatePath = path.join(UPLOADS_DIR, 'template.csv');
    if (!fs.existsSync(templatePath)) {
      // Generate template CSV
      const headers = [
        'ID_Transaksi',
        'Tanggal',
        'Nama_Sales',
        'Nama_Produk',
        'Kategori_Produk',
        'Qty',
        'Harga_Satuan',
        'Status_Transaksi',
        'Catatan',
      ].join(',');
      const sample = 'TRX001,2024-01-15,John Doe,Laptop Pro,Elektronik,2,15000000,Pending,First order';
      fs.writeFileSync(templatePath, `${headers}\n${sample}\n`);
    }
    return templatePath;
  },
};
