import { z } from 'zod';

export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export const httpEnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(1),
  SHUTDOWN_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  SHUTDOWN_DRAIN_MS: z.coerce.number().int().min(0).default(0),
});

export const databaseEnvSchema = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(50).default(10),
});

export const redisEnvSchema = z.object({
  REDIS_URL: z.url({ protocol: /^rediss?$/ }),
});

export const rabbitEnvSchema = z.object({
  RABBITMQ_URL: z.url({ protocol: /^amqps?$/ }),
  RABBITMQ_PREFETCH: z.coerce.number().int().min(1).default(1),
});

export const minioEnvSchema = z.object({
  MINIO_ENDPOINT: z.string().min(1),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_USE_SSL: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export const jwtVerifyEnvSchema = z.object({
  JWKS_URL: z.url(),
  JWT_ISSUER: z.string().min(1),
  JWT_AUDIENCE: z.string().min(1),
});
