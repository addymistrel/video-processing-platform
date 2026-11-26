import type { Logger } from 'pino';
import type { LoggerOptions } from './create-logger.js';
import { createLogger } from './create-logger.js';
import { REDACT_PATHS } from './redact.js';

export { createLogger, REDACT_PATHS };
export type { Logger, LoggerOptions };
