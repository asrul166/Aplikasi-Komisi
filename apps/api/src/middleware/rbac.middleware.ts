import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest, Role } from './auth.middleware.js';

/** Restrict a route to the given roles, e.g. `requireRole('admin', 'manager')`. */
export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Anda tidak punya izin untuk tindakan ini' });
      return;
    }
    next();
  };
}
