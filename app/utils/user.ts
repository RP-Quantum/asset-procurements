import type { UserRole } from "#shared/generated/prisma/enums";
import type { SelectItem } from "@nuxt/ui";

export function getRoleLabel(role: string): string {
	const roles: Record<UserRole, string> = {
		Admin: "ผู้ดูแลระบบ",
		User: "ผู้ใช้ทั่วไป",
		Guest: "ผู้เยี่ยมชม",
	};

	return roles[role as UserRole] || role;
}

export function getRoleSelectItems({
	disabled,
}: {
	disabled?: UserRole[];
}): (SelectItem & {
	label: string;
	value: UserRole;
})[] {
	return [
		{
			label: "ผู้ดูแลระบบ",
			disabled: disabled?.includes("Admin"),
			value: "Admin",
		},
		{
			label: "ผู้ใช้ทั่วไป",
			disabled: disabled?.includes("User"),
			value: "User",
		},
		{
			label: "ผู้เยี่ยมชม",
			disabled: disabled?.includes("Guest"),
			value: "Guest",
		},
	];
}
