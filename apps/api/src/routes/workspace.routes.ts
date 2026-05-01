import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { workspaceService } from '../services/workspace.service.js';

const router = Router();

router.use(requireAuth);

router.get('/current', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user!.workspaceId) {
      res.status(404).json({ error: 'No workspace assigned' });
      return;
    }
    const data = await workspaceService.getById(req.user!.workspaceId);
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.put(
  '/current',
  requireRole('admin'),
  auditLog('Updated Workspace Settings'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await workspaceService.update(
        req.user!.workspaceId!,
        req.body
      );
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.put(
  '/ai-config',
  requireRole('admin'),
  auditLog('Updated AI Configuration'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await workspaceService.updateAIConfig(
        req.user!.workspaceId!,
        req.body
      );
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

export default router;
