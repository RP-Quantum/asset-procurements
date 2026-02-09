import { ConflictError } from "~~/server/utils/error";

export class DuplicateEmployeeIDError extends ConflictError {
	constructor(employeeId: string) {
		super({
			name: "DuplicateEmployeeIDError",
			message: `An user with employee ID '${employeeId}' already exists.`,
		});
	}
}

export class DuplicateEmailError extends ConflictError {
	constructor(email: string) {
		super({
			name: "DuplicateEmailError",
			message: `An user with email '${email}' already exists.`,
		});
	}
}
