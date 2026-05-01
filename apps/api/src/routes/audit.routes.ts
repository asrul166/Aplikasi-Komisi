import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { auditService } from '../services/audit.service.js';
import { paginationSchema } from '../lib/pagination.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin', 'manager'));

router.get('/', validate({ query: paginationSchema }), async (req: AuthenticatedRequest, res) => {
  try {
    const query = (req as any).validatedQuery;
    const data = await auditService.list(req.user!.workspaceId!, query);
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.get('/:id', requireRole('admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const data = await auditService.getById(req.params.id as string);
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

export default router;
