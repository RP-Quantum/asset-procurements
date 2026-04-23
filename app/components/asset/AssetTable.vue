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
const UBadge = resolveComponent("UBadge");

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
					color: "primary",
					variant: "ghost",
					size: "sm",
					trailingIcon: "lucide:arrow-up-right",
					to: `/assets/${id}`,
					class: "font-semibold hover:underline underline-offset-4",
				},
				tag,
			);
		},
	},

	{
		accessorKey: "type",
		header: getAssetFieldLabel("type"),
		cell(props) {
			return h(
				UBadge,
				{
					color: "primary",
					variant: "soft",
					class: "rounded-full px-2.5 py-0.5 text-xs font-medium",
				},
				props.getValue<string>(),
			);
		},
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
		cell(props) {
			return h(
				"span",
				{
					class: "font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md",
				},
				props.getValue<string>() || "-",
			);
		},
	},

	{
		accessorKey: "owner",
		header: getAssetFieldLabel("owner"),
	},

	{
		accessorKey: "details",
		header: getAssetFieldLabel("details"),
		cell(props) {
			const value = props.getValue<string>();
			return h(
				"span",
				{
					class: "truncate max-w-[220px] text-gray-500 dark:text-gray-400",
					title: value,
				},
				value,
			);
		},
	},

	{
		accessorKey: "contractNumber",
		header: getAssetFieldLabel("contractNumber"),
	},

	{
		accessorKey: "contractEndDate",
		header: getAssetFieldLabel("contractEndDate"),
		cell(props) {
			const date = props.getValue<string>();
			if (!date) return "-";

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
			const items: DropdownMenuItem[] = [];

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
						if (result) emit("update");
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
						if (result) emit("delete");
					},
				});
			}

			return h(
				UDropdownMenu,
				{
					items,
					content: {
						align: "end",
						side: "bottom",
					},
					ui: {
						content:
							"min-w-44 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800",
					},
				},
				{
					default: () =>
						h(UButton, {
							color: "neutral",
							size: "xs",
							variant: "soft",
							icon: "lucide:more-horizontal",
							class:
								"rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200",
						}),
				},
			);
		},
	},
]);
</script>

<template>
  <div
    class="
      w-full
      rounded-2xl
      border border-gray-200/60 dark:border-gray-800
      bg-white dark:bg-gray-900
      shadow-sm hover:shadow-lg
      transition-all duration-300
      overflow-hidden
    "
  >
    <!-- Responsive Wrapper -->
    <div class="overflow-x-auto">
      <UTable
        :columns="columns"
        :data="props.data"
        :ui="{
          wrapper: 'min-w-[900px]',

          thead: `
            bg-gradient-to-r 
            from-gray-50 to-gray-100 
            dark:from-gray-800 dark:to-gray-900
          `,

          th: `
            text-gray-600 dark:text-gray-300
            font-semibold text-xs uppercase tracking-wider
            py-3 px-4
          `,

          tbody: 'divide-y divide-gray-100 dark:divide-gray-800',

          td: `
            py-3 px-4 text-sm
            text-gray-700 dark:text-gray-300
          `,

          tr: `
            transition-all duration-200
            odd:bg-white even:bg-gray-50/60
            dark:odd:bg-gray-900 dark:even:bg-gray-800/40

            hover:bg-primary-50/70
            dark:hover:bg-primary-900/20

          
          `,
        }"
      />
    </div>
  </div>
</template>