export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  
  // 1. เพิ่มโหมดการทำงาน (ถ้าไม่มี Backend Server ให้รัน)
  ssr: false, 

  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-auth-utils"
  ],

  ui: {
    fonts: false 
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  // 2. ถ้าใช้ Render แบบ Static ให้ย้ายค่าที่จำเป็นไปที่ public
  // แต่ถ้าเป็นความลับ (เช่น Password DB) ห้ามใส่ตรงๆ นะครับ
  runtimeConfig: {
    public: {
      // ค่าที่ฝั่ง Browser สามารถเห็นได้
    },
    databaseUrl: process.env.NUXT_DATABASE_URL,
  },

  css: ["~/assets/css/main.css"],

  // 3. (เพิ่มเติม) สำหรับการ Build บน Render
  nitro: {
    preset: 'render_static'
  }
});