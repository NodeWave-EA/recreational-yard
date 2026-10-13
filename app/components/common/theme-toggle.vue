<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <ClientOnly>
    <UButton
      color="neutral"
      variant="ghost"
      size="md"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      :icon="isDark ? 'i-tabler-sun' : 'i-tabler-moon'"
      class="min-h-11 min-w-11 rounded-sm cursor-pointer justify-center text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
      @click="toggleTheme($event)"
    />
    <template #fallback>
      <div class="size-8 rounded-sm bg-neutral-200/50 dark:bg-neutral-800/50 animate-pulse" />
    </template>
  </ClientOnly>
</template>
