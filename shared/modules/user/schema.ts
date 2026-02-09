import z4 from "zod/v4";
import type { UserUncheckedUpdateInput } from "#shared/generated/prisma/models";
import type { UserRole } from "#shared/generated/prisma/enums";

export type UpdateUserRoleDTO = z4.infer<typeof UpdateUserRoleSchema>;

export const UpdateUserRoleSchema = z4.object({
	role: z4.enum(["User", "Guest"] as Exclude<UserRole, "Admin">[]),
}) satisfies z4.ZodType<UserUncheckedUpdateInput>;
