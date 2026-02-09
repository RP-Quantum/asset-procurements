import { useAssetRepairService } from "~~/server/modules/asset-repair";

export default defineLazyEventHandler(() => {
	const assetRepairService = useAssetRepairService(prisma);

	return defineAuthenticatedEventHandler(async () => {
		try {
			const total = await assetRepairService.countAssetRepairs();

			return createDataResponse(total);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
