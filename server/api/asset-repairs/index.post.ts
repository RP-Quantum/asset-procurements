import { CreateAssetRepairSchema } from "#shared/modules/asset-repair";
import { useAssetRepairService } from "~~/server/modules/asset-repair";

export default defineLazyEventHandler(() => {
	const assetRepairService = useAssetRepairService(prisma);

	return defineAuthenticatedEventHandler(
		async (event) => {
			try {
				const data = await readValidatedBody(
					event,
					CreateAssetRepairSchema.parse,
				);

				const assetRepair = await assetRepairService.createAssetRepair(data);

				return createDataResponse(assetRepair);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("ASSET_REPAIR", "CREATE"),
	);
});
