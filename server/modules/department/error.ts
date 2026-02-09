import { NotFoundError } from "~~/server/utils/error";

export class DepartmentNotFoundError extends NotFoundError {
	constructor(departmentId: string) {
		super({
			name: "DepartmentNotFoundError",
			message: `Department with ID ${departmentId} not found.`,
		});
	}
}
