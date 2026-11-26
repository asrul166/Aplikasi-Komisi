import { count, desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { auditLogs } from '../db/schema/index.js';
import { type PaginationParams, getOffset, paginate } from '../lib/pagination.js';

export const auditService = {
  async list(workspaceId: string, pagination: PaginationParams) {
    const where = eq(auditLogs.workspaceId, workspaceId);
    const [total] = await db.select({ count: count() }).from(auditLogs).where(where);
    const data = await db
      .select()
      .from(auditLogs)
      .where(where)
      .orderBy(desc(auditLogs.createdAt))
      .limit(pagination.limit)
      .offset(getOffset(pagination));
    return paginate(data, total.count, pagination);
  },
};
