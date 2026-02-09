<script setup lang="ts">
import {
	type AssetCreateSlideover,
	LazyAssetCreateSlideover,
} from "#components";
import type { DropdownMenuItem } from "@nuxt/ui";

definePageMeta({
	requiresAuth: true,
});

useSeoMeta({
	title: "ทรัพย์สิน",
});

const apiFetch = useApiFetch();

const userSession = useUserSession();
const overlay = useOverlay();

const assetCreateSlideover = overlay.create(
	LazyAssetCreateSlideover as typeof AssetCreateSlideover,
);

const canCreateAsset = computed(() =>
	canPerformAction(userSession.user.value?.role, "ASSET", "CREATE"),
);

const actionDropdownMenuItems = computed<DropdownMenuItem[]>(() => {
	const items: DropdownMenuItem[] = [];

	if (canCreateAsset.value) {
		items.push({
			label: "เพิ่มทรัพย์สิน",
			color: "primary",
			icon: "i-heroicons-plus",
			async onSelect() {
				const { created } = await assetCreateSlideover.open();

				if (created) {
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
	data: assetData,
	pending,
	refresh,
} = await useAsyncData(
	() =>
		apiFetch("/api/assets", {
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

const assets = computed(() => assetData.value?.data);
const total = computed(() => assetData.value?.meta?.total ?? 0);

const isLoading = computed(() => pending.value);
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<UDashboardNavbar title="ทรัพย์สินอุปกรณ์สารสนเทศ">
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
				placeholder="ค้นหาทรัพย์สิน..."
			/>

			<AssetTable
				class="border-default rounded border"
				:data="assets ?? []"
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
