import z4 from "zod/v4";
import type { AssetUncheckedCreateInput } from "#shared/generated/prisma/models";
import type { AssetType } from "#shared/generated/prisma/enums";

export type CreateAssetDTO = z4.infer<typeof CreateAssetSchema>;

export const CreateAssetSchema = z4.object({
	departmentId: z4.ulid(),
	tag: z4.string().min(1).max(255),
	type: z4.enum(["PC", "Monitor", "Printer", "Other"] as AssetType[]),
	brand: z4.string().max(255).optional(),
	model: z4.string().max(255).optional(),
	serialNumber: z4.string().max(255).optional(),
	contractNumber: z4.string().max(255).optional(),
	contractEndDate: z4.string().max(255).optional(),
	owner: z4.string().max(255).optional(),
	details: z4.string().max(1024).optional(),
}) satisfies z4.ZodType<AssetUncheckedCreateInput>;

export type UpdateAssetDTO = z4.infer<typeof UpdateAssetSchema>;

export const UpdateAssetSchema = CreateAssetSchema.partial();
