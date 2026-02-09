import type {
	PrismaClient,
	User,
	UserRole,
} from "#shared/generated/prisma/client";
import {
	UserCannotUpdateAdminRoleError,
	UserCannotUpdateRoleError,
	UserCannotUpdateSelfRoleError,
	UserNotFoundError,
} from "~~/server/modules/user/error";

export class UserService {
	constructor(private readonly prisma: PrismaClient) {}

	async getUsers(): Promise<User[]> {
		return this.prisma.user.findMany();
	}

	async getUserById(id: string): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new UserNotFoundError(id);
		}

		return user;
	}

	async countUsers(): Promise<number> {
		return this.prisma.user.count();
	}

	async updateUserRole(
		currentUserId: string,
		targetUserId: string,
		role: Exclude<UserRole, "Admin">,
	): Promise<User> {
		const currentUser = await this.getUserById(currentUserId);
		const targetUser = await this.getUserById(targetUserId);

		if (currentUser.role !== "Admin") {
			throw new UserCannotUpdateRoleError(currentUserId);
		}

		if (currentUser.id === targetUser.id) {
			throw new UserCannotUpdateSelfRoleError();
		}

		if (targetUser.role === "Admin") {
			throw new UserCannotUpdateAdminRoleError(targetUserId);
		}

		if (targetUser.role === role) {
			return targetUser;
		}

		return this.prisma.user.update({
			where: { id: targetUserId },
			data: { role },
		});
	}
}

export function useUserService(prisma: PrismaClient): UserService {
	return new UserService(prisma);
}
