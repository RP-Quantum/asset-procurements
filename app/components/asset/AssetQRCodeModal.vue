<script setup lang="ts">
const props = defineProps<{
	data: SerializedAssetWithRelations;
}>();

const emit = defineEmits<{
	close: [];
}>();

const qrCodeDataUrl = ref<string>("");
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
	try {
		qrCodeDataUrl.value = await generateAssetQRCode(props.data);
	} catch (err) {
		error.value = "ไม่สามารถสร้าง QR Code ได้";
		console.error("QR Code generation error:", err);
	} finally {
		isLoading.value = false;
	}
});

function handleDownload() {
	if (!qrCodeDataUrl.value) return;

	const filename = `asset-${props.data.tag}-qr.png`;
	downloadAssetQRCode(qrCodeDataUrl.value, filename);

	showToastSuccess({
		title: "ดาวน์โหลดสำเร็จ",
		message: `ดาวน์โหลด QR Code สำหรับ ${props.data.tag} เรียบร้อยแล้ว`,
	});
}
</script>

<template>
	<UModal title="QR Code ทรัพย์สิน">
		<slot />

		<template #body>
			<div class="space-y-4">
				<!-- Asset Info -->
				<div class="border-default rounded-lg border p-4">
					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class="text-muted-foreground">รหัสทรัพย์สิน:</span>
							<span class="font-semibold">{{ data.tag }}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">ประเภท:</span>
							<span>{{ data.type }}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">หน่วยงาน:</span>
							<span>{{ data.department.name }}</span>
						</div>
					</div>
				</div>

				<!-- QR Code Display -->
				<div class="flex flex-col items-center justify-center space-y-4">
					<div
						v-if="isLoading"
						class="bg-muted flex h-[300px] w-[300px] items-center justify-center rounded-lg"
					>
						<UIcon
							name="lucide:loader-2"
							class="text-muted-foreground size-8 animate-spin"
						/>
					</div>

					<div
						v-else-if="error"
						class="bg-error/10 text-error flex h-[300px] w-[300px] items-center justify-center rounded-lg"
					>
						<div class="text-center">
							<UIcon name="lucide:alert-circle" class="mx-auto mb-2 size-8" />
							<p class="text-sm">{{ error }}</p>
						</div>
					</div>

					<img
						v-else
						:src="qrCodeDataUrl"
						alt="QR Code"
						class="border-default rounded-lg border shadow-sm"
					/>

					<p class="text-muted-foreground text-center text-xs">
						สแกน QR Code เพื่อดูข้อมูลทรัพย์สิน
					</p>
				</div>

				<!-- Actions -->
				<div class="flex gap-2">
					<UButton
						color="neutral"
						variant="outline"
						class="flex-1"
						@click="emit('close')"
					>
						ปิด
					</UButton>
					<UButton
						color="primary"
						class="flex-1"
						:disabled="isLoading || !!error"
						icon="lucide:download"
						@click="handleDownload"
					>
						ดาวน์โหลด
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
