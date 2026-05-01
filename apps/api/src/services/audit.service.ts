import { db } from '../db/index.js';
import { auditLogs } from '../db/schema/index.js';
import { eq, desc, count, and } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors.js';
import { type PaginationParams, getOffset, paginate } from '../lib/pagination.js';

export const auditService = {
  async list(workspaceId: string, pagination: PaginationParams) {
    const offset = getOffset(pagination);

    const [totalResult] = await db
      .select({ count: count() })
      .from(auditLogs)
      .where(eq(auditLogs.workspaceId, workspaceId));

    const data = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.workspaceId, workspaceId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(pagination.limit)
      .offset(offset);

    return paginate(data, totalResult.count, pagination);
  },

  async getById(id: string) {
    const [log] = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.id, id));

    if (!log) throw new NotFoundError('Audit Log', id);
    return log;
  },
};
