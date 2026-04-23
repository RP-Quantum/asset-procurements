<script setup lang="ts">
import {
  type AssetCreateSlideover,
  LazyAssetCreateSlideover,
} from "#components";
import { watchDebounced } from '@vueuse/core' // แนะนำให้ลงเพิ่ม หรือใช้ watch ปกติก็ได้

definePageMeta({
  requiresAuth: true,
});

useSeoMeta({
  title: "Asset Management | ระบบจัดการทรัพย์สิน",
});

const overlay = useOverlay();
const userSession = useUserSession();
const apiFetch = useApiFetch();

// --- Logic สำหรับการสร้างทรัพย์สิน ---
const assetCreateSlideover = overlay.create(
  LazyAssetCreateSlideover as typeof AssetCreateSlideover
);

const canCreateAsset = computed(() =>
  canPerformAction(userSession.user.value?.role, "ASSET", "CREATE")
);

async function openCreateAsset() {
  if (!canCreateAsset.value) return;
  const { created } = await assetCreateSlideover.open();
  if (created) { /* refresh logic */ }
}

// --- Logic สำหรับ Quick Search ---
const quickSearchQuery = ref('')
const isSearching = ref(false)
const quickResults = ref([])

// ค้นหาเมื่อหยุดพิมพ์ 500ms
watchDebounced(quickSearchQuery, async (newQuery) => {
  if (newQuery.length < 2) {
    quickResults.value = []
    return
  }
  isSearching.value = true
  try {
    const response = await apiFetch('/api/assets', {
      query: { search: newQuery, perPage: 5 }
    })
    quickResults.value = response.data
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    isSearching.value = false
  }
}, { debounce: 500 })
</script>

<template>
  <UDashboardPanel class="bg-slate-50 dark:bg-gray-950">
    <template #header>
      <UDashboardNavbar 
        title="Asset Management Portal" 
        class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800"
      >
        <template #left>
          <div class="p-2 bg-primary-500/10 rounded-lg mr-2 hidden sm:block">
            <UIcon name="i-heroicons-cpu-chip" class="w-5 h-5 text-primary-600" />
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <section class="relative min-h-[450px] lg:h-[550px] w-full flex items-center justify-center overflow-hidden">
      <div
        class="absolute inset-0 w-full h-full bg-cover bg-center scale-105 transition-transform duration-[10s] hover:scale-100"
        style="background-image: url('/n3.png');" 
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-slate-50 dark:to-gray-950"></div>
      
      <div class="relative z-10 px-6 text-center">
        <div
          class="inline-block px-10 py-12 rounded-[2.5rem]
                 bg-white/10 dark:bg-black/20
                 backdrop-blur-2xl
                 border border-white/30 dark:border-white/10
                 shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                 max-w-3xl transform transition-all"
        >
          <UIcon name="i-heroicons-archive-box" class="w-16 h-16 text-primary-400 mb-6 mx-auto animate-pulse" />
          <h1 class="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white uppercase">
            จัดการทรัพย์สินสารสนเทศ <br />
          </h1>
          <span class="block mt-2 text-sky-400 font-medium text-lg tracking-widest uppercase">
            บริหารจัดการทรัพย์สินสารสนเทศของการไฟฟ้าส่วนภูมิภาคเขต 3 ภาคเหนือ
          </span>
        </div>
      </div>
    </section>

    <section class="relative z-20 -mt-20 pb-20 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid gap-8 grid-cols-1 md:grid-cols-3">
          
          <div 
            v-if="canCreateAsset"
            @click="openCreateAsset"
            class="group cursor-pointer p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div class="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-6 group-hover:bg-primary-500 transition-colors">
              <UIcon name="i-heroicons-plus-circle" class="w-8 h-8 text-primary-600 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold mb-2 dark:text-white">เพิ่มข้อมูลทรัพย์สิน</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">เพิ่มข้อมูลอุปกรณ์ใหม่เข้าสู่ระบบ พร้อมกำหนดสัญญาและรายละเอียด S/N</p>
            <div class="mt-6 flex items-center text-primary-600 font-semibold text-sm">
              เพิ่มข้อมูลใหม่ <UIcon name="i-heroicons-arrow-right" class="ml-2 w-4 h-4" />
            </div>
          </div>

          <NuxtLink 
            to="/assets/read" 
            class="group p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div class="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition-colors">
              <UIcon name="i-heroicons-table-cells" class="w-8 h-8 text-indigo-600 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold mb-2 dark:text-white">คลังทรัพย์สิน</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">เรียกดูรายการทรัพย์สินทั้งหมด ค้นหา กรองข้อมูล และส่งออกรายงาน</p>
            <div class="mt-6 flex items-center text-indigo-600 font-semibold text-sm">
              เปิดดูคลัง <UIcon name="i-heroicons-arrow-right" class="ml-2 w-4 h-4" />
            </div>
          </NuxtLink>

         <div class="relative p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl min-h-[220px]">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6 text-emerald-600" />
              </div>
              <h3 class="text-xl font-bold dark:text-white">ค้นหาด่วน</h3>
            </div>
            
            <UInput
              v-model="quickSearchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="S/N, ชื่อ, เลขที่สัญญา..."
              size="lg"
              :loading="isSearching"
              color="emerald"
              variant="outline"
              :ui="{ rounded: 'rounded-xl' }"
            />

            <div v-if="quickSearchQuery.length >= 2" class="absolute left-0 right-0 mt-2 mx-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-30 overflow-hidden">
              <div v-if="quickResults.length === 0 && !isSearching" class="p-4 text-sm text-gray-500 text-center">
                ไม่พบข้อมูล
              </div>
              <ul v-else class="max-h-48 overflow-y-auto">
                <li v-for="item in quickResults" :key="item.id" class="border-b last:border-0 border-gray-100 dark:border-gray-700">
                  <NuxtLink :to="`/assets/${item.id}`" class="block p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                    <p class="text-sm font-bold truncate">{{ item.name }}</p>
                    <p class="text-[10px] text-gray-400">S/N: {{ item.serialNumber || 'N/A' }}</p>
                  </NuxtLink>
                </li>
              </ul>
              <NuxtLink 
                :to="`/assets/read?search=${quickSearchQuery}`" 
                class="block p-2 text-center text-xs font-bold bg-gray-50 dark:bg-gray-900/50 text-emerald-600 hover:text-emerald-700"
              >
                ดูผลลัพธ์ทั้งหมด
              </NuxtLink>
            </div>
          </div>

        </div>

        <div class="mt-20 flex flex-col items-center gap-6">
          <div class="flex items-center gap-4 w-full max-w-md">
            <div class="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700"></div>
            <p class="text-[10px] tracking-[0.3em] font-bold text-gray-400 uppercase">
              Asset Management System
            </p>
            <div class="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-700"></div>
          </div>
        </div>
      </div>
    </section>
  </UDashboardPanel>
</template>

<style scoped>
.transition-all {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>