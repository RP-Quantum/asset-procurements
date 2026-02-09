<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

definePageMeta({
  requiresAuth: true,
})


const id = useRoute().params.id as string;

const { data: assetProcurementData } = await useFetch(
	`/api/asset-procurements/${id}` as "/api/asset-procurements/:id",
);

const assetProcurement = computed(() => assetProcurementData.value?.data);
if (!assetProcurement.value) {
	throw createError({
		statusCode: 404,
		statusMessage: "Asset Procurement not found",
	});
}

const title = `การจัดซื้อ ${assetProcurement.value.repair.title} (${assetProcurement.value.repair.asset.tag})`;

useSeoMeta({
	title,
});

const userSession = useUserSession();

const canUpdateProcurement = canPerformAction(
	userSession.user.value?.role,
	"ASSET_PROCUREMENT",
	"UPDATE",
);

const navigationMenuItems = computed<NavigationMenuItem[]>(() => {
	const items: NavigationMenuItem[] = [
		{
			label: "รายละเอียด",
			to: `/procurements/${id}`,
			exact: true,
			icon: "lucide:eye",
		},
	];

	if (canUpdateProcurement) {
		items.push({
			label: "แก้ไข",
			to: `/procurements/${id}/update`,
			icon: "lucide:pencil",
		});
	}

	return items;
});
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<UDashboardNavbar :title="title">
				<template #toggle>
					<UButton
						color="neutral"
						icon="lucide:arrow-left"
						variant="ghost"
						to="/asset-procurements"
					/>
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<UNavigationMenu :items="navigationMenuItems" />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<NuxtPage :data="assetProcurement" />
		</template>
	</UDashboardPanel>
</template>
