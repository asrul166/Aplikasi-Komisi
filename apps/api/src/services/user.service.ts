import { db } from '../db/index.js';
import { user, workspaces } from '../db/schema/index.js';
import { eq, and, count, sql, desc } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors.js';
import { type PaginationParams, getOffset, paginate } from '../lib/pagination.js';

interface UpdateUserInput {
  name?: string;
  email?: string;
  jobTitle?: string;
  image?: string;
}

export const userService = {
  async list(
    workspaceId: string,
    filters: { role?: string },
    pagination: PaginationParams
  ) {
    const offset = getOffset(pagination);
    const conditions = [eq(user.workspaceId, workspaceId)];

    if (filters.role) {
      conditions.push(eq(user.role, filters.role as any));
    }

    const where = and(...conditions);

    const [totalResult] = await db
      .select({ count: count() })
      .from(user)
      .where(where);

    const data = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        jobTitle: user.jobTitle,
        isActive: user.isActive,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(where)
      .orderBy(desc(user.createdAt))
      .limit(pagination.limit)
      .offset(offset);

    return paginate(data, totalResult.count, pagination);
  },

  async getById(id: string) {
    const [found] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        jobTitle: user.jobTitle,
        isActive: user.isActive,
        image: user.image,
        workspaceId: user.workspaceId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, id));

    if (!found) throw new NotFoundError('User', id);
    return found;
  },

  async update(id: string, input: UpdateUserInput) {
    await this.getById(id);

    const [updated] = await db
      .update(user)
      .set({
        ...(input.name && { name: input.name }),
        ...(input.email && { email: input.email }),
        ...(input.jobTitle !== undefined && { jobTitle: input.jobTitle }),
        ...(input.image !== undefined && { image: input.image }),
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))
      .returning();

    return updated;
  },

  async updateRole(id: string, role: 'admin' | 'manager' | 'sales') {
    await this.getById(id);

    const [updated] = await db
      .update(user)
      .set({ role, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();

    return updated;
  },

  async toggleActive(id: string, isActive: boolean) {
    await this.getById(id);

    const [updated] = await db
      .update(user)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();

    return updated;
  },

  /**
   * Invite a new user (scaffold — creates user record, in production would send email).
   */
  async invite(input: {
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'sales';
    workspaceId: string;
  }) {
    const [newUser] = await db
      .insert(user)
      .values({
        id: crypto.randomUUID(),
        name: input.name,
        email: input.email,
        role: input.role,
        workspaceId: input.workspaceId,
        isActive: true,
      })
      .returning();

    // TODO: Send invite email via email service
    console.log(`[EMAIL STUB] Invite sent to ${input.email}`);

    return newUser;
  },

  async getStats(workspaceId: string) {
    const [totalResult] = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.workspaceId, workspaceId));

    const [activeResult] = await db
      .select({ count: count() })
      .from(user)
      .where(
        and(eq(user.workspaceId, workspaceId), eq(user.isActive, true))
      );

    // Get workspace max seats
    const [workspace] = await db
      .select({ maxSeats: workspaces.maxSeats })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId));

    return {
      totalUsers: totalResult.count,
      maxSeats: workspace?.maxSeats ?? 50,
      activeUsers: activeResult.count,
      pendingInvites: 0, // TODO: Track pending invites separately
    };
  },
};
