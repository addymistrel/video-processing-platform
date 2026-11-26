import { z } from 'zod';

const paginationQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

type PaginationQuery = z.infer<typeof paginationQuerySchema>;

const pageInfoSchema = z.object({
  nextCursor: z.string().nullable(),
  limit: z.number().int().positive(),
});

type PageInfo = z.infer<typeof pageInfoSchema>;

const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
    requestId: z.string().optional(),
  }),
});

export { errorResponseSchema, pageInfoSchema, paginationQuerySchema };

export type { PageInfo, PaginationQuery };
