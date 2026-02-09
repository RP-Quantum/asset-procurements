import type { $Fetch } from "nitropack";
import type { UserRole } from "#shared/generated/prisma/enums";

export class UserService {
	constructor(private readonly apiFetch: $Fetch) {}

	async getUsers() {
		return this.apiFetch("/api/users");
	}

	async getUserById(id: string) {
		return this.apiFetch(`/api/users/${id}`);
	}

	async countUsers() {
		return this.apiFetch("/api/users/count");
	}

	async updateUserRole(id: string, role: UserRole) {
		return this.apiFetch(`/api/users/${id}/role` as "/api/users/:id/role", {
			method: "PUT",
			body: { role },
		});
	}
}

export function useUserService(apiFetch?: $Fetch): UserService {
	apiFetch ??= useApiFetch();
	return new UserService(apiFetch);
}

/**
 * Fetch users data with caching using useAsyncData
 */
export function useUserData() {
	const userService = useUserService();

	return useAsyncData("users", () => userService.getUsers());
}

/**
 * Fetch single user data with caching using useAsyncData
 */
export function useUserDetailData(id: MaybeRefOrGetter<string>) {
	const userService = useUserService();

	return useAsyncData(`user-${toValue(id)}`, () =>
		userService.getUserById(toValue(id)),
	);
}

/**
 * Fetch user count with caching using useAsyncData
 */
export function useUserCountData() {
	const userService = useUserService();

	return useAsyncData("users-count", () => userService.countUsers());
}
