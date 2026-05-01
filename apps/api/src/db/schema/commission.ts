import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { workspaces } from './workspace.js';
import { user } from './auth.js';
import { transactions } from './transaction.js';

// ── Enums ────────────────────────────────────────────────────────────
export const commissionRuleTypeEnum = pgEnum('commission_rule_type', [
  'flat',
  'tiered',
]);

export const commissionRuleStatusEnum = pgEnum('commission_rule_status', [
  'operational',
  'staging',
  'archived',
]);

export const payoutStatusEnum = pgEnum('payout_status', [
  'pending',
  'processing',
  'paid',
  'cancelled',
]);

// ── Commission Rules ─────────────────────────────────────────────────
export const commissionRules = pgTable('commission_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  ruleCode: varchar('rule_code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: commissionRuleTypeEnum('type').notNull().default('flat'),
  flatRate: decimal('flat_rate', { precision: 5, scale: 4 }),
  status: commissionRuleStatusEnum('status').notNull().default('staging'),
  createdBy: text('created_by').references(() => user.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Commission Tiers ─────────────────────────────────────────────────
export const commissionTiers = pgTable('commission_tiers', {
  id: uuid('id').primaryKey().defaultRandom(),
  ruleId: uuid('rule_id')
    .notNull()
    .references(() => commissionRules.id, { onDelete: 'cascade' }),
  tierOrder: integer('tier_order').notNull(),
  minVolume: decimal('min_volume', { precision: 15, scale: 2 }).notNull(),
  maxVolume: decimal('max_volume', { precision: 15, scale: 2 }),
  commissionRate: decimal('commission_rate', {
    precision: 5,
    scale: 4,
  }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Asset Eligibility (Junction) ─────────────────────────────────────
export const commissionRuleEligibleCategories = pgTable(
  'commission_rule_eligible_categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ruleId: uuid('rule_id')
      .notNull()
      .references(() => commissionRules.id, { onDelete: 'cascade' }),
    category: varchar('category', { length: 255 }).notNull(),
  }
);

// ── Commission Payouts ───────────────────────────────────────────────
export const commissionPayouts = pgTable('commission_payouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionId: uuid('transaction_id')
    .notNull()
    .references(() => transactions.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  ruleId: uuid('rule_id').references(() => commissionRules.id),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  status: payoutStatusEnum('status').notNull().default('pending'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
