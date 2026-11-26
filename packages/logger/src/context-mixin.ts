import { getContext } from '@platform/request-context';

export function buildContextMixin(): Record<string, string | undefined> {
  const context = getContext();
  if (!context) {
    return {};
  }
  return {
    requestId: context.requestId,
    traceId: context.traceId,
    userId: context.userId,
    sessionId: context.sessionId,
  };
}
