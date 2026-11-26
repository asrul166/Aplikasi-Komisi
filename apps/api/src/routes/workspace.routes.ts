import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { db } from '../db/index.js';
import { workspaces } from '../db/schema/index.js';

const router = Router();
router.use(requireAuth);

router.get('/current', async (req: AuthenticatedRequest, res) => {
  const [workspace] = await db
    .select({ id: workspaces.id, name: workspaces.name })
    .from(workspaces)
    .where(eq(workspaces.id, req.user!.workspaceId));
  res.json(workspace);
});

router.put(
  '/current',
  requireRole('admin'),
  validate({ body: z.object({ name: z.string().trim().min(1).max(255) }) }),
  auditLog('Updated Workspace Settings'),
  async (req: AuthenticatedRequest, res) => {
    await db
      .update(workspaces)
      .set({ name: req.body.name, updatedAt: new Date() })
      .where(eq(workspaces.id, req.user!.workspaceId));
    res.status(204).send();
  }
);

export default router;
