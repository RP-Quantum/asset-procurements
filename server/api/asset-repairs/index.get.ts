import { useAssetRepairService } from "~~/server/modules/asset-repair";
import { paginationSchema, searchSchema } from "#shared/schemas";

export default defineLazyEventHandler(() => {
	const assetRepairService = useAssetRepairService(prisma);

	const schema = paginationSchema.extend(searchSchema.shape);

	return defineAuthenticatedEventHandler(async (event) => {
		try {
			const { page, perPage, search } = await getValidatedQuery(
				event,
				schema.parse,
			);

			const [assetRepairs, total] = await Promise.all([
				assetRepairService.getAssetRepairs({
					page,
					perPage,
					search,
				}),
				assetRepairService.countAssetRepairs({ search }),
			]);

			return createDataResponse(assetRepairs, {
				page,
				perPage,
				total,
			});
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
