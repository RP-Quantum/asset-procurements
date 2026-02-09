<script setup lang="ts">
const props = defineProps<{
	data: SerializedAssetRepairWithRelations;
}>();

const emit = defineEmits<{
	close: [
		{
			deleted?: boolean;
		},
	];
}>();

const assetRepairService = useAssetRepairService();
const isDeleting = ref(false);

async function handleDelete() {
	if (isDeleting.value) return;
	isDeleting.value = true;

	try {
		await assetRepairService.deleteAssetRepair(props.data.id);

		showToastSuccess({
			title: "ลบการซ่อมสำเร็จ",
			message: "คุณได้ลบการซ่อมเรียบร้อยแล้ว",
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
	<UModal title="ลบการซ่อม">
		<slot />

		<template #body>
			<p class="text-muted-foreground mb-4">
				คุณแน่ใจหรือไม่ว่าต้องการลบการซ่อม
				<span class="text-foreground font-semibold">{{ data.title }}</span>
				({{ data.asset.tag }})?
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
