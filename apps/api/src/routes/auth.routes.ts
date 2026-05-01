import { Router } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../config/auth.js';

const router = Router();

// Better Auth handles all /api/auth/* routes internally.
// This includes: sign-up, sign-in, sign-out, session, etc.
router.all('/*splat', toNodeHandler(auth));

export default router;
