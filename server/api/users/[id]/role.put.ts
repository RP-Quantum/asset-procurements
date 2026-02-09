import { UpdateUserRoleSchema } from "#shared/modules/user";
import { useUserService } from "~~/server/modules/user";

export default defineLazyEventHandler(() => {
	const userService = useUserService(prisma);

	return defineAuthenticatedEventHandler(
		async (event, userSession) => {
			try {
				const id = getRouterParam(event, "id");
				const { role } = await readValidatedBody(
					event,
					UpdateUserRoleSchema.parse,
				);

				const user = await userService.updateUserRole(
					userSession.user.id,
					id!,
					role,
				);

				return createDataResponse(user);
			} catch (error) {
				return handleEventHandlerError(error);
			}
		},
		getRequiredRoles("USER", "UPDATE_ROLE"),
	);
});
