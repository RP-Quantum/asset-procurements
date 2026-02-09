import z4 from "zod/v4";

export type PaginationDTO = z4.infer<typeof paginationSchema>;

export const paginationSchema = z4.object({
	page: z4.coerce.number().min(1).default(1).optional(),
	perPage: z4.coerce.number().min(1).max(100).default(10).optional(),
});

export type SearchDTO = z4.infer<typeof searchSchema>;

export const searchSchema = z4.object({
	search: z4.string().max(255).optional(),
});
