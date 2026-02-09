import { useAssetService } from "~~/server/modules/asset";

export default defineLazyEventHandler(() => {
	const assetService = useAssetService(prisma);

	return defineAuthenticatedEventHandler(
		async (event) => {
			try {
				const id = getRouterParam(event, "id");

				const asset = await assetService.deleteAsset(id!);

				return createDataResponse(asset);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("ASSET", "DELETE"),
	);
});
