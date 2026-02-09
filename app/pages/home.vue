<script setup lang="ts">
definePageMeta({
  requiresAuth: false,
})

useSeoMeta({
  title: "หน้าหลัก",
})
</script>

<template>
  <UDashboardPanel class="!p-0 !m-0 bg-white dark:bg-[#0f172b]">
 
    <!-- Header -->
    <template #header>
      <UDashboardNavbar title="หน้าหลัก" />
    </template>

    <!-- ================= Hero Section ================= -->
    <section
      class="relative w-full h-[89vh] bg-cover bg-center"
      style="background-image: url('/n3.png');"
    >
      <!-- Overlay ไล่เฉดแบบตัวอย่าง -->
      <div
        class="absolute inset-0
               bg-gradient-to-b
               from-[#0f172b]/70
               to-[#0f172b]/20"
      ></div>

      <!-- Content -->
      <div
        class="relative z-10 flex flex-col items-center justify-center
               h-full text-center px-6"
      >
        <!-- Title -->
        <h1
          class="text-5xl md:text-6xl lg:text-7xl
                 font-extrabold mb-8 drop-shadow-xl"
        >
          <span class="text-white">ระบบจัดซื้อ</span>
          <span class="text-[#00d492]">จัดจ้าง</span>
        </h1>

        <!-- Buttons -->
        <div class="flex flex-col md:flex-row gap-6">
          <!-- ปุ่มหลัก -->
          <NuxtLink
            to="/asset-procurements"
            class="px-10 py-4 rounded-xl
                   text-lg md:text-xl font-semibold
                   bg-[#00d492] text-[#0f172b]
                   shadow-xl
                   hover:bg-[#00b87a]
                   transition transform hover:-translate-y-1"
          >
            จัดซื้อ / จัดจ้าง
          </NuxtLink>

          <!-- ปุ่มรอง -->
          <NuxtLink
            to="/assets"
            class="px-10 py-4 rounded-xl
                   text-lg md:text-xl font-semibold
                   border-2 border-[#00d492]
                   text-[#00d492]
                   hover:bg-[#00d492]/20
                   transition transform hover:-translate-y-1"
          >
            ทรัพย์สิน
          </NuxtLink>

          <NuxtLink
            to="/asset-repairs"
            class="px-10 py-4 rounded-xl
                   text-lg md:text-xl font-semibold
                   border-2 border-[#00d492]
                   text-[#00d492]
                   hover:bg-[#00d492]/20
                   transition transform hover:-translate-y-1"
          >
            แจ้งซ่อม
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ================= Info Section ================= -->
    <section class="py-16 px-6 text-center bg-[#0f172b]">
      <h2
        class="text-2xl md:text-3xl font-bold mb-4 text-[#00d492]"
      >
        ระบบที่ช่วยให้งานของคุณง่ายขึ้น
      </h2>

      <p class="max-w-2xl mx-auto text-gray-300">
        ระบบจัดซื้อ/จัดจ้างถูกออกแบบมาเพื่อรองรับการทำงานในองค์กร
        ให้สามารถจัดการเอกสาร ตรวจสอบ และติดตามสถานะได้อย่างเป็นระบบ
        ลดเวลาและความยุ่งยากในการทำงาน
      </p>
    </section>
  </UDashboardPanel>
</template>
