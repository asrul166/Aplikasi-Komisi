import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { dashboardService } from '../services/dashboard.service.js';
import { currentMonth } from '../lib/period.js';
import { dateSchema, monthSchema } from '../lib/schemas.js';

const router = Router();
router.use(requireAuth);

const monthQuery = z.object({ month: monthSchema.optional() });
const reportQuery = z.object({ dateFrom: dateSchema, dateTo: dateSchema });
const goalSchema = z.object({
  userId: z.string().min(1),
  month: monthSchema,
  targetAmount: z.number().min(0).max(1_000_000_000_000),
});

const ownScope = (req: AuthenticatedRequest) =>
  req.user!.role === 'sales' ? req.user!.id : undefined;

router.get('/summary', validate({ query: monthQuery }), async (req: AuthenticatedRequest, res) => {
  const { month = currentMonth() } = (req as any).validatedQuery;
  res.json(await dashboardService.summary(req.user!.workspaceId, month, ownScope(req)));
});

router.get(
  '/team',
  requireRole('admin', 'manager'),
  validate({ query: monthQuery }),
  async (req: AuthenticatedRequest, res) => {
    const { month = currentMonth() } = (req as any).validatedQuery;
    res.json(await dashboardService.team(req.user!.workspaceId, month));
  }
);

router.get('/report', validate({ query: reportQuery }), async (req: AuthenticatedRequest, res) => {
  const { dateFrom, dateTo } = (req as any).validatedQuery;
  res.json(await dashboardService.report(req.user!.workspaceId, dateFrom, dateTo, ownScope(req)));
});

router.put(
  '/goals',
  requireRole('admin', 'manager'),
  validate({ body: goalSchema }),
  auditLog('Updated Sales Goal', (req) => req.body.userId),
  async (req: AuthenticatedRequest, res) => {
    const { userId, month, targetAmount } = req.body;
    await dashboardService.setGoal(req.user!.workspaceId, userId, month, targetAmount);
    res.status(204).send();
  }
);

export default router;
