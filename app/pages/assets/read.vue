<script setup lang="ts">
import {
  type AssetCreateSlideover,
  LazyAssetCreateSlideover,
} from "#components";
import { watchDebounced } from "@vueuse/core";

definePageMeta({
  requiresAuth: true,
});

useSeoMeta({
  title: "Asset Management | ระบบจัดการทรัพย์สิน",
});

const apiFetch = useApiFetch();
const userSession = useUserSession();
const overlay = useOverlay();

/* ---------------- CREATE ---------------- */
const assetCreateSlideover = overlay.create(
  LazyAssetCreateSlideover as typeof AssetCreateSlideover
);

const canCreateAsset = computed(() =>
  canPerformAction(userSession.user.value?.role, "ASSET", "CREATE")
);

/* ---------------- STATE ---------------- */
const page = ref(1);
const perPage = ref(10);
const search = ref("");
const searchDebounced = ref("");

/* debounce search (สำคัญมาก) */
watchDebounced(
  search,
  (val) => {
    page.value = 1;
    searchDebounced.value = val;
  },
  { debounce: 400 }
);

/* clear search */
const clearSearch = () => {
  search.value = "";
};

/* ---------------- DATA ---------------- */
const { data: assetData, pending, refresh } = await useAsyncData(
  "assets-list",
  () =>
    apiFetch("/api/assets", {
      query: {
        page: page.value,
        perPage: perPage.value,
        search: searchDebounced.value,
      },
    }),
  {
    watch: [page, perPage, searchDebounced],
  }
);

const assets = computed(() => assetData.value?.data ?? []);
const total = computed(() => assetData.value?.meta?.total ?? 0);
const totalPages = computed(() => Math.ceil(total.value / perPage.value));
const isLoading = computed(() => pending.value);
</script>

<template>
  <UDashboardPanel class="bg-slate-50/50 dark:bg-gray-950">
    
    <!-- HEADER -->
    <template #header>
      <UDashboardNavbar
        class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800"
      >
        <template #left>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-md">
              <UIcon name="i-heroicons-cpu-chip" class="w-5 h-5 text-white" />
            </div>

            <div class="flex flex-col leading-tight">
              <span class="text-sm sm:text-lg font-extrabold tracking-tight text-gray-800 dark:text-white">
                ทรัพย์สินอุปกรณ์สารสนเทศ
              </span>
              <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase">
                Asset Management System
              </span>
            </div>
          </div>
        </template>

        <template #right>
          <UButton
            v-if="canCreateAsset"
            icon="i-heroicons-plus-circle-20-solid"
            size="sm"
            class="px-4 sm:px-6 py-2 text-sm sm:text-base font-bold rounded-xl text-white
                   bg-gradient-to-r from-primary-600 to-indigo-600
                   hover:from-primary-700 hover:to-indigo-700
                   shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            @click="assetCreateSlideover.open()"
          >
            เพิ่มทรัพย์สิน
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <!-- BODY -->
    <template #body>
      <div class="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">

        <!-- SEARCH + ACTION -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <!-- SEARCH -->
          <div class="relative w-full lg:max-w-md">
            <UInput
              v-model="search"
              :loading="isLoading"
              icon="i-heroicons-magnifying-glass"
              placeholder="ค้นหา (ชื่อ, S/N, รหัส)..."
              size="lg"
              :ui="{ 
                rounded: 'rounded-xl',
                base: 'bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800 focus:ring-2 focus:ring-primary-500'
              }"
            >
              <template #trailing>
                <UButton
                  v-if="search"
                  icon="i-heroicons-x-mark"
                  variant="ghost"
                  size="xs"
                  @click="clearSearch"
                />
              </template>
            </UInput>
          </div>

          <!-- STATS -->
          <div class="flex items-center gap-3">
            <div class="px-3 py-2 bg-white dark:bg-gray-900 border rounded-xl shadow-sm">
              <span class="text-xs text-gray-500">ทั้งหมด</span>
              <span class="ml-2 text-base font-bold text-primary-600">
                {{ total }}
              </span>
            </div>

            <UButton
              icon="i-heroicons-arrow-path"
              variant="ghost"
              :class="{ 'animate-spin': isLoading }"
              @click="refresh"
            />
          </div>
        </div>

        <!-- TABLE -->
        <div
          class="rounded-2xl overflow-hidden
                 border border-gray-200/60 dark:border-gray-800/60
                 bg-white dark:bg-gray-900 shadow-sm"
        >
          <!-- LOADING -->
          <div v-if="isLoading" class="p-6 space-y-4">
            <USkeleton class="h-10 w-full" />
            <USkeleton v-for="i in 5" :key="i" class="h-12 w-full" />
          </div>

          <!-- DATA -->
          <template v-else>
            <AssetTable
              v-if="assets.length"
              :data="assets"
              @update="refresh"
              @delete="refresh"
            />

            <!-- EMPTY -->
            <div
              v-else
              class="flex flex-col items-center justify-center py-16 text-center"
            >
              <UIcon
                name="i-heroicons-archive-box-x-mark"
                class="w-12 h-12 text-gray-300 mb-3"
              />
              <p class="text-gray-500 text-sm">
                ไม่พบข้อมูล
              </p>

              <UButton
                v-if="search"
                variant="ghost"
                class="mt-3"
                @click="clearSearch"
              >
                ล้างค้นหา
              </UButton>
            </div>
          </template>
        </div>

        <!-- PAGINATION -->
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-3
                 bg-white dark:bg-gray-900 px-4 py-3 rounded-xl border shadow-sm"
        >
          <p class="text-xs text-gray-500">
            หน้า {{ page }} / {{ totalPages }}
          </p>

          <UPagination
            v-model:page="page"
            :disabled="isLoading"
            :items-per-page="perPage"
            :total="total"
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