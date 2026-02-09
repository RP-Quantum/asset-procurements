import { prisma } from "~~/server/utils/prisma";
import { useAssetProcurementService } from "~~/server/modules/asset-procurement";

export default defineLazyEventHandler(() => {
	const assetProcurementService = useAssetProcurementService(prisma);

	return defineAuthenticatedEventHandler(async () => {
		try {
			const total =
				await assetProcurementService.countAssetProcurements();

			return createDataResponse(total);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
