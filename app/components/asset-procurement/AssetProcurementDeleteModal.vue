<script setup lang="ts">
const props = defineProps<{
	assetProcurement: SerializedAssetProcurement;
}>();

const emit = defineEmits<{
	close: [
		{
			deleted?: boolean;
		},
	];
}>();

const assetProcurementService = useAssetProcurementService();
const isDeleting = ref(false);

async function handleDelete() {
	if (isDeleting.value) return;
	isDeleting.value = true;

	try {
		await assetProcurementService.deleteAssetProcurement(
			props.assetProcurement.id,
		);

		showToastSuccess({
			title: "ลบการจัดซื้อสำเร็จ",
			message: "คุณได้ลบการจัดซื้อเรียบร้อยแล้ว",
		});

		emit("close", { deleted: true });
	} catch (error) {
		handleToastError(error);
	} finally {
		isDeleting.value = false;
	}
}
</script>

<template>
	<UModal title="ลบการจัดซื้อ">
		<slot />

		<template #body>
			<p class="text-muted-foreground mb-4">
        คุณแน่ใจหรือไม่ว่าต้องการลบการจัดซื้อสำหรับการซ่อม
        <span class="text-foreground font-semibold">{{
            assetProcurement?.repair?.title
        }}</span>
        ({{ assetProcurement?.repair?.asset?.tag }})?
    </p>

			<div class="flex justify-end gap-2">
				<UButton color="neutral" variant="outline" @click="emit('close', {})">
					ยกเลิก
				</UButton>
				<UButton color="error" :loading="isDeleting" @click="handleDelete">
					ลบ
				</UButton>
			</div>
		</template>
	</UModal>
</template>
