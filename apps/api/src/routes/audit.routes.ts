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
  res.json(await auditService.list(req.user!.workspaceId, (req as any).validatedQuery));
});

export default router;
