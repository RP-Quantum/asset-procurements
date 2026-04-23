<script setup lang="ts">
import {
  type AssetRepairCreateSlideover,
  LazyAssetRepairCreateSlideover,
} from "#components";

definePageMeta({
  requiresAuth: true,
});

useSeoMeta({
  title: "ระบบแจ้งซ่อมทรัพย์สิน | Maintenance Management",
});

const apiFetch = useApiFetch();
const userSession = useUserSession();
const overlay = useOverlay();

const assetRepairCreateSlideover = overlay.create(
  LazyAssetRepairCreateSlideover as typeof AssetRepairCreateSlideover,
);

const canCreateAssetRepair = computed(() =>
  canPerformAction(userSession.user.value?.role, "ASSET", "CREATE"),
);

// ปรับปรุงฟังก์ชันเปิด Slideover ให้รองรับการ Refresh เมื่อบันทึกสำเร็จ
const handleCreateRepair = async () => {
  const result = await assetRepairCreateSlideover.open();
  if (result) refresh();
};

const page = ref(1);
const perPage = ref(10);
const search = ref("");

const clearSearch = () => {
  search.value = "";
  page.value = 1;
};

const {
  data: assetRepairData,
  pending,
  refresh,
} = await useAsyncData(
  "repair-list",
  () =>
    apiFetch("/api/asset-repairs", {
      query: {
        page: page.value,
        perPage: perPage.value,
        search: search.value,
      },
    }),
  { watch: [page, perPage, search] },
);

const assetRepairs = computed(() => assetRepairData.value?.data ?? []);
const total = computed(() => assetRepairData.value?.meta?.total ?? 0);
const isLoading = computed(() => pending.value);
</script>

<template>
  <UDashboardPanel
    class="bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/30 dark:from-gray-950 dark:via-gray-950 dark:to-indigo-950/10"
  >
    <template #header>
      <UDashboardNavbar
        title="รายการซ่อมทรัพย์สินอุปกรณ์"
        class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800"
      >
       <template #left>
  <div class="flex items-center gap-3">
    
    <!-- Icon -->
    <div class="p-2 rounded-xl shadow-md">
                  <UIcon name="i-heroicons-wrench-screwdriver" class="w-10 h-10 text-indigo-600" />

    </div>

    <!-- Title -->
    <div class="flex flex-col leading-tight">
      <span class="text-lg font-extrabold tracking-tight text-gray-800 dark:text-white">
        การซ่อมทรัพย์สินอุปกรณ์สารสนเทศ
      </span>
      <span class="text-xs text-gray-500 dark:text-gray-400 tracking-wide uppercase">
        Repair Management System
      </span>
    </div>

  </div>
</template>
        <template #right>
          <UButton
            v-if="canCreateAssetRepair"
            icon="i-heroicons-plus-circle-20-solid"
            size="md"
            class="
              px-6 py-2.5 font-bold rounded-xl text-white
              bg-gradient-to-r from-indigo-600 to-blue-600
              hover:from-indigo-700 hover:to-blue-700
              shadow-[0_4px_14px_0_rgba(79,70,229,0.4)]
              transition-all duration-300 transform hover:-translate-y-0.5
            "
            @click="handleCreateRepair"
          >
            แจ้งซ่อมใหม่
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6">
        
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="relative w-full lg:max-w-md">
            <UInput
              v-model.lazy="search"
              :loading="isLoading"
              icon="i-heroicons-magnifying-glass"
              placeholder="ค้นหาเลขที่ใบซ่อม, ชื่อทรัพย์สิน..."
              size="xl"
              :ui="{ 
                rounded: 'rounded-2xl',
                base: 'bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all'
              }"
            >
              <template #trailing>
                <UButton
                  v-if="search"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark"
                  :padded="false"
                  @click="clearSearch"
                />
              </template>
            </UInput>
          </div>

          <div class="flex items-center gap-3">
            <div class="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 rounded-xl shadow-sm flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300">ประวัติการซ่อม {{ total }} รายการ</span>
            </div>
          </div>
        </div>

        <div 
          class="
            relative rounded-3xl overflow-hidden
            border border-gray-200/60 dark:border-gray-800/60
            bg-white dark:bg-gray-900
            shadow-[0_8px_30px_rgb(0,0,0,0.04)]
            min-h-[400px]
          "
        >
          <div v-if="isLoading" class="p-8 space-y-4">
            <div v-for="i in 6" :key="i" class="flex gap-4">
              <USkeleton class="h-12 w-full" :ui="{ rounded: 'rounded-xl' }" />
            </div>
          </div>

          <div v-else>
            <AssetRepairTable
              v-if="assetRepairs.length > 0"
              :data="assetRepairs"
              class="w-full"
              @update="refresh"
              @delete="refresh"
            />

            <div
              v-else
              class="flex flex-col items-center justify-center py-28 text-center"
            >
              <div class="p-6 bg-slate-50 dark:bg-gray-800/50 rounded-full mb-6">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-16 h-16 text-gray-300" />
              </div>
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">ไม่มีรายการซ่อม</h3>
              <p class="text-gray-400 mt-2 max-w-xs mx-auto">
                ยังไม่มีการบันทึกข้อมูลการซ่อมในขณะนี้ หรือลองปรับคำค้นหาของคุณใหม่
              </p>
              <UButton
                v-if="search"
                label="ล้างตัวกรอง"
                variant="soft"
                color="gray"
                class="mt-6 rounded-xl"
                @click="clearSearch"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-gray-900/50 px-6 py-4 rounded-2xl border border-gray-200/50 dark:border-gray-800 backdrop-blur-sm">
          <div class="text-sm text-gray-500">
            แสดงหน้า <span class="font-semibold text-gray-900 dark:text-white">{{ page }}</span> 
            จากทั้งหมด <span class="font-semibold text-gray-900 dark:text-white">{{ Math.ceil(total / perPage) }}</span> หน้า
          </div>
          <UPagination
            v-model:page="page"
            :disabled="isLoading"
            :items-per-page="perPage"
            :total="total"
            size="md"
            :ui="{
              wrapper: 'gap-1',
              rounded: 'rounded-lg',
              base: 'min-w-[36px] transition-colors'
            }"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>