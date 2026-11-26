import type { DestinationStream, Logger } from 'pino';
import { pino } from 'pino';
import { buildContextMixin } from './context-mixin.js';
import { REDACT_PATHS } from './redact.js';

export interface LoggerOptions {
  readonly service: string;
  readonly level?: string;
  readonly destination?: DestinationStream;
}

export function createLogger(options: LoggerOptions): Logger {
  return pino(
    {
      level: options.level ?? 'info',
      base: { service: options.service },
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: { level: (label) => ({ level: label }) },
      redact: { paths: [...REDACT_PATHS], censor: '[REDACTED]' },
      mixin: buildContextMixin,
    },
    options.destination,
  );
}
