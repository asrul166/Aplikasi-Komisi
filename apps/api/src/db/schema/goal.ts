import {
  pgTable,
  uuid,
  text,
  decimal,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.js';
import { user } from './auth.js';

export const salesGoals = pgTable('sales_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  targetAmount: decimal('target_amount', {
    precision: 15,
    scale: 2,
  }).notNull(),
  currentAmount: decimal('current_amount', {
    precision: 15,
    scale: 2,
  })
    .notNull()
    .default('0'),
  month: date('month').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
