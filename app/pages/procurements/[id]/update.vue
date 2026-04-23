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

const procurementData = computed<AssetProcurementData>(() => {
  return (props.data?.data ?? {}) as AssetProcurementData;
});
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
	<UForm
		class="max-w-6xl mx-auto space-y-8 pb-12 transition-colors duration-300"
		:schema="schema"
		:state="state"
		@submit="handleUpdate"
	>
		<div class="border-b border-gray-200 dark:border-slate-800 pb-6 mb-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
						<UIcon name="lucide:file-edit" class="w-8 h-8 text-blue-500 dark:text-blue-400" />
						แก้ไขข้อมูลการจัดซื้อพัสดุ
					</h1>
					<p class="text-sm text-gray-500 dark:text-slate-400 mt-1">
						ระบบจัดการเอกสารพัสดุอิเล็กทรอนิกส์
					</p>
				</div>
				<div class="hidden sm:block">
					<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
						ID: {{ props.data.id }}
					</span>
				</div>
			</div>
		</div>
		<div class="grid grid-cols-1 gap-8">
			<section class="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
				<div class="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
				<div class="p-6">
					<div class="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase text-sm">
						<UIcon name="lucide:clipboard-check" class="text-lg" />
						<span>ข้อมูลเอกสารขออนุมัติหลักการ</span>
					</div>
					<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<UFormField name="vendor" label="ผู้เสนอราคา">
							<UInput v-model="state.vendor" placeholder="ระบุชื่อบริษัท/ร้านค้า" icon="lucide:building" class="w-full" />
						</UFormField>
						<UFormField name="quoteId" label="เลขที่ใบเสนอราคา">
							<UInput v-model="state.quoteId" placeholder="เช่น QT-2024-001" icon="lucide:hash" />
						</UFormField>
						<UFormField name="itemName" label="ชื่อรายการ">
							<UInput v-model="state.itemName" placeholder="ชื่อรายการพัสดุหลัก" />
						</UFormField>
					</div>
				</div>
			</section>
			<section class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
				<div class="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
				<div class="p-6">
					<div class="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase text-sm">
						<UIcon name="lucide:user-cog" />
						<span>ข้อมูลเอกสารขออนุมัติแต่งตั้งเจ้าหน้าที่ TOR</span>
					</div>
					<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<UFormField name="torOfficer" label="ชื่อเจ้าหน้าที่ TOR">
							<UInput v-model="state.torOfficer" icon="lucide:user" />
						</UFormField>
						<UFormField name="torOfficerPosition" label="ตำแหน่ง">
							<UInput v-model="state.torOfficerPosition" />
						</UFormField>
						<UFormField name="torOfficerDepartment" label="หน่วยงาน">
							<UInput v-model="state.torOfficerDepartment" />
						</UFormField>
						<UFormField name="estimatedBudget" label="วงเงินงบประมาณ">
							<UInput v-model="state.estimatedBudget" type="number" trailing-icon="lucide:banknote" />
						</UFormField>
					</div>
				</div>
			</section>
			<section class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
				<div class="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
				<div class="p-6">
					<div class="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase text-sm">
						<UIcon name="lucide:list-ordered" />
						<span>รายการ ฮาร์ดแวร์ และ อุปกรณ์ต่อพ่วง</span>
					</div>
					<div class="rounded-lg border border-gray-100 dark:border-slate-800 p-1">
						<ProcurementItemTableForm v-model="state.procureItems" />
					</div>
				</div>
			</section>
			<section class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
				<div class="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
				<div class="p-6">
					<div class="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase text-sm">
						<UIcon name="lucide:file-text" />
						<span>ข้อมูลเอกสารรายงานขอซื้อ</span>
					</div>
					<div class="grid gap-6 md:grid-cols-2">
						<UFormField name="reason" label="เหตุผลความจำเป็นที่ต้องจัดซื้อ">
							<UTextarea v-model="state.reason" :rows="3" />
						</UFormField>
						<UFormField name="source" label="แหล่งที่มาราคากลาง">
							<UTextarea v-model="state.source" :rows="3" />
						</UFormField>
					</div>
					<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6">
						<UFormField name="reportId" label="เลขที่รายงานขอซื้อ">
							<UInput v-model="state.reportId" />
						</UFormField>
						<UFormField name="reportDate" label="วันที่รายงานขอซื้อ">
							<UInput v-model="state.reportDate" type="date" icon="lucide:calendar" />
						</UFormField>
						<UFormField name="deliveryAddress" label="สถานที่ส่งมอบ">
							<UInput v-model="state.deliveryAddress" icon="lucide:map-pin" />
						</UFormField>
						<div class="flex items-center sm:pt-6">
							<UCheckbox
								v-model="state.hasVat"
								name="hasVat"
								label="ราคานี้รวม VAT แล้ว"
								:ui="{ label: 'text-sm font-medium dark:text-slate-300' }"
							/>
						</div>
					</div>
				</div>
			</section>
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<section class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
					<div class="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
					<div class="p-6">
						<div class="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase text-sm">
							<UIcon name="lucide:truck" />
							<span>ข้อมูลรายงานตรวจรับพัสดุ</span>
						</div>
						<div class="grid gap-6 sm:grid-cols-2">
							<UFormField name="taxInvoiceNumber" label="เลขที่ใบกำกับภาษี">
								<UInput v-model="state.taxInvoiceNumber" />
							</UFormField>
							<UFormField name="taxInvoiceDate" label="วันที่ใบกำกับภาษี">
								<UInput v-model="state.taxInvoiceDate" type="date" icon="lucide:calendar" />
							</UFormField>
							<UFormField name="deliveryDate" label="วันที่ส่งมอบพัสดุจริง">
								<UInput v-model="state.deliveryDate" type="date" icon="lucide:calendar-check" />
							</UFormField>
							<UFormField name="deliveranceStatus" label="สถานะการตรวจรับ">
								<USelect
									v-model="state.deliveranceStatus"
									icon="lucide:check-circle"
									:items="['ถูกต้องครบถ้วน', 'ถูกต้องแต่ไม่ครบถ้วน', 'ครบถ้วนแต่ไม่ถูกต้องทั้งหมด']"
								/>
							</UFormField>
						</div>
					</div>
				</section>
				<section class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
					<div class="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
					<div class="p-6">
						<div class="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase text-sm">
							<UIcon name="lucide:wallet" />
							<span>ใบสำคัญจ่ายเงิน</span>
						</div>
						<UFormField name="withdrawerName" label="ชื่อผู้เบิกเงิน">
							<UInput v-model="state.withdrawerName" icon="lucide:user-check" placeholder="ระบุชื่อ-นามสกุล" />
						</UFormField>
						<div class="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
							<div class="flex gap-2">
								<UIcon name="lucide:info" class="shrink-0 w-4 h-4 text-blue-500" />
								<span>กรุณาตรวจสอบข้อมูลชื่อผู้เบิกให้ตรงกับบัตรประชาชนหรือฐานข้อมูลบุคคลากร</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
		<div class="sticky bottom-6 mt-12 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-gray-100 dark:border-slate-800 rounded-2xl shadow-lg flex items-center justify-between transition-all">
			<UButton
				color="neutral"
				icon="lucide:undo-2"
				variant="ghost"
				class="dark:text-slate-400 dark:hover:bg-slate-800"
				@click="setData(procurementData)"
			>
				รีเซ็ตข้อมูล
			</UButton>

			<div class="flex gap-4">
				<UButton
					type="submit"
					size="xl"
					class="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20 px-10 font-bold transition-transform active:scale-95"
					icon="lucide:save"
					:loading="isUpdating"
				>
					บันทึกข้อมูลแก้ไข
				</UButton>
			</div>
		</div>
	</UForm>
</template>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>