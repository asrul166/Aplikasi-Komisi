import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { auditLog } from '../middleware/audit.middleware.js';
import { csvImportService } from '../services/csv-import.service.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin'));

// Configure multer for CSV uploads
const upload = multer({
  dest: path.resolve('uploads/csv'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

router.post(
  '/upload',
  upload.single('file'),
  auditLog('Uploaded CSV File', (req) => (req as any).file?.originalname ?? 'unknown'),
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const data = await csvImportService.upload(
        req.file,
        req.user!.workspaceId!,
        req.user!.id
      );
      res.status(201).json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.post(
  '/:jobId/mapping',
  auditLog('Confirmed CSV Mapping', (req) => req.params.jobId as string),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await csvImportService.confirmMapping(
        req.params.jobId as string,
        req.body.mappingConfig
      );
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.post(
  '/:jobId/import',
  auditLog('Executed CSV Import', (req) => req.params.jobId as string),
  async (req: AuthenticatedRequest, res) => {
    try {
      const data = await csvImportService.executeImport(req.params.jobId as string);
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  }
);

router.get('/:jobId/status', async (req: AuthenticatedRequest, res) => {
  try {
    const data = await csvImportService.getStatus(req.params.jobId as string);
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.get('/template', async (_req: AuthenticatedRequest, res) => {
  try {
    const filePath = csvImportService.getTemplatePath();
    res.download(filePath, 'autocomm_import_template.csv');
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

export default router;
