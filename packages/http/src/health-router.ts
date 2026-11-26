import type { Logger } from '@platform/logger';
import { Router } from 'express';

type HealthCheck = () => Promise<void>;

interface HealthRouterOptions {
  readonly checks?: Readonly<Record<string, HealthCheck>>;
  readonly isShuttingDown?: () => boolean;
  readonly checkTimeoutMs?: number;
  readonly logger?: Logger;
}

type CheckEntry = readonly [string, 'ok' | 'fail'];

async function runCheck(
  name: string,
  check: HealthCheck,
  timeoutMs: number,
  logger?: Logger,
): Promise<CheckEntry> {
  let timer: NodeJS.Timeout | undefined;

  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${name} check timed out`));
    }, timeoutMs);
  });

  try {
    await Promise.race([check(), timeout]);
    return [name, 'ok'];
  } catch (error) {
    logger?.warn({ err: error, check: name }, 'readiness check failed');
    return [name, 'fail'];
  } finally {
    clearTimeout(timer);
  }
}

function createHealthRouter(options: HealthRouterOptions = {}): Router {
  const { checks = {}, isShuttingDown = () => false, checkTimeoutMs = 2000, logger } = options;

  const router = Router();

  router.get('/healthz', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.get('/readyz', async (_req, res) => {
    if (isShuttingDown()) {
      res.status(503).json({ status: 'shutting_down' });
      return;
    }

    const entries = await Promise.all(
      Object.entries(checks).map(([name, check]) => runCheck(name, check, checkTimeoutMs, logger)),
    );

    const healthy = entries.every(([, result]) => result === 'ok');

    res.status(healthy ? 200 : 503).json({
      status: healthy ? 'ok' : 'unavailable',
      checks: Object.fromEntries(entries),
    });
  });

  return router;
}

export { createHealthRouter };
export type { HealthCheck, HealthRouterOptions };
