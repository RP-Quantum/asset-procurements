import z4 from "zod/v4";
import type {
	AssetProcurementUncheckedCreateInput,
	AssetProcurementUncheckedUpdateInput,
} from "#shared/generated/prisma/models";

export type ProcurementDataDTO = z4.infer<typeof ProcurementDataSchema>;

const ProcurementDataSchema = z4.object({
	vendor: z4.string().max(255).optional(),
	quoteId: z4.string().max(255).optional(),
	itemName: z4.string().max(255).optional(),
	torOfficer: z4.string().max(255).optional(),
	torOfficerPosition: z4.string().max(255).optional(),
	torOfficerDepartment: z4.string().max(255).optional(),
	estimatedBudget: z4.number().min(0).optional(),
	procureItems: z4
		.array(
			z4.object({
				itemName: z4.string().max(255),
				quantity: z4.number().min(1),
				total: z4.number().min(0),
			}),
		)
		.optional(),
	reason: z4.string().max(1000).optional(),
	source: z4.string().max(255).optional(),
	reportId: z4.string().max(255).optional(),
	reportDate: z4.coerce.date().optional(),
	deliveryAddress: z4.string().max(255).optional(),
	hasVat: z4.boolean().optional(),
	taxInvoiceNumber: z4.string().max(255).optional(),
	taxInvoiceDate: z4.coerce.date().optional(),
	deliveryDate: z4.coerce.date().optional(),
	deliveranceStatus: z4
		.enum([
			"ถูกต้องครบถ้วน",
			"ถูกต้องแต่ไม่ครบถ้วน",
			"ครบถ้วนแต่ไม่ถูกต้องทั้งหมด",
		])
		.optional(),
	withdrawerName: z4.string().max(255).optional(),
});

export type CreateAssetProcurementDTO = z4.infer<
	typeof CreateAssetProcurementSchema
>;

export const CreateAssetProcurementSchema = z4.object({
	repairId: z4.ulid(),
	data: ProcurementDataSchema.optional(),
}) satisfies z4.ZodType<AssetProcurementUncheckedCreateInput>;

export type UpdateAssetProcurementDTO = z4.infer<
	typeof UpdateAssetProcurementSchema
>;

export const UpdateAssetProcurementSchema = CreateAssetProcurementSchema.omit({
	repairId: true,
}).partial() satisfies z4.ZodType<AssetProcurementUncheckedUpdateInput>;
