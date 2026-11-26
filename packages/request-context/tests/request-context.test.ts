import { describe, expect, it } from 'vitest';
import { getContext, runWithContext, setContextValue } from '../src/index.js';

describe('request context', () => {
  it('is undefined outside a run', () => {
    expect(getContext()).toBeUndefined();
  });

  it('survives async boundaries', async () => {
    await runWithContext({ requestId: 'req-1' }, async () => {
      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(getContext()?.requestId).toBe('req-1');
    });
  });

  it('isolates concurrent runs and allows enrichment', async () => {
    const read = async (id: string): Promise<string | undefined> =>
      runWithContext({ requestId: id }, async () => {
        setContextValue('userId', `user-${id}`);
        await new Promise((resolve) => setTimeout(resolve, 5));
        return getContext()?.userId;
      });
    expect(await Promise.all([read('a'), read('b')])).toEqual(['user-a', 'user-b']);
  });
});
