import { useAssetRepairService } from "~~/server/modules/asset-repair";

export default defineLazyEventHandler(() => {
	const assetRepairService = useAssetRepairService(prisma);

	return defineAuthenticatedEventHandler(
		async (event) => {
			try {
				const id = getRouterParam(event, "id");

				const assetRepair = await assetRepairService.deleteAssetRepair(id!);

				return createDataResponse(assetRepair);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("ASSET_REPAIR", "DELETE"),
	);
});
