import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { commissionService } from '../services/commission.service.js';
import { ruleSchema, simulateSchema } from '../lib/schemas.js';

const router = Router();
router.use(requireAuth);
router.use(requireRole('admin', 'manager'));

router.get('/rules', async (req: AuthenticatedRequest, res) => {
  res.json(await commissionService.listRules(req.user!.workspaceId));
});

router.post('/simulate', validate({ body: simulateSchema }), (req, res) => {
  const { totalSales, cumulativeSales, ...rule } = req.body;
  res.json(commissionService.simulate(rule, totalSales, cumulativeSales));
});

router.post(
  '/rules',
  requireRole('admin'),
  validate({ body: ruleSchema }),
  auditLog('Created Commission Rule', (req) => req.body.name),
  async (req: AuthenticatedRequest, res) => {
    const { workspaceId, id } = req.user!;
    res.status(201).json(await commissionService.createRule(req.body, workspaceId, id));
  }
);

router.put(
  '/rules/:id',
  requireRole('admin'),
  validate({ body: ruleSchema }),
  auditLog('Updated Commission Rule'),
  async (req: AuthenticatedRequest, res) => {
    const id = String(req.params.id);
    res.json(await commissionService.updateRule(id, req.body, req.user!.workspaceId));
  }
);

router.post(
  '/rules/:id/activate',
  requireRole('admin'),
  auditLog('Activated Commission Rule'),
  async (req: AuthenticatedRequest, res) => {
    await commissionService.activateRule(String(req.params.id), req.user!.workspaceId);
    res.status(204).send();
  }
);

router.delete(
  '/rules/:id',
  requireRole('admin'),
  auditLog('Deleted Commission Rule'),
  async (req: AuthenticatedRequest, res) => {
    await commissionService.deleteRule(String(req.params.id), req.user!.workspaceId);
    res.status(204).send();
  }
);

export default router;
