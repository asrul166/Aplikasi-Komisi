import {
  pgTable,
  uuid,
  varchar,
  decimal,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.js';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }),
  unitPrice: decimal('unit_price', { precision: 15, scale: 2 })
    .notNull()
    .default('0'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
