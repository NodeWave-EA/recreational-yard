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
    class="relative border-b border-neutral-200/80 bg-neutral-100 text-xs font-medium text-neutral-800 transition-colors dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-200 overflow-hidden"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-1.5 sm:px-6">
      <!-- Scrolling Marquee or Static Text Container -->
      <div ref="containerRef" class="relative flex-1 overflow-hidden min-w-0">
        <div
          ref="textRef"
          class="whitespace-nowrap transition-all duration-300"
          :class="[
            isOverflowing ? 'animate-marquee hover:[animation-play-state:paused]' : 'text-center md:text-left',
          ]"
        >
          <span class="inline-block pr-8">{{ ANNOUNCEMENT_BAR.text }}</span>
          <span v-if="isOverflowing" class="inline-block pr-8" aria-hidden="true">{{ ANNOUNCEMENT_BAR.text }}</span>
        </div>
      </div>

      <!-- CTA Button -->
      <NuxtLink
        :to="ANNOUNCEMENT_BAR.ctaLink"
        class="shrink-0 rounded-sm bg-lime-500 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-black uppercase text-neutral-950 shadow-xs transition-transform hover:scale-105 hover:bg-lime-400 focus-visible:outline-2 focus-visible:outline-lime-600 dark:bg-lime-400 dark:hover:bg-lime-300 whitespace-nowrap"
      >
        {{ ANNOUNCEMENT_BAR.ctaText }}
      </NuxtLink>
    </div>
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
