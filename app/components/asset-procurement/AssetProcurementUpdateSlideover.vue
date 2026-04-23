<script setup lang="ts">
import {
  UpdateAssetProcurementSchema,
  type UpdateAssetProcurementDTO,
} from "#shared/modules/asset-procurement";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
  data: SerializedAssetProcurement;
}>();

const emit = defineEmits<{
  close: [
    {
      updated?: SerializedAssetProcurement;
    },
  ];
}>();

const assetProcurementService = useAssetProcurementService();
const schema = UpdateAssetProcurementSchema;

// Initialize with existing procurement data if available
const procurementData = (props.data.data || {}) as Record<string, unknown>;

const state = reactive({
  vendor: (procurementData.vendor as string) || "",
  quoteId: (procurementData.quoteId as string) || "",
  itemName: (procurementData.itemName as string) || "",
  torOfficer: (procurementData.torOfficer as string) || "",
  torOfficerPosition: (procurementData.torOfficerPosition as string) || "",
  torOfficerDepartment: (procurementData.torOfficerDepartment as string) || "",
  estimatedBudget: (procurementData.estimatedBudget as number) || 0,
  procureItems:
    (procurementData.procureItems as Array<{
      itemName: string;
      quantity: number;
      total: number;
    }>) || [],
  reason: (procurementData.reason as string) || "",
  source: (procurementData.source as string) || "",
});

// Functions to manage procure items
function addProcureItem() {
  state.procureItems.push({
    itemName: "",
    quantity: 1,
    total: 0,
  });
}

function removeProcureItem(index: number) {
  state.procureItems.splice(index, 1);
}

// Helper function to get item subtotal (before VAT)
function getItemSubtotal(item: { quantity: number; total: number }) {
  // If total is entered, calculate back to subtotal (remove VAT)
  return item.total / 1.07;
}

// Helper function to get item VAT (7%)
function getItemVat(item: { quantity: number; total: number }) {
  const subtotal = getItemSubtotal(item);
  return subtotal * 0.07;
}

// Helper function to get item total (including VAT)
function getItemTotal(item: { quantity: number; total: number }) {
  return item.total;
}

// Computed subtotal (before VAT)
const grandSubtotal = computed(() => {
  return state.procureItems.reduce((sum, item) => {
    return sum + getItemSubtotal(item);
  }, 0);
});

// Computed VAT (7%)
const grandVat = computed(() => {
  return state.procureItems.reduce((sum, item) => {
    return sum + getItemVat(item);
  }, 0);
});

// Computed total (including VAT)
const grandTotal = computed(() => {
  return state.procureItems.reduce((sum, item) => {
    return sum + getItemTotal(item);
  }, 0);
});

const isUpdating = ref(false);

async function handleUpdate(event: FormSubmitEvent<UpdateAssetProcurementDTO>) {
  if (isUpdating.value) return;
  isUpdating.value = true;

  try {
    // Build the data object from form state
    const updateData: UpdateAssetProcurementDTO = {
      data: {
        vendor: state.vendor || undefined,
        quoteId: state.quoteId || undefined,
        itemName: state.itemName || undefined,
        torOfficer: state.torOfficer || undefined,
        torOfficerPosition: state.torOfficerPosition || undefined,
        torOfficerDepartment: state.torOfficerDepartment || undefined,
        estimatedBudget: state.estimatedBudget || undefined,
        procureItems:
          state.procureItems.length > 0 ? state.procureItems : undefined,
        reason: state.reason || undefined,
        source: state.source || undefined,
      },
    };

    const { data: updatedAssetProcurement } =
      await assetProcurementService.updateAssetProcurement(
        props.data.id,
        updateData,
      );

    showToastSuccess({
      title: "แก้ไขการจัดซื้อสำเร็จ",
      message: "คุณได้แก้ไขการจัดซื้อเรียบร้อยแล้ว",
    });

    emit("close", { updated: updatedAssetProcurement });
  } catch (error) {
    handleToastError(error);
  } finally {
    isUpdating.value = false;
  }
}
</script>

<template>
  <USlideover title="แก้ไขข้อมูลการจัดซื้อ">
    <template #body>
      <div class="mb-6 rounded-xl bg-slate-50 p-4 dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-primary-500/10 rounded-lg">
            <UIcon name="lucide:info" class="w-5 h-5 text-primary-600" />
          </div>
          <span class="font-bold text-sm text-slate-700 dark:text-slate-200">ข้อมูลอ้างอิงการซ่อม</span>
        </div>
        <div class="grid grid-cols-1 gap-2 text-sm text-slate-500">
          <p><span class="font-medium text-slate-700 dark:text-slate-300">แจ้งซ่อม:</span> {{ data.repair.incidentId }} - {{ data.repair.title }}</p>
          <p><span class="font-medium text-slate-700 dark:text-slate-300">ทรัพย์สิน:</span> {{ data.repair.asset.tag }} ({{ data.repair.asset.type }})</p>
        </div>
      </div>

      <UForm
        class="space-y-6 pb-10"
        :schema="schema"
        :state="state"
        @submit="handleUpdate"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
            <h3 class="font-bold text-slate-800 dark:text-slate-100">ข้อมูลการจัดซื้อและผู้ค้า</h3>
          </div>
          
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField name="vendor" :label="getAssetProcurementFieldLabel('vendor')" class="sm:col-span-2">
              <UInput v-model="state.vendor" icon="lucide:store" placeholder="ชื่อผู้จำหน่าย/ร้านค้า" />
            </UFormField>

            <UFormField name="quoteId" :label="getAssetProcurementFieldLabel('quoteId')">
              <UInput v-model="state.quoteId" icon="lucide:file-text" placeholder="เลขที่ใบเสนอราคา" />
            </UFormField>

            <UFormField name="itemName" :label="getAssetProcurementFieldLabel('itemName')">
              <UInput v-model="state.itemName" placeholder="ชื่อสินค้าหลัก" />
            </UFormField>
          </div>
        </div>

        <div class="space-y-4 rounded-2xl bg-gray-50/50 p-4 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-2 border-l-4 border-blue-500 pl-3">
            <h3 class="font-bold text-slate-800 dark:text-slate-100">คณะกรรมการ / TOR</h3>
          </div>

          <UFormField name="torOfficer" :label="getAssetProcurementFieldLabel('torOfficer')">
            <UInput v-model="state.torOfficer" icon="lucide:user" placeholder="ชื่อเจ้าหน้าที่ TOR" />
          </UFormField>

          <div class="grid grid-cols-2 gap-3">
            <UFormField name="torOfficerPosition" :label="getAssetProcurementFieldLabel('torOfficerPosition')">
              <UInput v-model="state.torOfficerPosition" placeholder="ตำแหน่ง" />
            </UFormField>
            <UFormField name="torOfficerDepartment" :label="getAssetProcurementFieldLabel('torOfficerDepartment')">
              <UInput v-model="state.torOfficerDepartment" placeholder="หน่วยงาน" />
            </UFormField>
          </div>

          <UFormField name="estimatedBudget" :label="getAssetProcurementFieldLabel('estimatedBudget')">
            <UInput v-model.number="state.estimatedBudget" type="number" icon="lucide:banknote" placeholder="0.00" />
          </UFormField>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between border-l-4 border-amber-500 pl-3">
            <h3 class="font-bold text-slate-800 dark:text-slate-100">รายละเอียดรายการจัดซื้อ</h3>
            <UButton
              icon="lucide:plus"
              size="xs"
              label="เพิ่มรายการ"
              variant="subtle"
              color="primary"
              @click="addProcureItem"
            />
          </div>

          <div v-for="(item, index) in state.procureItems" :key="index" class="relative group">
            <div class="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700 transition-all hover:border-primary-300 dark:hover:border-primary-800">
              <div class="flex items-center justify-between">
                <UBadge color="gray" variant="subtle">รายการที่ {{ index + 1 }}</UBadge>
                <UButton
                  icon="lucide:x"
                  size="xs"
                  color="red"
                  variant="ghost"
                  @click="removeProcureItem(index)"
                />
              </div>

              <UFormField :name="`procureItems.${index}.itemName`" label="ชื่อสินค้า/บริการ">
                <UInput v-model="item.itemName" placeholder="ระบุชื่อสินค้าหรืออะไหล่" />
              </UFormField>

              <div class="grid grid-cols-2 gap-4">
                <UFormField label="จำนวน">
                  <UInput v-model.number="item.quantity" type="number" min="1" />
                </UFormField>
                <UFormField label="ราคารวม (รวม VAT)">
                  <UInput v-model.number="item.total" type="number" step="0.01" />
                </UFormField>
              </div>

              <div v-if="item.total > 0" class="flex justify-end gap-4 text-[11px] text-gray-500 font-mono italic">
                <span>ย่อย: {{ getItemSubtotal(item).toFixed(2) }}</span>
                <span>VAT(7%): {{ getItemVat(item).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div v-if="state.procureItems.length > 0" class="overflow-hidden rounded-2xl border-2 border-primary-500/20 shadow-lg">
            <div class="bg-primary-600 px-4 py-2 text-white flex items-center gap-2">
              <UIcon name="lucide:calculator" class="w-4 h-4" />
              <span class="text-xs font-bold uppercase tracking-wider">สรุปการเงิน</span>
            </div>
            <div class="bg-white p-4 dark:bg-gray-900 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">ราคารวม (ก่อน VAT)</span>
                <span class="font-medium font-mono">{{ grandSubtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">ภาษีมูลค่าเพิ่ม (7%)</span>
                <span class="font-medium font-mono">{{ grandVat.toLocaleString() }}</span>
              </div>
              <div class="mt-2 border-t border-dashed pt-2 flex justify-between items-center text-primary-600 dark:text-primary-400">
                <span class="font-bold">ยอดสุทธิทั้งสิ้น</span>
                <span class="text-xl font-black font-mono underline underline-offset-4">{{ grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-4">
          <UFormField name="reason" :label="getAssetProcurementFieldLabel('reason')">
            <UTextarea v-model="state.reason" placeholder="เหตุผลและความจำเป็น..." />
          </UFormField>

          <UFormField name="source" label="แหล่งที่มาของราคากลาง">
            <UInput v-model="state.source" icon="lucide:link-2" placeholder="สืบราคาจาก..." />
          </UFormField>
        </div>

        <div class="sticky bottom-0 bg-white pt-4 pb-2 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
          <UButton 
            type="submit" 
            block 
            size="xl"
            :loading="isUpdating"
            class="shadow-lg shadow-primary-500/20"
          >
            บันทึกการแก้ไขข้อมูล
          </UButton>
        </div>
      </UForm>
    </template>
  </USlideover>
</template>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
