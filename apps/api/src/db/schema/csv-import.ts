import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.js';
import { user } from './auth.js';

export const csvImportStatusEnum = pgEnum('csv_import_status', [
  'uploading',
  'mapping',
  'validating',
  'importing',
  'completed',
  'failed',
]);

export const csvImportJobs = pgTable('csv_import_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  uploadedBy: text('uploaded_by')
    .notNull()
    .references(() => user.id),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  status: csvImportStatusEnum('status').notNull().default('uploading'),
  mappingConfig: jsonb('mapping_config').$type<
    Record<string, string>
  >(),
  totalRows: integer('total_rows'),
  processedRows: integer('processed_rows').default(0),
  errorLog: jsonb('error_log').$type<
    Array<{ row: number; error: string }>
  >(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
});
