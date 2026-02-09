<script setup lang="ts">
definePageMeta({
	requiresAuth: true,
});

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
		</template>

		<template #body>
			<NuxtPage :data="assetProcurement" />
		</template>
	</UDashboardPanel>
</template>
