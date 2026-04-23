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
const UBadge = resolveComponent("UBadge");

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

const columns = computed<TableColumn<SerializedAssetRepairWithRelations>[]>(() => [
	{
		accessorKey: "asset.tag",
		header: getAssetFieldLabel("tag"),
		cell(props) {
			return h(
				UButton,
				{
					color: "neutral",
					size: "sm",
					variant: "link",
					class: "font-semibold",
				},
				props.getValue<string>(),
			);
		},
	},

	{
		accessorKey: "asset.type",
		header: getAssetFieldLabel("type"),
		cell(props) {
			return h(
				UBadge,
				{
					color: "neutral",
					variant: "subtle",
				},
				props.getValue<string>(),
			);
		},
	},

	{
		accessorKey: "incidentId",
		header: getAssetRepairFieldLabel("incidentId"),
	},

	{
		accessorKey: "title",
		header: getAssetRepairFieldLabel("title"),
		cell(props) {
			return h(
				"div",
				{
					class: "max-w-[220px] truncate font-medium",
				},
				props.getValue<string>(),
			);
		},
	},

	{
		accessorKey: "cause",
		header: getAssetRepairFieldLabel("cause"),
		cell(props) {
			return h(
				"div",
				{
					class: "max-w-[200px] truncate text-muted",
				},
				props.getValue<string>(),
			);
		},
	},

	{
		accessorKey: "description",
		header: getAssetRepairFieldLabel("description"),
		cell(props) {
			return h(
				"div",
				{
					class: "truncate max-w-[200px] text-gray-600 dark:text-gray-400",
				},
				props.getValue<string>(),
			);
		},
	},

	{
		accessorKey: "informedAt",
		header: getAssetRepairFieldLabel("informedAt"),
		cell(props) {
			return new Date(props.row.original.informedAt).toLocaleDateString(
				"th-TH",
				{
					day: "numeric",
					month: "short",
					year: "numeric",
				},
			);
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

						if (result) emit("update");
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

						if (result) emit("delete");
					},
				});
			}

			return h(
				UDropdownMenu,
				{
					content: {
						align: "end",
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
							size: "xs",
							variant: "soft",
							icon: "lucide:ellipsis",
							class:
								"rounded-lg shadow-sm hover:shadow transition-all",
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
    <div class="overflow-x-auto">
      <UTable
        :columns="columns"
        :data="props.data"
        :ui="{
          wrapper: 'min-w-[1000px]', // เพิ่มความกว้างเผื่อคอลัมน์รายละเอียด

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