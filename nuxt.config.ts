export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // เปลี่ยนเป็น true เพื่อให้รองรับ Prisma และ Auth ได้สมบูรณ์
  ssr: true, 

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

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    },
    // ถ้ามี Database URL สำหรับ Prisma ให้ใส่ไว้ที่นี่ (ไม่ใส่ใน public)
    databaseUrl: process.env.NUXT_DATABASE_URL,
  },

  css: ["~/assets/css/main.css"],

  // ❌ ลบส่วน nitro preset ออกไปเลยครับ ❌
  // เพื่อให้ Render ตรวจจับเองว่าเป็น Web Service
});