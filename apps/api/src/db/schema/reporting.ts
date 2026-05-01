import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.js';
import { user } from './auth.js';

// ── Enums ────────────────────────────────────────────────────────────
export const reportFrequencyEnum = pgEnum('report_frequency', [
  'daily',
  'weekly',
  'monthly',
  'realtime',
]);

export const reportFormatEnum = pgEnum('report_format', ['pdf', 'csv']);

export const reportDetailLevelEnum = pgEnum('report_detail_level', [
  'standard',
  'comprehensive',
  'audit',
]);

export const reportHistoryStatusEnum = pgEnum('report_history_status', [
  'generated',
  'sent',
  'failed',
]);

// ── Report Schedules ─────────────────────────────────────────────────
export const reportSchedules = pgTable('report_schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  frequency: reportFrequencyEnum('frequency').notNull().default('weekly'),
  format: reportFormatEnum('format').notNull().default('pdf'),
  detailLevel: reportDetailLevelEnum('detail_level')
    .notNull()
    .default('standard'),
  dataSlice: varchar('data_slice', { length: 255 }),
  emailTemplateId: varchar('email_template_id', { length: 255 }),
  recipients: jsonb('recipients').$type<string[]>().default([]),
  isActive: boolean('is_active').notNull().default(true),
  nextRunAt: timestamp('next_run_at'),
  createdBy: text('created_by').references(() => user.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Report History ───────────────────────────────────────────────────
export const reportHistory = pgTable('report_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  scheduleId: uuid('schedule_id').references(() => reportSchedules.id),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  format: reportFormatEnum('format').notNull(),
  status: reportHistoryStatusEnum('status').notNull().default('generated'),
  fileUrl: text('file_url'),
  generatedAt: timestamp('generated_at').notNull().defaultNow(),
  sentTo: jsonb('sent_to').$type<string[]>().default([]),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
