import type { H3Event } from "h3";
import { ID_TOKEN_COOKIE_NAME } from "~~/server/consts/auth";

function getPostLogoutRedirectUri(event: H3Event): string | undefined {
	const candidate = getHeader(event, "origin") || getHeader(event, "referer");
	if (candidate) {
		try {
			return new URL(candidate).origin;
		} catch {
			return undefined;
		}
	}
}

function getAndClearIdTokenCookie(event: H3Event): string | undefined {
	const idToken = getCookie(event, ID_TOKEN_COOKIE_NAME) || undefined;
	deleteCookie(event, ID_TOKEN_COOKIE_NAME);
	return idToken;
}

function buildLogoutUrl(
	serverUrl: string,
	realm: string,
	params: {
		postLogoutRedirectUri: string | undefined;
		idToken: string | undefined;
	},
): string {
	try {
		const url = new URL(
			`${serverUrl}/realms/${realm}/protocol/openid-connect/logout`,
		);

		if (params.postLogoutRedirectUri && params.idToken) {
			url.searchParams.append(
				"post_logout_redirect_uri",
				params.postLogoutRedirectUri,
			);
			url.searchParams.append("id_token_hint", params.idToken);
		}

		return url.toString();
	} catch {
		console.warn(
			"Invalid serverUrl or realm provided for logout URL construction.",
		);
		return "/";
	}
}

export default defineEventHandler(async (event) => {
	try {
		const {
			oauth: { keycloak },
		} = useRuntimeConfig();
		const { serverUrl, realm } = keycloak;

		const postLogoutRedirectUri = getPostLogoutRedirectUri(event);
		const idToken = getAndClearIdTokenCookie(event);

		const logoutUrl = buildLogoutUrl(serverUrl, realm, {
			postLogoutRedirectUri,
			idToken,
		});

		await clearUserSession(event);

		return sendRedirect(event, logoutUrl);
	} catch (error) {
		const eventError = handleEventHandlerError(error, true);
		return sendRedirect(
			event,
			`/?error=${encodeURIComponent(eventError.message)}`,
		);
	}
});
