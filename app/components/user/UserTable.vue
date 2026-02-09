<script setup lang="ts">
import type { UserRole } from "#shared/generated/prisma/enums";
import type { TableColumn } from "@nuxt/ui";

const props = defineProps<{
	data: SerializedUser[];
}>();
const emit = defineEmits<{
	roleUpdated: [];
}>();

const USelect = resolveComponent("USelect");

const columns = computed<TableColumn<SerializedUser>[]>(() => [
	{
		accessorKey: "employeeId",
		header: "รหัสพนักงาน",
	},
	{
		accessorKey: "name",
		header: "ชื่อ-นามสกุล",
	},
	{
		accessorKey: "email",
		header: "อีเมล",
	},
	{
		accessorKey: "position",
		header: "ตำแหน่ง",
	},
	{
		accessorKey: "department",
		header: "สังกัด",
	},
	{
		accessorKey: "role",
		header: "บทบาท",
		cell(props) {
			const role = props.getValue<UserRole>();
			const roleSelectItems = getRoleSelectItems({
				disabled: ["Admin", role],
			});

			const isDisabled =
				role === "Admin" || isUpdatingRole.value === props.row.original.id;
			const isLoading = isUpdatingRole.value === props.row.original.id;

			return h(USelect, {
				disabled: isDisabled,
				items: roleSelectItems,
				loading: isLoading,
				modelValue: props.row.original.role,
				valueKey: "value",
				"onUpdate:modelValue"(newRole: UserRole) {
					handleRoleUpdate(props.row.original.id, newRole);
				},
			});
		},
	},
]);

const isUpdatingRole = ref<string>();

async function handleRoleUpdate(id: string, newRole: UserRole) {
	if (isUpdatingRole.value) return;
	isUpdatingRole.value = id;

	const userService = useUserService();

	try {
		await userService.updateUserRole(id, newRole);

		showToastSuccess({
			title: "อัปเดตบทบาทผู้ใช้สำเร็จ",
			message: "คุณได้อัปเดตบทบาทผู้ใช้เรียบร้อยแล้ว",
		});

		emit("roleUpdated");
	} catch (error) {
		handleToastError(error);
	} finally {
		isUpdatingRole.value = undefined;
	}
}
</script>

<template>
	<UTable :columns="columns" :data="props.data" />
</template>
