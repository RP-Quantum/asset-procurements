import type { UserRole } from "#shared/generated/prisma/enums";

declare module "#app" {
	interface PageMeta {
		requiresAuth?: UserRole[] | boolean;
	}
}

export default defineNuxtRouteMiddleware((to) => {
	const requiresAuth = to.meta.requiresAuth;
	const userSession = useUserSession();

	if (requiresAuth) {
		if (!userSession.user.value) {
			return navigateTo("/login?original=" + encodeURIComponent(to.fullPath));
			
		}

		if (Array.isArray(requiresAuth) && requiresAuth.length > 0) {
			const hasRequiredRole = requiresAuth.includes(
				userSession.user.value.role as UserRole,
			);
			if (!hasRequiredRole) {
				return navigateTo("/");
			}
		}
	}

if (requiresAuth === false) {
  if (userSession.user.value && to.path !== "/") {
    return navigateTo("/");
  }
}
});
