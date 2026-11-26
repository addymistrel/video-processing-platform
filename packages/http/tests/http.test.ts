import { ValidationError } from '@platform/errors';
import { createLogger } from '@platform/logger';
import type { Express } from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import {
  createApp,
  createErrorHandler,
  createHealthRouter,
  notFoundHandler,
} from '../src/index.js';

const logger = createLogger({ service: 'test', level: 'silent' });

function buildApp(): Express {
  const app = createApp({ logger });
  app.use(
    createHealthRouter({
      checks: {
        db: async () => {
          throw new Error('connection refused');
        },
      },
    }),
  );
  app.get('/invalid', () => {
    throw new ValidationError({ message: 'bad input' });
  });
  app.get('/boom', () => {
    throw new Error('secret db detail');
  });
  app.use(notFoundHandler());
  app.use(createErrorHandler(logger));
  return app;
}

describe('http package', () => {
  it('returns the standard error shape for operational errors', async () => {
    const res = await request(buildApp()).get('/invalid');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatchObject({ code: 'VALIDATION_ERROR', message: 'bad input' });
    expect(res.body.error.requestId).toBe(res.headers['x-request-id']);
  });

  it('never leaks internals on unexpected errors', async () => {
    const res = await request(buildApp()).get('/boom');
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain('secret');
  });

  it('keeps a valid incoming request id and replaces an unsafe one', async () => {
    const kept = await request(buildApp()).get('/invalid').set('X-Request-ID', 'abc12345-trace');
    expect(kept.headers['x-request-id']).toBe('abc12345-trace');
    const replaced = await request(buildApp()).get('/invalid').set('X-Request-ID', 'bad id!');
    expect(replaced.headers['x-request-id']).not.toBe('bad id!');
  });

  it('answers 404 for unknown routes and 400 for malformed JSON', async () => {
    expect((await request(buildApp()).get('/nope')).status).toBe(404);
    const bad = await request(buildApp())
      .post('/x')
      .set('Content-Type', 'application/json')
      .send('{bad');
    expect(bad.status).toBe(400);
  });

  it('reports readiness failures with 503 and no error details', async () => {
    const res = await request(buildApp()).get('/readyz');
    expect(res.status).toBe(503);
    expect(res.body.checks.db).toBe('fail');
    expect(JSON.stringify(res.body)).not.toContain('refused');
  });
});
