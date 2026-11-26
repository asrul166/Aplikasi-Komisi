import { and, asc, count, desc, eq, gte, ilike, lte, or, sql, type SQL } from 'drizzle-orm';
import { db } from '../db/index.js';
import { commissionPayouts, products, transactions, user } from '../db/schema/index.js';
import { BadRequestError, ConflictError, NotFoundError, pgErrorCode } from '../lib/errors.js';
import { type PaginationParams, getOffset, paginate } from '../lib/pagination.js';
import { syncCommission, type Executor } from './commission.service.js';

export type TxStatus = 'pending' | 'success' | 'cancelled';

export interface TransactionInput {
  transactionCode?: string;
  customerName: string;
  date: string;
  salesAgentId: string;
  productName: string;
  productCategory?: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface ListFilters {
  workspaceId: string;
  status?: TxStatus;
  salesAgentId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

const columns = {
  id: transactions.id,
  transactionCode: transactions.transactionCode,
  date: transactions.date,
  customerName: transactions.customerName,
  salesAgentId: transactions.salesAgentId,
  salesAgentName: user.name,
  productName: products.name,
  quantity: transactions.quantity,
  unitPrice: transactions.unitPrice,
  totalSales: transactions.totalSales,
  commissionPercent: transactions.commissionPercent,
  commissionAmount: transactions.commissionAmount,
  status: transactions.status,
  notes: transactions.notes,
};

export function transactionQuery() {
  return db
    .select(columns)
    .from(transactions)
    .innerJoin(user, eq(transactions.salesAgentId, user.id))
    .leftJoin(products, eq(transactions.productId, products.id));
}

export function transactionConditions(f: ListFilters): SQL {
  const list: (SQL | undefined)[] = [eq(transactions.workspaceId, f.workspaceId)];
  if (f.status) list.push(eq(transactions.status, f.status));
  if (f.salesAgentId) list.push(eq(transactions.salesAgentId, f.salesAgentId));
  if (f.dateFrom) list.push(gte(transactions.date, f.dateFrom));
  if (f.dateTo) list.push(lte(transactions.date, f.dateTo));
  if (f.search) {
    const term = `%${f.search.replace(/[\\%_]/g, '\\$&')}%`;
    list.push(
      or(ilike(transactions.customerName, term), ilike(transactions.transactionCode, term))
    );
  }
  return and(...list)!;
}

async function assertAgent(tx: Executor, agentId: string, workspaceId: string) {
  const [agent] = await tx
    .select({ id: user.id })
    .from(user)
    .where(and(eq(user.id, agentId), eq(user.workspaceId, workspaceId), eq(user.isActive, true)));
  if (!agent) throw new BadRequestError('Sales tidak ditemukan atau tidak aktif');
}

async function findOrCreateProduct(tx: Executor, workspaceId: string, input: TransactionInput) {
  const name = input.productName.trim();
  const [existing] = await tx
    .select({ id: products.id })
    .from(products)
    .where(
      and(eq(products.workspaceId, workspaceId), sql`lower(${products.name}) = lower(${name})`)
    );
  if (existing) return existing.id;

  const [created] = await tx
    .insert(products)
    .values({
      workspaceId,
      name,
      category: input.productCategory,
      unitPrice: input.unitPrice.toFixed(2),
    })
    .returning({ id: products.id });
  return created.id;
}

function newTransactionCode(date: string) {
  const random = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `TRX-${date.replaceAll('-', '').slice(2)}-${random}`;
}

function toValues(input: TransactionInput, productId: string) {
  return {
    productId,
    salesAgentId: input.salesAgentId,
    customerName: input.customerName,
    date: input.date,
    quantity: input.quantity,
    unitPrice: input.unitPrice.toFixed(2),
    totalSales: (input.quantity * input.unitPrice).toFixed(2),
    notes: input.notes ?? null,
  };
}

async function lockOwned(tx: Executor, id: string, workspaceId: string) {
  const [row] = await tx
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.workspaceId, workspaceId)))
    .for('update');
  if (!row) throw new NotFoundError('Transaksi');
  return row;
}

export const transactionService = {
  async list(filters: ListFilters, pagination: PaginationParams) {
    const where = transactionConditions(filters);
    const [total] = await db.select({ count: count() }).from(transactions).where(where);

    const column = pagination.sort === 'amount' ? transactions.totalSales : transactions.date;
    const direction = pagination.order === 'asc' ? asc : desc;
    const data = await transactionQuery()
      .where(where)
      .orderBy(direction(column), desc(transactions.createdAt))
      .limit(pagination.limit)
      .offset(getOffset(pagination));

    return paginate(data, total.count, pagination);
  },

  async getById(id: string, workspaceId: string, salesAgentId?: string) {
    const [row] = await transactionQuery().where(
      and(eq(transactions.id, id), transactionConditions({ workspaceId, salesAgentId }))
    );
    if (!row) throw new NotFoundError('Transaksi');
    return row;
  },

  /** `status` other than pending is applied in the same DB transaction (CSV import, seed). */
  async create(input: TransactionInput, workspaceId: string, status: TxStatus = 'pending') {
    try {
      return await db.transaction(async (tx) => {
        await assertAgent(tx, input.salesAgentId, workspaceId);
        const productId = await findOrCreateProduct(tx, workspaceId, input);
        const [row] = await tx
          .insert(transactions)
          .values({
            ...toValues(input, productId),
            workspaceId,
            transactionCode: input.transactionCode?.trim() || newTransactionCode(input.date),
            status,
          })
          .returning();
        if (status === 'success') await syncCommission(tx, row.id);
        return row;
      });
    } catch (err) {
      if (pgErrorCode(err) === '23505') {
        throw new ConflictError(`ID transaksi ${input.transactionCode} sudah dipakai`);
      }
      throw err;
    }
  },

  /** Approved or rejected transactions must go back to pending before editing. */
  async update(id: string, input: TransactionInput, workspaceId: string) {
    return db.transaction(async (tx) => {
      const existing = await lockOwned(tx, id, workspaceId);
      if (existing.status !== 'pending') {
        throw new ConflictError('Hanya transaksi berstatus Menunggu yang bisa diubah');
      }
      await assertAgent(tx, input.salesAgentId, workspaceId);
      const productId = await findOrCreateProduct(tx, workspaceId, input);
      const [row] = await tx
        .update(transactions)
        .set({ ...toValues(input, productId), updatedAt: new Date() })
        .where(eq(transactions.id, id))
        .returning();
      return row;
    });
  },

  async updateStatus(id: string, status: TxStatus, workspaceId: string) {
    await db.transaction(async (tx) => {
      const existing = await lockOwned(tx, id, workspaceId);
      // Re-approving must not recalculate an already computed commission.
      if (existing.status === status) return;
      await tx
        .update(transactions)
        .set({ status, updatedAt: new Date() })
        .where(eq(transactions.id, id));
      await syncCommission(tx, id);
    });
    return this.getById(id, workspaceId);
  },

  async delete(id: string, workspaceId: string) {
    await db.transaction(async (tx) => {
      await lockOwned(tx, id, workspaceId);
      const payouts = await tx
        .select()
        .from(commissionPayouts)
        .where(eq(commissionPayouts.transactionId, id));
      if (payouts.some((p) => p.status === 'paid')) {
        throw new ConflictError('Transaksi dengan komisi yang sudah dibayar tidak bisa dihapus');
      }
      await tx.delete(transactions).where(eq(transactions.id, id));
    });
  },
};
