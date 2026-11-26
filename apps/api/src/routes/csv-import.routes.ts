import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { csvImportService, UPLOADS_DIR } from '../services/csv-import.service.js';
import { TARGET_COLUMNS } from '../lib/csv-parser.js';
import { BadRequestError } from '../lib/errors.js';

const router = Router();
router.use(requireAuth);
router.use(requireRole('admin'));

const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (file.originalname.toLowerCase().endsWith('.csv')) cb(null, true);
    else cb(new BadRequestError('Hanya file .csv yang diterima'));
  },
});

router.get('/template', (_req, res) => {
  res.attachment('template-impor-komisia.csv').type('text/csv').send(csvImportService.template);
});

router.post(
  '/upload',
  upload.single('file'),
  auditLog('Uploaded CSV File', (req) => (req as any).file?.originalname ?? '-'),
  async (req: AuthenticatedRequest, res) => {
    if (!req.file) throw new BadRequestError('File belum dipilih');
    const { workspaceId, id } = req.user!;
    res.status(201).json(await csvImportService.upload(req.file, workspaceId, id));
  }
);

router.post(
  '/:jobId/import',
  validate({ body: z.object({ mapping: z.record(z.string(), z.enum(TARGET_COLUMNS)) }) }),
  auditLog('Executed CSV Import', (req) => String(req.params.jobId)),
  async (req: AuthenticatedRequest, res) => {
    const jobId = String(req.params.jobId);
    res.json(await csvImportService.execute(jobId, req.body.mapping, req.user!.workspaceId));
  }
);

export default router;
