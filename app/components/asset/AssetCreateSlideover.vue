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
  <USlideover 
    title="เพิ่มทรัพย์สินใหม่"
    :ui="{
      width: 'max-w-xl',
      body: { base: 'p-0 flex-1 overflow-y-auto' },
      header: { base: 'px-6 py-4 border-b border-gray-200 dark:border-gray-800' }
    }"
  >
    <slot />

    <template #body>
      <UForm
        class="flex flex-col h-full"
        :schema="schema"
        :state="state"
        @submit="handleCreate"
      >
        <div class="p-6 space-y-8">
          
          <section class="space-y-4">
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-primary" />
              <h3 class="font-semibold text-gray-900 dark:text-white">ข้อมูลพื้นฐาน</h3>
            </div>

            <UFormField
              name="departmentId"
              :label="getAssetFieldLabel('department')"
              required
            >
              <USelect
                v-model="state.departmentId"
                :items="departmentSelectMenuItems"
                value-key="value"
                icon="i-lucide-building"
                size="md"
              />
            </UFormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField name="tag" :label="getAssetFieldLabel('tag')" required>
                <UInput v-model="state.tag" placeholder="เช่น ASSET-001" icon="i-lucide-tag" />
              </UFormField>

              <UFormField name="type" :label="getAssetFieldLabel('type')" required>
                <USelect
                  v-model="state.type"
                  :items="getAssetTypeSelectMenuItems()"
                  value-key="value"
                  icon="i-lucide-layers"
                />
              </UFormField>
            </div>
          </section>

          <UDivider class="opacity-50" />

          <section class="space-y-4">
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-cpu" class="w-5 h-5 text-primary" />
              <h3 class="font-semibold text-gray-900 dark:text-white">รายละเอียดอุปกรณ์</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField name="brand" :label="getAssetFieldLabel('brand')">
                <UInput v-model="state.brand" placeholder="Brand name" />
              </UFormField>

              <UFormField name="model" :label="getAssetFieldLabel('model')">
                <UInput v-model="state.model" placeholder="Model name" />
              </UFormField>
            </div>

            <UFormField name="serialNumber" :label="getAssetFieldLabel('serialNumber')">
              <UInput v-model="state.serialNumber" icon="i-lucide-barcode" />
            </UFormField>

            <UFormField name="owner" :label="getAssetFieldLabel('owner')">
              <UInput v-model="state.owner" icon="i-lucide-user" />
            </UFormField>

            <UFormField name="details" :label="getAssetFieldLabel('details')">
              <UTextarea v-model="state.details" :rows="3" placeholder="ระบุรายละเอียดเพิ่มเติม..." />
            </UFormField>
          </section>

          <UDivider class="opacity-50" />

          <section class="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-2 mb-2">
              <UIcon name="i-lucide-file-text" class="w-5 h-5 text-primary" />
              <h3 class="font-semibold text-gray-900 dark:text-white">สัญญาและการรับประกัน</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField name="contractNumber" :label="getAssetFieldLabel('contractNumber')">
                <UInput v-model="state.contractNumber" />
              </UFormField>

              <UFormField name="contractEndDate" :label="getAssetFieldLabel('contractEndDate')">
                <UInput v-model="state.contractEndDate" type="date" icon="i-lucide-calendar" />
              </UFormField>
            </div>
          </section>
        </div>

        <div class="mt-auto sticky bottom-0 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
          <UButton 
            type="submit" 
            block 
            size="xl" 
            :loading="isCreating"
            icon="i-lucide-plus"
            class="shadow-lg shadow-primary-500/20"
          >
            เพิ่มทรัพย์สินลงระบบ
          </UButton>
        </div>
      </UForm>
    </template>
  </USlideover>
</template>