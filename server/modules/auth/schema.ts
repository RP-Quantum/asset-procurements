import z4 from "zod/v4";
import type { UserUncheckedCreateInput } from "#shared/generated/prisma/models";

export type UpsertKeycloakUserDTO = z4.infer<typeof UpsertKeycloakUserSchema>;

export const UpsertKeycloakUserSchema = z4.object({
	sub: z4.string().min(1).max(255),
	employeeId: z4.string().min(1).max(255),
	name: z4.string().min(1).max(255),
	email: z4.email().max(255),
	position: z4.string().min(1).max(255),
	department: z4.string().min(1).max(255),
}) satisfies z4.ZodType<UserUncheckedCreateInput>;
