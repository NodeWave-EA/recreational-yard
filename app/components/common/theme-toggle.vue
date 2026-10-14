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
      class="min-h-11 min-w-11 rounded-sm cursor-pointer justify-center text-muted hover:text-muted dark:hover:text-inverted"
      @click="toggleTheme($event)"
    />
    <template #fallback>
      <div class="size-8 rounded-sm bg-elevated/50 animate-pulse" />
    </template>
  </ClientOnly>
</template>
