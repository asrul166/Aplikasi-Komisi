import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dashboardService } from '../services/dashboard.service.js';
import { goalService } from '../services/goal.service.js';

const router = Router();

router.use(requireAuth);

router.get('/summary', async (req: AuthenticatedRequest, res) => {
  try {
    const data = await dashboardService.getPersonalSummary(
      req.user!.id,
      req.user!.workspaceId!
    );
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.get('/commission-progress', async (req: AuthenticatedRequest, res) => {
  try {
    const period = (req.query.period as 'daily' | 'weekly') ?? 'weekly';
    const data = await dashboardService.getCommissionProgress(
      req.user!.id,
      req.user!.workspaceId!,
      period
    );
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.get('/monthly-goal', async (req: AuthenticatedRequest, res) => {
  try {
    const data = await goalService.getCurrentGoal(
      req.user!.id,
      req.user!.workspaceId!
    );
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

router.get('/recent-transactions', async (req: AuthenticatedRequest, res) => {
  try {
    const data = await dashboardService.getRecentTransactions(
      req.user!.workspaceId!,
      5
    );
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

export default router;
