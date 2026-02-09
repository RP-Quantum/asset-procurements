<script setup lang="ts">
import {
	type AssetDeleteModal,
	type AssetQRCodeModal,
	type AssetUpdateSlideover,
	LazyAssetDeleteModal,
	LazyAssetQRCodeModal,
	LazyAssetUpdateSlideover,
} from "#components";
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";

const props = defineProps<{
	data: SerializedAssetWithRelations[];
}>();
const emit = defineEmits<{
	update: [];
	delete: [];
}>();

const overlay = useOverlay();
const userSession = useUserSession();

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const assetUpdateSlideover = overlay.create(
	LazyAssetUpdateSlideover as typeof AssetUpdateSlideover,
);
const assetDeleteModal = overlay.create(
	LazyAssetDeleteModal as typeof AssetDeleteModal,
);
const assetQRCodeModal = overlay.create(
	LazyAssetQRCodeModal as typeof AssetQRCodeModal,
);

const canUpdateAsset = computed(() =>
	canPerformAction(userSession.user.value?.role, "ASSET", "UPDATE"),
);
const canDeleteAsset = computed(() =>
	canPerformAction(userSession.user.value?.role, "ASSET", "DELETE"),
);

const columns = computed<TableColumn<SerializedAssetWithRelations>[]>(() => [
	{
		accessorKey: "tag",
		header: getAssetFieldLabel("tag"),
		cell(props) {
			const id = props.row.original.id;
			const tag = props.getValue<string>();

			return h(
				UButton,
				{
					color: "neutral",
					size: "sm",
					trailingIcon: "lucide:link",
					variant: "link",
					to: `/assets/${id}`,
				},
				tag,
			);
		},
	},
	{
		accessorKey: "type",
		header: getAssetFieldLabel("type"),
	},
	{
		accessorKey: "brand",
		header: getAssetFieldLabel("brand"),
	},
	{
		accessorKey: "model",
		header: getAssetFieldLabel("model"),
	},
	{
		accessorKey: "serialNumber",
		header: getAssetFieldLabel("serialNumber"),
	},
	{
		accessorKey: "owner",
		header: getAssetFieldLabel("owner"),
	},
	{
		accessorKey: "details",
		header: getAssetFieldLabel("details"),
	},
	{
		accessorKey: "contractNumber",
		header: getAssetFieldLabel("contractNumber"),
	},
	{
		accessorKey: "contractEndDate",
		header: getAssetFieldLabel("contractEndDate"),
	},
	{
		id: "actions",
		cell(props) {
			const items: DropdownMenuItem[] = [];

			// QR Code - always available
			items.push({
				label: "QR Code",
				icon: "lucide:qr-code",
				async onSelect() {
					await assetQRCodeModal.open({
						data: props.row.original,
					});
				},
			});

			if (canUpdateAsset.value) {
				items.push({
					label: "แก้ไข",
					icon: "lucide:pencil",
					async onSelect() {
						const result = await assetUpdateSlideover.open({
							data: props.row.original,
						});

						if (result) {
							emit("update");
						}
					},
				});
			}
			if (canDeleteAsset.value) {
				items.push({
					label: "ลบ",
					icon: "lucide:trash-2",
					color: "error",
					async onSelect() {
						const result = await assetDeleteModal.open({
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
]);
</script>

<template>
	<UTable :columns="columns" :data="props.data" />
</template>
