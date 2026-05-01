import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { reportingService } from '../services/reporting.service.js';
import { paginationSchema } from '../lib/pagination.js';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// ── Validation ─────────────────────────────────────────────────

const generateSchema = z.object({
  format: z.enum(['pdf', 'csv']),
  detailLevel: z.enum(['standard', 'comprehensive', 'audit']).default('standard'),
  scheduleId: z.string().uuid().optional(),
});

const createScheduleSchema = z.object({
  name: z.string().min(1),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'realtime']),
  format: z.enum(['pdf', 'csv']),
  detailLevel: z.enum(['standard', 'comprehensive', 'audit']).optional(),
  dataSlice: z.string().optional(),
  emailTemplateId: z.string().optional(),
  recipients: z.array(z.string()).optional(),
});

// ── Reports ────────────────────────────────────────────────────

router.post(
  '/generate',
  requireRole('admin', 'manager'),
  validate({ body: generateSchema }),
  auditLog('Generated Report'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await reportingService.generate({
        ...req.body,
        workspaceId: req.user!.workspaceId!,
      });
      res.status(201).json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.get(
  '/history',
  requireRole('admin', 'manager'),
  validate({ query: paginationSchema }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const query = (req as any).validatedQuery;
      const data = await reportingService.getHistory(
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
  '/download/:id',
  requireRole('admin', 'manager'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { filePath, fileName } = await reportingService.download(
        req.params.id as string
      );
      res.download(filePath, fileName);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

// ── Schedules ──────────────────────────────────────────────────

router.get('/schedules', requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const data = await reportingService.listSchedules(
      req.user!.workspaceId!
    );
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.post(
  '/schedules',
  requireRole('admin'),
  validate({ body: createScheduleSchema }),
  auditLog('Created Report Schedule', (req) => req.body.name),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await reportingService.createSchedule({
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
  '/schedules/:id',
  requireRole('admin'),
  auditLog('Updated Report Schedule', (req) => req.params.id as string),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await reportingService.updateSchedule(
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
  '/schedules/:id',
  requireRole('admin'),
  auditLog('Deleted Report Schedule', (req) => req.params.id as string),
  async (req: AuthenticatedRequest, res) => {
    try {
      await reportingService.deleteSchedule(req.params.id as string);
      res.status(204).send();
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

export default router;
