import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { userService } from '../services/user.service.js';
import { paginationSchema } from '../lib/pagination.js';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// ── Validation ─────────────────────────────────────────────────

const inviteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'sales']),
});

// ── Routes ─────────────────────────────────────────────────────

router.get(
  '/',
  requireRole('admin', 'manager'),
  validate({ query: paginationSchema }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const query = (req as any).validatedQuery;
      const data = await userService.list(
        req.user!.workspaceId!,
        { role: req.query.role as string | undefined },
        query
      );
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.get('/stats', requireRole('admin', 'manager'), async (req: AuthenticatedRequest, res) => {
  try {
    const data = await userService.getStats(req.user!.workspaceId!);
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    // Sales users can only view their own profile
    if (req.user!.role === 'sales' && req.params.id !== req.user!.id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    const data = await userService.getById(req.params.id as string);
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.post(
  '/invite',
  requireRole('admin'),
  validate({ body: inviteSchema }),
  auditLog('Invited User', (req) => req.body.email),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await userService.invite({
        ...req.body,
        workspaceId: req.user!.workspaceId!,
      });
      res.status(201).json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.put(
  '/:id',
  requireRole('admin'),
  auditLog('Updated User', (req) => req.params.id as string),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await userService.update(req.params.id as string, req.body);
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.patch(
  '/:id/role',
  requireRole('admin'),
  auditLog('Modified User Role', (req) => `User_${req.params.id}`),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await userService.updateRole(req.params.id as string, req.body.role);
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.patch(
  '/:id/status',
  requireRole('admin'),
  auditLog('Toggled User Status', (req) => `User_${req.params.id}`),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await userService.toggleActive(
        req.params.id as string,
        req.body.isActive
      );
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

export default router;
