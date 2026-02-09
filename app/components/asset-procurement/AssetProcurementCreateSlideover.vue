<script setup lang="ts">
import {
	CreateAssetProcurementSchema,
	type CreateAssetProcurementDTO,
} from "#shared/modules/asset-procurement";
import type { FormSubmitEvent } from "@nuxt/ui";

const emit = defineEmits<{
	close: [
		{
			created?: SerializedAssetProcurement;
		},
	];
}>();

const assetProcurementService = useAssetProcurementService();
const schema = CreateAssetProcurementSchema;
const state = reactive<CreateAssetProcurementDTO>({
	repairId: "",
	data: undefined,
});

// Get all asset repairs for selection
const { data: assetRepairs } = await useAssetRepairData();
const repairSelectMenuItems = computed(() =>
	assetRepairs.value?.data.map((repair) => ({
		label: `${repair.incidentId} - ${repair.title} (${repair.asset.tag})`,
		value: repair.id,
	})),
);

const isCreating = ref(false);

async function handleCreate(event: FormSubmitEvent<CreateAssetProcurementDTO>) {
	if (isCreating.value) return;
	isCreating.value = true;

	try {
		const { data: createdAssetProcurement } =
			await assetProcurementService.createAssetProcurement(event.data);

		showToastSuccess({
			title: "เพิ่มการจัดซื้อสำเร็จ",
			message: "คุณได้เพิ่มการจัดซื้อใหม่เรียบร้อยแล้ว",
		});

		emit("close", { created: createdAssetProcurement });
	} catch (error) {
		handleToastError(error);
	} finally {
		isCreating.value = false;
	}
}
</script>

<template>
	<USlideover title="เพิ่มการจัดซื้อ">
		<slot />

		<template #body>
			<UForm
				class="space-y-2 sm:space-y-3"
				:schema="schema"
				:state="state"
				@submit="handleCreate"
			>
				<UFormField
					name="repairId"
					:label="getAssetProcurementFieldLabel('repair')"
					required
				>
					<USelect
						v-model="state.repairId"
						:items="repairSelectMenuItems"
						value-key="value"
						placeholder="เลือกการซ่อม"
					/>
				</UFormField>

				<UAlert
					color="primary"
					icon="lucide:info"
					title="หมายเหตุ"
					description="คุณสามารถเพิ่มข้อมูลการจัดซื้อเพิ่มเติมได้ภายหลัง"
				/>

				<UButton type="submit" block :loading="isCreating">
					เพิ่มการจัดซื้อ
				</UButton>
			</UForm>
		</template>
	</USlideover>
</template>
