import { runWithContext } from '@platform/request-context';
import type { RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';

const REQUEST_ID_HEADER = 'x-request-id';
const SAFE_REQUEST_ID = /^[\w-]{8,64}$/;
const TRACEPARENT = /^00-([0-9a-f]{32})-[0-9a-f]{16}-[0-9a-f]{2}$/;

function resolveRequestId(incoming: string | undefined): string {
  return incoming !== undefined && SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();
}

function parseTraceId(header: string | undefined): string | undefined {
  return header === undefined ? undefined : TRACEPARENT.exec(header)?.[1];
}

function requestContextMiddleware(): RequestHandler {
  return (req, res, next): void => {
    const requestId = resolveRequestId(req.header(REQUEST_ID_HEADER));

    res.setHeader('X-Request-ID', requestId);

    runWithContext(
      {
        requestId,
        traceId: parseTraceId(req.header('traceparent')),
        ip: req.ip,
        userAgent: req.header('user-agent'),
      },
      () => {
        next();
      },
    );
  };
}

export { REQUEST_ID_HEADER, requestContextMiddleware };
