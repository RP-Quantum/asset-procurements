<script setup lang="ts">
import { CreateAssetSchema, type CreateAssetDTO } from "#shared/modules/asset";
import type { AssetType } from "#shared/generated/prisma/enums";
import type { FormSubmitEvent } from "@nuxt/ui";

const emit = defineEmits<{
	close: [
		{
			created?: SerializedAssetWithRelations;
		},
	];
}>();

const assetService = useAssetService();
const schema = CreateAssetSchema;
const state = reactive<CreateAssetDTO>({
	departmentId: "",
	tag: "",
	type: "" as AssetType,
	brand: "",
	model: "",
	serialNumber: "",
	owner: "",
	details: "",
	contractNumber: "",
	contractEndDate: "",
});

const { data: departments } = await useDepartmentData();
const departmentSelectMenuItems = computed(() =>
	departments.value?.data.map((department) => ({
		label: department.name,
		value: department.id,
	})),
);

const isCreating = ref(false);

async function handleCreate(event: FormSubmitEvent<CreateAssetDTO>) {
	if (isCreating.value) return;
	isCreating.value = true;

	try {
		const { data: createdAsset } = await assetService.createAsset(event.data);

		showToastSuccess({
			title: "เพิ่มทรัพย์สินสำเร็จ",
			message: "คุณได้เพิ่มทรัพย์สินใหม่เรียบร้อยแล้ว",
		});

		emit("close", { created: createdAsset });
	} catch (error) {
		handleToastError(error);
	} finally {
		isCreating.value = false;
	}
}
</script>

<template>
	<USlideover title="เพิ่มทรัพย์สิน">
		<slot />

		<template #body>
			<UForm
				class="space-y-2 sm:space-y-3"
				:schema="schema"
				:state="state"
				@submit="handleCreate"
			>
				<UFormField
					name="departmentId"
					:label="getAssetFieldLabel('department')"
					required
				>
					<USelect
						v-model="state.departmentId"
						:items="departmentSelectMenuItems"
						value-key="value"
					/>
				</UFormField>
				<UFormField name="tag" :label="getAssetFieldLabel('tag')" required>
					<UInput v-model="state.tag" />
				</UFormField>
				<UFormField name="type" :label="getAssetFieldLabel('type')" required>
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

				<UButton type="submit" block :loading="isCreating">
					เพิ่มทรัพย์สิน
				</UButton>
			</UForm>
		</template>
	</USlideover>
</template>
