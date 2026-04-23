<script setup lang="ts">
import {
  CreateAssetRepairSchema,
  type CreateAssetRepairDTO,
} from "#shared/modules/asset-repair";
import type { FormSubmitEvent, DropdownMenuItem } from "@nuxt/ui";

/* ------------------ EMIT ------------------ */
const emit = defineEmits<{
  close: [{ created: boolean; data?: SerializedAssetRepairWithRelations }];
}>();

/* ------------------ SERVICES ------------------ */
const assetRepairService = useAssetRepairService();
const assetService = useAssetService();

/* ------------------ SCHEMA ------------------ */
const schema = CreateAssetRepairSchema.extend({
  informedAt: CreateAssetRepairSchema.shape.informedAt.transform((value) =>
    value ? new Date(value) : value,
  ),
});

/* ------------------ FORM STATE ------------------ */
const state = reactive<CreateAssetRepairDTO>({
  assetId: "",
  incidentId: "",
  title: "",
  cause: "",
  description: "",
  informedAt: "" as unknown as Date,
});

/* ------------------ ASSET SEARCH ------------------ */
const assetSearch = ref("");
const isSearching = ref(false);
const assetItems = ref<DropdownMenuItem[][]>([]);
const selectedAssetLabel = ref("");

watch(assetSearch, async (q) => {
  if (!q || q.length < 2) {
    assetItems.value = [];
    return;
  }

  isSearching.value = true;

  try {
    const res = await assetService.getAssets({
      page: 1,
      perPage: 15,
      search: q,
    });

    assetItems.value = [
      res.data.map((asset) => ({
        label: `${asset.tag} - ${asset.type}`,
        description: asset.department.name,
        icon: "i-lucide-package",
        onSelect: () => {
          state.assetId = asset.id;
          selectedAssetLabel.value = `${asset.tag} - ${asset.type}`;
          assetSearch.value = "";
          assetItems.value = [];
        },
      })),
    ];
  } catch (e) {
    assetItems.value = [];
  } finally {
    isSearching.value = false;
  }
});

/* ------------------ SUBMIT ------------------ */
const isCreating = ref(false);

async function handleCreate(event: FormSubmitEvent<CreateAssetRepairDTO>) {
  if (isCreating.value) return;
  isCreating.value = true;

  try {
    const { data } =
      await assetRepairService.createAssetRepair(event.data);

    showToastSuccess({
      title: "เพิ่มการซ่อมสำเร็จ",
      message: "คุณได้เพิ่มการซ่อมใหม่เรียบร้อยแล้ว",
    });

    // ✅ ปิด overlay + ส่งค่า
    emit("close", { created: true, data });

  } catch (error) {
    handleToastError(error);
  } finally {
    isCreating.value = false;
  }
}
</script>
<template>
  <USlideover
    title="เพิ่มการซ่อม"
    @close="emit('close', { created: false })"
    :ui="{
      width: 'max-w-md',
      body: { base: 'flex-1 overflow-y-auto p-6' },
      header: { base: 'px-6 py-4 border-b border-gray-200 dark:border-gray-800' }
    }"
  >
    <template #body>
      <UForm
        class="flex flex-col gap-y-6"
        :schema="schema"
        :state="state"
        @submit="handleCreate"
      >
        <UFormField name="assetId" label="ทรัพย์สิน" required>
          <div class="relative mt-1">
            <div v-if="!state.assetId" class="space-y-3">
              <UInput
                v-model="assetSearch"
                icon="i-lucide-search"
                placeholder="ค้นหาชื่อหรือรหัสทรัพย์สิน..."
                :loading="isSearching"
                size="lg"
                class="w-full shadow-sm"
              />
              
              <div v-if="assetItems.length" class="animate-in fade-in slide-in-from-top-1 duration-200">
                <USelectMenu
                  :items="assetItems"
                  class="w-full"
                  :teleport="false"
                  :uiMenu="{
                    container: 'z-20 w-full mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl rounded-lg'
                  }"
                >
                  <UButton 
                    block 
                    variant="soft" 
                    color="primary" 
                    icon="i-lucide-list-checks"
                    label="กดเพื่อดูรายการที่พบ"
                  />
                </USelectMenu>
              </div>
            </div>

            <div 
              v-else 
              class="flex flex-col p-4 rounded-xl border-2 border-primary-500/20 bg-primary-50/50 dark:bg-primary-950/20 transition-all"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary-500 rounded-lg">
                    <UIcon name="i-lucide-package" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">เลือกแล้ว</p>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ selectedAssetLabel }}</p>
                  </div>
                </div>
                <UButton
                  size="xs"
                  variant="ghost"
                  color="red"
                  icon="i-lucide-x"
                  class="rounded-full"
                  @click="state.assetId = ''; selectedAssetLabel = '';"
                />
              </div>
            </div>
          </div>
        </UFormField>

        <UDivider class="opacity-50" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField name="incidentId" label="รหัสเหตุการณ์" required class="md:col-span-1">
            <UInput v-model="state.incidentId" icon="i-lucide-hash" placeholder="เช่น INC-001" />
          </UFormField>

          <UFormField name="informedAt" label="วันที่แจ้ง" class="md:col-span-1">
            <UInput v-model="state.informedAt" type="date" icon="i-lucide-calendar" />
          </UFormField>
        </div>

        <UFormField name="title" label="หัวข้อการซ่อม" required>
          <UInput v-model="state.title" placeholder="ระบุปัญหาเบื้องต้น" size="md" />
        </UFormField>

        <UFormField name="cause" label="สาเหตุที่พบ" required>
          <UInput v-model="state.cause" placeholder="เช่น อุปกรณ์เสื่อมสภาพ" />
        </UFormField>

        <UFormField name="description" label="รายละเอียดเพิ่มเติม">
          <UTextarea 
            v-model="state.description" 
            placeholder="อธิบายรายละเอียดการชำรุด..." 
            :rows="4"
            class="resize-none"
          />
        </UFormField>

        <div class="sticky bottom-0 pt-6 mt-auto bg-white dark:bg-gray-900/80 backdrop-blur-sm">
          <UButton 
            type="submit" 
            block 
            size="xl"
            :loading="isCreating"
            icon="i-lucide-save"
            class="shadow-lg shadow-primary-500/20"
          >
            บันทึกข้อมูลการซ่อม
          </UButton>
        </div>
      </UForm>
    </template>
  </USlideover>
</template>