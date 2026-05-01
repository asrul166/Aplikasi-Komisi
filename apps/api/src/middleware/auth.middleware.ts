import type { Request, Response, NextFunction } from 'express';
import { auth } from '../config/auth.js';
import { fromNodeHeaders } from 'better-auth/node';
import { db } from '../db/index.js';
import { user as userTable } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'sales';
    workspaceId: string | null;
  };
  session?: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: 'Unauthorized — no valid session' });
      return;
    }

    // Better Auth doesn't return custom columns (role, workspaceId) in session.user.
    // Query the actual user record to get them.
    const [dbUser] = await db
      .select({
        role: userTable.role,
        workspaceId: userTable.workspaceId,
      })
      .from(userTable)
      .where(eq(userTable.id, session.user.id));

    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: dbUser?.role ?? 'sales',
      workspaceId: dbUser?.workspaceId ?? null,
    };

    req.session = {
      id: session.session.id,
      userId: session.session.userId,
      token: session.session.token,
      expiresAt: session.session.expiresAt,
    };

    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized — session verification failed' });
  }
}
