import { UpdateAssetRepairSchema } from "#shared/modules/asset-repair";
import { useAssetRepairService } from "~~/server/modules/asset-repair";

export default defineLazyEventHandler(() => {
	const assetRepairService = useAssetRepairService(prisma);

	return defineAuthenticatedEventHandler(
		async (event) => {
			try {
				const id = getRouterParam(event, "id");
				const data = await readValidatedBody(
					event,
					UpdateAssetRepairSchema.parse,
				);

				const assetRepair = await assetRepairService.updateAssetRepair(
					id!,
					data,
				);

				return createDataResponse(assetRepair);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("ASSET_REPAIR", "UPDATE"),
	);
});
