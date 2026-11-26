import {
  AppError,
  NotFoundError,
  PayloadTooLargeError,
  RateLimitError,
  ServiceUnavailableError,
  ValidationError,
  toErrorResponse,
} from '@platform/errors';

import type { Logger } from '@platform/logger';
import { getContext } from '@platform/request-context';

import type { ErrorRequestHandler, RequestHandler, Response } from 'express';

function statusOf(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return undefined;
  }

  return typeof error.status === 'number' ? error.status : undefined;
}

function normalizeError(error: unknown): unknown {
  const status = statusOf(error);

  if (error instanceof AppError || status === undefined) {
    return error;
  }

  if (status === 413) {
    return new PayloadTooLargeError({ cause: error });
  }

  return status >= 400 && status < 500
    ? new ValidationError({ message: 'Malformed request', cause: error })
    : error;
}

function applyRetryAfter(res: Response, error: unknown): void {
  if (error instanceof RateLimitError || error instanceof ServiceUnavailableError) {
    if (error.retryAfterSeconds !== undefined) {
      res.setHeader('Retry-After', String(error.retryAfterSeconds));
    }
  }
}

function logFailure(logger: Logger, error: unknown, status: number): void {
  if (status >= 500) {
    logger.error({ err: error, status }, 'request failed');
    return;
  }

  logger.warn(
    {
      status,
      code: error instanceof AppError ? error.code : undefined,
    },
    'request rejected',
  );
}

function notFoundHandler(): RequestHandler {
  return (req, _res, next): void => {
    next(
      new NotFoundError({
        message: `Route ${req.method} ${req.path} not found`,
      }),
    );
  };
}

function createErrorHandler(logger: Logger): ErrorRequestHandler {
  return (rawError, _req, res, next): void => {
    if (res.headersSent) {
      next(rawError);
      return;
    }

    const error = normalizeError(rawError);
    const { status, body } = toErrorResponse(error, getContext()?.requestId);

    logFailure(logger, error, status);
    applyRetryAfter(res, error);

    res.status(status).json(body);
  };
}

export { createErrorHandler, notFoundHandler };
