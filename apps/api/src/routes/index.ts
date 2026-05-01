import { Router } from 'express';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import transactionRoutes from './transaction.routes.js';
import commissionRoutes from './commission.routes.js';
import userRoutes from './user.routes.js';
import reportingRoutes from './reporting.routes.js';
import workspaceRoutes from './workspace.routes.js';
import csvImportRoutes from './csv-import.routes.js';
import auditRoutes from './audit.routes.js';

const router = Router();

// ── Mount all route modules ────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/transactions', transactionRoutes);
router.use('/commissions', commissionRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportingRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/csv', csvImportRoutes);
router.use('/audit', auditRoutes);

// ── AI Placeholder Routes ──────────────────────────────────────
router.post('/ai/chat', (_req, res) => {
  res.json({
    message:
      'AI chat endpoint — placeholder. Connect your Anti Gravity AI agent here.',
    response:
      'Good afternoon! Based on current trends, you are on track to exceed your monthly goal by 12%.',
  });
});

router.post('/ai/anomaly-detect', (_req, res) => {
  res.json({
    message:
      'Anomaly detection endpoint — placeholder. Connect your AI model here.',
    anomalies: [
      {
        accountId: '#8821',
        deviation: '4.2σ',
        severity: 'high',
        description:
          'Irregular commission spikes detected. Volume deviates from rolling average.',
      },
    ],
  });
});

router.post('/ai/csv-mapping', (_req, res) => {
  res.json({
    message:
      'AI CSV mapping endpoint — placeholder. Connect your smart mapping model here.',
    mappings: [
      { source: 'Tgl_Trx', target: 'Transaction Date', confidence: 0.98 },
      { source: 'Amt_Gross', target: 'Gross Revenue', confidence: 0.95 },
    ],
  });
});

export default router;
