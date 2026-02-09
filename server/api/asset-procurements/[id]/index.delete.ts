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

				const assetProcurement =
					await assetProcurementService.deleteAssetProcurement(id);

				return createDataResponse(assetProcurement);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("ASSET_PROCUREMENT", "DELETE"),
	);
});
