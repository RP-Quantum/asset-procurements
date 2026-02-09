import { useAssetService } from "~~/server/modules/asset";
import { paginationSchema, searchSchema } from "#shared/schemas";

export default defineLazyEventHandler(() => {
	const assetService = useAssetService(prisma);

	const schema = paginationSchema.extend(searchSchema.shape);

	return defineAuthenticatedEventHandler(async (event) => {
		try {
			const { page, perPage, search } = await getValidatedQuery(
				event,
				schema.parse,
			);

			const [assets, total] = await Promise.all([
				assetService.getAssets({
					page,
					perPage,
					search,
				}),
				assetService.countAssets({ search }),
			]);

			return createDataResponse(assets, {
				page,
				perPage,
				total,
			});
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
