<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  legend?: string;
  collapsible?: boolean;
}>();
const UCollapsible = resolveComponent("UCollapsible");
const open = ref(true);
function toggleCollapse() {
  open.value = !open.value;
}
</script>
<template>
  <fieldset class="border-default dark:border-default/50 rounded border">
    <legend v-if="props.legend" class="mx-2 px-2 sm:mx-3 sm:px-3">
      <UButton
        v-if="props.collapsible"
        class="px-0"
        color="neutral"
        variant="link"
        :trailing-icon="open ? 'lucide:chevron-up' : 'lucide:chevron-down'"
        @click="toggleCollapse"
      >
        {{ props.legend }}
      </UButton>
      <span v-else class="text-sm font-medium">{{ props.legend }}</span>
    </legend>
    <UCollapsible v-if="props.collapsible" v-model:open="open">
      <template #content>
        <div v-bind="$attrs" class="p-4 sm:p-6">
          <slot />
        </div>
      </template>
    </UCollapsible>
    <div v-else v-bind="$attrs" class="p-4 sm:p-6">
      <slot />
    </div>
  </fieldset>
</template>
