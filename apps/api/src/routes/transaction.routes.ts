import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { transactionService } from '../services/transaction.service.js';
import { paginationSchema } from '../lib/pagination.js';
import { dateSchema, transactionSchema } from '../lib/schemas.js';

const router = Router();
router.use(requireAuth);

const statusSchema = z.enum(['pending', 'success', 'cancelled']);
const listSchema = paginationSchema.extend({
  status: statusSchema.optional(),
  salesAgentId: z.string().optional(),
  dateFrom: dateSchema.optional(),
  dateTo: dateSchema.optional(),
  search: z.string().max(100).optional(),
});

/** Sales users are always limited to their own records. */
const ownScope = (req: AuthenticatedRequest) =>
  req.user!.role === 'sales' ? req.user!.id : undefined;

router.get('/', validate({ query: listSchema }), async (req: AuthenticatedRequest, res) => {
  const query = (req as any).validatedQuery as z.infer<typeof listSchema>;
  const salesAgentId = ownScope(req) ?? query.salesAgentId;
  res.json(
    await transactionService.list(
      { ...query, workspaceId: req.user!.workspaceId, salesAgentId },
      query
    )
  );
});

router.get('/:id', async (req: AuthenticatedRequest, res) => {
  const id = String(req.params.id);
  res.json(await transactionService.getById(id, req.user!.workspaceId, ownScope(req)));
});

router.post(
  '/',
  requireRole('admin', 'manager'),
  validate({ body: transactionSchema }),
  auditLog('Created Transaction', (req) => req.body.transactionCode || req.body.customerName),
  async (req: AuthenticatedRequest, res) => {
    res.status(201).json(await transactionService.create(req.body, req.user!.workspaceId));
  }
);

router.put(
  '/:id',
  requireRole('admin', 'manager'),
  validate({ body: transactionSchema }),
  auditLog('Updated Transaction'),
  async (req: AuthenticatedRequest, res) => {
    const id = String(req.params.id);
    res.json(await transactionService.update(id, req.body, req.user!.workspaceId));
  }
);

router.patch(
  '/:id/status',
  requireRole('admin', 'manager'),
  validate({ body: z.object({ status: statusSchema }) }),
  auditLog('Updated Transaction Status'),
  async (req: AuthenticatedRequest, res) => {
    const id = String(req.params.id);
    res.json(await transactionService.updateStatus(id, req.body.status, req.user!.workspaceId));
  }
);

router.delete(
  '/:id',
  requireRole('admin'),
  auditLog('Deleted Transaction'),
  async (req: AuthenticatedRequest, res) => {
    await transactionService.delete(String(req.params.id), req.user!.workspaceId);
    res.status(204).send();
  }
);

export default router;
