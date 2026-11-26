import { and, asc, desc, eq, gte, lt, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { salesGoals, transactions, user } from '../db/schema/index.js';
import { NotFoundError } from '../lib/errors.js';
import { monthRange, toDateString } from '../lib/period.js';
import { transactionConditions, transactionQuery } from './transaction.service.js';

const approved = sql`${transactions.status} = 'success'`;
const pending = sql`${transactions.status} = 'pending'`;

const totals = {
  totalSales: sql<number>`COALESCE(SUM(${transactions.totalSales}) FILTER (WHERE ${approved}), 0)::float8`,
  totalCommission: sql<number>`COALESCE(SUM(${transactions.commissionAmount}) FILTER (WHERE ${approved}), 0)::float8`,
  approvedCount: sql<number>`(COUNT(*) FILTER (WHERE ${approved}))::int`,
  pendingCount: sql<number>`(COUNT(*) FILTER (WHERE ${pending}))::int`,
  pendingValue: sql<number>`COALESCE(SUM(${transactions.totalSales}) FILTER (WHERE ${pending}), 0)::float8`,
};

function inMonth(workspaceId: string, month: string, salesAgentId?: string) {
  const range = monthRange(month);
  return and(
    transactionConditions({ workspaceId, salesAgentId }),
    gte(transactions.date, range.start),
    lt(transactions.date, range.end)
  );
}

export const dashboardService = {
  /** Team totals, or one agent's totals when `salesAgentId` is given. */
  async summary(workspaceId: string, month: string, salesAgentId?: string) {
    const range = monthRange(month);
    const where = inMonth(workspaceId, month, salesAgentId);

    const [sum] = await db.select(totals).from(transactions).where(where);

    const daily = await db
      .select({
        date: transactions.date,
        commission: totals.totalCommission,
        sales: totals.totalSales,
      })
      .from(transactions)
      .where(where)
      .groupBy(transactions.date)
      .orderBy(asc(transactions.date));

    const [goal] = await db
      .select({ target: sql<number>`COALESCE(SUM(${salesGoals.targetAmount}), 0)::float8` })
      .from(salesGoals)
      .where(
        and(
          eq(salesGoals.workspaceId, workspaceId),
          eq(salesGoals.month, range.start),
          salesAgentId ? eq(salesGoals.userId, salesAgentId) : undefined
        )
      );

    const recent = await transactionQuery()
      .where(transactionConditions({ workspaceId, salesAgentId }))
      .orderBy(desc(transactions.date), desc(transactions.createdAt))
      .limit(5);

    const today = toDateString(new Date());
    let daysLeft = range.days - Number(today.slice(8));
    if (today < range.start) daysLeft = range.days;
    if (today >= range.end) daysLeft = 0;

    return {
      month,
      ...sum,
      target: goal.target,
      daysInMonth: range.days,
      daysLeft,
      daily,
      recent,
    };
  },

  async team(workspaceId: string, month: string) {
    const range = monthRange(month);

    const members = await db
      .select({ id: user.id, name: user.name, role: user.role, isActive: user.isActive })
      .from(user)
      .where(eq(user.workspaceId, workspaceId))
      .orderBy(asc(user.name));

    const stats = await db
      .select({ userId: transactions.salesAgentId, ...totals })
      .from(transactions)
      .where(inMonth(workspaceId, month))
      .groupBy(transactions.salesAgentId);

    const goals = await db
      .select()
      .from(salesGoals)
      .where(and(eq(salesGoals.workspaceId, workspaceId), eq(salesGoals.month, range.start)));

    return (
      members
        .map((m) => {
          const s = stats.find((x) => x.userId === m.id);
          return {
            ...m,
            totalSales: s?.totalSales ?? 0,
            totalCommission: s?.totalCommission ?? 0,
            approvedCount: s?.approvedCount ?? 0,
            pendingCount: s?.pendingCount ?? 0,
            target: Number(goals.find((g) => g.userId === m.id)?.targetAmount ?? 0),
          };
        })
        // Every active sales agent, plus anyone else who sold something this month.
        .filter((m) => (m.role === 'sales' && m.isActive) || m.approvedCount + m.pendingCount > 0)
        .sort((a, b) => b.totalSales - a.totalSales)
    );
  },

  report(workspaceId: string, dateFrom: string, dateTo: string, salesAgentId?: string) {
    return transactionQuery()
      .where(transactionConditions({ workspaceId, salesAgentId, dateFrom, dateTo }))
      .orderBy(asc(transactions.date), asc(transactions.transactionCode));
  },

  async setGoal(workspaceId: string, userId: string, month: string, targetAmount: number) {
    const [member] = await db
      .select({ id: user.id })
      .from(user)
      .where(and(eq(user.id, userId), eq(user.workspaceId, workspaceId)));
    if (!member) throw new NotFoundError('Pengguna');

    const start = monthRange(month).start;
    await db.transaction(async (tx) => {
      await tx
        .delete(salesGoals)
        .where(and(eq(salesGoals.userId, userId), eq(salesGoals.month, start)));
      await tx.insert(salesGoals).values({
        userId,
        workspaceId,
        month: start,
        targetAmount: targetAmount.toFixed(2),
      });
    });
  },
};
