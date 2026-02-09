<script setup lang="ts">
import type { AvatarProps, DropdownMenuItem } from "@nuxt/ui";

defineProps<{
	collapsed?: boolean;
}>();

const userSession = useUserSession();

const avatar = computed<AvatarProps>(() => ({
	src: `https://pictureapi.pea.co.th/MyphotoAPI/api/v1/Main/GetPicImg?EmpCode=${userSession.user.value?.employeeId}&Type=1&SType=2`,
	alt: userSession.user.value?.name,
}));

const dropdownMenuItems = computed<DropdownMenuItem[][]>(() => {
	const items: DropdownMenuItem[][] = [
		[
			{
				type: "label",
				label: userSession.user.value?.name,
				avatar: avatar.value,
			},
		],
		[
			{
				label: "ออกจากระบบ",
				color: "error",
				icon: "lucide:log-out",
				external: true,
				to: "/auth/logout",
			},
		],
	];

	return items;
});
</script>

<template>
	<UDropdownMenu
		:content="{
			align: collapsed ? 'end' : 'start',
			side: collapsed ? 'right' : 'top',
		}"
		:items="dropdownMenuItems"
		:ui="{
			content: collapsed
				? 'min-w-48'
				: 'w-(--reka-dropdown-menu-trigger-width)',
		}"
	>
		<slot>
			<UButton
				:avatar="avatar"
				block
				color="neutral"
				:label="collapsed ? '' : userSession.user?.value?.name"
				:trailing-icon="collapsed ? '' : 'lucide:chevrons-up-down'"
				variant="ghost"
			/>
		</slot>
	</UDropdownMenu>
</template>
