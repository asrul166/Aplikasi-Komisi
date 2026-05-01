import { db } from '../db/index.js';
import {
  commissionRules,
  commissionTiers,
  commissionRuleEligibleCategories,
  commissionPayouts,
} from '../db/schema/index.js';
import { eq, and, desc, asc, count } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors.js';
import {
  calculateCommission,
  simulateEffectiveRate,
  type TierDefinition,
} from '../lib/commission-engine.js';
import { type PaginationParams, getOffset, paginate } from '../lib/pagination.js';

interface CreateRuleInput {
  workspaceId: string;
  name: string;
  description?: string;
  type: 'flat' | 'tiered';
  flatRate?: number;
  status?: 'operational' | 'staging' | 'archived';
  createdBy: string;
}

interface CreateTierInput {
  ruleId: string;
  tierOrder: number;
  minVolume: number;
  maxVolume?: number | null;
  commissionRate: number;
}

export const commissionService = {
  // ── Rules ────────────────────────────────────────────────────────

  async listRules(workspaceId: string, pagination: PaginationParams) {
    const offset = getOffset(pagination);

    const [totalResult] = await db
      .select({ count: count() })
      .from(commissionRules)
      .where(eq(commissionRules.workspaceId, workspaceId));

    const data = await db
      .select()
      .from(commissionRules)
      .where(eq(commissionRules.workspaceId, workspaceId))
      .orderBy(desc(commissionRules.createdAt))
      .limit(pagination.limit)
      .offset(offset);

    return paginate(data, totalResult.count, pagination);
  },

  async getRuleById(id: string) {
    const [rule] = await db
      .select()
      .from(commissionRules)
      .where(eq(commissionRules.id, id));

    if (!rule) throw new NotFoundError('Commission Rule', id);

    const tiers = await db
      .select()
      .from(commissionTiers)
      .where(eq(commissionTiers.ruleId, id))
      .orderBy(asc(commissionTiers.tierOrder));

    const eligibleCategories = await db
      .select()
      .from(commissionRuleEligibleCategories)
      .where(eq(commissionRuleEligibleCategories.ruleId, id));

    return {
      ...rule,
      tiers,
      eligibleCategories: eligibleCategories.map((ec) => ec.category),
    };
  },

  async createRule(input: CreateRuleInput) {
    // Generate rule code
    const ruleCode = `ACC-RULE-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const [rule] = await db
      .insert(commissionRules)
      .values({
        workspaceId: input.workspaceId,
        ruleCode,
        name: input.name,
        description: input.description,
        type: input.type,
        flatRate: input.flatRate?.toFixed(4),
        status: input.status ?? 'staging',
        createdBy: input.createdBy,
      })
      .returning();

    return rule;
  },

  async updateRule(id: string, input: Partial<CreateRuleInput>) {
    await this.getRuleById(id); // Ensure exists

    const [rule] = await db
      .update(commissionRules)
      .set({
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.type && { type: input.type }),
        ...(input.flatRate !== undefined && {
          flatRate: input.flatRate?.toFixed(4),
        }),
        ...(input.status && { status: input.status }),
        updatedAt: new Date(),
      })
      .where(eq(commissionRules.id, id))
      .returning();

    return rule;
  },

  async deleteRule(id: string) {
    await this.getRuleById(id);
    await db.delete(commissionRules).where(eq(commissionRules.id, id));
  },

  // ── Tiers ────────────────────────────────────────────────────────

  async addTier(input: CreateTierInput) {
    const [tier] = await db
      .insert(commissionTiers)
      .values({
        ruleId: input.ruleId,
        tierOrder: input.tierOrder,
        minVolume: input.minVolume.toFixed(2),
        maxVolume: input.maxVolume != null ? input.maxVolume.toFixed(2) : null,
        commissionRate: input.commissionRate.toFixed(4),
      })
      .returning();

    return tier;
  },

  async updateTier(
    id: string,
    input: Partial<Omit<CreateTierInput, 'ruleId'>>
  ) {
    const [tier] = await db
      .update(commissionTiers)
      .set({
        ...(input.tierOrder !== undefined && { tierOrder: input.tierOrder }),
        ...(input.minVolume !== undefined && {
          minVolume: input.minVolume.toFixed(2),
        }),
        ...(input.maxVolume !== undefined && {
          maxVolume:
            input.maxVolume != null ? input.maxVolume.toFixed(2) : null,
        }),
        ...(input.commissionRate !== undefined && {
          commissionRate: input.commissionRate.toFixed(4),
        }),
      })
      .where(eq(commissionTiers.id, id))
      .returning();

    if (!tier) throw new NotFoundError('Commission Tier', id);
    return tier;
  },

  async deleteTier(id: string) {
    const result = await db
      .delete(commissionTiers)
      .where(eq(commissionTiers.id, id))
      .returning();

    if (result.length === 0) throw new NotFoundError('Commission Tier', id);
  },

  // ── Calculation / Simulation ─────────────────────────────────────

  async simulate(ruleId: string, totalSales: number, cumulativeSales: number) {
    const fullRule = await this.getRuleById(ruleId);

    const tierDefs: TierDefinition[] = fullRule.tiers.map((t) => ({
      tierOrder: t.tierOrder,
      minVolume: parseFloat(String(t.minVolume)),
      maxVolume: t.maxVolume ? parseFloat(String(t.maxVolume)) : null,
      commissionRate: parseFloat(String(t.commissionRate)),
    }));

    return calculateCommission({
      totalSales,
      cumulativeSales,
      flatRate: fullRule.flatRate ? parseFloat(String(fullRule.flatRate)) : 0,
      tiers: tierDefs,
    });
  },

  // ── Payouts ──────────────────────────────────────────────────────

  async listPayouts(
    filters: { userId?: string; workspaceId?: string; status?: string },
    pagination: PaginationParams
  ) {
    const offset = getOffset(pagination);

    // Build a simplified query — in production, use a join for workspace filtering
    const conditions = [];
    if (filters.userId) {
      conditions.push(eq(commissionPayouts.userId, filters.userId));
    }
    if (filters.status) {
      conditions.push(eq(commissionPayouts.status, filters.status as any));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await db
      .select({ count: count() })
      .from(commissionPayouts)
      .where(where);

    const data = await db
      .select()
      .from(commissionPayouts)
      .where(where)
      .orderBy(desc(commissionPayouts.createdAt))
      .limit(pagination.limit)
      .offset(offset);

    return paginate(data, totalResult.count, pagination);
  },

  async updatePayoutStatus(
    id: string,
    status: 'pending' | 'processing' | 'paid' | 'cancelled'
  ) {
    const [payout] = await db
      .update(commissionPayouts)
      .set({
        status,
        ...(status === 'paid' && { paidAt: new Date() }),
      })
      .where(eq(commissionPayouts.id, id))
      .returning();

    if (!payout) throw new NotFoundError('Commission Payout', id);
    return payout;
  },
};
