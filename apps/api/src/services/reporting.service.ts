import { db } from '../db/index.js';
import {
  reportSchedules,
  reportHistory,
} from '../db/schema/index.js';
import { eq, desc, count } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors.js';
import { type PaginationParams, getOffset, paginate } from '../lib/pagination.js';
import fs from 'fs';
import path from 'path';

const REPORTS_DIR = path.resolve('uploads/reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

interface CreateScheduleInput {
  workspaceId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'realtime';
  format: 'pdf' | 'csv';
  detailLevel?: 'standard' | 'comprehensive' | 'audit';
  dataSlice?: string;
  emailTemplateId?: string;
  recipients?: string[];
  createdBy: string;
}

export const reportingService = {
  // ── Report Generation ────────────────────────────────────────────

  async generate(input: {
    workspaceId: string;
    format: 'pdf' | 'csv';
    detailLevel: string;
    scheduleId?: string;
  }) {
    const fileName = `Report_${Date.now()}.${input.format}`;
    const filePath = path.join(REPORTS_DIR, fileName);

    // Dummy report generation — write placeholder content
    const content =
      input.format === 'csv'
        ? 'Transaction ID,Date,Customer,Amount,Commission,Status\nTXN-001,2024-01-01,Acme Corp,10000,500,success\n'
        : `%PDF-PLACEHOLDER% AutoComm Report generated at ${new Date().toISOString()}`;

    fs.writeFileSync(filePath, content);
    console.log(`[REPORT STUB] Generated ${fileName} at ${filePath}`);

    const [record] = await db
      .insert(reportHistory)
      .values({
        scheduleId: input.scheduleId,
        workspaceId: input.workspaceId,
        fileName,
        format: input.format,
        status: 'generated',
        fileUrl: filePath,
      })
      .returning();

    return record;
  },

  async getHistory(workspaceId: string, pagination: PaginationParams) {
    const offset = getOffset(pagination);

    const [totalResult] = await db
      .select({ count: count() })
      .from(reportHistory)
      .where(eq(reportHistory.workspaceId, workspaceId));

    const data = await db
      .select()
      .from(reportHistory)
      .where(eq(reportHistory.workspaceId, workspaceId))
      .orderBy(desc(reportHistory.generatedAt))
      .limit(pagination.limit)
      .offset(offset);

    return paginate(data, totalResult.count, pagination);
  },

  async download(id: string) {
    const [record] = await db
      .select()
      .from(reportHistory)
      .where(eq(reportHistory.id, id));

    if (!record) throw new NotFoundError('Report', id);
    if (!record.fileUrl || !fs.existsSync(record.fileUrl)) {
      throw new NotFoundError('Report file');
    }

    return {
      filePath: record.fileUrl,
      fileName: record.fileName,
      format: record.format,
    };
  },

  // ── Schedules ────────────────────────────────────────────────────

  async listSchedules(workspaceId: string) {
    return db
      .select()
      .from(reportSchedules)
      .where(eq(reportSchedules.workspaceId, workspaceId))
      .orderBy(desc(reportSchedules.createdAt));
  },

  async createSchedule(input: CreateScheduleInput) {
    const [schedule] = await db
      .insert(reportSchedules)
      .values({
        workspaceId: input.workspaceId,
        name: input.name,
        frequency: input.frequency,
        format: input.format,
        detailLevel: input.detailLevel ?? 'standard',
        dataSlice: input.dataSlice,
        emailTemplateId: input.emailTemplateId,
        recipients: input.recipients ?? [],
        createdBy: input.createdBy,
        isActive: true,
      })
      .returning();

    console.log(`[EMAIL STUB] Schedule "${input.name}" created, would notify recipients`);

    return schedule;
  },

  async updateSchedule(id: string, input: Partial<CreateScheduleInput>) {
    const [schedule] = await db
      .update(reportSchedules)
      .set({
        ...(input.name && { name: input.name }),
        ...(input.frequency && { frequency: input.frequency }),
        ...(input.format && { format: input.format }),
        ...(input.detailLevel && { detailLevel: input.detailLevel }),
        ...(input.dataSlice !== undefined && { dataSlice: input.dataSlice }),
        ...(input.emailTemplateId !== undefined && { emailTemplateId: input.emailTemplateId }),
        ...(input.recipients && { recipients: input.recipients }),
        updatedAt: new Date(),
      })
      .where(eq(reportSchedules.id, id))
      .returning();

    if (!schedule) throw new NotFoundError('Report Schedule', id);
    return schedule;
  },

  async deleteSchedule(id: string) {
    const result = await db
      .delete(reportSchedules)
      .where(eq(reportSchedules.id, id))
      .returning();

    if (result.length === 0) throw new NotFoundError('Report Schedule', id);
  },
};
