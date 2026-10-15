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
      class="min-h-10 min-w-10 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 cursor-pointer justify-center text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
      @click="toggleTheme($event)"
    />
    <template #fallback>
      <div class="size-10 rounded-md bg-neutral-200/50 dark:bg-neutral-800/50 animate-pulse border border-neutral-200/80 dark:border-neutral-800/80" />
    </template>
  </ClientOnly>
</template>
