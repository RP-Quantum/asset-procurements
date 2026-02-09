import { UpdateAssetProcurementSchema } from "#shared/modules/asset-procurement";
import { useAssetProcurementService } from "~~/server/modules/asset-procurement";

export default defineLazyEventHandler(() => {
	const assetProcurementService = useAssetProcurementService(prisma);

	return defineAuthenticatedEventHandler(
		async (event) => {
			try {
				const id = getRouterParam(event, "id");

				if (!id) {
					throw createError({
						statusCode: 400,
						message: "Missing asset procurement ID",
					});
				}

				const data = await readValidatedBody(
					event,
					UpdateAssetProcurementSchema.parse,
				);

				const assetProcurement =
					await assetProcurementService.updateAssetProcurement(id, data);

				return createDataResponse(assetProcurement);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("ASSET_PROCUREMENT", "UPDATE"),
	);
});
