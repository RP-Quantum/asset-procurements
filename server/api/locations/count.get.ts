import { useLocationService } from "~~/server/modules/location";

export default defineLazyEventHandler(() => {
	const locationService = useLocationService(prisma);

	return defineAuthenticatedEventHandler(async () => {
		try {
			const total = await locationService.countAllLocations();

			return createDataResponse(total);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
