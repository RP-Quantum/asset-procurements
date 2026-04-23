<script setup lang="ts">
import {
  type AssetRepairCreateSlideover,
  LazyAssetRepairCreateSlideover,
} from "#components";

definePageMeta({
  requiresAuth: true,
});

useSeoMeta({
  title: "Asset Repair | ระบบงานซ่อม",
});

const overlay = useOverlay();

const assetRepairSlideover = overlay.create(
  LazyAssetRepairCreateSlideover as typeof AssetRepairCreateSlideover
);

async function openRepair() {
  const { created } = await assetRepairSlideover.open();
  if (created) {
    // สามารถเพิ่ม Toast แจ้งเตือนตรงนี้ได้
  }
}
</script>

<template>
  <UDashboardPanel class="bg-slate-50 dark:bg-gray-950">
    <template #header>
      <UDashboardNavbar 
        title="Repair & Maintenance Portal" 
        class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800"
      />
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
          <UIcon name="i-heroicons-wrench-screwdriver" class="w-16 h-16 text-cyan-400 mb-6 mx-auto animate-pulse" />
          <h1 class="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white uppercase">
            การแจ้งซ่อมทรัพย์สิน
          </h1>
         
            <span class="block mt-2 text-cyan-300 font-medium text-lg tracking-widest uppercase">Asset Repair Management</span>
      
        </div>
      </div>
    </section>

    <section class="relative z-20 -mt-20 pb-20 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid gap-8 grid-cols-1 md:grid-cols-3">
          
          <div 
            @click="openRepair"
            class="group cursor-pointer p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
              <UIcon name="i-heroicons-plus-circle" class="w-8 h-8 text-blue-600 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold mb-2 dark:text-white">แจ้งซ่อมใหม่</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">บันทึกข้อมูลอาการเสีย และรายละเอียดอุปกรณ์ที่ต้องการซ่อม</p>
            <div class="mt-6 flex items-center text-blue-600 font-semibold text-sm">
              เริ่มต้นใช้งาน <UIcon name="i-heroicons-arrow-right" class="ml-2 w-4 h-4" />
            </div>
          </div>

          <NuxtLink 
            to="/asset-repairs/read"
            class="group p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div class="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500 transition-colors">
              <UIcon name="i-heroicons-list-bullet" class="w-8 h-8 text-cyan-600 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold mb-2 dark:text-white">รายการทั้งหมด</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">ตรวจสอบสถานะงานซ่อม ประวัติการแก้ไข และติดตามความคืบหน้า</p>
            <div class="mt-6 flex items-center text-cyan-600 font-semibold text-sm">
              ดูรายการซ่อม <UIcon name="i-heroicons-arrow-right" class="ml-2 w-4 h-4" />
            </div>
          </NuxtLink>

          <NuxtLink
            to="/asset-procurements"
            class="group p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div class="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition-colors">
              <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-indigo-600 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold mb-2 dark:text-white">จัดทำเอกสารจัดซื้อ</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">ออกเอกสารขออนุมัติซื้ออะไหล่ หรืออุปกรณ์สำหรับการซ่อมแซม</p>
            <div class="mt-6 flex items-center text-indigo-600 font-semibold text-sm">
              สร้างเอกสาร <UIcon name="i-heroicons-arrow-right" class="ml-2 w-4 h-4" />
            </div>
          </NuxtLink>

      </div>

        <div class="mt-20 flex flex-col items-center gap-6">
          <div class="flex items-center gap-4 w-full max-w-md">
            <div class="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700"></div>
            <p class="text-[10px] tracking-[0.3em] font-bold text-gray-400 uppercase">
              IT Maintenance System
            </p>
            <div class="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-700"></div>
          </div>
        </div>
      </div>
    </section>
  </UDashboardPanel>
</template>

<style scoped>
/* เพิ่มความนุ่มนวลในการ Transition */
.transition-all {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>