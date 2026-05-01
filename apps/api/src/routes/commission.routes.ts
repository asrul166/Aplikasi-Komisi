import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { commissionService } from '../services/commission.service.js';
import { paginationSchema } from '../lib/pagination.js';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// ── Validation ─────────────────────────────────────────────────

const createRuleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['flat', 'tiered']),
  flatRate: z.number().optional(),
  status: z.enum(['operational', 'staging', 'archived']).optional(),
});

const createTierSchema = z.object({
  tierOrder: z.number().int().positive(),
  minVolume: z.number().min(0),
  maxVolume: z.number().nullable().optional(),
  commissionRate: z.number().positive(),
});

const simulateSchema = z.object({
  ruleId: z.string().uuid(),
  totalSales: z.number().positive(),
  cumulativeSales: z.number().min(0),
});

// ── Rules ──────────────────────────────────────────────────────

router.get(
  '/rules',
  requireRole('admin', 'manager'),
  validate({ query: paginationSchema }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const query = (req as any).validatedQuery;
      const data = await commissionService.listRules(
        req.user!.workspaceId!,
        query
      );
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.get(
  '/rules/:id',
  requireRole('admin', 'manager'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await commissionService.getRuleById(req.params.id as string);
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.post(
  '/rules',
  requireRole('admin'),
  validate({ body: createRuleSchema }),
  auditLog('Created Commission Rule', (req) => req.body.name),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await commissionService.createRule({
        ...req.body,
        workspaceId: req.user!.workspaceId!,
        createdBy: req.user!.id,
      });
      res.status(201).json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.put(
  '/rules/:id',
  requireRole('admin'),
  auditLog('Updated Commission Rule', (req) => req.params.id as string),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await commissionService.updateRule(
        req.params.id as string,
        req.body
      );
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.delete(
  '/rules/:id',
  requireRole('admin'),
  auditLog('Deleted Commission Rule', (req) => req.params.id as string),
  async (req: AuthenticatedRequest, res) => {
    try {
      await commissionService.deleteRule(req.params.id as string);
      res.status(204).send();
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

// ── Tiers ──────────────────────────────────────────────────────

router.post(
  '/rules/:id/tiers',
  requireRole('admin'),
  validate({ body: createTierSchema }),
  auditLog('Added Commission Tier', (req) => req.params.id as string),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await commissionService.addTier({
        ...req.body,
        ruleId: req.params.id as string,
      });
      res.status(201).json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.put(
  '/tiers/:id',
  requireRole('admin'),
  auditLog('Updated Commission Tier', (req) => req.params.id as string),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await commissionService.updateTier(
        req.params.id as string,
        req.body
      );
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.delete(
  '/tiers/:id',
  requireRole('admin'),
  auditLog('Deleted Commission Tier', (req) => req.params.id as string),
  async (req: AuthenticatedRequest, res) => {
    try {
      await commissionService.deleteTier(req.params.id as string);
      res.status(204).send();
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

// ── Simulation ─────────────────────────────────────────────────

router.post(
  '/calculate',
  requireRole('admin', 'manager'),
  validate({ body: simulateSchema }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await commissionService.simulate(
        req.body.ruleId,
        req.body.totalSales,
        req.body.cumulativeSales
      );
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

// ── Payouts ────────────────────────────────────────────────────

router.get(
  '/payouts',
  validate({ query: paginationSchema }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const query = (req as any).validatedQuery;
      const filters = {
        userId: req.user!.role === 'sales' ? req.user!.id : undefined,
        status: req.query.status as string | undefined,
      };
      const data = await commissionService.listPayouts(filters, query);
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.patch(
  '/payouts/:id/status',
  requireRole('admin'),
  auditLog('Updated Payout Status', (req) => req.params.id as string),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await commissionService.updatePayoutStatus(
        req.params.id as string,
        req.body.status
      );
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

export default router;
