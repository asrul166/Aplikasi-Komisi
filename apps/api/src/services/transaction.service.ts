import { db } from '../db/index.js';
import { transactions } from '../db/schema/index.js';
import { eq, and, desc, asc, sql, count, ilike } from 'drizzle-orm';
import { type PaginationParams, getOffset, paginate } from '../lib/pagination.js';
import { NotFoundError } from '../lib/errors.js';

interface ListFilters {
  workspaceId: string;
  status?: string;
  salesAgentId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface CreateTransactionInput {
  workspaceId: string;
  salesAgentId: string;
  productId?: string;
  transactionCode: string;
  customerName: string;
  date: string;
  quantity: number;
  unitPrice: number;
  status?: 'pending' | 'success' | 'failed' | 'cancelled';
  notes?: string;
}

export const transactionService = {
  async list(filters: ListFilters, pagination: PaginationParams) {
    const conditions = [eq(transactions.workspaceId, filters.workspaceId)];

    if (filters.status) {
      conditions.push(eq(transactions.status, filters.status as any));
    }
    if (filters.salesAgentId) {
      conditions.push(eq(transactions.salesAgentId, filters.salesAgentId));
    }
    if (filters.search) {
      conditions.push(
        sql`(${ilike(transactions.customerName, `%${filters.search}%`)} OR ${ilike(transactions.transactionCode, `%${filters.search}%`)})`
      );
    }

    const where = and(...conditions);
    const offset = getOffset(pagination);

    const [totalResult] = await db
      .select({ count: count() })
      .from(transactions)
      .where(where);

    const orderCol =
      pagination.sort === 'amount'
        ? transactions.totalSales
        : pagination.sort === 'date'
          ? transactions.date
          : transactions.createdAt;
    const orderFn = pagination.order === 'asc' ? asc : desc;

    const data = await db
      .select()
      .from(transactions)
      .where(where)
      .orderBy(orderFn(orderCol))
      .limit(pagination.limit)
      .offset(offset);

    return paginate(data, totalResult.count, pagination);
  },

  async getById(id: string) {
    const [tx] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));

    if (!tx) throw new NotFoundError('Transaction', id);
    return tx;
  },

  async create(input: CreateTransactionInput) {
    const totalSales = input.quantity * input.unitPrice;

    const [tx] = await db
      .insert(transactions)
      .values({
        workspaceId: input.workspaceId,
        salesAgentId: input.salesAgentId,
        productId: input.productId,
        transactionCode: input.transactionCode,
        customerName: input.customerName,
        date: input.date,
        quantity: input.quantity,
        unitPrice: input.unitPrice.toFixed(2),
        totalSales: totalSales.toFixed(2),
        status: input.status ?? 'pending',
        notes: input.notes,
      })
      .returning();

    return tx;
  },

  async update(id: string, input: Partial<CreateTransactionInput>) {
    const existing = await this.getById(id);

    const quantity = input.quantity ?? parseInt(String(existing.quantity));
    const unitPrice = input.unitPrice ?? parseFloat(String(existing.unitPrice));
    const totalSales = quantity * unitPrice;

    const [tx] = await db
      .update(transactions)
      .set({
        ...(input.customerName && { customerName: input.customerName }),
        ...(input.date && { date: input.date }),
        ...(input.productId && { productId: input.productId }),
        ...(input.notes !== undefined && { notes: input.notes }),
        quantity,
        unitPrice: unitPrice.toFixed(2),
        totalSales: totalSales.toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, id))
      .returning();

    return tx;
  },

  async updateStatus(id: string, status: 'pending' | 'success' | 'failed' | 'cancelled') {
    await this.getById(id); // Ensure exists

    const [tx] = await db
      .update(transactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();

    return tx;
  },

  async delete(id: string) {
    await this.getById(id); // Ensure exists
    await db.delete(transactions).where(eq(transactions.id, id));
  },

  async getStats(workspaceId: string) {
    const [result] = await db
      .select({
        totalVolume: sql<string>`COALESCE(SUM(${transactions.totalSales}), 0)`,
        avgCommission: sql<string>`COALESCE(AVG(${transactions.commissionPercent}), 0)`,
        totalCount: count(),
      })
      .from(transactions)
      .where(eq(transactions.workspaceId, workspaceId));

    return {
      totalVolume: parseFloat(result.totalVolume),
      avgCommission: parseFloat(result.avgCommission),
      totalCount: result.totalCount,
    };
  },
};
