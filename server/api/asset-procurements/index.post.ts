import { CreateAssetProcurementSchema } from "#shared/modules/asset-procurement";
import { useAssetProcurementService } from "~~/server/modules/asset-procurement";

export default defineLazyEventHandler(() => {
	const assetProcurementService = useAssetProcurementService(prisma);

	return defineAuthenticatedEventHandler(
		async (event) => {
			try {
				const data = await readValidatedBody(
					event,
					CreateAssetProcurementSchema.parse,
				);

				const assetProcurement =
					await assetProcurementService.createAssetProcurement(data);

				return createDataResponse(assetProcurement);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("ASSET_PROCUREMENT", "CREATE"),
	);
});
