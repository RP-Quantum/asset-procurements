<section class="relative min-h-[350px] sm:min-h-[400px] lg:h-[550px] w-full flex items-center justify-center overflow-hidden">
  <!-- bg -->
  <div
    class="absolute inset-0 w-full h-full bg-cover bg-center scale-105 transition-transform duration-[10s] hover:scale-100"
    style="background-image: url('/n3.png');"
  ></div>

  <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-slate-50 dark:to-gray-950"></div>

  <!-- content -->
  <div class="relative z-10 px-4 sm:px-6 text-center w-full">
    <div
      class="mx-auto
             px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12
             rounded-3xl sm:rounded-[2.5rem]
             bg-white/10 dark:bg-black/20
             backdrop-blur-2xl
             border border-white/30 dark:border-white/10
             shadow-[0_20px_50px_rgba(0,0,0,0.3)]
             max-w-xs sm:max-w-xl lg:max-w-3xl"
    >
      <UIcon name="i-heroicons-wrench-screwdriver"
        class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-cyan-400 mb-4 sm:mb-6 mx-auto animate-pulse" />

      <h1 class="text-2xl sm:text-4xl lg:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight text-white uppercase">
        การแจ้งซ่อมทรัพย์สิน
      </h1>

      <span class="block text-sm sm:text-base lg:text-lg text-cyan-300 font-medium tracking-widest uppercase">
        Asset Repair Management
      </span>
    </div>
  </div>
</section>


<!-- CARD SECTION -->
<section class="relative z-20 -mt-10 sm:-mt-16 lg:-mt-20 pb-16 sm:pb-20 px-4 sm:px-6">
  <div class="max-w-6xl mx-auto">

    <!-- grid -->
    <div class="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

      <!-- CARD -->
      <div 
        @click="openRepair"
        class="group cursor-pointer p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      >
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-500 transition-colors">
          <UIcon name="i-heroicons-plus-circle" class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 group-hover:text-white" />
        </div>

        <h3 class="text-lg sm:text-xl font-bold mb-2 dark:text-white">แจ้งซ่อมใหม่</h3>

        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          บันทึกข้อมูลอาการเสีย และรายละเอียดอุปกรณ์
        </p>

        <div class="mt-4 sm:mt-6 flex items-center text-blue-600 font-semibold text-xs sm:text-sm">
          เริ่มต้นใช้งาน <UIcon name="i-heroicons-arrow-right" class="ml-2 w-4 h-4" />
        </div>
      </div>


      <!-- CARD 2 -->
      <NuxtLink 
        to="/asset-repairs/read"
        class="group p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      >
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-cyan-500 transition-colors">
          <UIcon name="i-heroicons-list-bullet" class="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600 group-hover:text-white" />
        </div>

        <h3 class="text-lg sm:text-xl font-bold mb-2 dark:text-white">รายการทั้งหมด</h3>

        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          ตรวจสอบสถานะงานซ่อม และติดตามความคืบหน้า
        </p>

        <div class="mt-4 sm:mt-6 flex items-center text-cyan-600 font-semibold text-xs sm:text-sm">
          ดูรายการซ่อม <UIcon name="i-heroicons-arrow-right" class="ml-2 w-4 h-4" />
        </div>
      </NuxtLink>


      <!-- CARD 3 -->
      <NuxtLink
        to="/asset-procurements"
        class="group p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      >
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-indigo-500 transition-colors">
          <UIcon name="i-heroicons-document-text" class="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 group-hover:text-white" />
        </div>

        <h3 class="text-lg sm:text-xl font-bold mb-2 dark:text-white">จัดทำเอกสารจัดซื้อ</h3>

        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          ออกเอกสารขออนุมัติซื้ออุปกรณ์
        </p>

        <div class="mt-4 sm:mt-6 flex items-center text-indigo-600 font-semibold text-xs sm:text-sm">
          สร้างเอกสาร <UIcon name="i-heroicons-arrow-right" class="ml-2 w-4 h-4" />
        </div>
      </NuxtLink>

    </div>

  </div>
</section>
