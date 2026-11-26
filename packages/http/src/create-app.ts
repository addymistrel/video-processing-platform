import type { Logger } from '@platform/logger';
import type { Express } from 'express';
import express from 'express';

import { requestContextMiddleware } from './request-context-middleware.js';
import { requestLogger } from './request-logger.js';

interface CreateAppOptions {
  readonly logger: Logger;
  readonly trustProxy?: boolean | number | string;
  readonly bodyLimit?: string;
  readonly ignoreLogPaths?: readonly string[];
}

function createApp(options: CreateAppOptions): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', options.trustProxy ?? 1);

  app.use(requestContextMiddleware());

  app.use(
    requestLogger({
      logger: options.logger,
      ignorePaths: options.ignoreLogPaths,
    }),
  );

  app.use(express.json({ limit: options.bodyLimit ?? '1mb' }));

  return app;
}

export { createApp };
export type { CreateAppOptions };
