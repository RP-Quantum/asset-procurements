import z4 from "zod/v4";
import type { AssetRepairUncheckedCreateInput } from "#shared/generated/prisma/models";

export type CreateAssetRepairDTO = z4.infer<typeof CreateAssetRepairSchema>;

export const CreateAssetRepairSchema = z4.object({
	assetId: z4.ulid(),
	incidentId: z4.string().min(1).max(255),
	title: z4.string().min(1).max(255),
	cause: z4.string().max(1024).optional(),
	description: z4.string().max(1024).optional(),
	informedAt: z4.coerce.date(),
}) satisfies z4.ZodType<AssetRepairUncheckedCreateInput>;

export type UpdateAssetRepairDTO = z4.infer<typeof UpdateAssetRepairSchema>;

export const UpdateAssetRepairSchema = CreateAssetRepairSchema.omit({
	assetId: true,
}).partial();
