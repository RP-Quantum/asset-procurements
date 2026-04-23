<script setup lang="ts">
import {
  type AssetCreateSlideover,
  LazyAssetCreateSlideover,
} from "#components";

definePageMeta({
  requiresAuth: true,
});

useSeoMeta({
  title: "Asset Management | ระบบจัดการทรัพย์สิน",
});

const apiFetch = useApiFetch();
const userSession = useUserSession();
const overlay = useOverlay();

// สร้าง Slideover สำหรับเพิ่มทรัพย์สิน
const assetCreateSlideover = overlay.create(
  LazyAssetCreateSlideover as typeof AssetCreateSlideover,
);

const canCreateAsset = computed(() =>
  canPerformAction(userSession.user.value?.role, "ASSET", "CREATE"),
);

const page = ref(1);
const perPage = ref(10);
const search = ref("");

// ฟังก์ชันล้างการค้นหา
const clearSearch = () => {
  search.value = "";
  page.value = 1;
};

const { data: assetData, pending, refresh } = await useAsyncData(
  "assets-list",
  () =>
    apiFetch("/api/assets", {
      query: {
        page: page.value,
        perPage: perPage.value,
        search: search.value,
      },
    }),
  { watch: [page, perPage, search] },
);

const assets = computed(() => assetData.value?.data ?? []);
const total = computed(() => assetData.value?.meta?.total ?? 0);
const isLoading = computed(() => pending.value);
</script>

<template>
  <UDashboardPanel
    class="bg-slate-50/50 dark:bg-gray-950"
  >
    <template #header>
      <UDashboardNavbar
        title="คลังทรัพย์สินและอุปกรณ์"
        class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800"
      >


      
    <template #left>
  <div class="flex items-center gap-3">
    
    <!-- Icon -->
    <div class="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-md">
      <UIcon name="i-heroicons-cpu-chip" class="w-5 h-5 text-white" />
    </div>

    <!-- Title -->
    <div class="flex flex-col leading-tight">
      <span class="text-lg font-extrabold tracking-tight text-gray-800 dark:text-white">
        ทรัพย์สินอุปกรณ์สารสนเทศ
      </span>
      <span class="text-xs text-gray-500 dark:text-gray-400 tracking-wide uppercase">
        Asset Management System
      </span>
    </div>

  </div>
</template>

        <template #right>
          <UButton
            v-if="canCreateAsset"
            icon="i-heroicons-plus-circle-20-solid"
            size="md"
            class="
              px-6 py-2.5 font-bold rounded-xl text-white
              bg-gradient-to-r from-primary-600 to-indigo-600
              hover:from-primary-700 hover:to-indigo-700
              shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]
              transition-all duration-300 transform hover:-translate-y-0.5
            "
            @click="assetCreateSlideover.open()"
          >
            เพิ่มทรัพย์สินใหม่
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6">
        
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="relative w-full lg:max-w-md group">
            <UInput
              v-model.lazy="search"
              :loading="isLoading"
              icon="i-heroicons-magnifying-glass"
              placeholder="ค้นหาด้วยชื่อ, S/N หรือรหัสทรัพย์สิน..."
              size="xl"
              :ui="{ 
                rounded: 'rounded-2xl',
                base: 'bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 focus:ring-2 focus:ring-primary-500 transition-all'
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
            <div class="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
              <span class="text-sm text-gray-500 dark:text-gray-400">รายการทั้งหมด:</span>
              <span class="ml-2 text-lg font-bold text-primary-600 dark:text-primary-400">{{ total }}</span>
            </div>
            <UButton
              icon="i-heroicons-arrow-path"
              color="gray"
              variant="ghost"
              class="rounded-xl"
              :class="{ 'animate-spin': isLoading }"
              @click="refresh"
            />
          </div>
        </div>

        <div 
          class="
            relative rounded-3xl overflow-hidden
            border border-gray-200/60 dark:border-gray-800/60
            bg-white dark:bg-gray-900
            shadow-[0_8px_30px_rgb(0,0,0,0.04)]
          "
        >
          <div v-if="isLoading" class="p-8 space-y-4">
            <div class="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
              <USkeleton class="h-8 w-[20%]" />
              <USkeleton class="h-8 w-[40%]" />
              <USkeleton class="h-8 w-[20%]" />
              <USkeleton class="h-8 w-[20%]" />
            </div>
            <div v-for="i in 5" :key="i" class="flex gap-4 py-2">
              <USkeleton class="h-12 w-full" :ui="{ rounded: 'rounded-xl' }" />
            </div>
          </div>

          <div v-else>
            <AssetTable
              v-if="assets.length > 0"
              :data="assets"
              @update="refresh"
              @delete="refresh"
            />

            <div
              v-else
              class="flex flex-col items-center justify-center py-24 text-center"
            >
              <div class="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-full mb-4">
                <UIcon name="i-heroicons-archive-box-x-mark" class="w-16 h-16 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 class="text-xl font-bold text-gray-700 dark:text-gray-200">ไม่พบข้อมูลทรัพย์สิน</h3>
              <p class="text-gray-400 mt-2 max-w-xs">
                ไม่พบรายการที่คุณกำลังมองหา ลองเปลี่ยนคำค้นหาหรือเพิ่มข้อมูลใหม่
              </p>
              <UButton
                v-if="search"
                label="ล้างการค้นหา"
                variant="ghost"
                class="mt-4"
                @click="clearSearch"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between bg-white dark:bg-gray-900 px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <p class="text-sm text-gray-500 hidden sm:block">
            แสดงหน้า {{ page }} จาก {{ Math.ceil(total / perPage) }}
          </p>
          <UPagination
            v-model:page="page"
            :disabled="isLoading"
            :items-per-page="perPage"
            :total="total"
            size="md"
            :ui="{
              wrapper: 'gap-2',
              rounded: 'rounded-lg',
              base: 'min-w-[40px] justify-center'
            }"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<style scoped>
/* เพิ่มความสมูทในการเปลี่ยนผ่านหน้า */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>