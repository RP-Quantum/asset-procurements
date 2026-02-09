<script setup lang="ts">
import {
	UpdateAssetRepairSchema,
	type UpdateAssetRepairDTO,
} from "#shared/modules/asset-repair";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
	data: SerializedAssetRepairWithRelations;
}>();

const emit = defineEmits<{
	close: [
		{
			updated?: SerializedAssetRepairWithRelations;
		},
	];
}>();

const assetRepairService = useAssetRepairService();
const schema = UpdateAssetRepairSchema;
const state = reactive<UpdateAssetRepairDTO>({
	incidentId: props.data.incidentId,
	title: props.data.title,
	description: props.data.description || "",
});

const isUpdating = ref(false);

async function handleUpdate(event: FormSubmitEvent<UpdateAssetRepairDTO>) {
	if (isUpdating.value) return;
	isUpdating.value = true;

	try {
		const { data: updatedAssetRepair } =
			await assetRepairService.updateAssetRepair(props.data.id, event.data);

		showToastSuccess({
			title: "แก้ไขการซ่อมสำเร็จ",
			message: "คุณได้แก้ไขการซ่อมเรียบร้อยแล้ว",
		});

		emit("close", { updated: updatedAssetRepair });
	} catch (error) {
		handleToastError(error);
	} finally {
		isUpdating.value = false;
	}
}
</script>

<template>
	<USlideover title="แก้ไขการซ่อม">
		<slot />

		<template #body>
			<UForm
				class="space-y-2 sm:space-y-3"
				:schema="schema"
				:state="state"
				@submit="handleUpdate"
			>
				<UFormField name="assetId" :label="getAssetRepairFieldLabel('asset')">
					<UInput
						:model-value="`${data.asset.tag} - ${data.asset.type}`"
						disabled
					/>
				</UFormField>
				<UFormField
					name="incidentId"
					:label="getAssetRepairFieldLabel('incidentId')"
				>
					<UInput v-model="state.incidentId" />
				</UFormField>
				<UFormField name="title" :label="getAssetRepairFieldLabel('title')">
					<UInput v-model="state.title" />
				</UFormField>
				<UFormField
					name="description"
					:label="getAssetRepairFieldLabel('description')"
				>
					<UInput v-model="state.description" textarea />
				</UFormField>

				<UButton type="submit" block :loading="isUpdating">
					บันทึกการแก้ไข
				</UButton>
			</UForm>
		</template>
	</USlideover>
</template>
