<script setup lang="ts">
import {
  CreateAssetProcurementSchema,
  type CreateAssetProcurementDTO,
} from "#shared/modules/asset-procurement";
import type { FormSubmitEvent } from "@nuxt/ui";

const emit = defineEmits<{
  close: [{ created?: SerializedAssetProcurement }];
}>();

const assetProcurementService = useAssetProcurementService();
const schema = CreateAssetProcurementSchema;

const state = reactive<CreateAssetProcurementDTO>({
  repairId: "",
  data: undefined,
});

/**
 * ✅ แก้ไขปัญหาดึงข้อมูลไม่ครบ และ Error Arguments:
 * ใช้ useFetch โดยตรงแทนการใช้ Composable เดิม เพื่อส่งค่า limit
 * สิ่งนี้จะช่วยให้ดึงข้อมูลจาก "หน้า 2" (เช่น INC600000539597) มาเก็บไว้ใน Memory ได้
 */
/**
 * ✅ แก้ไขเพื่อให้โหลดข้อมูลได้มากกว่า 10 รายการ
 * โดยใช้ useFetch เรียก API โดยตรงและส่ง query parameters ไปยัง Backend
 */
const { data: assetRepairs } = await useFetch<any>('/api/asset-repairs', {
  query: {
    page: 1,
    perPage: 100, // กำหนดจำนวนต่อหน้าให้มากพอสำหรับข้อมูลทั้งหมด (12 รายการ)
    limit: 100    // บางระบบอาจใช้คำว่า limit แทน perPage
  }
});

const { data: procurements } = await useFetch<any>('/api/asset-procurements', {
  query: {
    page: 1,
    perPage: 100
  }
});

const repairSelectMenuItems = computed(() => {
  // 1. รวบรวม repairId ทั้งหมดที่ถูกนำไปสร้างใบจัดซื้อแล้ว
  const usedRepairIds = procurements.value?.data?.map((p: any) => p.repairId) || [];

  return assetRepairs.value?.data
    // 2. กรองออก: เอาเฉพาะรายการที่ id "ไม่อยู่ใน" usedRepairIds
    ?.filter((repair: any) => !usedRepairIds.includes(repair.id)) 
    // 3. แปลงข้อมูลเข้า Select Menu
    ?.map((repair: any) => ({
      label: `${repair.incidentId} - ${repair.title} (${repair.asset.tag})`,
      value: repair.id,
    })) || [];
});

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

// 🔍 คอยตรวจสอบจำนวนข้อมูลที่ดึงมาได้ใน Console
watchEffect(() => {
  console.log("จำนวนรายการแจ้งซ่อมที่โหลดมาได้ทั้งหมด:", assetRepairs.value?.data?.length);
});
</script>
<template>
  <USlideover 
    title="เพิ่มรายการจัดซื้อ"
    :ui="{
      width: 'max-w-md',
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
        <div class="p-6 flex-1 space-y-6">
          
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ขั้นตอนการจัดซื้อ
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              เลือกรายการซ่อมที่ต้องการดำเนินการจัดซื้ออะไหล่หรืออุปกรณ์ทดแทน
            </p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
            <UFormField
              name="repairId"
              :label="getAssetProcurementFieldLabel('repair')"
              required
              :ui="{ label: { base: 'font-semibold text-gray-900 dark:text-white' } }"
            >
              <USelectMenu
                v-model="state.repairId"
                :items="repairSelectMenuItems"
                value-key="value"
                searchable
                size="lg"
                placeholder="ค้นหาเลขที่ใบซ่อม หรือ ชื่อทรัพย์สิน..."
                icon="i-lucide-search"
                class="w-full"
                :ui-menu="{
                  container: 'z-20 w-full mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl rounded-lg'
                }"
              >
                <template #leading>
                  <UIcon name="i-lucide-clipboard-list" class="w-5 h-5 text-primary" />
                </template>
              </USelectMenu>
            </UFormField>

            <div v-if="state.repairId" class="animate-in fade-in slide-in-from-top-2">
              <div class="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-950/30 rounded-xl border border-primary-100 dark:border-primary-900/50">
                <UIcon name="i-lucide-check-circle-2" class="w-5 h-5 text-primary" />
                <span class="text-xs font-medium text-primary-700 dark:text-primary-300">
                  เชื่อมโยงกับรายการซ่อมเรียบร้อยแล้ว
                </span>
              </div>
            </div>
          </div>

          <UAlert
            variant="subtle"
            color="primary"
            icon="i-lucide-info"
            class="rounded-xl border border-primary-100 dark:border-primary-900/30"
            :ui="{
              title: 'font-semibold',
              description: 'text-sm opacity-90'
            }"
            title="หมายเหตุการทำงาน"
            description="หลังจากเพิ่มรายการจัดซื้อนี้แล้ว คุณจะสามารถเข้าไประบุรายละเอียดงบประมาณและซัพพลายเออร์ได้ในขั้นตอนถัดไป"
          />
        </div>

        <div class="p-6 mt-auto sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
          <UButton 
            type="submit" 
            block 
            size="xl" 
            :loading="isCreating"
            icon="i-lucide-shopping-cart"
            class="shadow-lg shadow-primary-500/20 rounded-xl font-bold"
          >
            สร้างรายการจัดซื้อ
          </UButton>
        </div>
      </UForm>
    </template>
  </USlideover>
</template>
