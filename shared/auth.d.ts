import type { User as PrismaUser } from "#shared/generated/prisma/client";

type AuthUser = Pick<
	PrismaUser,
	"id" | "employeeId" | "name" | "email" | "position" | "department" | "role"
>;

declare module "#auth-utils" {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface User extends AuthUser {}
}
