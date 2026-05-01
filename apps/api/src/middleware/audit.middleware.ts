import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth.middleware.js';
import { db } from '../db/index.js';
import { auditLogs } from '../db/schema/index.js';

/**
 * Middleware that automatically logs mutation requests (POST, PUT, PATCH, DELETE)
 * to the audit_logs table after the response is sent.
 */
export function auditLog(action: string, getTargetResource?: (req: AuthenticatedRequest) => string | string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Hook into response finish event to log after the response is sent
    const onFinish = async () => {
      try {
        const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
        const rawParamId = req.params.id;
        const paramId = Array.isArray(rawParamId) ? rawParamId[0] : (rawParamId ?? req.originalUrl);

        await db.insert(auditLogs).values({
          workspaceId: req.user?.workspaceId ?? null,
          actorId: req.user?.id ?? null,
          actorName: req.user?.name ?? 'Unknown',
          actorRole: req.user?.role ?? 'system',
          action,
          targetResource: (() => {
            const raw = getTargetResource
              ? getTargetResource(req)
              : paramId;
            return Array.isArray(raw) ? raw[0] : raw;
          })(),
          status: isSuccess ? 'success' : 'failed',
          metadata: {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            ip: req.ip,
            userAgent: req.get('user-agent'),
          },
        });
      } catch (err) {
        // Audit logging should never break the request flow
        console.error('[AUDIT] Failed to write audit log:', err);
      }
    };

    res.on('finish', onFinish as () => void);
    next();
  };
}
