import type { UserRole } from "#shared/generated/prisma/enums";

const PERMISSIONS = {
	ASSET: {
		CREATE: ["Admin", "User"],
		READ: ["Admin", "User", "Guest"],
		UPDATE: ["Admin", "User"],
		DELETE: ["Admin", "User"],
	},
	ASSET_REPAIR: {
		CREATE: ["Admin", "User"],
		READ: ["Admin", "User", "Guest"],
		UPDATE: ["Admin", "User"],
		DELETE: ["Admin", "User"],
	},
	ASSET_PROCUREMENT: {
		CREATE: ["Admin", "User"],
		READ: ["Admin", "User", "Guest"],
		UPDATE: ["Admin", "User"],
		DELETE: ["Admin", "User"],
	},
	DEPARTMENT: {
		READ: ["Admin", "User", "Guest"],
	},
	LOCATION: {
		READ: ["Admin", "User", "Guest"],
	},
	USER: {
		READ: ["Admin"],
		UPDATE_ROLE: ["Admin"],
	},
} as const satisfies Record<string, Record<string, UserRole[]>>;

export function getRequiredRoles<
	Resource extends keyof typeof PERMISSIONS,
	Action extends keyof (typeof PERMISSIONS)[Resource],
>(resource: Resource, action: Action): UserRole[] {
	return PERMISSIONS[resource][action] as UserRole[];
}

export function canPerformAction<
	Resource extends keyof typeof PERMISSIONS,
	Action extends keyof (typeof PERMISSIONS)[Resource],
>(userRole: UserRole | undefined, resource: Resource, action: Action): boolean {
	if (!userRole) {
		return false;
	}

	const requiredRoles = getRequiredRoles(resource, action);

	return requiredRoles.includes(userRole);
}
