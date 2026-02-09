import { useAssetProcurementService } from "~~/server/modules/asset-procurement";

export default defineLazyEventHandler(() => {
	const assetProcurementService = useAssetProcurementService(prisma);

	return defineAuthenticatedEventHandler(async () => {
		try {
			const assetProcurements =
				await assetProcurementService.getAssetProcurements();

			return createDataResponse(assetProcurements);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
