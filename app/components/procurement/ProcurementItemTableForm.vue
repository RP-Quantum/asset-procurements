<script setup lang="ts">
import { DEFAULT_VAT_RATE } from "#shared/consts/procurement";
import type { TableColumn } from "@nuxt/ui";
import ThaiBahtText from "thai-baht-text";

type Item = NonNullable<AssetProcurementData["procureItems"]>[number] & {
	unitPrice?: number;
	subtotal?: number;
	vatAmount?: number;
};

const MAX_ITEMS = 10;

const items = defineModel<Item[]>({ required: true });

function calculateDerivedValues(row: Item) {
	if (row.quantity <= 0 || row.total <= 0) {
		row.unitPrice = 0;
		row.subtotal = 0;
		row.vatAmount = 0;
		return;
	}

	const vatRate = DEFAULT_VAT_RATE / 100;

	row.unitPrice =
		Math.round((row.total / (1 + vatRate) / row.quantity) * 100) / 100;
	row.subtotal = Math.round(row.unitPrice * row.quantity * 100) / 100;
	row.vatAmount = Math.round((row.total - row.subtotal) * 100) / 100;
}

function addItem() {
	if (items.value.length >= MAX_ITEMS) return;
	items.value.push({
		itemName: "",
		quantity: 0,
		total: 0,
	});
}

function removeItem(index: number) {
	if (items.value.length <= 1) return;
	items.value.splice(index, 1);
}

const total = computed(() =>
	items.value.reduce((sum, item) => sum + (item.total || 0), 0),
);

const UInput = resolveComponent("UInput");
const UButton = resolveComponent("UButton");

const columns = computed<TableColumn<Item>[]>(() => [
	{
		accessorKey: "itemName",
		header: "รายละเอียด",
		cell(props) {
			return h(UInput, {
				name: `procureItems.itemName.${props.row.index}`,
				modelValue: props.getValue(),
				"onUpdate:modelValue": (value: string) => {
					props.row.original.itemName = value;
				},
			});
		},
		footer() {
			return `(${ThaiBahtText(total.value)})`;
		},
	},
	{
		accessorKey: "quantity",
		header: "จำนวน",
		cell(props) {
			return h(UInput, {
				type: "number",
				name: `procureItems.quantity.${props.row.index}`,
				modelValue: props.getValue(),
				"onUpdate:modelValue": (value: number) => {
					props.row.original.quantity = value;
					calculateDerivedValues(props.row.original);
				},
				ui: {
					base: "text-end",
				},
			});
		},
	},
	{
		accessorKey: "unitPrice",
		header: "ราคาต่อหน่วย",
		cell(props) {
			return h(UInput, {
				type: "number",
				modelValue: (() => {
					const value = props.getValue();
					if (value === undefined) {
						calculateDerivedValues(props.row.original);
					}
					return props.getValue();
				})(),
				disabled: true,
				ui: {
					base: "text-end",
				},
			});
		},
	},
	{
		accessorKey: "vatAmount",
		header: "ภาษีมูลค่าเพิ่ม",
		cell(props) {
			return h(UInput, {
				modelValue: (() => {
					const value = props.getValue();
					if (value === undefined) {
						calculateDerivedValues(props.row.original);
					}
					return props.getValue();
				})(),
				disabled: true,
				ui: {
					base: "text-end",
				},
			});
		},
	},
	{
		accessorKey: "subtotal",
		header: "ราคารวม",
		cell(props) {
			return h(UInput, {
				modelValue: (() => {
					const value = props.getValue();
					if (value === undefined) {
						calculateDerivedValues(props.row.original);
					}
					return props.getValue();
				})(),
				disabled: true,
				ui: {
					base: "text-end",
				},
			});
		},
		footer() {
			return h(UButton, {
				block: true,
				color: "primary",
				icon: "lucide:plus",
				label: "เพิ่มรายการ",
				onClick: addItem,
			});
		},
	},
	{
		accessorKey: "total",
		header: "ราคารวมทั้งสิ้น",
		cell(props) {
			return h(UInput, {
				type: "number",
				name: `procureItems.total.${props.row.index}`,
				modelValue: props.row.original.total,
				"onUpdate:modelValue": (value: number) => {
					props.row.original.total = value;
					calculateDerivedValues(props.row.original);
				},
				ui: {
					base: "text-end",
				},
			});
		},
		footer() {
			return h(UInput, {
				modelValue: total.value.toLocaleString("th-TH", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}),
				disabled: true,
				ui: {
					base: "text-end",
				},
			});
		},
	},
	{
		id: "delete",
		cell(props) {
			if (items.value.length <= 1) {
				return null;
			}

			return h(UButton, {
				color: "error",
				icon: "lucide:trash-2",
				onClick: () => removeItem(props.row.index),
			});
		},
	},
]);
</script>

<template>
	<UTable
		class="border-default bg-default rounded border"
		:columns="columns"
		:data="items"
		:ui="{
			th: 'bg-elevated/25',
		}"
	/>
</template>
