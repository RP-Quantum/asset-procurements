import { useDepartmentService } from "~~/server/modules/department";

export default defineLazyEventHandler(() => {
	const departmentService = useDepartmentService(prisma);

	return defineAuthenticatedEventHandler(async () => {
		try {
			const total = await departmentService.countAllDepartments();

			return createDataResponse(total);
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
