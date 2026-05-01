import { db } from '../db/index.js';
import {
  transactions,
  commissionPayouts,
  salesGoals,
} from '../db/schema/index.js';
import { eq, and, sql, gte, lte, desc } from 'drizzle-orm';

export const dashboardService = {
  /**
   * Get personal sales summary for the authenticated user.
   * Returns: salesVolume, earnedCommissions, pendingPayouts, percentChange
   */
  async getPersonalSummary(userId: string, workspaceId: string) {
    // Total sales volume for this user
    const [salesVolume] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${transactions.totalSales}), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.salesAgentId, userId),
          eq(transactions.workspaceId, workspaceId),
          eq(transactions.status, 'success')
        )
      );

    // Total earned (paid) commissions
    const [earnedCommissions] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${commissionPayouts.amount}), 0)`,
      })
      .from(commissionPayouts)
      .where(
        and(
          eq(commissionPayouts.userId, userId),
          eq(commissionPayouts.status, 'paid')
        )
      );

    // Pending payouts
    const [pendingPayouts] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${commissionPayouts.amount}), 0)`,
      })
      .from(commissionPayouts)
      .where(
        and(
          eq(commissionPayouts.userId, userId),
          sql`${commissionPayouts.status} IN ('pending', 'processing')`
        )
      );

    return {
      salesVolume: parseFloat(salesVolume.total),
      earnedCommissions: parseFloat(earnedCommissions.total),
      pendingPayouts: parseFloat(pendingPayouts.total),
    };
  },

  /**
   * Get weekly commission progress data for the bar chart.
   */
  async getCommissionProgress(
    userId: string,
    workspaceId: string,
    period: 'daily' | 'weekly' = 'weekly'
  ) {
    // Simplified: return sum of commissions grouped by day of week
    const result = await db
      .select({
        day: sql<string>`TO_CHAR(${transactions.date}, 'Dy')`,
        amount: sql<string>`COALESCE(SUM(${transactions.commissionAmount}), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.salesAgentId, userId),
          eq(transactions.workspaceId, workspaceId),
          eq(transactions.status, 'success')
        )
      )
      .groupBy(sql`TO_CHAR(${transactions.date}, 'Dy')`)
      .orderBy(sql`MIN(${transactions.date})`);

    return result.map((r) => ({
      day: r.day,
      amount: parseFloat(r.amount),
    }));
  },

  /**
   * Get recent transactions (limited, for dashboard widget).
   */
  async getRecentTransactions(workspaceId: string, limit = 5) {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.workspaceId, workspaceId))
      .orderBy(desc(transactions.date))
      .limit(limit);
  },
};
