import type { UserSession, UserSessionRequired } from "#auth-utils";
import type { UserRole } from "#shared/generated/prisma/enums";
import type { H3Event, EventHandler, EventHandlerRequest } from "h3";

// @ts-expect-error Function overloads
export function defineAuthenticatedEventHandler<
	Request extends EventHandlerRequest,
	Response,
>(
	handler: (event: H3Event, userSession: UserSessionRequired) => Response,
	requiresAuth: UserRole[] | true,
): EventHandler<Request, Response>;
export function defineAuthenticatedEventHandler<
	Request extends EventHandlerRequest,
	Response,
>(
	handler: (event: H3Event, userSession: UserSession) => Response,
	requiresAuth?: false,
): EventHandler<Request, Response>;
export function defineAuthenticatedEventHandler<
	Request extends EventHandlerRequest,
	Response,
>(
	handler: (
		event: H3Event,
		userSession: UserSession | UserSessionRequired,
	) => Response,
	requiresAuth: UserRole[] | true | false = true,
): EventHandler<Request, Response> {
	return defineEventHandler<Request>(async (event) => {
		const userSession = requiresAuth
			? await requireUserSession(event)
			: await getUserSession(event);

		if (requiresAuth) {
			validateAccessControl(userSession as UserSessionRequired, requiresAuth);
		}

		return handler(event, userSession);
	});
}

function validateAccessControl(
	userSession: UserSessionRequired,
	requiresAuth: UserRole[] | true,
): void {
	if (Array.isArray(requiresAuth) && requiresAuth.length > 0) {
		const hasRequiredRole = requiresAuth.includes(userSession.user.role);
		if (!hasRequiredRole) {
			throw createError({
				statusCode: 403,
				statusMessage: "Forbidden",
				message: "You do not have permission to access this resource.",
			});
		}
	}
}
