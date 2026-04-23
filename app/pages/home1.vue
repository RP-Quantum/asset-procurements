<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
});

useSeoMeta({
  title: "หน้าการจัดซื้อ",
});
</script>

<template>
  <UDashboardPanel class="!p-0 !m-0 bg-white dark:bg-slate-900">
    
    <!-- Header -->
    <template #header>
      <UDashboardNavbar title="ระบบงานจัดซื้อ" />
    </template>

    <section class="p-6 bg-gradient-to-br from-purple-50 via-white to-yellow-50 
                    dark:from-slate-900 dark:to-slate-900 min-h-[85vh]">

      <div class="max-w-7xl mx-auto">

        <!-- Top Section -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

          <div>
            <h1 class="text-3xl font-extrabold text-purple-800 dark:text-purple-400">
              ตารางการจัดซื้อ
            </h1>
            <p class="text-slate-500 dark:text-slate-300 mt-2">
              แสดงรายการจัดซื้อทั้งหมดในระบบ
            </p>
          </div>

          <!-- Add Button -->
          <NuxtLink
            to="/asset-procurements/create"
            class="mt-4 md:mt-0 inline-block px-6 py-3 rounded-xl
                   bg-yellow-400 text-purple-900 font-semibold
                   shadow-lg hover:bg-yellow-300
                   transition-all duration-300"
          >
            + เพิ่มการจัดซื้อ
          </NuxtLink>

        </div>

        <!-- Search + Filter -->
        <div class="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="ค้นหารายการ..."
            class="w-full md:w-1/3 px-4 py-3 rounded-xl border 
                   border-purple-200 focus:ring-2 focus:ring-purple-400
                   dark:bg-slate-800 dark:border-slate-700"
          />

          <select
            class="w-full md:w-1/4 px-4 py-3 rounded-xl border
                   border-purple-200 focus:ring-2 focus:ring-purple-400
                   dark:bg-slate-800 dark:border-slate-700"
          >
            <option value="">ทุกสถานะ</option>
            <option value="pending">รอดำเนินการ</option>
            <option value="approved">อนุมัติแล้ว</option>
            <option value="ordered">สั่งซื้อแล้ว</option>
            <option value="received">ได้รับสินค้าแล้ว</option>
          </select>
        </div>

        <!-- Table -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">

          <table class="min-w-full text-sm text-left">

            <thead class="bg-purple-700 text-white">
              <tr>
                <th class="px-6 py-4">เลขที่จัดซื้อ</th>
                <th class="px-6 py-4">รายการ</th>
                <th class="px-6 py-4">งบประมาณ</th>
                <th class="px-6 py-4">สถานะ</th>
                <th class="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">

              <tr class="hover:bg-purple-50 dark:hover:bg-slate-700 transition">
                <td class="px-6 py-4 font-medium">PR-0001</td>
                <td class="px-6 py-4">เปลี่ยนเมนบอร์ด</td>
                <td class="px-6 py-4">15,000 บาท</td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    รอดำเนินการ
                  </span>
                </td>
                <td class="px-6 py-4 text-center space-x-2">
                  <button class="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs hover:bg-purple-700">
                    ดู
                  </button>
                  <button class="px-3 py-1 rounded-lg bg-slate-200 text-xs hover:bg-slate-300">
                    แก้ไข
                  </button>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>
    </section>
  </UDashboardPanel>
</template>