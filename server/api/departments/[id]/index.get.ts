import { useDepartmentService } from "~~/server/modules/department";

export default defineLazyEventHandler(() => {
	const departmentService = useDepartmentService(prisma);

	return defineAuthenticatedEventHandler(async (event) => {
		try {
			const id = getRouterParam(event, "id");

			const department = await departmentService.getDepartmentById(id!);

			return createDataResponse(department);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
