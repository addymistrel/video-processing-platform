import type { CreateAppOptions } from './create-app.js';
import { createApp } from './create-app.js';

import { createErrorHandler, notFoundHandler } from './error-handler.js';

import type { ShutdownController, ShutdownOptions } from './graceful-shutdown.js';
import { installProcessErrorHandlers, setupGracefulShutdown } from './graceful-shutdown.js';

import type { HealthCheck, HealthRouterOptions } from './health-router.js';
import { createHealthRouter } from './health-router.js';

import { REQUEST_ID_HEADER, requestContextMiddleware } from './request-context-middleware.js';

import type { RequestLoggerOptions } from './request-logger.js';
import { requestLogger } from './request-logger.js';

export {
  createApp,
  createErrorHandler,
  createHealthRouter,
  installProcessErrorHandlers,
  notFoundHandler,
  REQUEST_ID_HEADER,
  requestContextMiddleware,
  requestLogger,
  setupGracefulShutdown,
};

export type {
  CreateAppOptions,
  HealthCheck,
  HealthRouterOptions,
  RequestLoggerOptions,
  ShutdownController,
  ShutdownOptions,
};
