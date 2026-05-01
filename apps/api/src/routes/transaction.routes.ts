import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { transactionService } from '../services/transaction.service.js';
import { paginationSchema } from '../lib/pagination.js';
import { z } from 'zod';

const router = Router();

router.use(requireAuth as any);

// ── Validation Schemas ─────────────────────────────────────────

const createSchema = z.object({
  transactionCode: z.string().min(1),
  customerName: z.string().min(1),
  date: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  productId: z.string().uuid().optional(),
  salesAgentId: z.string().uuid().optional(),
  status: z.enum(['pending', 'success', 'failed', 'cancelled']).optional(),
  notes: z.string().optional(),
});

const listQuerySchema = paginationSchema.extend({
  status: z.string().optional(),
  salesAgentId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

// ── Routes ─────────────────────────────────────────────────────

router.get('/', validate({ query: listQuerySchema }) as any, async (req: AuthenticatedRequest, res) => {
  try {
    const query = (req as any).validatedQuery;
    const filters = {
      workspaceId: req.user!.workspaceId!,
      status: query.status,
      salesAgentId:
        req.user!.role === 'sales' ? req.user!.id : query.salesAgentId,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      search: query.search,
    };
    const data = await transactionService.list(filters, query);
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.get('/stats', async (req: AuthenticatedRequest, res) => {
  try {
    const data = await transactionService.getStats(req.user!.workspaceId!);
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const id = req.params.id as string;
    const data = await transactionService.getById(id);
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.post(
  '/',
  requireRole('admin', 'manager') as any,
  validate({ body: createSchema }) as any,
  auditLog('Created Transaction', (req) => req.body.transactionCode) as any,
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await transactionService.create({
        ...req.body,
        workspaceId: req.user!.workspaceId!,
        salesAgentId: req.body.salesAgentId ?? req.user!.id,
      });
      res.status(201).json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.put(
  '/:id',
  requireRole('admin', 'manager') as any,
  auditLog('Updated Transaction', (req) => req.params.id as string) as any,
  async (req: AuthenticatedRequest, res) => {
    try {
      const id = req.params.id as string;
      const data = await transactionService.update(id, req.body);
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.patch(
  '/:id/status',
  requireRole('admin', 'manager') as any,
  auditLog('Updated Transaction Status', (req) => req.params.id as string) as any,
  async (req: AuthenticatedRequest, res) => {
    try {
      const id = req.params.id as string;
      const data = await transactionService.updateStatus(id, req.body.status);
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.delete(
  '/:id',
  requireRole('admin') as any,
  auditLog('Deleted Transaction', (req) => req.params.id as string) as any,
  async (req: AuthenticatedRequest, res) => {
    try {
      const id = req.params.id as string;
      await transactionService.delete(id);
      res.status(204).send();
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

export default router;
