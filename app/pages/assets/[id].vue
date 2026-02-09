<script setup lang="ts">
const route = useRoute();
const assetId = route.params.id as string;

definePageMeta({
	requiresAuth: true,
});

const assetService = useAssetService();
const { data: asset, error } = await useAsyncData(() =>
	assetService.getAssetById(assetId),
);

useSeoMeta({
	title: asset.value?.data.tag
		? `ทรัพย์สิน - ${asset.value.data.tag}`
		: "ทรัพย์สิน",
});

if (error.value) {
	throw createError({
		statusCode: 404,
		message: "ไม่พบทรัพย์สินที่ค้นหา",
	});
}
</script>

<template>
	<UDashboardPanel v-if="asset">
		<template #header>
			<UDashboardNavbar :title="`ทรัพย์สิน - ${asset.data.tag}`">
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
			<div class="mx-auto max-w-4xl space-y-6 p-6">
				<!-- Asset Header -->
				<div class="border-default bg-card rounded-lg border p-6">
					<h2 class="mb-4 text-2xl font-bold">{{ asset.data.tag }}</h2>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label class="text-muted-foreground block text-sm">{{
								getAssetFieldLabel("type")
							}}</label>
							<p class="text-foreground font-medium">{{ asset.data.type }}</p>
						</div>
						<div>
							<label class="text-muted-foreground block text-sm">{{
								getAssetFieldLabel("department")
							}}</label>
							<p class="text-foreground font-medium">
								{{ asset.data.department.name }}
							</p>
						</div>
					</div>
				</div>

				<!-- Asset Details -->
				<div class="border-default bg-card rounded-lg border p-6">
					<h3 class="mb-4 text-lg font-semibold">รายละเอียด</h3>
					<div class="space-y-4">
						<div v-if="asset.data.brand" class="grid gap-2 sm:grid-cols-3">
							<label class="text-muted-foreground text-sm">{{
								getAssetFieldLabel("brand")
							}}</label>
							<p class="text-foreground sm:col-span-2">
								{{ asset.data.brand }}
							</p>
						</div>
						<div v-if="asset.data.model" class="grid gap-2 sm:grid-cols-3">
							<label class="text-muted-foreground text-sm">{{
								getAssetFieldLabel("model")
							}}</label>
							<p class="text-foreground sm:col-span-2">
								{{ asset.data.model }}
							</p>
						</div>
						<div
							v-if="asset.data.serialNumber"
							class="grid gap-2 sm:grid-cols-3"
						>
							<label class="text-muted-foreground text-sm">{{
								getAssetFieldLabel("serialNumber")
							}}</label>
							<p class="text-foreground sm:col-span-2">
								{{ asset.data.serialNumber }}
							</p>
						</div>
						<div v-if="asset.data.owner" class="grid gap-2 sm:grid-cols-3">
							<label class="text-muted-foreground text-sm">{{
								getAssetFieldLabel("owner")
							}}</label>
							<p class="text-foreground sm:col-span-2">
								{{ asset.data.owner }}
							</p>
						</div>
						<div v-if="asset.data.details" class="grid gap-2 sm:grid-cols-3">
							<label class="text-muted-foreground text-sm">{{
								getAssetFieldLabel("details")
							}}</label>
							<p class="text-foreground sm:col-span-2">
								{{ asset.data.details }}
							</p>
						</div>
					</div>
				</div>

				<!-- Contract Information -->
				<div
					v-if="asset.data.contractNumber || asset.data.contractEndDate"
					class="border-default bg-card rounded-lg border p-6"
				>
					<h3 class="mb-4 text-lg font-semibold">ข้อมูลสัญญา</h3>
					<div class="space-y-4">
						<div
							v-if="asset.data.contractNumber"
							class="grid gap-2 sm:grid-cols-3"
						>
							<label class="text-muted-foreground text-sm">{{
								getAssetFieldLabel("contractNumber")
							}}</label>
							<p class="text-foreground sm:col-span-2">
								{{ asset.data.contractNumber }}
							</p>
						</div>
						<div
							v-if="asset.data.contractEndDate"
							class="grid gap-2 sm:grid-cols-3"
						>
							<label class="text-muted-foreground text-sm">{{
								getAssetFieldLabel("contractEndDate")
							}}</label>
							<p class="text-foreground sm:col-span-2">
								{{ asset.data.contractEndDate }}
							</p>
						</div>
					</div>
				</div>

				<!-- Department Details -->
				<div class="border-default bg-card rounded-lg border p-6">
					<h3 class="mb-4 text-lg font-semibold">หน่วยงาน</h3>
					<div class="space-y-4">
						<div class="grid gap-2 sm:grid-cols-3">
							<label class="text-muted-foreground text-sm">ชื่อหน่วยงาน</label>
							<p class="text-foreground sm:col-span-2">
								{{ asset.data.department.name }}
							</p>
						</div>
						<div class="grid gap-2 sm:grid-cols-3">
							<label class="text-muted-foreground text-sm">สถานที่</label>
							<p class="text-foreground sm:col-span-2">
								{{ asset.data.department.location.name }}
							</p>
						</div>
					</div>
				</div>
					<!-- เพิ่มส่วนของการซ่อม ด้านล่วงนี้-->
			</div>
		</template>
	</UDashboardPanel>
</template>
