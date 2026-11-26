import { and, asc, desc, eq, gte, inArray, lt, ne, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  commissionPayouts,
  commissionRules,
  commissionTiers,
  transactions,
  user,
} from '../db/schema/index.js';
import { calculateCommission, type TierDefinition } from '../lib/commission-engine.js';
import { BadRequestError, ConflictError, NotFoundError, pgErrorCode } from '../lib/errors.js';
import { monthRange } from '../lib/period.js';

export type Executor = Parameters<Parameters<typeof db.transaction>[0]>[0];

export interface RuleInput {
  name: string;
  description?: string;
  type: 'flat' | 'tiered';
  flatRate: number;
  tiers: { minVolume: number; commissionRate: number }[];
}

/** Tiers are open-ended: the highest `minVolume` that has been reached wins. */
export function toTierDefinitions(
  tiers: { minVolume: number | string; commissionRate: number | string }[]
): TierDefinition[] {
  return [...tiers]
    .sort((a, b) => Number(a.minVolume) - Number(b.minVolume))
    .map((t, i) => ({
      tierOrder: i + 1,
      minVolume: Number(t.minVolume),
      maxVolume: null,
      commissionRate: Number(t.commissionRate),
    }));
}

async function findRule(id: string, workspaceId: string) {
  const [rule] = await db
    .select()
    .from(commissionRules)
    .where(and(eq(commissionRules.id, id), eq(commissionRules.workspaceId, workspaceId)));
  if (!rule) throw new NotFoundError('Aturan komisi');
  return rule;
}

async function replaceTiers(tx: Executor, ruleId: string, input: RuleInput) {
  await tx.delete(commissionTiers).where(eq(commissionTiers.ruleId, ruleId));
  if (input.type !== 'tiered' || input.tiers.length === 0) return;
  await tx.insert(commissionTiers).values(
    toTierDefinitions(input.tiers).map((t) => ({
      ruleId,
      tierOrder: t.tierOrder,
      minVolume: t.minVolume.toFixed(2),
      maxVolume: null,
      commissionRate: t.commissionRate.toFixed(4),
    }))
  );
}

/**
 * Bring a transaction's commission and payout in line with its status.
 * Must run inside the same DB transaction that changed the status.
 */
export async function syncCommission(tx: Executor, transactionId: string) {
  const [row] = await tx.select().from(transactions).where(eq(transactions.id, transactionId));
  if (!row) throw new NotFoundError('Transaksi');

  const payouts = await tx
    .select()
    .from(commissionPayouts)
    .where(eq(commissionPayouts.transactionId, transactionId));
  if (payouts.some((p) => p.status === 'paid')) {
    throw new ConflictError('Komisi transaksi ini sudah dibayar dan tidak bisa diubah');
  }

  if (row.status !== 'success') {
    await tx
      .update(transactions)
      .set({ commissionPercent: null, commissionAmount: null })
      .where(eq(transactions.id, transactionId));
    await tx
      .update(commissionPayouts)
      .set({ status: 'cancelled' })
      .where(eq(commissionPayouts.transactionId, transactionId));
    return;
  }

  const [rule] = await tx
    .select()
    .from(commissionRules)
    .where(
      and(
        eq(commissionRules.workspaceId, row.workspaceId),
        eq(commissionRules.status, 'operational')
      )
    );
  if (!rule) throw new BadRequestError('Belum ada aturan komisi yang aktif');

  const tiers = await tx.select().from(commissionTiers).where(eq(commissionTiers.ruleId, rule.id));

  // Serialise approvals per agent so two of them cannot read the same running total.
  await tx.select({ id: user.id }).from(user).where(eq(user.id, row.salesAgentId)).for('update');

  const range = monthRange(row.date.slice(0, 7));
  const [previous] = await tx
    .select({ total: sql<string>`COALESCE(SUM(${transactions.totalSales}), 0)` })
    .from(transactions)
    .where(
      and(
        eq(transactions.workspaceId, row.workspaceId),
        eq(transactions.salesAgentId, row.salesAgentId),
        eq(transactions.status, 'success'),
        ne(transactions.id, row.id),
        gte(transactions.date, range.start),
        lt(transactions.date, range.end)
      )
    );

  const totalSales = Number(row.totalSales);
  const result = calculateCommission({
    totalSales,
    cumulativeSales: Number(previous.total) + totalSales,
    flatRate: Number(rule.flatRate ?? 0),
    tiers: rule.type === 'tiered' ? toTierDefinitions(tiers) : [],
  });

  await tx
    .update(transactions)
    .set({
      commissionPercent: result.effectiveRate.toFixed(4),
      commissionAmount: result.totalCommission.toFixed(2),
    })
    .where(eq(transactions.id, row.id));

  await tx.delete(commissionPayouts).where(eq(commissionPayouts.transactionId, row.id));
  await tx.insert(commissionPayouts).values({
    transactionId: row.id,
    userId: row.salesAgentId,
    ruleId: rule.id,
    amount: result.totalCommission.toFixed(2),
  });
}

export const commissionService = {
  async listRules(workspaceId: string) {
    const rules = await db
      .select()
      .from(commissionRules)
      .where(eq(commissionRules.workspaceId, workspaceId))
      .orderBy(desc(commissionRules.createdAt));
    if (rules.length === 0) return [];

    const tiers = await db
      .select()
      .from(commissionTiers)
      .where(inArray(commissionTiers.ruleId, rules.map((r) => r.id)))
      .orderBy(asc(commissionTiers.tierOrder));
    return rules.map((r) => ({ ...r, tiers: tiers.filter((t) => t.ruleId === r.id) }));
  },

  async createRule(input: RuleInput, workspaceId: string, createdBy: string) {
    return db.transaction(async (tx) => {
      const [rule] = await tx
        .insert(commissionRules)
        .values({
          workspaceId,
          createdBy,
          ruleCode: `KMS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          name: input.name,
          description: input.description,
          type: input.type,
          flatRate: input.flatRate.toFixed(4),
        })
        .returning();
      await replaceTiers(tx, rule.id, input);
      return rule;
    });
  },

  async updateRule(id: string, input: RuleInput, workspaceId: string) {
    await findRule(id, workspaceId);
    return db.transaction(async (tx) => {
      const [rule] = await tx
        .update(commissionRules)
        .set({
          name: input.name,
          description: input.description ?? null,
          type: input.type,
          flatRate: input.flatRate.toFixed(4),
          updatedAt: new Date(),
        })
        .where(eq(commissionRules.id, id))
        .returning();
      await replaceTiers(tx, id, input);
      return rule;
    });
  },

  /** Only one rule per workspace is active at a time. */
  async activateRule(id: string, workspaceId: string) {
    await findRule(id, workspaceId);
    await db.transaction(async (tx) => {
      await tx
        .update(commissionRules)
        .set({ status: 'staging', updatedAt: new Date() })
        .where(
          and(
            eq(commissionRules.workspaceId, workspaceId),
            eq(commissionRules.status, 'operational')
          )
        );
      await tx
        .update(commissionRules)
        .set({ status: 'operational', updatedAt: new Date() })
        .where(eq(commissionRules.id, id));
    });
  },

  async deleteRule(id: string, workspaceId: string) {
    const rule = await findRule(id, workspaceId);
    if (rule.status === 'operational') {
      throw new ConflictError('Aturan yang sedang aktif tidak bisa dihapus');
    }
    try {
      await db.delete(commissionRules).where(eq(commissionRules.id, id));
    } catch (err) {
      if (pgErrorCode(err) === '23503') {
        throw new ConflictError('Aturan sudah dipakai menghitung komisi, jadi tidak bisa dihapus');
      }
      throw err;
    }
  },

  simulate(
    input: Pick<RuleInput, 'type' | 'flatRate' | 'tiers'>,
    totalSales: number,
    cumulativeSales: number
  ) {
    return calculateCommission({
      totalSales,
      cumulativeSales,
      flatRate: input.flatRate,
      tiers: input.type === 'tiered' ? toTierDefinitions(input.tiers) : [],
    });
  },
};
