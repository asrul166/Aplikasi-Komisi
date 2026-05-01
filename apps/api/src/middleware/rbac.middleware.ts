import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth.middleware.js';

type Role = 'admin' | 'manager' | 'sales';

/**
 * Creates middleware that restricts access to users with specific roles.
 * Usage: `requireRole('admin')` or `requireRole('admin', 'manager')`
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden — insufficient role privileges',
        required: allowedRoles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
}
