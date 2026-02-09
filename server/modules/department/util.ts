import type { DepartmentInclude } from "#shared/generated/prisma/models";

export const departmentInclude = {
	location: true,
} satisfies DepartmentInclude;
