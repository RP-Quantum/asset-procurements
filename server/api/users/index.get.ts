import { useUserService } from "~~/server/modules/user";

export default defineLazyEventHandler(() => {
	const userService = useUserService(prisma);

	return defineAuthenticatedEventHandler(
		async () => {
			try {
				const users = await userService.getUsers();

				return createDataResponse(users);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("USER", "READ"),
	);
});
