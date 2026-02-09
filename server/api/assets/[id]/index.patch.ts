import { UpdateAssetSchema } from "#shared/modules/asset";
import { useAssetService } from "~~/server/modules/asset";

export default defineLazyEventHandler(() => {
	const assetService = useAssetService(prisma);

	return defineAuthenticatedEventHandler(
		async (event) => {
			try {
				const id = getRouterParam(event, "id");
				const data = await readValidatedBody(event, UpdateAssetSchema.parse);

				const asset = await assetService.updateAsset(id!, data);

				return createDataResponse(asset);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("ASSET", "UPDATE"),
	);
});
