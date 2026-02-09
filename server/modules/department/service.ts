import type { PrismaClient, Department } from "#shared/generated/prisma/client";
import { DepartmentNotFoundError } from "~~/server/modules/department/error";

export class DepartmentService {
	constructor(private readonly prisma: PrismaClient) {}

	async getAllDepartments(): Promise<Department[]> {
		return this.prisma.department.findMany();
	}

	async getDepartmentById(id: string): Promise<Department | null> {
		const department = await this.prisma.department.findUnique({
			where: { id },
		});

		if (!department) {
			throw new DepartmentNotFoundError(id);
		}

		return department;
	}

	async countAllDepartments(): Promise<number> {
		return this.prisma.department.count();
	}
}

export function useDepartmentService(prisma: PrismaClient): DepartmentService {
	return new DepartmentService(prisma);
}
