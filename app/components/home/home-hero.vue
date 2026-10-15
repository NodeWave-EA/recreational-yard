<script setup lang="ts">
import { useGallery } from '~/composables/useGallery'

const { allImages, fetchAllImages } = useGallery()

onMounted(async () => {
  await fetchAllImages()
  startAutoScroll()
})

const AUTO_SCROLL_MS = 4000
const activeIndex = ref(0)
let scrollTimer: ReturnType<typeof setInterval> | null = null

const fallbackImages = [
  { url: '/images/archery.jpg', caption: 'Archery Range', category: 'RECREATION' },
  { url: '/images/tennis.jpg', caption: 'Tennis on Lawn', category: 'SPORTS' },
  { url: '/images/kericho-landscape.jpg', caption: 'Tea Garden Stroll', category: 'NATURE' },
]

const galleryList = computed(() => {
  return allImages.value.length > 0 ? allImages.value : fallbackImages
})

const visibleImages = computed(() => {
  const list = galleryList.value
  if (list.length === 0)
    return []

  const total = list.length
  const prevIdx = (activeIndex.value - 1 + total) % total
  const currIdx = activeIndex.value % total
  const nextIdx = (activeIndex.value + 1) % total

  return [
    { ...list[prevIdx], originalIndex: prevIdx, position: 'prev' },
    { ...list[currIdx], originalIndex: currIdx, position: 'active' },
    { ...list[nextIdx], originalIndex: nextIdx, position: 'next' },
  ]
})

function nextSlide() {
  if (galleryList.value.length === 0)
    return
  activeIndex.value = (activeIndex.value + 1) % galleryList.value.length
}

function prevSlide() {
  if (galleryList.value.length === 0)
    return
  activeIndex.value = (activeIndex.value - 1 + galleryList.value.length) % galleryList.value.length
}

function selectSlide(index: number) {
  activeIndex.value = index
  resetAutoScroll()
}

function startAutoScroll() {
  if (import.meta.client && !scrollTimer) {
    scrollTimer = setInterval(nextSlide, AUTO_SCROLL_MS)
  }
}

function resetAutoScroll() {
  if (scrollTimer) {
    clearInterval(scrollTimer)
    scrollTimer = null
    startAutoScroll()
  }
}

onUnmounted(() => {
  if (scrollTimer)
    clearInterval(scrollTimer)
})
</script>

<template>
  <section class="relative min-h-[calc(100vh-var(--ui-header-height,4rem))] lg:h-[calc(100vh-var(--ui-header-height,4rem))] w-full flex flex-col justify-between bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white overflow-hidden transition-colors duration-300">
    <div class="relative z-10 flex-1 flex items-center py-2 sm:py-8 lg:py-4 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center w-full">
        <div class="lg:col-span-5 space-y-3 lg:space-y-4 text-left px-3 sm:px-0">
          <div class="inline-flex max-w-full">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold text-[10px] sm:text-xs uppercase tracking-widest px-2.5 py-1 rounded-md border border-lime-500/40"
            >
              <UIcon name="i-tabler-photo-sensors" class="size-3.5 sm:size-4 mr-1.5 text-lime-600 dark:text-lime-400 shrink-0" />
              <span class="truncate">DYNAMIC RECREATION GALLERY</span>
            </UBadge>
          </div>

          <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-tight sm:leading-[1.1]">
            Recreation, sport and shared experiences.
            <span class="block text-lime-600 dark:text-lime-400">
              Built for active living
            </span>
          </h1>

          <p class="max-w-xl text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-semibold">
            Explore our outdoor facilities dynamically captured across Kericho tea gardens, archery ranges, lawn sports, and running trails.
          </p>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2.5 sm:gap-3 pt-1">
            <UButton
              size="md"
              color="primary"
              to="/gallery"
              icon="i-tabler-photo"
              class="w-full sm:w-auto font-black uppercase text-xs text-neutral-950 px-6 py-3 sm:py-2.5 rounded-md shadow-xs cursor-pointer justify-center"
            >
              Full Gallery
            </UButton>

            <UButton
              size="md"
              color="neutral"
              variant="outline"
              to="/facilities"
              icon="i-tabler-trees"
              class="w-full sm:w-auto font-black uppercase text-xs rounded-md px-6 py-3 sm:py-2.5 cursor-pointer justify-center border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white hover:border-lime-500"
            >
              Explore Facilities
            </UButton>
          </div>
        </div>

        <div class="lg:col-span-7 relative w-full px-0">
          <div class="relative flex items-center justify-between gap-1 sm:gap-4 h-72 sm:h-80 lg:h-96 py-0 w-full">
            <div
              v-for="item in visibleImages"
              :key="item.url"
              class="relative transition-all duration-500 ease-out overflow-hidden cursor-pointer select-none shrink-0"
              :class="[
                item.position === 'active'
                  ? 'w-[84%] sm:w-1/2 h-full z-20 rounded-md sm:rounded-md border-2 border-lime-500 ring-2 ring-lime-500/40 shadow-xs'
                  : 'w-[7%] sm:w-1/4 h-[88%] sm:h-[82%] z-10 rounded-sm sm:rounded-md border-0 sm:border-2 border-neutral-200 dark:border-neutral-800 opacity-50 hover:opacity-90 grayscale-30 hover:grayscale-0',
              ]"
              @click="selectSlide(item.originalIndex)"
            >
              <NuxtImg
                :src="item.url"
                :alt="item.caption"
                width="800"
                height="1000"
                sizes="(max-width: 640px) 100vw, 400px"
                format="avif,webp"
                quality="85"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />

              <div
                class="absolute bottom-1.5 left-1.5 right-1.5 p-2 rounded-md bg-neutral-950/85 text-white backdrop-blur-md border border-neutral-800/80 transition-all duration-300"
                :class="[item.position === 'active' ? 'opacity-100' : 'opacity-0 sm:opacity-75']"
              >
                <span class="text-[9px] font-black uppercase tracking-widest text-lime-400 block truncate">
                  {{ item.category }}
                </span>
                <span class="text-xs font-bold text-white block truncate">
                  {{ item.caption }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 px-2 sm:px-0 w-full">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-tabler-chevron-left"
                size="xs"
                class="rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-lime-500 cursor-pointer p-1.5"
                @click="prevSlide"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-tabler-chevron-right"
                size="xs"
                class="rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-lime-500 cursor-pointer p-1.5"
                @click="nextSlide"
              />
              <span class="text-xs text-neutral-500 dark:text-neutral-400 font-mono ml-1 sm:ml-2">
                {{ activeIndex + 1 }} / {{ galleryList.length }}
              </span>
            </div>

            <div class="flex items-center gap-1 sm:gap-1.5 overflow-hidden max-w-xs">
              <button
                v-for="(_, idx) in galleryList.slice(0, 10)"
                :key="idx"
                class="h-1.5 rounded-md transition-all duration-300 cursor-pointer"
                :class="[activeIndex === idx ? 'w-5 sm:w-6 bg-lime-500' : 'w-1 sm:w-1.5 bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-400 dark:hover:bg-neutral-600']"
                @click="selectSlide(idx)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
