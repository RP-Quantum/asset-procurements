import { useAssetService } from "~~/server/modules/asset";

export default defineLazyEventHandler(() => {
	const assetService = useAssetService(prisma);

	return defineAuthenticatedEventHandler(async () => {
		try {
			const total = await assetService.countAssets();

			return createDataResponse(total);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
