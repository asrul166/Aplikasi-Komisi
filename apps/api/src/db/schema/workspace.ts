import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
} from 'drizzle-orm/pg-core';

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  maxSeats: integer('max_seats').notNull().default(50),
  aiEndpoint: text('ai_endpoint'),
  anomalySensitivity: decimal('anomaly_sensitivity', {
    precision: 3,
    scale: 2,
  }).default('0.84'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
