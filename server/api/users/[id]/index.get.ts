import { useUserService } from "~~/server/modules/user";

export default defineLazyEventHandler(() => {
	const userService = useUserService(prisma);

	return defineAuthenticatedEventHandler(
		async (event) => {
			try {
				const id = getRouterParam(event, "id");

				const user = await userService.getUserById(id!);

				return createDataResponse(user);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("USER", "READ"),
	);
});
