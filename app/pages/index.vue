<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
});

useSeoMeta({
  title: "หน้าหลัก",
});
</script>

<template>
  <UDashboardPanel class="!p-0 !m-0 bg-white dark:bg-slate-900">
    <!-- Header -->
    <template #header>
      <UDashboardNavbar title="หน้าหลัก" />
    </template>

    <!-- Hero Section -->
    <section
      class="relative h-[89vh] bg-cover bg-center"
      style="background-image: url('/n3.png');"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0
               bg-gradient-to-b
               from-white/40 via-white/30 to-gray-100/20
               dark:from-[#0f172b]/70
               dark:via-[#0f172b]/70
               dark:to-[#0f172b]/20
               backdrop-blur-[2px]"
      />

      <!-- Content -->
      <div
        class="relative z-10 flex flex-col items-center justify-center
               h-full text-center px-6"
      >
        <p
          class="mb-4 text-sm md:text-base uppercase tracking-widest
                 text-sky-600 dark:text-sky-400"
        >
          Procurement Management System
        </p>

        <h1
          class="mb-8 text-4xl md:text-6xl lg:text-7xl
                 font-extrabold leading-tight
                 text-slate-900 dark:text-white
                 drop-shadow-xl"
        >
          ระบบ
          <span
            class="inline-block py-2
                   bg-gradient-to-r from-sky-500 to-cyan-400
                   bg-clip-text text-transparent"
          >
            จัดซื้อจัดจ้าง
          </span>
        </h1>

        <!-- Action Buttons -->
        <div class="flex flex-col md:flex-row gap-6 justify-center">
          <NuxtLink
            to="/asset-procurements"
            class="px-12 py-4 rounded-2xl text-lg font-semibold
                   bg-gradient-to-r from-sky-500 to-cyan-400
                   text-white shadow-xl
                   hover:shadow-2xl hover:-translate-y-1
                   transition-all duration-300"
          >
            จัดซื้อ / จัดจ้าง
          </NuxtLink>

          <NuxtLink
            to="/assets"
            class="px-10 py-4 rounded-2xl text-lg font-semibold
                   bg-white/80 dark:bg-slate-800
                   text-slate-900 dark:text-white
                   border border-slate-200 dark:border-slate-700
                   hover:bg-white dark:hover:bg-slate-700
                   hover:-translate-y-1
                   transition-all duration-300"
          >
            ทรัพย์สิน
          </NuxtLink>

          <NuxtLink
            to="/asset-repairs"
            class="px-10 py-4 rounded-2xl text-lg font-semibold
                   bg-white/80 dark:bg-slate-800
                   text-slate-900 dark:text-white
                   border border-slate-200 dark:border-slate-700
                   hover:bg-white dark:hover:bg-slate-700
                   hover:-translate-y-1
                   transition-all duration-300"
          >
            แจ้งซ่อม
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Feature Intro -->
    <section class="py-16 px-6 bg-gray-50 dark:bg-slate-800">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="mb-4 text-3xl md:text-4xl font-bold text-sky-500">
          ระบบที่ช่วยให้งานง่ายขึ้น
        </h2>
        <p class="max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
          จัดการทรัพย์สิน การซ่อม และการจัดซื้ออยู่ในที่เดียวกัน
          พร้อมตรวจสอบข้อมูลย้อนหลังได้อย่างเป็นระบบ
        </p>
      </div>
    </section>
  </UDashboardPanel>
</template>
