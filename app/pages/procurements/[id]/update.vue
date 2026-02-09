<script setup lang="ts">
import {
	UpdateAssetProcurementSchema,
	type UpdateAssetProcurementDTO,
} from "#shared/modules/asset-procurement";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
	data: SerializedAssetProcurementWithRelations;
}>();

const assetProcurementService = useAssetProcurementService();

const isUpdating = ref(false);

const procurementData = computed(() => props.data.data as AssetProcurementData);
const schema = UpdateAssetProcurementSchema;
const state = reactive({
	vendor: procurementData.value?.vendor || "",
	quoteId: procurementData.value?.quoteId || "",
	itemName: procurementData.value?.itemName || "",
	torOfficer: procurementData.value?.torOfficer || "",
	torOfficerPosition: procurementData.value?.torOfficerPosition || "",
	torOfficerDepartment: procurementData.value?.torOfficerDepartment || "",
	estimatedBudget: procurementData.value?.estimatedBudget || 0,
	procureItems: structuredClone(procurementData.value?.procureItems) || [],
	reason: procurementData.value?.reason || "",
	source: procurementData.value?.source || "",
	reportId: procurementData.value?.reportId || "",
	reportDate: procurementData.value.reportDate
		? new Date(procurementData.value.reportDate).toISOString().substring(0, 10)
		: "",
	deliveryAddress: procurementData.value?.deliveryAddress || "",
	hasVat: procurementData.value?.hasVat || false,
	taxInvoiceNumber: procurementData.value?.taxInvoiceNumber || "",
	taxInvoiceDate: procurementData.value?.taxInvoiceDate
		? new Date(procurementData.value.taxInvoiceDate)
				.toISOString()
				.substring(0, 10)
		: "",
	deliveryDate: procurementData.value?.deliveryDate
		? new Date(procurementData.value.deliveryDate)
				.toISOString()
				.substring(0, 10)
		: "",
	deliveranceStatus: procurementData.value?.deliveranceStatus || "",
	withdrawerName: procurementData.value?.withdrawerName || "",
});

function setData(data: Partial<AssetProcurementData>) {
	state.vendor = data.vendor || "";
	state.quoteId = data.quoteId || "";
	state.itemName = data.itemName || "";
	state.torOfficer = data.torOfficer || "";
	state.torOfficerPosition = data.torOfficerPosition || "";
	state.torOfficerDepartment = data.torOfficerDepartment || "";
	state.estimatedBudget = data.estimatedBudget || 0;
	state.procureItems = structuredClone(data.procureItems) || [];
	state.reason = data.reason || "";
	state.source = data.source || "";
	state.reportId = data.reportId || "";
	state.reportDate = data.reportDate
		? new Date(data.reportDate).toISOString().substring(0, 10)
		: "";
	state.deliveryAddress = data.deliveryAddress || "";
	state.hasVat = data.hasVat || false;
	state.taxInvoiceNumber = data.taxInvoiceNumber || "";
	state.taxInvoiceDate = data.taxInvoiceDate
		? new Date(data.taxInvoiceDate).toISOString().substring(0, 10)
		: "";
	state.deliveryDate = data.deliveryDate
		? new Date(data.deliveryDate).toISOString().substring(0, 10)
		: "";
	state.deliveranceStatus = data.deliveranceStatus || "";
	state.withdrawerName = data.withdrawerName || "";
}

async function handleUpdate(_: FormSubmitEvent<UpdateAssetProcurementDTO>) {
	if (isUpdating.value) return;
	isUpdating.value = true;

	try {
		// Build the data object from form state
		const updateData: UpdateAssetProcurementDTO = {
			data: {
				vendor: state.vendor || undefined,
				quoteId: state.quoteId || undefined,
				itemName: state.itemName || undefined,
				torOfficer: state.torOfficer || undefined,
				torOfficerPosition: state.torOfficerPosition || undefined,
				torOfficerDepartment: state.torOfficerDepartment || undefined,
				estimatedBudget: state.estimatedBudget || undefined,
				procureItems:
					state.procureItems.length > 0 ? state.procureItems : undefined,
				reason: state.reason || undefined,
				source: state.source || undefined,
				reportId: state.reportId || undefined,
				reportDate: state.reportDate ? new Date(state.reportDate) : undefined,
				deliveryAddress: state.deliveryAddress || undefined,
				hasVat: state.hasVat,
				taxInvoiceNumber: state.taxInvoiceNumber || undefined,
				taxInvoiceDate: state.taxInvoiceDate
					? new Date(state.taxInvoiceDate)
					: undefined,
				deliveryDate: state.deliveryDate
					? new Date(state.deliveryDate)
					: undefined,
				deliveranceStatus: (state.deliveranceStatus || undefined) as
					| "ถูกต้องครบถ้วน"
					| "ถูกต้องแต่ไม่ครบถ้วน"
					| "ครบถ้วนแต่ไม่ถูกต้องทั้งหมด"
					| undefined,
				withdrawerName: state.withdrawerName || undefined,
			},
		};

		await assetProcurementService.updateAssetProcurement(
			props.data.id,
			updateData,
		);

		showToastSuccess({
			title: "แก้ไขการจัดซื้อสำเร็จ",
			message: "คุณได้แก้ไขการจัดซื้อเรียบร้อยแล้ว",
		});

		refreshNuxtData();
	} catch (error) {
		handleToastError(error);
	} finally {
		isUpdating.value = false;
	}
}
</script>

<template>
	<!-- @vue-expect-error Mismatched state -->
	<UForm
		class="space-y-4 sm:space-y-6"
		:schema="schema"
		:state="state"
		@submit="handleUpdate"
	>
		<FieldSet
			class="grid gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4"
			collapsible
			legend="ข้อมูลเอกสารขออนุมัติหลักการ"
		>
			<UFormField name="vendor" label="ผู้เสนอราคา">
				<UInput v-model="state.vendor" />
			</UFormField>

			<UFormField name="quoteId" label="เลขที่ใบเสนอราคา">
				<UInput v-model="state.quoteId" />
			</UFormField>

			<UFormField name="itemName" label="ชื่อรายการ">
				<UInput v-model="state.itemName" />
			</UFormField>
		</FieldSet>

		<FieldSet
			class="grid gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4"
			collapsible
			legend="ข้อมูลเอกสารขออนุมตัติแต่งตั้งเจ้าหน้าที่ TOR"
		>
			<UFormField name="torOfficer" label="ชื่อเจ้าหน้าที่ TOR">
				<UInput v-model="state.torOfficer" />
			</UFormField>

			<UFormField name="torOfficerPosition" label="ตำแหน่งเจ้าหน้าที่ TOR">
				<UInput v-model="state.torOfficerPosition" />
			</UFormField>

			<UFormField name="torOfficerDepartment" label="หน่วยงานเจ้าหน้าที่ TOR">
				<UInput v-model="state.torOfficerDepartment" />
			</UFormField>

			<UFormField name="estimatedBudget" label="วงเงินงบประมาณ">
				<UInput v-model="state.estimatedBudget" type="number" />
			</UFormField>
		</FieldSet>

		<FieldSet
			class="grid gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4"
			collapsible
			legend="ข้อมูลเอกสารขอจัดซื้อ ฮาร์ดแวร์ และ อุปกรณ์ต่อพ่วง"
		>
			<ProcurementItemTableForm
				v-model="state.procureItems"
				class="sm:col-span-2 md:col-span-3 xl:col-span-4"
			/>
		</FieldSet>

		<FieldSet
			class="grid gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4"
			collapsible
			legend="ข้อมูลเอกสารรายงานขอซื้อ"
		>
			<UFormField name="reason" label="เหตุผลความจำเป็นที่ต้องจัดซื้อ">
				<UTextarea v-model="state.reason" :rows="4" />
			</UFormField>

			<UFormField name="source" label="แหล่งที่มาราคากลาง">
				<UTextarea v-model="state.source" :rows="4" />
			</UFormField>
		</FieldSet>

		<FieldSet
			class="grid gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4"
			collapsible
			legend="ข้อมูลเอกสารขออนุมัติจัดซื้อ"
		>
			<UFormField name="reportId" label="เลขที่รายงานขอซื้อ">
				<UInput v-model="state.reportId" />
			</UFormField>

			<UFormField name="reportDate" label="วันที่รายงานขอซื้อ">
				<UInput v-model="state.reportDate" type="date" />
			</UFormField>

			<UFormField name="deliveryAddress" label="ส่งมอบพัสดุ">
				<UInput v-model="state.deliveryAddress" />
			</UFormField>

			<UCheckbox
				v-model="state.hasVat"
				class="self-center"
				name="hasVat"
				label="มีภาษีมูลค่าเพิ่ม (VAT)"
			/>
		</FieldSet>

		<FieldSet
			class="grid gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4"
			collapsible
			legend="ข้อมูลเอกสารรายงานตรวจรับพัสดุ"
		>
			<UFormField name="taxInvoiceNumber" label="เลขที่ใบกำกับภาษี">
				<UInput v-model="state.taxInvoiceNumber" />
			</UFormField>

			<UFormField name="taxInvoiceDate" label="วันที่ใบกำกับภาษี">
				<UInput v-model="state.taxInvoiceDate" type="date" />
			</UFormField>

			<UFormField name="deliveryDate" label="วันที่ส่งมอบพัสดุ">
				<UInput v-model="state.deliveryDate" type="date" />
			</UFormField>

			<UFormField name="deliveranceStatus" label="สถานะการตรวจรับพัสดุ">
				<USelect
					v-model="state.deliveranceStatus"
					:items="[
						'ถูกต้องครบถ้วน',
						'ถูกต้องแต่ไม่ครบถ้วน',
						'ครบถ้วนแต่ไม่ถูกต้องทั้งหมด',
					]"
				/>
			</UFormField>
		</FieldSet>

		<FieldSet
			class="grid gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4"
			collapsible
			legend="ข้อมูลเอกสารใบสำคัญจ่ายเงิน"
		>
			<UFormField name="withdrawerName" label="ชื่อผู้เบิกเงิน">
				<UInput v-model="state.withdrawerName" />
			</UFormField>
		</FieldSet>

		<div class="flex items-center justify-between">
			<UButton
				color="neutral"
				icon="lucide:undo"
				variant="outline"
				@click="setData(procurementData)"
			>
				รีเซ็ต
			</UButton>

			<UButton
				type="submit"
				class="ms-auto"
				color="primary"
				icon="lucide:save"
				:loading="isUpdating"
			>
				บันทึกการแก้ไข
			</UButton>
		</div>
	</UForm>
</template>
