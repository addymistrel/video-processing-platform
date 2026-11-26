import { AppError } from './app-error.js';
import { ERROR_CODES } from './error-codes.js';

interface ErrorInit {
  readonly message?: string;
  readonly details?: unknown;
  readonly cause?: unknown;
}

interface RetryableErrorInit extends ErrorInit {
  readonly retryAfterSeconds?: number;
}

class ValidationError extends AppError {
  public constructor(init: ErrorInit = {}) {
    super({
      code: ERROR_CODES.validation,
      httpStatus: 400,
      message: init.message ?? 'Invalid request',
      details: init.details,
      cause: init.cause,
    });
  }
}

class AuthError extends AppError {
  public constructor(init: ErrorInit = {}) {
    super({
      code: ERROR_CODES.unauthenticated,
      httpStatus: 401,
      message: init.message ?? 'Authentication required',
      details: init.details,
      cause: init.cause,
    });
  }
}

class ForbiddenError extends AppError {
  public constructor(init: ErrorInit = {}) {
    super({
      code: ERROR_CODES.forbidden,
      httpStatus: 403,
      message: init.message ?? 'Access denied',
      details: init.details,
      cause: init.cause,
    });
  }
}

class NotFoundError extends AppError {
  public constructor(init: ErrorInit = {}) {
    super({
      code: ERROR_CODES.notFound,
      httpStatus: 404,
      message: init.message ?? 'Resource not found',
      details: init.details,
      cause: init.cause,
    });
  }
}

class ConflictError extends AppError {
  public constructor(init: ErrorInit = {}) {
    super({
      code: ERROR_CODES.conflict,
      httpStatus: 409,
      message: init.message ?? 'Resource conflict',
      details: init.details,
      cause: init.cause,
    });
  }
}

class PayloadTooLargeError extends AppError {
  public constructor(init: ErrorInit = {}) {
    super({
      code: ERROR_CODES.payloadTooLarge,
      httpStatus: 413,
      message: init.message ?? 'Payload too large',
      details: init.details,
      cause: init.cause,
    });
  }
}

class RateLimitError extends AppError {
  public readonly retryAfterSeconds: number | undefined;

  public constructor(init: RetryableErrorInit = {}) {
    super({
      code: ERROR_CODES.rateLimited,
      httpStatus: 429,
      message: init.message ?? 'Too many requests',
      details: init.details,
      cause: init.cause,
    });
    this.retryAfterSeconds = init.retryAfterSeconds;
  }
}

class ServiceUnavailableError extends AppError {
  public readonly retryAfterSeconds: number | undefined;

  public constructor(init: RetryableErrorInit = {}) {
    super({
      code: ERROR_CODES.serviceUnavailable,
      httpStatus: 503,
      message: init.message ?? 'Service temporarily unavailable',
      details: init.details,
      cause: init.cause,
    });
    this.retryAfterSeconds = init.retryAfterSeconds;
  }
}

export {
  AuthError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  PayloadTooLargeError,
  RateLimitError,
  ServiceUnavailableError,
  ValidationError,
};
export type { ErrorInit, RetryableErrorInit };
