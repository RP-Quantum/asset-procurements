import { useDepartmentService } from "~~/server/modules/department";

export default defineLazyEventHandler(() => {
	const departmentService = useDepartmentService(prisma);

	return defineAuthenticatedEventHandler(async () => {
		try {
			const departments = await departmentService.getAllDepartments();

			return createDataResponse(departments);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
