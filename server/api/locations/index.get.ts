import { useLocationService } from "~~/server/modules/location";

export default defineLazyEventHandler(() => {
	const locationService = useLocationService(prisma);

	return defineAuthenticatedEventHandler(async () => {
		try {
			const locations = await locationService.getAllLocations();

			return createDataResponse(locations);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
