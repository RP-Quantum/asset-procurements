<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
});
useSeoMeta({
  title: "หน้าหลัก",
});
</script>
<template>
  <UDashboardPanel
    class="!p-0 !m-0
           bg-white text-gray-900
           dark:bg-slate-900 dark:text-white"
  >
    <template #header>
      <UDashboardNavbar title="หน้าหลัก" />
    </template>
    <section
      class="relative h-screen w-full bg-cover bg-center"
      style="background-image: url('/n3.png');"
    >
      <div
        class="absolute inset-0
               bg-gradient-to-br
               from-white/70 via-white/40 to-transparent
               dark:from-black/80 dark:via-black/60 dark:to-black/30"
      />
     <div
  class="relative z-10 h-full flex flex-col
         justify-center items-center
         text-center px-6
         -translate-y-16 md:-translate-y-24"
>
        <h1
          class="font-extrabold
                 text-4xl md:text-6xl lg:text-7xl
                 leading-tight tracking-tight
                 drop-shadow-xl"
        >
          ระบบงานทรัพย์สินสารสนเทศ <br />
          <span
            class="bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400
                   
                   bg-clip-text text-transparent"
          >
            การจัดซื้อจัดจ้าง
          </span>
        </h1>
        <p
          class="mt-6 max-w-2xl text-sm md:text-base
                 text-black dark:text-white/80
                 leading-relaxed"
        >
          ระบบบริหารจัดการทรัพย์สินและการจัดซื้อจัดจ้างของการไฟฟ้าส่วนภูมิภาคเขต 3 ภาคเหนือ
        </p>
        <div class="mt-10 flex flex-wrap justify-center gap-5">
          <NuxtLink
            to="assets/"
            class="px-10 py-4 rounded-2xl
                   bg-gradient-to-r from-blue-500 to-cyan-500
                   hover:scale-105 hover:shadow-cyan-500/40
                   text-white shadow-xl
                   transition duration-300"
          >
            จัดการทรัพย์สิน
          </NuxtLink>
          <NuxtLink
          to="assets-repair/"
            class="px-10 py-4 rounded-2xl
                   bg-gradient-to-r from-blue-500 to-cyan-500
                   hover:scale-105 hover:shadow-cyan-500/40
                   text-white shadow-xl
                   transition duration-300"
          >
            แจ้งซ่อมทรัพย์สิน
          </NuxtLink>
          <NuxtLink
          to="procurements/"
            class="px-10 py-4 rounded-2xl
                   bg-gradient-to-r from-blue-500 to-cyan-500
                   hover:scale-105 hover:shadow-cyan-500/40
                   text-white shadow-xl
                   transition duration-300"
          >
            จัดซื้ออะไหร่ทรัพย์สิน
          </NuxtLink>
        </div>
      </div>
      <div
        class="absolute bottom-8 left-1/2 -translate-x-1/2 
               w-[95%] md:w-[90%] max-w-6xl
               rounded-3xl
               backdrop-blur-2xl
               border
               shadow-[0_10px_40px_rgba(0,0,0,0.25)]
               
               bg-white/60 border-white/30 text-gray-800
               dark:bg-white/10 dark:border-white/20 dark:text-white"
      >
        <div
          class="px-6 md:px-12 py-6
                 grid grid-cols-1 md:grid-cols-3
                 items-center gap-6"
        >
          <div>
            <p class="font-semibold text-lg">
              ระบบทรัพย์สินองค์กร
            </p>
            <p class="text-sm opacity-80 mt-2 leading-relaxed">
              ครอบคลุมงานทรัพย์สิน แจ้งซ่อม และจัดซื้อ
              ภายในระบบเดียว
            </p>
          </div>
          <div
            class="flex justify-center gap-12 text-center
                   md:border-l md:border-r
                   border-gray-300 dark:border-white/20
                   px-6"
          >
            <div class="hover:scale-110 transition cursor-pointer">
              <UIcon name="i-heroicons-computer-desktop" class="text-3xl mb-1" />
              <p class="text-xs">ทรัพย์สิน</p>
            </div>
            <div class="hover:scale-110 transition cursor-pointer">
              <UIcon name="i-heroicons-wrench-screwdriver" class="text-3xl mb-1" />
              <p class="text-xs">แจ้งซ่อม</p>
            </div>
            <div class="hover:scale-110 transition cursor-pointer">
              <UIcon name="i-heroicons-shopping-cart" class="text-3xl mb-1" />
              <p class="text-xs">จัดซื้อ</p>
            </div>
          </div>
<div class="text-right">
  <p class="text-sm opacity-80">
    ติดต่อเจ้าหน้าที่
  </p>
  <p class="mt-2 text-sm font-medium leading-relaxed">
    การไฟฟ้าส่วนภูมิภาคเขต 3 ภาคเหนือ <br />
    <span class="text-xs opacity-70">
      ฝ่ายสนับสนุนงาน แผนกปฏิบัติการดิจิทัลและการสื่อสาร
    </span>
  </p>
  <button
    class="mt-4 px-6 py-2 rounded-full
           bg-gradient-to-r from-sky-500 to-blue-600
           hover:scale-105
           text-white
           transition flex items-center gap-2 ml-auto
           shadow-lg"
  >
    <span>📞</span>
    <span class="font-medium">10370-74</span>
  </button>
</div>
        </div>
      </div>
    </section>
  </UDashboardPanel>
</template>