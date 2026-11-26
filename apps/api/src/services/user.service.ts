import { and, asc, eq } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import { db } from '../db/index.js';
import { account, session, user } from '../db/schema/index.js';
import type { Role } from '../middleware/auth.middleware.js';
import { BadRequestError, ConflictError, NotFoundError, pgErrorCode } from '../lib/errors.js';

const publicColumns = {
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  jobTitle: user.jobTitle,
  isActive: user.isActive,
};

export interface NewUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  jobTitle?: string;
}

export const userService = {
  list(workspaceId: string) {
    return db
      .select(publicColumns)
      .from(user)
      .where(eq(user.workspaceId, workspaceId))
      .orderBy(asc(user.name));
  },

  /** Public sign-up is disabled, so the credential account is written here. */
  async create(input: NewUser, workspaceId: string) {
    const id = crypto.randomUUID();
    const password = await hashPassword(input.password);
    try {
      await db.transaction(async (tx) => {
        await tx.insert(user).values({
          id,
          workspaceId,
          name: input.name,
          email: input.email.toLowerCase(),
          role: input.role,
          jobTitle: input.jobTitle,
        });
        await tx.insert(account).values({
          id: crypto.randomUUID(),
          accountId: id,
          providerId: 'credential',
          userId: id,
          password,
        });
      });
    } catch (err) {
      if (pgErrorCode(err) === '23505') throw new ConflictError('Email sudah terdaftar');
      throw err;
    }
    return id;
  },

  async update(
    id: string,
    input: { name?: string; jobTitle?: string; role?: Role; isActive?: boolean },
    workspaceId: string,
    actorId: string
  ) {
    if (id === actorId && (input.isActive === false || (input.role && input.role !== 'admin'))) {
      throw new BadRequestError('Anda tidak bisa menonaktifkan atau menurunkan peran akun sendiri');
    }
    const [updated] = await db
      .update(user)
      .set({ ...input, updatedAt: new Date() })
      .where(and(eq(user.id, id), eq(user.workspaceId, workspaceId)))
      .returning(publicColumns);
    if (!updated) throw new NotFoundError('Pengguna');
    if (input.isActive === false) await db.delete(session).where(eq(session.userId, id));
    return updated;
  },
};
