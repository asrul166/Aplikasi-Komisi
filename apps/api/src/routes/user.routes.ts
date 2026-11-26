import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { userService } from '../services/user.service.js';

const router = Router();
router.use(requireAuth);

const name = z.string().trim().min(1, 'Wajib diisi').max(255);
const jobTitle = z.string().trim().max(255);
const role = z.enum(['admin', 'manager', 'sales']);

const createSchema = z.object({
  name,
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter').max(128),
  role,
  jobTitle: jobTitle.optional(),
});

const updateSchema = z.object({
  name: name.optional(),
  jobTitle: jobTitle.optional(),
  role: role.optional(),
  isActive: z.boolean().optional(),
});

/** The signed-in user. */
router.get('/me', (req: AuthenticatedRequest, res) => {
  res.json(req.user);
});

router.patch(
  '/me',
  validate({ body: z.object({ name, jobTitle: jobTitle.optional() }) }),
  auditLog('Updated Own Profile'),
  async (req: AuthenticatedRequest, res) => {
    const { id, workspaceId } = req.user!;
    res.json(await userService.update(id, req.body, workspaceId, id));
  }
);

router.get('/', requireRole('admin', 'manager'), async (req: AuthenticatedRequest, res) => {
  res.json(await userService.list(req.user!.workspaceId));
});

router.post(
  '/',
  requireRole('admin'),
  validate({ body: createSchema }),
  auditLog('Added User', (req) => req.body.email),
  async (req: AuthenticatedRequest, res) => {
    const id = await userService.create(req.body, req.user!.workspaceId);
    res.status(201).json({ id });
  }
);

router.patch(
  '/:id',
  requireRole('admin'),
  validate({ body: updateSchema }),
  auditLog('Updated User'),
  async (req: AuthenticatedRequest, res) => {
    const id = String(req.params.id);
    res.json(await userService.update(id, req.body, req.user!.workspaceId, req.user!.id));
  }
);

export default router;
