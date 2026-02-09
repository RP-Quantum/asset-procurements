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
  <USlideover title="แก้ไขการจัดซื้อ">
    <slot />

    <template #body>
      <UForm
        class="space-y-2 sm:space-y-3"
        :schema="schema"
        :state="state"
        @submit="handleUpdate"
      >
        <!-- Display repair info (read-only) -->
        <UFormField
          name="repair"
          :label="getAssetProcurementFieldLabel('repair')"
        >
          <UInput
            :model-value="`${data.repair.incidentId} - ${data.repair.title}`"
            disabled
          />
        </UFormField>

        <UFormField
          name="asset"
          :label="getAssetProcurementFieldLabel('asset')"
        >
          <UInput
            :model-value="`${data.repair.asset.tag} - ${data.repair.asset.type}`"
            disabled
          />
        </UFormField>

        <UDivider label="ข้อมูลการจัดซื้อ" />

        <UFormField
          name="vendor"
          :label="getAssetProcurementFieldLabel('vendor')"
        >
          <UInput v-model="state.vendor" placeholder="ชื่อผู้จำหน่าย/ร้านค้า" />
        </UFormField>

        <UFormField
          name="quoteId"
          :label="getAssetProcurementFieldLabel('quoteId')"
        >
          <UInput v-model="state.quoteId" placeholder="เลขที่ใบเสนอราคา" />
        </UFormField>

        <UFormField
          name="itemName"
          :label="getAssetProcurementFieldLabel('itemName')"
        >
          <UInput
            v-model="state.itemName"
            placeholder="ชื่อสินค้า/อะไหล่/บริการ"
          />
        </UFormField>

        <UDivider label="ข้อมูล TOR" />

        <UFormField
          name="torOfficer"
          :label="getAssetProcurementFieldLabel('torOfficer')"
        >
          <UInput
            v-model="state.torOfficer"
            placeholder="ชื่อเจ้าหน้าที่ TOR"
          />
        </UFormField>

        <UFormField
          name="torOfficerPosition"
          :label="getAssetProcurementFieldLabel('torOfficerPosition')"
        >
          <UInput v-model="state.torOfficerPosition" placeholder="ตำแหน่ง" />
        </UFormField>

        <UFormField
          name="torOfficerDepartment"
          :label="getAssetProcurementFieldLabel('torOfficerDepartment')"
        >
          <UInput v-model="state.torOfficerDepartment" placeholder="หน่วยงาน" />
        </UFormField>

        <UFormField
          name="estimatedBudget"
          :label="getAssetProcurementFieldLabel('estimatedBudget')"
        >
          <UInput
            v-model.number="state.estimatedBudget"
            type="number"
            placeholder="งบประมาณโดยประมาณ (บาท)"
          />
        </UFormField>
        <UDivider label="รายการจัดซื้อ" />

        <div class="space-y-3">
          <div
            v-for="(item, index) in state.procureItems"
            :key="index"
            class="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
          >
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm font-medium">รายการที่ {{ index + 1 }}</span>
              <UButton
                icon="lucide:trash-2"
                size="xs"
                color="error"
                variant="ghost"
                @click="removeProcureItem(index)"
              />
            </div>

            <UFormField
              :name="`procureItems.${index}.itemName`"
              label="ชื่อรายการ"
            >
              <UInput v-model="item.itemName" placeholder="ชื่อสินค้า/บริการ" />
            </UFormField>

            <div class="grid grid-cols-2 gap-2">
              <UFormField
                :name="`procureItems.${index}.quantity`"
                label="จำนวน"
              >
                <UInput
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  placeholder="จำนวน"
                />
              </UFormField>

              <UFormField
                :name="`procureItems.${index}.total`"
                label="ราคารวม (บาท)"
                required
              >
                <UInput
                  v-model.number="item.total"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="ราคารวม (รวม VAT 7%)"
                />
              </UFormField>
            </div>

            <div
              v-if="item.total > 0"
              class="space-y-1 rounded bg-gray-50 p-2 text-sm dark:bg-gray-800"
            >
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">ราคาย่อย:</span>
                <span class="font-medium"
                  >{{
                    getItemSubtotal(item).toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                  บาท</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">VAT 7%:</span>
                <span class="font-medium"
                  >{{
                    getItemVat(item).toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                  บาท</span
                >
              </div>
            </div>
          </div>

          <UButton
            icon="lucide:plus"
            variant="outline"
            block
            @click="addProcureItem"
          >
            เพิ่มรายการ
          </UButton>

          <UCard
            v-if="state.procureItems.length > 0"
            class="bg-primary-50 dark:bg-primary-950"
          >
            <div class="space-y-2">
              <div
                class="text-primary-600 dark:text-primary-400 mb-3 flex items-center gap-2"
              >
                <UIcon name="lucide:calculator" class="h-5 w-5" />
                <span class="font-semibold">สรุปยอดรวม</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400"
                  >ราคาย่อยรวม:</span
                >
                <span class="font-medium"
                  >{{
                    grandSubtotal.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                  บาท</span
                >
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">VAT 7%:</span>
                <span class="font-medium"
                  >{{
                    grandVat.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                  บาท</span
                >
              </div>
              <div
                class="border-primary-200 dark:border-primary-800 flex justify-between border-t pt-2"
              >
                <span
                  class="text-primary-900 dark:text-primary-100 text-lg font-bold"
                  >ยอดรวมทั้งสิ้น:</span
                >
                <span
                  class="text-primary-600 dark:text-primary-400 text-lg font-bold"
                  >{{
                    grandTotal.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                  บาท</span
                >
              </div>
            </div>
          </UCard>
        </div>

        <UFormField
          name="reason"
          :label="getAssetProcurementFieldLabel('reason')"
        >
          <UInput
            v-model="state.reason"
            placeholder="เหตุผลและความจำเป็นที่ต้องจัดซื้อ"
          />
        </UFormField>

        <UFormField
          name="source"
          :label="getAssetProcurementFieldLabel('แหล่งที่มาของราคากลาง')"
        >
          <UInput v-model="state.source" placeholder="แหล่งที่มาของราคากลาง" />
        </UFormField>

        <UButton type="submit" block :loading="isUpdating">
          บันทึกการแก้ไข
        </UButton>
      </UForm>
    </template>
  </USlideover>
</template>
