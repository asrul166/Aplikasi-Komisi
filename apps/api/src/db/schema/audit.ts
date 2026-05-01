import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.js';
import { user } from './auth.js';

export const auditStatusEnum = pgEnum('audit_status', [
  'success',
  'failed',
  'warning',
]);

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  actorId: text('actor_id').references(() => user.id),
  actorName: varchar('actor_name', { length: 255 }),
  actorRole: varchar('actor_role', { length: 50 }),
  action: varchar('action', { length: 255 }).notNull(),
  targetResource: varchar('target_resource', { length: 255 }),
  status: auditStatusEnum('status').notNull().default('success'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
