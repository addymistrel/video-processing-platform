import type { ErrorCode } from './error-codes.js';

interface AppErrorOptions {
  readonly code: ErrorCode;
  readonly message: string;
  readonly httpStatus: number;
  readonly details?: unknown;
  readonly cause?: unknown;
  readonly isOperational?: boolean;
}

class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly httpStatus: number;
  public readonly details: unknown;
  public readonly isOperational: boolean;

  public constructor(options: AppErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = new.target.name;
    this.code = options.code;
    this.httpStatus = options.httpStatus;
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;
  }
}

export { AppError };
export type { AppErrorOptions };
