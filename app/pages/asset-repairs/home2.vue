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
      <!-- Overlay Gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-b
               from-black/60 via-black/40 to-black/70"
      ></div>

      <!-- Content -->
      <div
        class="relative z-10 flex flex-col items-center justify-center
               h-full text-center px-6"
      >
        <h1
          class="mb-6 text-4xl md:text-6xl lg:text-7xl
                 font-extrabold leading-tight
                 text-white drop-shadow-2xl"
        >
          ระบบแจ้งซ่อมและจัดการทรัพย์สิน
        </h1>

        <p
          class="max-w-2xl text-base md:text-lg
                 text-gray-200 mb-10 leading-relaxed"
        >
          แจ้งซ่อมอุปกรณ์ ติดตามสถานะ และบริหารจัดการข้อมูล
          ได้อย่างสะดวก รวดเร็ว และเป็นระบบในที่เดียว
        </p>

        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink
            to="/repairs/create"
            class="px-8 py-4 rounded-full
                   bg-indigo-600 text-white font-semibold
                   shadow-lg shadow-indigo-600/30
                   hover:bg-indigo-700 hover:scale-105
                   transition-all duration-300"
          >
            ➕ เพิ่มการแจ้งซ่อม
          </NuxtLink>

          <NuxtLink
            to="/repairs"
            class="px-8 py-4 rounded-full
                   bg-white/90 backdrop-blur
                   text-gray-800 font-semibold
                   shadow-md
                   hover:bg-white hover:scale-105
                   transition-all duration-300"
          >
            📋 รายการแจ้งซ่อม
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Feature Intro -->
    <section class="py-20 px-6 bg-gray-50 dark:bg-slate-800">
      <div class="max-w-6xl mx-auto text-center">
        <h2
          class="mb-4 text-3xl md:text-4xl
                 font-bold text-sky-600 dark:text-sky-400"
        >
          ระบบที่ช่วยให้งานง่ายขึ้น
        </h2>

        <p
          class="max-w-2xl mx-auto
                 text-slate-600 dark:text-slate-300
                 leading-relaxed"
        >
          จัดการทรัพย์สิน การซ่อม และการจัดซื้อ
          ไว้ในระบบเดียว พร้อมตรวจสอบข้อมูลย้อนหลัง
          ได้อย่างเป็นระบบและโปร่งใส
        </p>
      </div>
    </section>
  </UDashboardPanel>
</template>
