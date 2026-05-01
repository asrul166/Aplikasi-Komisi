import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  date,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.js';
import { user } from './auth.js';
import { products } from './product.js';

export const transactionStatusEnum = pgEnum('transaction_status', [
  'pending',
  'success',
  'failed',
  'cancelled',
]);

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionCode: varchar('transaction_code', { length: 50 })
    .notNull()
    .unique(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  salesAgentId: text('sales_agent_id')
    .notNull()
    .references(() => user.id),
  productId: uuid('product_id').references(() => products.id),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  date: date('date').notNull(),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: decimal('unit_price', { precision: 15, scale: 2 }).notNull(),
  totalSales: decimal('total_sales', { precision: 15, scale: 2 }).notNull(),
  commissionPercent: decimal('commission_percent', {
    precision: 5,
    scale: 4,
  }),
  commissionAmount: decimal('commission_amount', {
    precision: 15,
    scale: 2,
  }),
  status: transactionStatusEnum('status').notNull().default('pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
