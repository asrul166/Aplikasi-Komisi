import type { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { eq } from 'drizzle-orm';
import { auth } from '../config/auth.js';
import { db } from '../db/index.js';
import { user as userTable } from '../db/schema/index.js';

export type Role = 'admin' | 'manager' | 'sales';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  workspaceId: string;
  jobTitle: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) {
    res.status(401).json({ error: 'Silakan masuk terlebih dahulu' });
    return;
  }

  // Better Auth does not return our custom columns, so read the user row.
  const [row] = await db.select().from(userTable).where(eq(userTable.id, session.user.id));

  if (!row?.isActive || !row.workspaceId) {
    res.status(403).json({ error: 'Akun Anda tidak aktif' });
    return;
  }

  req.user = {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    workspaceId: row.workspaceId,
    jobTitle: row.jobTitle,
  };
  next();
}
