<script setup lang="ts">
const props = defineProps<{
	data: SerializedAssetWithRelations;
}>();
const emit = defineEmits<{
	close: [boolean];
}>();

const assetService = useAssetService();
const isDeleting = ref(false);

async function handleDelete() {
	if (isDeleting.value) return;
	isDeleting.value = true;

	try {
		await assetService.deleteAsset(props.data.id);

		emit("close", true);

		showToastSuccess({
			title: "Asset deleted",
			message: "The asset has been successfully deleted.",
		});

		emit("close", true);
	} catch (error) {
		handleToastError(error);
	} finally {
		isDeleting.value = false;
	}
}
</script>

<template>
	<UModal>
		<slot />

		<template #body>
			<p>Are you sure you want to delete this asset?</p>
		</template>

		<template #footer>
			<UButton
				color="neutral"
				:disabled="isDeleting"
				icon="lucide:x"
				variant="ghost"
			>
				ยกเลิก
			</UButton>
			<UButton
				color="error"
				icon="lucide:trash-2"
				:loading="isDeleting"
				@click="handleDelete"
			>
				ลบ
			</UButton>
		</template>
	</UModal>
</template>
