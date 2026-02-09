<script setup lang="ts">
import {
	type AssetProcurementCreateSlideover,
	LazyAssetProcurementCreateSlideover,
} from "#components";
import type { DropdownMenuItem } from "@nuxt/ui";


definePageMeta({
	requiresAuth: true,
});
useSeoMeta({
	title: "การจัดซื้อ",
});

const userSession = useUserSession();
const overlay = useOverlay();

const assetProcurementCreateSlideover = overlay.create(
	LazyAssetProcurementCreateSlideover as typeof AssetProcurementCreateSlideover,
);

const canCreateAssetProcurement = computed(() =>
	canPerformAction(userSession.user.value?.role, "ASSET_PROCUREMENT", "CREATE"),
);

const actionDropdownMenuItems = computed<DropdownMenuItem[]>(() => {
	const items: DropdownMenuItem[] = [];

	if (canCreateAssetProcurement.value) {
		items.push({
			label: "เพิ่มการจัดซื้อ",
			color: "primary",
			icon: "i-heroicons-plus",
			async onSelect() {
				const { created } = await assetProcurementCreateSlideover.open();

				if (created) {
					refresh();
				}
			},
		});
	}

	return items;
});

// Use the asset procurement service composable
const { data: assetProcurementData, refresh } = await useAssetProcurementData();
const assetProcurements = computed(() => assetProcurementData.value?.data);
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<UDashboardNavbar title="การจัดซื้อ">
				<template #right>
					<UDropdownMenu
						v-if="actionDropdownMenuItems.length"
						:content="{
							align: 'end',
							side: 'bottom',
						}"
						:items="actionDropdownMenuItems"
						:ui="{
							content: 'min-w-40',
						}"
					>
						<UButton
							color="neutral"
							icon="lucide:ellipsis-vertical"
							variant="ghost"
						/>
					</UDropdownMenu>
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<AssetProcurementTable
				class="border-default rounded border"
				:data="assetProcurements ?? []"
				@update="refresh"
				@delete="refresh"
			/>
		</template>
	</UDashboardPanel>
</template>
