<script setup lang="ts">
import {
	type AssetProcurementDeleteModal,
	type AssetProcurementUpdateSlideover,
	LazyAssetProcurementDeleteModal,
	LazyAssetProcurementUpdateSlideover,
} from "#components";
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";
import { PROCUREMENT_DOCUMENTS } from "#shared/consts/procurement-documents";

const props = defineProps<{
	data: SerializedAssetProcurement[];
}>();
const emit = defineEmits<{
	update: [];
	delete: [];
}>();

const overlay = useOverlay();
const userSession = useUserSession();

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const assetProcurementUpdateSlideover = overlay.create(
	LazyAssetProcurementUpdateSlideover as typeof AssetProcurementUpdateSlideover,
);
const assetProcurementDeleteModal = overlay.create(
	LazyAssetProcurementDeleteModal as typeof AssetProcurementDeleteModal,
);

const canUpdateAssetProcurement = computed(() =>
	canPerformAction(userSession.user.value?.role, "ASSET_PROCUREMENT", "UPDATE"),
);
const canDeleteAssetProcurement = computed(() =>
	canPerformAction(userSession.user.value?.role, "ASSET_PROCUREMENT", "DELETE"),
);

const columns = computed<TableColumn<SerializedAssetProcurement>[]>(() => [
	{
		accessorKey: "repair.asset.tag",
		header: getAssetFieldLabel("tag"),
		cell(props) {
			const assetId = props.row.original.repair.asset.id;
			const tag = props.getValue<string>();

			return h(
				UButton,
				{
					color: "neutral",
					size: "sm",
					trailingIcon: "lucide:link",
					variant: "link",
					to: `/assets/${assetId}`,
				},
				{ default: () => tag },
			);
		},
	},
	{
		accessorKey: "repair.asset.type",
		header: getAssetFieldLabel("type"),
	},
	{
		accessorKey: "repair.incidentId",
		header: getAssetRepairFieldLabel("incidentId"),
	},
	{
		accessorKey: "repair.title",
		header: getAssetRepairFieldLabel("title"),
	},
	{
		accessorKey: "createdAt",
		header: getAssetProcurementFieldLabel("createdAt"),
		cell(props) {
			const date = props.getValue<string>();
			return new Date(date).toLocaleDateString("th-TH", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		},
	},
	{
		id: "actions",
		cell(props) {
			const items: DropdownMenuItem[] = [
				{
					label: "ดูรายละเอียด",
					icon: "lucide:eye",
					to: `/procurements/${props.row.original.id}`,
				},
			];

			// Download documents - submenu with document types
			const procurementId = props.row.original.id;
			const assetTag = props.row.original.repair.asset.tag;

			items.push({
				label: "ดาวน์โหลดเอกสาร",
				icon: "lucide:file-down",
				children: PROCUREMENT_DOCUMENTS.map((doc) => ({
					label: doc.label,
					icon: doc.icon,
					onSelect() {
						window.open(
							`/api/asset-procurements/${procurementId}/documents/${doc.value}`,
							"_blank",
						);
						showToastSuccess({
							title: "กำลังดาวน์โหลด",
							message: `กำลังสร้าง ${doc.label} สำหรับ ${assetTag}`,
						});
					},
				})),
			});

			if (canUpdateAssetProcurement.value) {
				items.push({
					label: "แก้ไข",
					icon: "lucide:pencil",
					async onSelect() {
						const result = await assetProcurementUpdateSlideover.open({
							data: props.row.original,
						});

						if (result) {
							emit("update");
						}
					},
				});
			}

			if (canDeleteAssetProcurement.value) {
				items.push({
					label: "ลบ",
					icon: "lucide:trash-2",
					color: "error",
					async onSelect() {
						const result = await assetProcurementDeleteModal.open({
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
