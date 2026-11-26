import { AsyncLocalStorage } from 'node:async_hooks';

interface RequestContext {
  requestId: string;
  traceId?: string;
  ip?: string;
  userAgent?: string;
  deviceId?: string;
  userId?: string;
  sessionId?: string;
  role?: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

function runWithContext<T>(context: RequestContext, callback: () => T): T {
  return storage.run(context, callback);
}

function getContext(): RequestContext | undefined {
  return storage.getStore();
}

function getRequestId(): string | undefined {
  return storage.getStore()?.requestId;
}

function setContextValue<K extends keyof RequestContext>(key: K, value: RequestContext[K]): void {
  const store = storage.getStore();
  if (store) {
    store[key] = value;
  }
}

export { getContext, getRequestId, runWithContext, setContextValue };
export type { RequestContext };
