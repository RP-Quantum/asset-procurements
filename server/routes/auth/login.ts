import { ORIGINAL_URL_COOKIE_NAME } from "#shared/consts/auth";
import type { H3Event } from "h3";
import { ID_TOKEN_COOKIE_NAME } from "~~/server/consts/auth";
import { UpsertKeycloakUserSchema } from "~~/server/modules/auth/schema";
import { useAuthService } from "~~/server/modules/auth/service";

type ResultUser = {
	sub: string;
	hr_employee_id: string;
	hr_fullname_th: string;
	email: string;
	hr_position: string;
	hr_department: string;
};

type ResultTokens = {
	refresh_token: string;
	refresh_expires_in: number;
	id_token: string;
};

function parseKeycloakUser(resultUser: ResultUser) {
	return UpsertKeycloakUserSchema.parse({
		sub: resultUser.sub,
		employeeId: resultUser.hr_employee_id,
		name: resultUser.hr_fullname_th,
		email: resultUser.email,
		position: resultUser.hr_position,
		department: resultUser.hr_department,
	});
}

function setIdTokenCookie(event: H3Event, idToken: string, maxAge: number) {
	return setCookie(event, ID_TOKEN_COOKIE_NAME, idToken, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge,
	});
}

function getAndClearOriginalUrlCookie(event: H3Event): string | null {
	const originalUrl = getCookie(event, ORIGINAL_URL_COOKIE_NAME) || null;
	deleteCookie(event, ORIGINAL_URL_COOKIE_NAME);

	// Validate that originalUrl is a safe relative path
	if (!originalUrl) {
		return null;
	}

	// Must start with single slash and not be a protocol-relative URL
	if (!originalUrl.startsWith("/") || originalUrl.startsWith("//")) {
		return null;
	}

	// Prevent URLs with backslashes that might bypass validation
	if (originalUrl.includes("\\")) {
		return null;
	}

	// Additional safety: prevent control characters and encoded slashes
	// eslint-disable-next-line no-control-regex
	if (/[\x00-\x1F\x7F]|%2[fF]|%5[cC]/.test(originalUrl)) {
		return null;
	}

	return originalUrl;
}

export default defineLazyEventHandler(() => {
	const authService = useAuthService(prisma);

	return defineOAuthKeycloakEventHandler({
		async onSuccess(event, result) {
			try {
				const resultUser = result.user as ResultUser;
				const resultTokens = result.tokens as ResultTokens;

				const keycloakUser = parseKeycloakUser(resultUser);
				const user = await authService.upsertKeycloakUser(keycloakUser);
				await setUserSession(
					event,
					{
						user: {
							id: user.id,
							employeeId: user.employeeId,
							name: user.name,
							email: user.email,
							position: user.position,
							department: user.department,
							role: user.role,
						},
					},
					{
						maxAge: resultTokens.refresh_expires_in,
					},
				);

				setIdTokenCookie(
					event,
					resultTokens.id_token,
					resultTokens.refresh_expires_in,
				);

				const originalUrl = getAndClearOriginalUrlCookie(event);
				return sendRedirect(event, originalUrl || "/");
			} catch (error) {
				const eventError = handleEventHandlerError(error, true);
				return sendRedirect(
					event,
					`/login?error=${encodeURIComponent(eventError.message)}`,
				);
			}
		},

		onError(event, error) {
			const eventError = handleEventHandlerError(error, true);
			return sendRedirect(
				event,
				`/login?error=${encodeURIComponent(eventError.message)}`,
			);
		},
	});
});
