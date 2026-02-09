<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
})

useSeoMeta({
  title: "หน้าหลัก | ระบบแจ้งซ่อมและจัดซื้อ",
})
</script>

<template>
  <UDashboardPanel class="!p-0 !m-0 bg-slate-50 dark:bg-slate-900">
    <!-- Header -->
    <template #header>
      <UDashboardNavbar title="หน้าหลัก" />
    </template>

    <!-- Hero -->
    <section
      class="relative min-h-screen bg-cover bg-center"
      style="background-image: url('/n3.png')"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-br
               from-slate-950/90 via-slate-900/70 to-slate-950/90"
      />

      <!-- Content -->
      <div class="relative z-10 flex min-h-screen items-center">
        <div class="mx-auto w-full max-w-7xl px-6">
          <!-- Title -->
          <div class="mb-16 text-center">
            <UBadge
              color="sky"
              variant="soft"
              class="mb-6 px-5 py-1 text-sm tracking-wide"
            >
              Asset & Repair Management System
            </UBadge>

            <h1
              class="mb-6 text-4xl md:text-6xl lg:text-7xl
                     font-extrabold text-white drop-shadow-xl"
            >
              ระบบแจ้งซ่อมและจัดซื้อ
            </h1>

            <p
              class="mx-auto max-w-3xl
                     text-base md:text-lg
                     text-slate-200 leading-relaxed"
            >
              บริหารจัดการการแจ้งซ่อม การติดตามสถานะ
              และการจัดซื้อจัดจ้าง อย่างเป็นระบบ
              โปร่งใส และเหมาะกับการใช้งานในองค์กร
            </p>
          </div>

          <!-- Cards -->
          <section class="grid gap-8 md:grid-cols-3">
            <!-- Add Repair -->
            <NuxtLink
              to="/repairs/create"
              class="group block rounded-3xl
                     border border-white/10
                     bg-white/80 p-7 backdrop-blur-xl
                     shadow-xl transition-all duration-300
                     hover:-translate-y-1 hover:shadow-2xl
                     dark:bg-slate-900/80 dark:border-slate-700"
            >
              <div
                class="mb-5 flex h-14 w-14 items-center justify-center
                       rounded-2xl bg-blue-100 text-3xl text-blue-600
                       dark:bg-blue-900/40 dark:text-blue-400"
              >
                🔧
              </div>

              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                เพิ่มการแจ้งซ่อม
              </h2>

              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                แจ้งปัญหาทรัพย์สินหรืออุปกรณ์ในระบบ
              </p>

              <div
                class="mt-7 inline-flex items-center gap-2
                       text-sm font-medium text-blue-600
                       dark:text-blue-400"
              >
                แจ้งซ่อมใหม่ →
              </div>
            </NuxtLink>

            <!-- Repair List -->
            <NuxtLink
              to="/repairs"
              class="group block rounded-3xl
                     border border-white/10
                     bg-white/80 p-7 backdrop-blur-xl
                     shadow-xl transition-all duration-300
                     hover:-translate-y-1 hover:shadow-2xl
                     dark:bg-slate-900/80 dark:border-slate-700"
            >
              <div
                class="mb-5 flex h-14 w-14 items-center justify-center
                       rounded-2xl bg-gray-100 text-3xl text-gray-700
                       dark:bg-gray-800 dark:text-gray-300"
              >
                📋
              </div>

              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                รายการแจ้งซ่อม
              </h2>

              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                ตรวจสอบ แก้ไข และติดตามสถานะการแจ้งซ่อม
              </p>

              <div
                class="mt-7 inline-flex items-center gap-2
                       text-sm font-medium text-gray-700
                       dark:text-gray-300"
              >
                ดูรายการ →
              </div>
            </NuxtLink>

            <!-- Procurement -->
            <NuxtLink
              to="/procurements"
              class="group block rounded-3xl
                     border border-white/10
                     bg-white/80 p-7 backdrop-blur-xl
                     shadow-xl transition-all duration-300
                     hover:-translate-y-1 hover:shadow-2xl
                     dark:bg-slate-900/80 dark:border-slate-700"
            >
              <div
                class="mb-5 flex h-14 w-14 items-center justify-center
                       rounded-2xl bg-emerald-100 text-3xl text-emerald-600
                       dark:bg-emerald-900/40 dark:text-emerald-400"
              >
                🧾
              </div>

              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                การจัดซื้อจัดจ้าง
              </h2>

              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                จัดซื้อจากรายการแจ้งซ่อมที่ผ่านการอนุมัติ
              </p>

              <div
                class="mt-7 inline-flex items-center gap-2
                       text-sm font-medium text-emerald-600
                       dark:text-emerald-400"
              >
                ไปหน้าการจัดซื้อ →
              </div>
            </NuxtLink>
          </section>
        </div>
      </div>
    </section>
  </UDashboardPanel>
</template>
