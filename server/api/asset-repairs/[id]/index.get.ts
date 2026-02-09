import { useAssetRepairService } from "~~/server/modules/asset-repair";

export default defineLazyEventHandler(() => {
	const assetRepairService = useAssetRepairService(prisma);

	return defineAuthenticatedEventHandler(async (event) => {
		try {
			const id = getRouterParam(event, "id");

			const assetRepair = await assetRepairService.getAssetRepairById(id!);

			return createDataResponse(assetRepair);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
