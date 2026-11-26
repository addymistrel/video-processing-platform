import type { Logger } from '@platform/logger';
import type { Server } from 'node:http';

interface ShutdownOptions {
  readonly server: Server;
  readonly logger: Logger;
  readonly cleanups?: readonly (() => Promise<void>)[];
  readonly timeoutMs?: number;
  readonly drainDelayMs?: number;
}

interface ShutdownController {
  readonly isShuttingDown: () => boolean;
  readonly shutdown: (reason: string) => Promise<void>;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function setupGracefulShutdown(options: ShutdownOptions): ShutdownController {
  const { server, logger, cleanups = [], timeoutMs = 30_000, drainDelayMs = 0 } = options;

  let shuttingDown = false;

  const shutdown = async (reason: string): Promise<void> => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    logger.info({ reason }, 'shutdown started');

    setTimeout(() => {
      logger.error('shutdown timed out, forcing exit');
      process.exit(1);
    }, timeoutMs).unref();

    try {
      await delay(drainDelayMs);
      await closeServer(server);

      for (const cleanup of cleanups) {
        await cleanup();
      }

      logger.info('shutdown complete');
      process.exit(0);
    } catch (error) {
      logger.error({ err: error }, 'shutdown failed');
      process.exit(1);
    }
  };

  for (const signal of ['SIGTERM', 'SIGINT'] as const) {
    process.once(signal, () => {
      void shutdown(signal);
    });
  }

  return {
    isShuttingDown: () => shuttingDown,
    shutdown,
  };
}

function installProcessErrorHandlers(logger: Logger): void {
  process.on('unhandledRejection', (reason) => {
    logger.fatal({ err: reason }, 'unhandled rejection');
    process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    logger.fatal({ err: error }, 'uncaught exception');
    process.exit(1);
  });
}

export { installProcessErrorHandlers, setupGracefulShutdown };

export type { ShutdownController, ShutdownOptions };
