<script setup lang="ts">
import {
	type AssetRepairCreateSlideover,
	LazyAssetRepairCreateSlideover,
} from "#components";
import type { DropdownMenuItem } from "@nuxt/ui";


definePageMeta({
	requiresAuth: true,
});

useSeoMeta({
	title: "การซ่อม",
});

const apiFetch = useApiFetch();
const userSession = useUserSession();
const overlay = useOverlay();

const assetRepairCreateSlideover = overlay.create(
	LazyAssetRepairCreateSlideover as typeof AssetRepairCreateSlideover,
);

const canCreateAssetRepair = computed(() =>
	canPerformAction(userSession.user.value?.role, "ASSET", "CREATE"),
);

const actionDropdownMenuItems = computed<DropdownMenuItem[]>(() => {
	const items: DropdownMenuItem[] = [];

	if (canCreateAssetRepair.value) {
		items.push({
			label: "เพิ่มการซ่อม",
			color: "primary",
			icon: "i-heroicons-plus",
			async onSelect() {
				const result = await assetRepairCreateSlideover.open();

				if (result) {
					refresh();
				}
			},
		});
	}

	return items;
});

const page = ref(1);
const perPage = ref(10);
const search = ref("");

const {
	data: assetRepairData,
	pending,
	refresh,
} = await useAsyncData(
	() =>
		apiFetch("/api/asset-repairs", {
			query: {
				page: page.value,
				perPage: perPage.value,
				search: search.value,
			},
		}),
	{
		watch: [page, perPage, search],
	},
);

const assetRepairs = computed(() => assetRepairData.value?.data);
const total = computed(() => assetRepairData.value?.meta?.total ?? 0);

const isLoading = computed(() => pending.value);
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<UDashboardNavbar title="การซ่อม">
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
			<UInput
				v-model.lazy="search"
				:disabled="isLoading"
				icon="lucide:search"
				:loading="isLoading"
				placeholder="ค้นหาการซ่อม..."
			/>
			<AssetRepairTable
				class="border-default rounded border"
				:data="assetRepairs ?? []"
				@update="refresh"
				@delete="refresh"
			/>
			<UPagination
				v-model:page="page"
				:disabled="isLoading"
				:items-per-page="perPage"
				:total="total"
			/>
		</template>
	</UDashboardPanel>
</template>
