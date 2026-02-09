<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const userSession = useUserSession();
const canReadUser = canPerformAction(
	userSession.user.value?.role,
	"USER",
	"READ",
);

const navigationMenuItems = computed<NavigationMenuItem[][]>(() => {
	const items: NavigationMenuItem[][] = [
		[
			{
				label: "หน้าหลัก",
				icon: "lucide:house",
				to: "/",
			},
		],
		[
			{
				label: "ทรัพย์สิน",
				icon: "lucide:monitor",
				to: "/assets",
			},
			{
				label: "การซ่อม",
				icon: "lucide:tool-case",
				to: "/asset-repairs",
			},
			{
				label: "การจัดซื้อ",
				icon: "lucide:shopping-cart",
				to: "/asset-procurements",
			},
		],
	];

	if (canReadUser) {
		items.push([
			{
				label: "ผู้ใช้",
				icon: "lucide:users",
				to: "/users",
			},
		]);
	}

	return items;
});
</script>

<template>
	<UDashboardGroup unit="rem">
		<UDashboardSidebar
			:default-size="16"
			collapsible
			:resizable="false"
			:ui="{ root: 'bg-elevated/25' }"
		>
			<template #header>
				<UDashboardSidebarCollapse />
			</template>

			<template #default="{ collapsed }">
				<UNavigationMenu
					:collapsed="collapsed"
					:items="navigationMenuItems"
					orientation="vertical"
				/>
			</template>

			<template #footer="{ collapsed }">
				<div class="flex w-full flex-col gap-1.5">
					<div class="flex items-center">
						<UColorModeButton />
					</div>

					<UserDropdownMenu :collapsed="collapsed" />
				</div>
			</template>
		</UDashboardSidebar>

		<slot />
	</UDashboardGroup>
</template>
