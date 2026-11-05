<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { ANNOUNCEMENT_BAR } from '~/utils/site-data'

const containerRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const isOverflowing = ref(false)

function checkOverflow() {
  if (containerRef.value && textRef.value) {
    isOverflowing.value = textRef.value.scrollWidth > containerRef.value.clientWidth
  }
}

useResizeObserver(containerRef, checkOverflow)
onMounted(checkOverflow)
</script>

<template>
  <aside
    aria-label="Announcement Bar"
    class="relative border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900/70 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors overflow-hidden w-full"
  >
    <UContainer class="flex items-center justify-between gap-3 py-1.5 px-3 sm:px-6 lg:px-8">
      <div ref="containerRef" class="relative flex-1 overflow-hidden min-w-0">
        <div
          ref="textRef"
          class="whitespace-nowrap transition-all duration-300 font-medium"
          :class="[
            isOverflowing ? 'animate-marquee hover:[animation-play-state:paused]' : 'text-left sm:text-center',
          ]"
        >
          <span class="inline-block pr-8">{{ ANNOUNCEMENT_BAR.text }}</span>
          <span v-if="isOverflowing" class="inline-block pr-8" aria-hidden="true">{{ ANNOUNCEMENT_BAR.text }}</span>
        </div>
      </div>

      <NuxtLink
        :to="ANNOUNCEMENT_BAR.ctaLink"
        class="shrink-0 rounded-xs bg-lime-500 hover:bg-lime-400 text-neutral-950 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-black uppercase transition-colors whitespace-nowrap cursor-pointer"
      >
        {{ ANNOUNCEMENT_BAR.ctaText }}
      </NuxtLink>
    </UContainer>
  </aside>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: inline-flex;
  width: max-content;
  animation: marquee 18s linear infinite;
}
</style>
