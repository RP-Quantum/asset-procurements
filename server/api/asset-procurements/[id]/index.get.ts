import { useAssetProcurementService } from "~~/server/modules/asset-procurement";

export default defineLazyEventHandler(() => {
	const assetProcurementService = useAssetProcurementService(prisma);

	return defineAuthenticatedEventHandler(async (event) => {
		try {
			const id = getRouterParam(event, "id");

			if (!id) {
				throw createError({
					statusCode: 400,
					message: "Missing asset procurement ID",
				});
			}

			const assetProcurement =
				await assetProcurementService.getAssetProcurementById(id);

			return createDataResponse(assetProcurement);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
