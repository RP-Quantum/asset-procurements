import { CreateAssetSchema } from "#shared/modules/asset";
import { useAssetService } from "~~/server/modules/asset";

export default defineLazyEventHandler(() => {
	const assetService = useAssetService(prisma);

	return defineAuthenticatedEventHandler(
		async (event) => {
			try {
				const data = await readValidatedBody(event, CreateAssetSchema.parse);

				const asset = await assetService.createAsset(data);

				return createDataResponse(asset);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("ASSET", "CREATE"),
	);
});
