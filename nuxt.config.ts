export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-auth-utils"
  ],
  ui: {
    fonts: false // <--ปิดการโหลดฟอนต์ออนไลน์
  }, 
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  runtimeConfig: {
    databaseUrl: process.env.NUXT_DATABASE_URL,
  },
  css: ["~/assets/css/main.css"],
});
