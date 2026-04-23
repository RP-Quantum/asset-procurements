<script setup lang="ts">
import { PROCUREMENT_DOCUMENTS } from "#shared/consts/procurement-documents";

const props = defineProps<{
	data: SerializedAssetProcurementWithRelations;
}>();

const procurementData = computed(() => props.data.data as AssetProcurementData);

const toast = useToast();

// Calculate document readiness progress based on actual schema fields
const documentProgress = computed(() => {
	const data = procurementData.value;
	if (!data) return 0;

	// Count fields organized by document type
	const fields = [
		// ขออนุมัติหลักการจัดซื้ออะไหล่
		data.vendor,
		data.quoteId,
		data.itemName,
		// ขออนุมัติแต่งตั้งเจ้าหน้าที่ TOR
		data.torOfficer,
		data.torOfficerPosition,
		data.torOfficerDepartment,
		data.estimatedBudget,
		// ขอจัดซื้อ ฮาร์ดแวร์ และ อุปกรณ์ต่อพ่วง
		data.procureItems && data.procureItems.length > 0,
		// รายงานขอซื้อ
		data.reason,
		data.source,
		// ขออนุมัติจัดซื้อ
		data.reportId,
		data.reportDate,
		data.deliveryAddress,
		// รายงานตรวจรับและขออนุมัติจ่ายเงิน
		data.taxInvoiceNumber,
		data.taxInvoiceDate,
		data.deliveryDate,
		data.deliveranceStatus,
		// ใบสำคัญจ่ายเงิน
		data.withdrawerName,
	];

	const filledFields = fields.filter((field) => {
		if (typeof field === "boolean") return field;
		return !!field;
	}).length;
	return Math.round((filledFields / fields.length) * 100);
});

// Download document
const downloadingDocs = ref<Record<string, boolean>>({});

const downloadDocument = async (
	documentType: string,
	format: "docx" | "pdf" = "docx",
) => {
	try {
		downloadingDocs.value[documentType] = true;

		const response = await fetch(
			`/api/asset-procurements/${props.data.id}/documents/${documentType}?format=${format}`,
		);

		if (!response.ok) {
			throw new Error("Failed to download document");
		}

		// Get filename from Content-Disposition header
		const contentDisposition = response.headers.get("Content-Disposition");
		let filename = "document.docx";
		if (contentDisposition) {
			const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
				contentDisposition,
			);
			if (matches?.[1]) {
				filename = decodeURIComponent(matches[1].replace(/['"]/g, ""));
			}
		}

		// Download the file
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);

		toast.add({
			title: "ดาวน์โหลดสำเร็จ",
			description: "ดาวน์โหลดเอกสารเรียบร้อยแล้ว",
			color: "success",
		});
	} catch (error) {
		console.error("Error downloading document:", error);
		toast.add({
			title: "เกิดข้อผิดพลาด",
			description: "ไม่สามารถดาวน์โหลดเอกสารได้",
			color: "error",
		});
	} finally {
		downloadingDocs.value[documentType] = false;
	}
};
</script>
<template>
	<div class="space-y-4 p-4 sm:space-y-6 sm:p-6">
		<!-- Document Readiness Card -->
		<UCard>
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold">ความพร้อมของเอกสาร</h3>
					<UBadge
						:color="
							documentProgress === 100
								? 'success'
								: documentProgress >= 50
									? 'warning'
									: 'error'
						"
						variant="subtle"
						size="lg"
					>
						{{ documentProgress }}%
					</UBadge>
				</div>
			</template>
			<div>
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm text-gray-600 dark:text-gray-400">
						ความสมบูรณ์ของข้อมูล
					</span>
					<span class="text-sm font-medium"> {{ documentProgress }}% </span>
				</div>
				<UProgress
					v-model="documentProgress"
					:color="
						documentProgress === 100
							? 'success'
							: documentProgress >= 50
								? 'warning'
								: 'error'
					"
					size="md"
				/>
			</div>
		</UCard>
		<UCard>
			<template #header>
				<div class="flex items-center gap-2">
					<UIcon name="lucide:file-text" class="h-5 w-5" />
					<h3 class="text-lg font-semibold">เอกสารที่สามารถดาวน์โหลดได้</h3>
				</div>
			</template>
			<div class="divide-y divide-gray-200 dark:divide-gray-800">
				<div
					v-for="doc in PROCUREMENT_DOCUMENTS"
					:key="doc.value"
					class="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center dark:hover:bg-gray-800/50"
				>
					<div class="flex items-center gap-3">
						<UIcon :name="doc.icon" class="h-5 w-5 text-gray-500" />
						<span class="text-sm font-medium">{{ doc.label }}</span>
					</div>
					<UFieldGroup orientation="vertical">
						<UButton
							:loading="downloadingDocs[doc.value]"
							color="primary"
							variant="soft"
							size="sm"
							icon="lucide:download"
							@click="downloadDocument(doc.value, 'docx')"
						>
							<span class="hidden sm:inline">ดาวน์โหลด</span> .docx
						</UButton>
						<UButton
							:loading="downloadingDocs[doc.value]"
							color="neutral"
							variant="soft"
							size="sm"
							icon="lucide:download"
							@click="downloadDocument(doc.value, 'pdf')"
						>
							<span class="hidden sm:inline">ดาวน์โหลด</span> .pdf
						</UButton>
					</UFieldGroup>
				</div>
			</div>
		</UCard>
		<UCard>
			<template #header>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<UIcon name="lucide:info" class="h-5 w-5" />
						<h3 class="text-lg font-semibold">รายละเอียดการจัดซื้อ</h3>
					</div>
					<UButton
						color="primary"
						variant="soft"
						size="sm"
						icon="lucide:edit"
						:to="`/procurements/${props.data.id}/update`"
					>
						แก้ไข
					</UButton>
				</div>
			</template>

			<div class="space-y-6">
				<div>
					<h4
						class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300"
					>
						ข้อมูลเอกสารขออนุมัติหลักการจัดซื้ออะไหล่
					</h4>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								ผู้เสนอราคา
							</label>
							<p class="font-medium">
								{{ procurementData?.vendor || "-" }}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								เลขที่ใบเสนอราคา
							</label>
							<p class="font-medium">
								{{ procurementData?.quoteId || "-" }}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								ชื่อรายการ
							</label>
							<p class="font-medium">
								{{ procurementData?.itemName || "-" }}
							</p>
						</div>
					</div>
				</div>

				<UDivider />
				<div>
					<h4
						class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300"
					>
						ข้อมูลเอกสารขออนุมัติแต่งตั้งเจ้าหน้าที่ TOR
					</h4>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								ชื่อเจ้าหน้าที่ TOR
							</label>
							<p class="font-medium">
								{{ procurementData?.torOfficer || "-" }}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								ตำแหน่งเจ้าหน้าที่ TOR
							</label>
							<p class="font-medium">
								{{ procurementData?.torOfficerPosition || "-" }}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								หน่วยงานเจ้าหน้าที่ TOR
							</label>
							<p class="font-medium">
								{{ procurementData?.torOfficerDepartment || "-" }}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								วงเงินงบประมาณ
							</label>
							<p class="font-medium">
								{{
									procurementData?.estimatedBudget
										? procurementData.estimatedBudget.toLocaleString()
										: "-"
								}}
								บาท
							</p>
						</div>
					</div>
				</div>

				<UDivider />
				<div>
					<h4
						class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300"
					>
						ข้อมูลเอกสารขอจัดซื้อ ฮาร์ดแวร์ และ อุปกรณ์ต่อพ่วง
					</h4>
					<div
						v-if="procurementData?.procureItems?.length"
						class="overflow-x-auto"
					>
						<table
							class="w-full border border-gray-200 text-sm dark:border-gray-800"
						>
							<thead class="bg-gray-50 dark:bg-gray-800">
								<tr>
									<th class="px-4 py-2 text-left">ลำดับ</th>
									<th class="px-4 py-2 text-left">ชื่อรายการ</th>
									<th class="px-4 py-2 text-right">จำนวน</th>
									<th class="px-4 py-2 text-right">รวมเงิน</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 dark:divide-gray-800">
								<tr
									v-for="(item, index) in procurementData.procureItems"
									:key="index"
								>
									<td class="px-4 py-2">{{ index + 1 }}</td>
									<td class="px-4 py-2">{{ item.itemName }}</td>
									<td class="px-4 py-2 text-right">{{ item.quantity }}</td>
									<td class="px-4 py-2 text-right">
										{{ item.total?.toLocaleString() || "-" }} บาท
									</td>
								</tr>
							</tbody>
							<tfoot class="border-t-2 border-gray-300 dark:border-gray-700">
								<tr>
									<td colspan="3" class="px-4 py-2 text-right font-semibold">
										รวมทั้งหมด
									</td>
									<td class="px-4 py-2 text-right font-semibold">
										{{
											procurementData.procureItems
												.reduce((sum, item) => sum + (item.total || 0), 0)
												.toLocaleString()
										}}
										บาท
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
					<p v-else class="text-sm text-gray-500">ไม่มีรายการ</p>
				</div>

				<UDivider />
				<div>
					<h4
						class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300"
					>
						ข้อมูลเอกสารรายงานขอซื้อ
					</h4>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								เหตุผลความจำเป็นที่ต้องจัดซื้อ
							</label>
							<p class="font-medium whitespace-pre-wrap">
								{{ procurementData?.reason || "-" }}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								แหล่งที่มาราคากลาง
							</label>
							<p class="font-medium whitespace-pre-wrap">
								{{ procurementData?.source || "-" }}
							</p>
						</div>
					</div>
				</div>

				<UDivider />
				<div>
					<h4
						class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300"
					>
						ข้อมูลเอกสารขออนุมัติจัดซื้อ
					</h4>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								เลขที่รายงานขอซื้อ
							</label>
							<p class="font-medium">
								{{ procurementData?.reportId || "-" }}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								วันที่รายงานขอซื้อ
							</label>
							<p class="font-medium">
								{{
									procurementData?.reportDate
										? new Date(procurementData.reportDate).toLocaleDateString(
												"th-TH",
											)
										: "-"
								}}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								ส่งมอบพัสดุ
							</label>
							<p class="font-medium">
								{{ procurementData?.deliveryAddress || "-" }}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								ภาษีมูลค่าเพิ่ม (VAT)
							</label>
							<p class="font-medium">
								<UBadge
									:color="procurementData?.hasVat ? 'success' : 'neutral'"
									variant="subtle"
								>
									{{ procurementData?.hasVat ? "มี VAT" : "ไม่มี VAT" }}
								</UBadge>
							</p>
						</div>
					</div>
				</div>

				<UDivider />
				<div>
					<h4
						class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300"
					>
						ข้อมูลเอกสารรายงานตรวจรับพัสดุ
					</h4>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								เลขที่ใบกำกับภาษี
							</label>
							<p class="font-medium">
								{{ procurementData?.taxInvoiceNumber || "-" }}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								วันที่ใบกำกับภาษี
							</label>
							<p class="font-medium">
								{{
									procurementData?.taxInvoiceDate
										? new Date(
												procurementData.taxInvoiceDate,
											).toLocaleDateString("th-TH")
										: "-"
								}}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								วันที่ส่งมอบพัสดุ
							</label>
							<p class="font-medium">
								{{
									procurementData?.deliveryDate
										? new Date(procurementData.deliveryDate).toLocaleDateString(
												"th-TH",
											)
										: "-"
								}}
							</p>
						</div>
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								สถานะการตรวจรับพัสดุ
							</label>
							<p class="font-medium">
								{{ procurementData?.deliveranceStatus || "-" }}
							</p>
						</div>
					</div>
				</div>

				<UDivider />
				<div>
					<h4
						class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300"
					>
						ข้อมูลเอกสารใบสำคัญจ่ายเงิน
					</h4>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label class="text-sm text-gray-600 dark:text-gray-400">
								ชื่อผู้เบิกเงิน
							</label>
							<p class="font-medium">
								{{ procurementData?.withdrawerName || "-" }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</UCard>
	</div>
</template>
