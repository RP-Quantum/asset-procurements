import { ForbiddenError, NotFoundError } from "~~/server/utils/error";

export class UserNotFoundError extends NotFoundError {
	constructor(userId: string) {
		super({
			name: "UserNotFoundError",
			message: `User with ID ${userId} not found.`,
		});
	}
}

export class UserCannotUpdateRoleError extends ForbiddenError {
	constructor(userId: string) {
		super({
			name: "UserCannotUpdateRoleError",
			message: `Cannot update role for user with ID ${userId}.`,
		});
	}
}

export class UserCannotUpdateSelfRoleError extends ForbiddenError {
	constructor() {
		super({
			name: "UserCannotUpdateSelfRoleError",
			message: "Users cannot update their own roles.",
		});
	}
}

export class UserCannotUpdateAdminRoleError extends ForbiddenError {
	constructor(userId: string) {
		super({
			name: "UserCannotUpdateAdminRoleError",
			message: `Cannot update role for Admin user with ID ${userId}.`,
		});
	}
}
