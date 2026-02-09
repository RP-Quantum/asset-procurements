<script setup lang="ts">
import { UpdateAssetSchema, type UpdateAssetDTO } from "#shared/modules/asset";
import type { AssetType } from "#shared/generated/prisma/enums";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
	data: SerializedAssetWithRelations;
}>();

const emit = defineEmits<{
	close: [SerializedAssetWithRelations | undefined];
}>();

const assetService = useAssetService();
const schema = UpdateAssetSchema;
const state = reactive<UpdateAssetDTO>({
	departmentId: props.data.departmentId,
	tag: props.data.tag,
	type: props.data.type as AssetType,
	brand: props.data.brand || "",
	model: props.data.model || "",
	serialNumber: props.data.serialNumber || "",
	owner: props.data.owner || "",
	details: props.data.details || "",
	contractNumber: props.data.contractNumber || "",
	contractEndDate: props.data.contractEndDate || "",
});

const { data: departments } = await useDepartmentData();
const departmentSelectMenuItems = computed(() =>
	departments.value?.data.map((department) => ({
		label: department.name,
		value: department.id,
	})),
);

const isUpdating = ref(false);

async function handleUpdate(event: FormSubmitEvent<UpdateAssetDTO>) {
	if (isUpdating.value) return;
	isUpdating.value = true;

	try {
		const { data: updatedAsset } = await assetService.updateAsset(
			props.data.id,
			event.data,
		);

		showToastSuccess({
			title: "แก้ไขทรัพย์สินสำเร็จ",
			message: "คุณได้แก้ไขทรัพย์สินเรียบร้อยแล้ว",
		});

		emit("close", updatedAsset);
	} catch (error) {
		handleToastError(error);
	} finally {
		isUpdating.value = false;
	}
}
</script>

<template>
	<USlideover title="แก้ไขทรัพย์สิน">
		<slot />

		<template #body>
			<UForm
				class="space-y-2 sm:space-y-3"
				:schema="schema"
				:state="state"
				@submit="handleUpdate"
			>
				<UFormField
					name="departmentId"
					:label="getAssetFieldLabel('department')"
				>
					<USelect
						v-model="state.departmentId"
						:items="departmentSelectMenuItems"
						value-key="value"
					/>
				</UFormField>
				<UFormField name="tag" :label="getAssetFieldLabel('tag')">
					<UInput v-model="state.tag" />
				</UFormField>
				<UFormField name="type" :label="getAssetFieldLabel('type')">
					<USelect
						v-model="state.type"
						:items="getAssetTypeSelectMenuItems()"
						value-key="value"
					/>
				</UFormField>
				<UFormField name="brand" :label="getAssetFieldLabel('brand')">
					<UInput v-model="state.brand" />
				</UFormField>
				<UFormField name="model" :label="getAssetFieldLabel('model')">
					<UInput v-model="state.model" />
				</UFormField>
				<UFormField
					name="serialNumber"
					:label="getAssetFieldLabel('serialNumber')"
				>
					<UInput v-model="state.serialNumber" />
				</UFormField>
				<UFormField name="owner" :label="getAssetFieldLabel('owner')">
					<UInput v-model="state.owner" />
				</UFormField>
				<UFormField name="details" :label="getAssetFieldLabel('details')">
					<UInput v-model="state.details" textarea />
				</UFormField>
				<UFormField
					name="contractNumber"
					:label="getAssetFieldLabel('contractNumber')"
				>
					<UInput v-model="state.contractNumber" />
				</UFormField>
				<UFormField
					name="contractEndDate"
					:label="getAssetFieldLabel('contractEndDate')"
				>
					<UInput v-model="state.contractEndDate" />
				</UFormField>

				<UButton type="submit" block :loading="isUpdating">
					บันทึกการแก้ไข
				</UButton>
			</UForm>
		</template>
	</USlideover>
</template>
