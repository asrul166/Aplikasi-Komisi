import { db } from '../db/index.js';
import { salesGoals } from '../db/schema/index.js';
import { eq, and } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors.js';

export const goalService = {
  async getCurrentGoal(userId: string, workspaceId: string) {
    // Get the goal for current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];

    const [goal] = await db
      .select()
      .from(salesGoals)
      .where(
        and(
          eq(salesGoals.userId, userId),
          eq(salesGoals.workspaceId, workspaceId),
          eq(salesGoals.month, monthStart)
        )
      );

    if (!goal) return null;

    const target = parseFloat(String(goal.targetAmount));
    const current = parseFloat(String(goal.currentAmount));
    const progress = target > 0 ? (current / target) * 100 : 0;
    const remaining = Math.max(0, target - current);

    // Estimate days left in month
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLeft = lastDay - now.getDate();

    return {
      ...goal,
      progress: Math.round(progress),
      remaining,
      daysLeft,
    };
  },

  async upsertGoal(input: {
    userId: string;
    workspaceId: string;
    targetAmount: number;
    month: string;
  }) {
    const existing = await db
      .select()
      .from(salesGoals)
      .where(
        and(
          eq(salesGoals.userId, input.userId),
          eq(salesGoals.workspaceId, input.workspaceId),
          eq(salesGoals.month, input.month)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(salesGoals)
        .set({
          targetAmount: input.targetAmount.toFixed(2),
          updatedAt: new Date(),
        })
        .where(eq(salesGoals.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(salesGoals)
      .values({
        userId: input.userId,
        workspaceId: input.workspaceId,
        targetAmount: input.targetAmount.toFixed(2),
        month: input.month,
      })
      .returning();

    return created;
  },
};
