import { describe, expect, it } from 'vitest';
import {
  ConfigError,
  baseEnvSchema,
  databaseEnvSchema,
  httpEnvSchema,
  loadConfig,
} from '../src/index.js';

const schema = baseEnvSchema.extend(httpEnvSchema.shape).extend(databaseEnvSchema.shape);
const valid = { PORT: '3001', DATABASE_URL: 'postgresql://user:pw@host/db' };

describe('loadConfig', () => {
  it('parses, coerces and applies defaults', () => {
    const config = loadConfig(schema, valid);
    expect(config.PORT).toBe(3001);
    expect(config.NODE_ENV).toBe('development');
    expect(config.DATABASE_POOL_MAX).toBe(10);
  });

  it('lists every invalid variable', () => {
    expect(() => loadConfig(schema, { PORT: 'abc' })).toThrow(ConfigError);
    expect(() => loadConfig(schema, { PORT: 'abc' })).toThrow(/PORT[\s\S]*DATABASE_URL/);
  });

  it('never prints values', () => {
    const bad = { PORT: '3001', DATABASE_URL: 'not-a-url-secret123' };
    expect(() => loadConfig(schema, bad)).not.toThrow(/secret123/);
  });
});
