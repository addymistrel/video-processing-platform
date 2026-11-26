import type { Logger } from '@platform/logger';
import { getContext } from '@platform/request-context';
import type { RequestHandler } from 'express';

interface RequestLoggerOptions {
  readonly logger: Logger;
  readonly ignorePaths?: readonly string[];
}

function levelFor(status: number): 'info' | 'warn' | 'error' {
  if (status >= 500) {
    return 'error';
  }

  return status >= 400 ? 'warn' : 'info';
}

function requestLogger(options: RequestLoggerOptions): RequestHandler {
  const { logger, ignorePaths = ['/healthz', '/readyz'] } = options;

  return (req, res, next): void => {
    if (ignorePaths.includes(req.path)) {
      next();
      return;
    }

    const startedAt = process.hrtime.bigint();
    const context = getContext();

    res.on('finish', () => {
      const durationMs = Math.round(Number(process.hrtime.bigint() - startedAt) / 1e6);

      logger[levelFor(res.statusCode)](
        {
          requestId: context?.requestId,
          userId: context?.userId,
          sessionId: context?.sessionId,
          ip: context?.ip,
          method: req.method,
          path: req.path,
          status: res.statusCode,
          durationMs,
        },
        'request completed',
      );
    });

    next();
  };
}

export { requestLogger };
export type { RequestLoggerOptions };
