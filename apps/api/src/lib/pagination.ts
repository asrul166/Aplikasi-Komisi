import { z } from 'zod';

/** Standard pagination query schema */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function paginate<T>(
  data: T[],
  totalItems: number,
  params: PaginationParams
): PaginatedResult<T> {
  const totalPages = Math.ceil(totalItems / params.limit);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      totalItems,
      totalPages,
      hasNextPage: params.page < totalPages,
      hasPreviousPage: params.page > 1,
    },
  };
}

/** Calculate SQL offset from page-based params */
export function getOffset(params: PaginationParams): number {
  return (params.page - 1) * params.limit;
}
