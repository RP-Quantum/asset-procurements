import { useLocationService } from "~~/server/modules/location";

export default defineLazyEventHandler(() => {
	const locationService = useLocationService(prisma);

	return defineAuthenticatedEventHandler(async (event) => {
		try {
			const id = getRouterParam(event, "id");

			const location = await locationService.getLocationById(id!);

			return createDataResponse(location);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
