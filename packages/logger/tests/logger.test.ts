import { runWithContext } from '@platform/request-context';
import { Writable } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { createLogger } from '../src/index.js';

function createSink(lines: string[]): Writable {
  return new Writable({
    write(chunk: Buffer, _encoding, callback): void {
      lines.push(chunk.toString());
      callback();
    },
  });
}

function parse(lines: string[]): Record<string, unknown> {
  return JSON.parse(String(lines[0])) as Record<string, unknown>;
}

describe('createLogger', () => {
  it('adds the request context to every line', () => {
    const lines: string[] = [];
    const logger = createLogger({ service: 'test', destination: createSink(lines) });
    runWithContext({ requestId: 'req-1', userId: 'u-1' }, () => logger.info('hello'));
    expect(parse(lines)).toMatchObject({
      service: 'test',
      level: 'info',
      requestId: 'req-1',
      userId: 'u-1',
    });
  });

  it('redacts secrets', () => {
    const lines: string[] = [];
    const logger = createLogger({ service: 'test', destination: createSink(lines) });
    logger.info({ password: 'hunter2', user: { token: 'abc' } }, 'login');
    expect(lines[0]).not.toContain('hunter2');
    expect(lines[0]).not.toContain('"abc"');
  });
});
