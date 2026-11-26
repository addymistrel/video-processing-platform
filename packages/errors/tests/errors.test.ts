import { describe, expect, it } from 'vitest';
import {
  AppError,
  NotFoundError,
  RateLimitError,
  ValidationError,
  toErrorResponse,
} from '../src/index.js';

describe('toErrorResponse', () => {
  it('maps operational errors to their status and code', () => {
    const result = toErrorResponse(new ValidationError({ message: 'bad title' }), 'req-1');
    expect(result.status).toBe(400);
    expect(result.body.error).toMatchObject({ code: 'VALIDATION_ERROR', requestId: 'req-1' });
  });

  it('hides internals of unknown errors', () => {
    const result = toErrorResponse(new Error('password=hunter2'), 'req-2');
    expect(result.status).toBe(500);
    expect(JSON.stringify(result.body)).not.toContain('hunter2');
  });

  it('treats non-operational AppErrors as internal', () => {
    const error = new AppError({
      code: 'CONFLICT',
      message: 'x',
      httpStatus: 409,
      isOperational: false,
    });
    expect(toErrorResponse(error).status).toBe(500);
  });
});

describe('error classes', () => {
  it('keeps name, status and cause', () => {
    const cause = new Error('root');
    const error = new NotFoundError({ cause });
    expect(error.name).toBe('NotFoundError');
    expect(error.httpStatus).toBe(404);
    expect(error.cause).toBe(cause);
  });

  it('carries retry hints', () => {
    expect(new RateLimitError({ retryAfterSeconds: 30 }).retryAfterSeconds).toBe(30);
  });
});
