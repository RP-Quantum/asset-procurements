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
//เพิ่ม component สำหรับ Progress และ Badge
const UProgress = resolveComponent("UProgress");
const UBadge = resolveComponent("UBadge");


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

//เพิ่มฟังก์ชันคำนวณเปอร์เซ็นเอกสาร
function calculateDocumentProgress(data: any) {
	if (!data) return 0;

	const fields = [
		data.vendor,
		data.quoteId,
		data.itemName,
		data.torOfficer,
		data.torOfficerPosition,
		data.torOfficerDepartment,
		data.estimatedBudget,
		data.procureItems && data.procureItems.length > 0,
		data.reason,
		data.source,
		data.reportId,
		data.reportDate,
		data.deliveryAddress,
		data.taxInvoiceNumber,
		data.taxInvoiceDate,
		data.deliveryDate,
		data.deliveranceStatus,
		data.withdrawerName,
	];

	const filled = fields.filter((f) => {
		if (typeof f === "boolean") return f;
		return !!f;
	}).length;

	return Math.round((filled / fields.length) * 100);
}

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
					color: "primary",
					size: "sm",
					trailingIcon: "lucide:external-link",
					variant: "link",
					to: `/assets/${assetId}`,
					class: "font-semibold",
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

			return h(
				"span",
				{ class: "text-gray-500 text-sm" },
				new Date(date).toLocaleDateString("th-TH", {
					year: "numeric",
					month: "short",
					day: "numeric",
				}),
			);
		},
	},

	//เพิ่ม Column ใหม่ใน Table
{
	id: "documentProgress",
	header: "ความสมบูรณ์ของเอกสาร",
	cell(props) {

		const data = props.row.original.data
		const progress = calculateDocumentProgress(data)

		let color = "error"
		let status = "ข้อมูลไม่ครบ"

		if (progress === 100) {
			color = "success"
			status = "สมบูรณ์"
		} else if (progress >= 50) {
			color = "warning"
			status = "กำลังดำเนินการ"
		}

		return h("div", { class: "flex flex-col gap-1 w-40" }, [

			h(UProgress, {
				modelValue: progress,
				size: "xs",
				color
			}),

			h("div", { class: "flex justify-between text-xs" }, [

				h("span", { class: "font-medium" }, `${progress}%`),

				h(UBadge, {
					color,
					variant: "subtle",
					size: "xs"
				}, { default: () => status })

			])

		])
	}
},
	
	{
		id: "actions",
		cell(props) {
			const items: DropdownMenuItem[] = [
				{
					label: "ดูรายละเอียด/แก้ไข",
					icon: "lucide:eye",
					to: `/procurements/${props.row.original.id}`,
				},
			];

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

						if (result) emit("update");
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
        assetProcurement: props.row.original, // <--- เปลี่ยนชื่อคีย์ให้ตรงกับ defineProps ใน Modal
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
						content: "min-w-44",
					},
				},
				{
					default: () =>
						h(
							UButton,
							{
								color: "neutral",
								size: "xs",
								variant: "soft",
								trailingIcon: "lucide:chevron-down",
								class:
									"rounded-lg px-3 font-medium shadow-sm hover:shadow transition-all",
							},
							{ default: () => "จัดการ" },
						),
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
          wrapper: 'min-w-[1100px]', // กว้างขึ้นเพื่อรองรับ Progress Bar และรายละเอียด

          thead: `
            bg-gradient-to-r 
            from-gray-50 to-gray-100 
            dark:from-gray-800 dark:to-gray-900
          `,

          th: `
            text-gray-600 dark:text-gray-300
            font-semibold text-xs uppercase tracking-wider
            py-4 px-4
          `,

          tbody: 'divide-y divide-gray-100 dark:divide-gray-800',

          td: `
            py-4 px-4 text-sm
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