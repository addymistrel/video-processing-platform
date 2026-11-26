const ERROR_CODES = {
  validation: 'VALIDATION_ERROR',
  unauthenticated: 'UNAUTHENTICATED',
  forbidden: 'FORBIDDEN',
  notFound: 'NOT_FOUND',
  conflict: 'CONFLICT',
  payloadTooLarge: 'PAYLOAD_TOO_LARGE',
  rateLimited: 'RATE_LIMITED',
  serviceUnavailable: 'SERVICE_UNAVAILABLE',
  internal: 'INTERNAL_ERROR',
} as const;

type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export { ERROR_CODES };
export type { ErrorCode };
