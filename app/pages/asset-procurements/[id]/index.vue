<script setup lang="ts">
import { PROCUREMENT_DOCUMENTS } from "#shared/consts/procurement-documents";

definePageMeta({
	requiresAuth: true,
});

const props = defineProps<{
	data: SerializedAssetProcurement;
}>();

const documents = PROCUREMENT_DOCUMENTS;
</script>

<template>
	<section>
		<header>
			<h2 class="font-semibold">ดาวน์โหลดเอกสาร</h2>
		</header>

		<div>
			<ul>
				<li v-for="document in documents" :key="document.label" class="my-2">
					<UButton
						color="primary"
						:label="document.label"
						icon="lucide:download"
						variant="outline"
						external
						target="_blank"
						:to="`/api/asset-procurements/${props.data.id}/documents/${document.value}`"
					/>
				</li>
			</ul>

			<pre>
				{{ props.data.data }}
			</pre
			>
		</div>
	</section>
</template>
