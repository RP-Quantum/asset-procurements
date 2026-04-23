<script setup lang="ts">
import {
  type AssetProcurementCreateSlideover,
  LazyAssetProcurementCreateSlideover,
} from "#components";
import { useDebounceFn } from '@vueuse/core';

// --- Logic & Data Fetching ---
const search = ref("");
const debouncedSearch = ref(""); 
const page = ref(1);
const perPage = ref(10); // ตั้งไว้ที่ 10 รายการต่อหน้า

// 1. ระบบ Debounce ป้องกันการยิง API ถี่เกินไป
const updateDebouncedSearch = useDebounceFn((val: string) => {
  debouncedSearch.value = val;
}, 500);

watch(search, (newVal) => {
  updateDebouncedSearch(newVal);
});

// 2. เมื่อมีการค้นหาใหม่ ให้เด้งกลับไปเริ่มหน้า 1 เสมอ
watch(debouncedSearch, () => {
  page.value = 1;
});

const query = computed(() => ({
  page: page.value,
  perPage: perPage.value,
  search: debouncedSearch.value
}));

const { data: assetProcurementData, refresh, pending } = await useAssetProcurementData({
  query,
  watch: [query] 
});

// 3. จัดการข้อมูลดิบ (Raw Data)
const allProcurements = computed(() => assetProcurementData.value?.data ?? []);

// 4. ระบบกรองข้อมูลและแบ่งหน้า (Frontend Filtering & Pagination)
// แก้ปัญหาข้อมูลกองรวมกันหน้าเดียว แม้ API จะส่งมาทั้งหมด
const assetProcurements = computed(() => {
  let filtered = allProcurements.value;

  // กรองข้อมูลตามคำค้นหา (ถ้า API ไม่กรองให้)
  if (debouncedSearch.value) {
    const s = debouncedSearch.value.toLowerCase();
    filtered = filtered.filter((item: any) => 
      item.data?.vendor?.toLowerCase().includes(s) ||
      item.data?.reportId?.toLowerCase().includes(s) ||
      item.data?.itemName?.toLowerCase().includes(s)
    );
  }

  // ตัดแบ่งหน้า (Pagination)
  const start = (page.value - 1) * perPage.value;
  const end = start + perPage.value;
  
  return filtered.slice(start, end);
});

// 5. นับจำนวนทั้งหมดจากข้อมูลที่กรองแล้ว เพื่อให้เลขหน้าใน UPagination ถูกต้อง
const total = computed(() => {
  // กรองข้อมูลก่อนนับ total เพื่อให้ Pagination สอดคล้องกับผลการค้นหา
  if (debouncedSearch.value) {
    const s = debouncedSearch.value.toLowerCase();
    return allProcurements.value.filter((item: any) => 
      item.data?.vendor?.toLowerCase().includes(s) ||
      item.data?.reportId?.toLowerCase().includes(s)
    ).length;
  }
  
  return assetProcurementData.value?.meta?.total 
      ?? assetProcurementData.value?.total 
      ?? allProcurements.value.length 
      ?? 0;
});

const isLoading = computed(() => pending?.value ?? false);

// --- Dashboard Stats ---
const stats = computed(() => {
  const data = allProcurements.value; // ใช้ข้อมูลทั้งหมดในการคำนวณ Stat
  return [
    { label: 'รายการทั้งหมด', value: total.value, icon: 'i-heroicons-document-duplicate', color: 'blue' },
    { 
      label: 'เอกสารสมบูรณ์', 
      value: data.filter(i => calculateProgress(i.data) === 100).length, 
      icon: 'i-heroicons-check-badge', 
      color: 'emerald' 
    },
    { 
      label: 'รอดำเนินการ', 
      value: data.filter(i => calculateProgress(i.data) < 100).length, 
      icon: 'i-heroicons-clock', 
      color: 'amber' 
    },
  ];
});

function calculateProgress(data: any) {
  if (!data) return 0;
  const fields = [
    data.vendor, data.quoteId, data.itemName, data.torOfficer,
    data.torOfficerPosition, data.torOfficerDepartment, data.estimatedBudget,
    data.procureItems && data.procureItems.length > 0, data.reason,
    data.source, data.reportId, data.reportDate, data.deliveryAddress,
    data.taxInvoiceNumber, data.taxInvoiceDate, data.deliveryDate,
    data.deliveranceStatus, data.withdrawerName,
  ];
  const filled = fields.filter(f => typeof f === "boolean" ? f : !!f).length;
  return Math.round((filled / fields.length) * 100);
}

// --- Overlay & Actions ---
const userSession = useUserSession();
const overlay = useOverlay();
const canCreate = computed(() => canPerformAction(userSession.user.value?.role, "ASSET_PROCUREMENT", "CREATE"));
const procurementCreateSlideover = overlay.create(LazyAssetProcurementCreateSlideover as typeof AssetProcurementCreateSlideover);

const handleCreate = async () => {
  const result = await procurementCreateSlideover.open();
  if (result) refresh();
};

definePageMeta({ requiresAuth: true });
useSeoMeta({ title: "Procurement Portal | ระบบจัดซื้อ" });
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-gray-950">
    
    <header class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-6 z-50">
     
  <div class="flex items-center gap-3">
    
    <!-- Icon -->
    <div class="p-2 rounded-xl shadow-md">
       <UIcon name="i-heroicons-shopping-bag" class="w-5 h-5 bg-emerald-500 text-white" />
    </div>

    <!-- Title -->
    <div class="flex flex-col leading-tight">
      <span class="text-lg font-extrabold tracking-tight text-gray-800 dark:text-white">
        การจัดทำเอกสารจัดซื้อ
      </span>
      <span class="text-xs text-gray-500 dark:text-gray-400 tracking-wide uppercase">
        Asset Management System
      </span>
    </div>

  </div>


      <div class="flex items-center gap-3">
        <UButton
          v-if="canCreate"
          icon="i-heroicons-plus-circle"
          size="md"
          class="rounded-xl px-5 py-2 font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          @click="handleCreate"
        >
          สร้างใบขอซื้อ
        </UButton>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-20">
      
      <section class="relative h-[450px] w-full flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] scale-110" style="background-image: url('/n3.png');"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-50 via-black/40 to-black/60 dark:from-gray-950"></div>
        
        <div class="relative z-10 text-center space-y-4 px-4">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md mb-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">System Online</span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
            จัดทำเอกสาร <span class="text-emerald-400">จัดซื้อ</span>
          </h1>
          <p class="text-gray-300 font-medium tracking-[0.5em] text-[11px] uppercase max-w-lg mx-auto leading-relaxed">
            Integrated Asset Inventory & Procurement Management
          </p>
        </div>
      </section>

      <div class="max-w-7xl mx-auto px-6 -mt-20 relative z-20 space-y-10">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="stat in stats" :key="stat.label" 
            class="group p-1 rounded-[2rem] bg-gradient-to-br from-white/50 to-white/10 dark:from-white/5 dark:to-transparent backdrop-blur-xl border border-white/20 shadow-2xl transition-all hover:-translate-y-2 hover:shadow-emerald-500/10"
          >
            <div class="bg-white dark:bg-gray-900 rounded-[1.9rem] p-6 flex items-center gap-5">
              <div :class="`p-4 rounded-2xl bg-${stat.color}-500/10 group-hover:scale-110 transition-transform`">
                <UIcon :name="stat.icon" :class="`w-8 h-8 text-${stat.color}-500`" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-3xl font-black text-gray-900 dark:text-white">{{ stat.value }}</span>
                  <span class="text-xs text-gray-400 font-medium">รายการ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="w-full md:max-w-xl relative group">
              <UInput
  v-model="search" 
  :loading="isLoading"
  icon="i-heroicons-magnifying-glass"
  placeholder="ค้นหาเลขที่จัดซื้อ, ผู้ขาย หรือรายการ..."
  size="xl"
  class="w-full shadow-2xl transition-all"
  :ui="{ 
    rounded: 'rounded-3xl',
    base: 'h-16 bg-white dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-800 focus:ring-2 focus:ring-emerald-500'
  }"
/>


            </div>
<div class="flex items-center gap-3">
  <UButton
    variant="ghost"
    color="emerald"
    :loading="isLoading"
    class="relative rounded-2xl h-14 w-14 flex justify-center border border-emerald-500/20 bg-emerald-500/5 transition-all duration-500  
           hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:scale-95 group"
    @click="refresh"
  >
    <template #leading v-if="!isLoading">
      <UIcon 
        name="i-heroicons-arrow-path" 
        class="h-6 w-6 transition-transform duration-700 group-hover:rotate-180" 
      />
    </template>

    <div 
      v-if="!isLoading" 
      class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-emerald-400/30 to-teal-400/30 blur-xl -z-10"
    ></div>
  </UButton>
</div>
          </div>

          <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-black/5">
            <div v-if="isLoading" class="p-12 space-y-6">
              <USkeleton v-for="i in 5" :key="i" class="h-16 w-full rounded-2xl" />
            </div>
                        
            <div v-else>
              <AssetProcurementTable
                v-if="assetProcurements.length > 0"
                :data="assetProcurements"
                @update="refresh"
                @delete="refresh"
              />
              
              <div v-else class="py-32 flex flex-col items-center text-center space-y-4">
                <div class="w-24 h-24 bg-slate-50 dark:bg-gray-800 rounded-full flex items-center justify-center animate-bounce">
                  <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-300" />
                </div>
                <div class="space-y-1">
                  <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">ไม่พบข้อมูล</h3>
                  <p class="text-gray-400 text-sm max-w-xs mx-auto">ลองเปลี่ยนคำค้นหา หรือสร้างใบขอซื้อใหม่เพื่อเริ่มต้นรายการของคุณ</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col md:flex-row items-center justify-between gap-4 px-6">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest italic">
              Showing <span class="text-emerald-500">{{ assetProcurements.length }}</span> of {{ total }} records
            </p>
            <UPagination 
              v-model:page="page" 
              :total="total" 
              :items-per-page="perPage" 
              :disabled="isLoading"
              :ui="{ 
                rounded: 'rounded-2xl',
                wrapper: 'shadow-lg'
              }" 
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* เพิ่มความสมูทให้กับการ Scroll */
main {
  scrollbar-width: thin;
  scrollbar-color: #10b981 transparent;
}

/* ปรับแต่ง Scrollbar สำหรับ Chrome/Safari */
main::-webkit-scrollbar {
  width: 6px;
}
main::-webkit-scrollbar-thumb {
  background-color: #10b981;
  border-radius: 20px;
}
</style>