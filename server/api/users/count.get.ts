import { useUserService } from "~~/server/modules/user";

export default defineLazyEventHandler(() => {
	const userService = useUserService(prisma);

	return defineAuthenticatedEventHandler(
		async () => {
			try {
				const total = await userService.countUsers();

				return createDataResponse(total);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("USER", "READ"),
	);
});
