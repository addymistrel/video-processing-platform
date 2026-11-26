import { AppError } from './app-error.js';
import { ERROR_CODES, type ErrorCode } from './error-codes.js';

interface ErrorResponse {
  readonly error: {
    readonly code: ErrorCode;
    readonly message: string;
    readonly details?: unknown;
    readonly requestId?: string;
  };
}

interface ErrorResult {
  readonly status: number;
  readonly body: ErrorResponse;
}

function toErrorResponse(error: unknown, requestId?: string): ErrorResult {
  if (error instanceof AppError && error.isOperational) {
    const { code, message, details } = error;
    return { status: error.httpStatus, body: { error: { code, message, details, requestId } } };
  }
  return {
    status: 500,
    body: {
      error: { code: ERROR_CODES.internal, message: 'Internal server error', requestId },
    },
  };
}

export { toErrorResponse };
export type { ErrorResponse, ErrorResult };
