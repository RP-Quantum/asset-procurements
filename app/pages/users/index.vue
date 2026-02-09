<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
})

useSeoMeta({
	title: "ผู้ใช้",
});

const { data: userData, refresh } = await useFetch("/api/users");
const users = computed(() => userData.value?.data);
</script>

<template>
	<UDashboardPanel>
		<template #header>
			<UDashboardNavbar title="ผู้ใช้" />
		</template>

		<template #body>
			<UserTable
				class="border-default rounded border"
				:data="users || []"
				@role-updated="refresh"
			/>
		</template>
	</UDashboardPanel>
</template>
