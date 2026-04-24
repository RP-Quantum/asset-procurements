<script setup lang="ts">
const route = useRoute();
const assetId = route.params.id as string;

definePageMeta({
  requiresAuth: true,
});

const assetService = useAssetService();

/* ---------------- FETCH ---------------- */
const {
  data: asset,
  error,
  pending,
} = await useAsyncData(`asset-${assetId}`, () =>
  assetService.getAssetById(assetId)
);

/* ---------------- SEO (แก้ให้ reactive) ---------------- */
watchEffect(() => {
  useSeoMeta({
    title: asset.value?.data?.tag
      ? `ทรัพย์สิน - ${asset.value.data.tag}`
      : "ทรัพย์สิน",
  });
});

/* ---------------- ERROR ---------------- */
if (error.value) {
  throw createError({
    statusCode: 404,
    message: "ไม่พบทรัพย์สินที่ค้นหา",
  });
}

/* ---------------- FORMAT ---------------- */
const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("th-TH");
};
</script>

<template>
  <UDashboardPanel>
    <!-- HEADER -->
    <template #header>
      <UDashboardNavbar
        :title="asset?.data?.tag ? `ทรัพย์สิน - ${asset.data.tag}` : 'กำลังโหลด...'"
      >
        <template #left>
          <UButton
            color="neutral"
            variant="ghost"
            icon="lucide:arrow-left"
            to="/assets"
          >
            กลับ
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto max-w-5xl px-4 sm:px-6 py-6 space-y-6">

        <!-- LOADING -->
        <div v-if="pending" class="space-y-4">
          <USkeleton class="h-24 w-full rounded-xl" />
          <USkeleton class="h-40 w-full rounded-xl" />
          <USkeleton class="h-40 w-full rounded-xl" />
        </div>

        <!-- CONTENT -->
        <template v-else-if="asset">

          <!-- HEADER CARD -->
          <div class="bg-white dark:bg-gray-900 border rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 class="text-xl sm:text-2xl font-bold mb-4 break-words">
              {{ asset.data.tag }}
            </h2>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="text-xs sm:text-sm text-gray-400">
                  {{ getAssetFieldLabel("type") }}
                </label>
                <p class="font-medium">{{ asset.data.type || "-" }}</p>
              </div>

              <div>
                <label class="text-xs sm:text-sm text-gray-400">
                  {{ getAssetFieldLabel("department") }}
                </label>
                <p class="font-medium">
                  {{ asset.data.department?.name || "-" }}
                </p>
              </div>
            </div>
          </div>

          <!-- DETAILS -->
          <div class="bg-white dark:bg-gray-900 border rounded-2xl p-5 sm:p-6 shadow-sm">
            <h3 class="text-lg font-semibold mb-4">รายละเอียด</h3>

            <div class="space-y-3 text-sm sm:text-base">

              <div class="grid sm:grid-cols-3 gap-2">
                <span class="text-gray-400">Brand</span>
                <span class="sm:col-span-2">{{ asset.data.brand || "-" }}</span>
              </div>

              <div class="grid sm:grid-cols-3 gap-2">
                <span class="text-gray-400">Model</span>
                <span class="sm:col-span-2">{{ asset.data.model || "-" }}</span>
              </div>

              <div class="grid sm:grid-cols-3 gap-2">
                <span class="text-gray-400">S/N</span>
                <span class="sm:col-span-2">{{ asset.data.serialNumber || "-" }}</span>
              </div>

              <div class="grid sm:grid-cols-3 gap-2">
                <span class="text-gray-400">Owner</span>
                <span class="sm:col-span-2">{{ asset.data.owner || "-" }}</span>
              </div>

              <div v-if="asset.data.details" class="grid sm:grid-cols-3 gap-2">
                <span class="text-gray-400">รายละเอียดเพิ่มเติม</span>
                <span class="sm:col-span-2">{{ asset.data.details }}</span>
              </div>

            </div>
          </div>

          <!-- CONTRACT -->
          <div
            v-if="asset.data.contractNumber || asset.data.contractEndDate"
            class="bg-white dark:bg-gray-900 border rounded-2xl p-5 sm:p-6 shadow-sm"
          >
            <h3 class="text-lg font-semibold mb-4">ข้อมูลสัญญา</h3>

            <div class="space-y-3 text-sm sm:text-base">

              <div v-if="asset.data.contractNumber" class="grid sm:grid-cols-3 gap-2">
                <span class="text-gray-400">เลขสัญญา</span>
                <span class="sm:col-span-2">{{ asset.data.contractNumber }}</span>
              </div>

              <div v-if="asset.data.contractEndDate" class="grid sm:grid-cols-3 gap-2">
                <span class="text-gray-400">วันหมดสัญญา</span>
                <span class="sm:col-span-2">
                  {{ formatDate(asset.data.contractEndDate) }}
                </span>
              </div>

            </div>
          </div>

          <!-- DEPARTMENT -->
          <div class="bg-white dark:bg-gray-900 border rounded-2xl p-5 sm:p-6 shadow-sm">
            <h3 class="text-lg font-semibold mb-4">หน่วยงาน</h3>

            <div class="space-y-3 text-sm sm:text-base">

              <div class="grid sm:grid-cols-3 gap-2">
                <span class="text-gray-400">ชื่อหน่วยงาน</span>
                <span class="sm:col-span-2">
                  {{ asset.data.department?.name || "-" }}
                </span>
              </div>

              <div class="grid sm:grid-cols-3 gap-2">
                <span class="text-gray-400">สถานที่</span>
                <span class="sm:col-span-2">
                  {{ asset.data.department?.location?.name || "-" }}
                </span>
              </div>

            </div>
          </div>

        </template>
      </div>
    </template>
  </UDashboardPanel>
</template>