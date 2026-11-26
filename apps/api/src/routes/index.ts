import { Router } from 'express';
import dashboardRoutes from './dashboard.routes.js';
import transactionRoutes from './transaction.routes.js';
import commissionRoutes from './commission.routes.js';
import userRoutes from './user.routes.js';
import workspaceRoutes from './workspace.routes.js';
import csvImportRoutes from './csv-import.routes.js';
import auditRoutes from './audit.routes.js';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/transactions', transactionRoutes);
router.use('/commissions', commissionRoutes);
router.use('/users', userRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/csv', csvImportRoutes);
router.use('/audit', auditRoutes);

export default router;
