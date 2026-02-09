import type { PrismaClient, User } from "#shared/generated/prisma/client";
import {
	DuplicateEmailError,
	DuplicateEmployeeIDError,
} from "~~/server/modules/auth/error";
import type { UpsertKeycloakUserDTO } from "~~/server/modules/auth/schema";

export class AuthService {
	constructor(private readonly prisma: PrismaClient) {}

	async upsertKeycloakUser(data: UpsertKeycloakUserDTO): Promise<User> {
		const { sub, ...rest } = data;

		await this.validateDuplicateEmployeeId(sub, data.employeeId);
		await this.validateDuplicateEmail(sub, data.email);

		return this.prisma.user.upsert({
			where: { sub },
			create: {
				sub,
				...rest,
			},
			update: {
				...rest,
			},
		});
	}

	async validateDuplicateEmployeeId(
		sub: string,
		employeeId: string,
	): Promise<void> {
		const existingUser = await this.prisma.user.findUnique({
			where: {
				employeeId,
				NOT: { sub },
			},
		});

		if (existingUser) {
			throw new DuplicateEmployeeIDError(employeeId);
		}

		return;
	}

	async validateDuplicateEmail(sub: string, email: string): Promise<void> {
		const existingUser = await this.prisma.user.findUnique({
			where: {
				email,
				NOT: { sub },
			},
		});

		if (existingUser) {
			throw new DuplicateEmailError(email);
		}

		return;
	}
}

export function useAuthService(prisma: PrismaClient): AuthService {
	return new AuthService(prisma);
}
