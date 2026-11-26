import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { EVENT_TYPES, platformEventSchema } from '../src/index.js';

const base = {
  messageId: randomUUID(),
  traceId: 'trace-1',
  occurredAt: new Date().toISOString(),
  schemaVersion: 1,
};

describe('platformEventSchema', () => {
  it('accepts a valid progress event and defaults attempt', () => {
    const parsed = platformEventSchema.parse({
      ...base,
      type: EVENT_TYPES.videoProgress,
      payload: { jobId: randomUUID(), videoId: randomUUID(), step: 'TRANSCODE', percent: 42 },
    });
    expect(parsed.attempt).toBe(0);
  });

  it('rejects out-of-range percent', () => {
    const result = platformEventSchema.safeParse({
      ...base,
      type: EVENT_TYPES.videoProgress,
      payload: { jobId: randomUUID(), videoId: randomUUID(), step: 'HLS', percent: 150 },
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown event types', () => {
    expect(
      platformEventSchema.safeParse({ ...base, type: 'video.unknown', payload: {} }).success,
    ).toBe(false);
  });
});
