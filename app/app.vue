<script setup lang="ts">
useSeoMeta({
	titleTemplate(title) {
		return title ? `${title} | HARPS` : "HARPS";
	},
});
</script>

<template>
	<UApp>
		<NuxtLoadingIndicator />

		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
