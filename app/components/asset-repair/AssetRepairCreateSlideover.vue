<script setup lang="ts">
import {
  CreateAssetRepairSchema,
  type CreateAssetRepairDTO,
} from "#shared/modules/asset-repair";
import type { FormSubmitEvent, DropdownMenuItem } from "@nuxt/ui";

/* ------------------ EMIT ------------------ */
const emit = defineEmits<{
  close: [SerializedAssetRepairWithRelations | undefined];
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

/* ------------------ ASSET SEARCH (SERVER SIDE) ------------------ */
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
      perPage: 15, // จำกัดไว้ กันหนักเครื่อง
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

    emit("close", data);
  } catch (error) {
    handleToastError(error);
  } finally {
    isCreating.value = false;
  }
}
</script>



<template>
  <USlideover title="เพิ่มการซ่อม">
    <slot />

    <template #body>
      <UForm
        class="space-y-2 sm:space-y-3"
        :schema="schema"
        :state="state"
        @submit="handleCreate"
      >
        <!-- ASSET -->
        <UFormField
          name="assetId"
          :label="getAssetRepairFieldLabel('asset')"
          required
        >
          <div class="space-y-1">
            <UInput
              v-if="!state.assetId"
              v-model="assetSearch"
              icon="i-lucide-search"
              placeholder="ค้นหาทรัพย์สิน (tag / type / แผนก)"
              :loading="isSearching"
            />

            <UInput
              v-else
              :model-value="selectedAssetLabel"
              disabled
              icon="i-lucide-check"
            />

<UDropdownMenu
  v-if="assetItems.length"
  :items="assetItems"
  class="w-full"
  :teleport="false"
  :content-class="'max-h-64 overflow-y-auto'"
>
  <UButton
    block
    color="neutral"
    variant="outline"
    icon="i-lucide-box"
  >
    เลือกทรัพย์สิน
  </UButton>
</UDropdownMenu>


            <UButton
              v-if="state.assetId"
              size="xs"
              variant="ghost"
              color="red"
              @click="
                state.assetId = '';
                selectedAssetLabel = '';
              "
            >
              เปลี่ยนทรัพย์สิน
            </UButton>
          </div>
        </UFormField>

        <!-- INCIDENT -->
        <UFormField
          name="incidentId"
          :label="getAssetRepairFieldLabel('incidentId')"
          required
        >
          <UInput v-model="state.incidentId" />
        </UFormField>

        <!-- TITLE -->
        <UFormField
          name="title"
          :label="getAssetRepairFieldLabel('title')"
          required
        >
          <UInput v-model="state.title" />
        </UFormField>

        <!-- CAUSE -->
        <UFormField
          name="cause"
          :label="getAssetRepairFieldLabel('cause')"
          required
        >
          <UInput v-model="state.cause" />
        </UFormField>

        <!-- DESCRIPTION -->
        <UFormField
          name="description"
          :label="getAssetRepairFieldLabel('description')"
        >
          <UInput v-model="state.description" textarea />
        </UFormField>

        <!-- DATE -->
        <UFormField
          name="informedAt"
          :label="getAssetRepairFieldLabel('informedAt')"
        >
          <UInput v-model="state.informedAt" type="date" />
        </UFormField>

        <UButton type="submit" block :loading="isCreating">
          เพิ่มการซ่อม
        </UButton>
      </UForm>
    </template>
  </USlideover>
</template>

