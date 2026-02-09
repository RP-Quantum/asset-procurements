<script setup lang="ts">
import { ORIGINAL_URL_COOKIE_NAME } from "#shared/consts/auth";

definePageMeta({
	layout: false,
	requiresAuth: false,
});

const route = useRoute();
const originalUrl = route.query.original as string | undefined;

const loading = ref(false);

function handleLogin() {
	loading.value = true;

	if (originalUrl) {
		const originalUrlCookie = useCookie(ORIGINAL_URL_COOKIE_NAME);
		originalUrlCookie.value = originalUrl;
	}
	navigateTo("/auth/login", { external: true });
}
</script>

<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 ">
		<UCard
			class="w-full max-w-sm text-center shadow-lg"
			:ui="{ body: 'space-y-4' }"
		>
			<!--ไอคอน-->
			<div
				class="mx-auto w-14 h-14 flex items-center justify-center rounded-full
				       bg-primary/10 text-primary"
			>
				<UIcon name="lucide:lock" class="w-7 h-7" />
			</div>
			<h1 class="text-xl font-semibold">
				เข้าสู่ระบบ
			</h1> 
			<p class="text-sm text-gray-500 dark:text-gray-400">
				กรุณาเข้าสู่ระบบก่อนใช้งานระบบ
			</p>
			<UButton
				size="lg"
				color="primary"
				block
				:loading="loading"
				icon="lucide:log-in"
				@click="handleLogin"
			>
				เข้าสู่ระบบ
			</UButton>
		</UCard>
	</div>
</template>
