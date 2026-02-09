<script setup lang="ts">
import {
	type AssetRepairDeleteModal,
	type AssetRepairUpdateSlideover,
	LazyAssetRepairDeleteModal,
	LazyAssetRepairUpdateSlideover,
} from "#components";
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";

const props = defineProps<{
	data: SerializedAssetRepairWithRelations[];
}>();
const emit = defineEmits<{
	update: [];
	delete: [];
}>();

const overlay = useOverlay();
const userSession = useUserSession();

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const assetRepairUpdateSlideover = overlay.create(
	LazyAssetRepairUpdateSlideover as typeof AssetRepairUpdateSlideover,
);
const assetRepairDeleteModal = overlay.create(
	LazyAssetRepairDeleteModal as typeof AssetRepairDeleteModal,
);

const canUpdateAssetRepair = computed(() =>
	canPerformAction(userSession.user.value?.role, "ASSET", "UPDATE"),
);
const canDeleteAssetRepair = computed(() =>
	canPerformAction(userSession.user.value?.role, "ASSET", "DELETE"),
);

const columns = computed<TableColumn<SerializedAssetRepairWithRelations>[]>(
	() => [
		{
			accessorKey: "asset.tag",
			header: getAssetFieldLabel("tag"),
		},
		{
			accessorKey: "asset.type",
			header: getAssetFieldLabel("type"),
		},
		{
			accessorKey: "incidentId",
			header: getAssetRepairFieldLabel("incidentId"),
		},
		{
			accessorKey: "title",
			header: getAssetRepairFieldLabel("title"),
		},
		{
			accessorKey: "cause",
			header: getAssetRepairFieldLabel("cause"),
		},
		{
			accessorKey: "description",
			header: getAssetRepairFieldLabel("description"),
		},
		{
			accessorKey: "informedAt",
			header: getAssetRepairFieldLabel("informedAt"),
			accessorFn(originalRow) {
				return new Date(originalRow.informedAt).toLocaleDateString("th-TH", {
					day: "numeric",
					month: "long",
					year: "numeric",
				});
			},
		},
		{
			id: "actions",
			cell(props) {
				const items: DropdownMenuItem[] = [];

				if (canUpdateAssetRepair.value) {
					items.push({
						label: "แก้ไข",
						icon: "lucide:pencil",
						async onSelect() {
							const result = await assetRepairUpdateSlideover.open({
								data: props.row.original,
							});

							if (result) {
								emit("update");
							}
						},
					});
				}
				if (canDeleteAssetRepair.value) {
					items.push({
						label: "ลบ",
						icon: "lucide:trash-2",
						color: "error",
						async onSelect() {
							const result = await assetRepairDeleteModal.open({
								data: props.row.original,
							});

							if (result) {
								emit("delete");
							}
						},
					});
				}

				return h(
					UDropdownMenu,
					{
						content: {
							align: "start",
							side: "left",
						},
						items,
						ui: {
							content: "min-w-40",
						},
					},
					{
						default: () =>
							h(UButton, {
								color: "neutral",
								icon: "lucide:ellipsis-vertical",
								size: "sm",
								variant: "ghost",
							}),
					},
				);
			},
		},
	],
);
</script>

<template>
	<UTable :columns="columns" :data="props.data" />
</template>
