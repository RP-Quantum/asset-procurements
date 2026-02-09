import { H3Error } from "h3";

export class UnauthorizedError extends H3Error {
	constructor({ name, message }: { name?: string; message?: string }) {
		super(message || "Unauthorized");
		this.name = name || "UnauthorizedError";
		this.statusCode = 401;
		this.statusMessage = "Unauthorized";
	}
}

export class ForbiddenError extends H3Error {
	constructor({ name, message }: { name?: string; message?: string }) {
		super(message || "Forbidden");
		this.name = name || "ForbiddenError";
		this.statusCode = 403;
		this.statusMessage = "Forbidden";
	}
}

export class NotFoundError extends H3Error {
	constructor({ name, message }: { name?: string; message?: string }) {
		super(message || "Not Found");
		this.name = name || "NotFoundError";
		this.statusCode = 404;
		this.statusMessage = "Not Found";
	}
}

export class ConflictError extends H3Error {
	constructor({ name, message }: { name?: string; message?: string }) {
		super(message || "Conflict Error");
		this.name = name || "ConflictError";
		this.statusCode = 409;
		this.statusMessage = "Conflict";
	}
}

export function handleEventHandlerError(error: unknown, safe: true): H3Error;
export function handleEventHandlerError(error: unknown, safe?: false): void;
export function handleEventHandlerError(
	error: unknown,
	safe = false,
): H3Error | void {
	let h3Error: H3Error;

	if (error instanceof H3Error) {
		h3Error = error;
	} else {
		console.error("Unexpected error:", error);
		h3Error = createError({
			statusCode: 500,
			statusMessage: "Internal Server Error",
			message: "An unexpected error occurred.",
		});
	}

	if (safe) {
		return h3Error;
	}

	throw h3Error;
}
