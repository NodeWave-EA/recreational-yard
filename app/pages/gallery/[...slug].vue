<script setup lang="ts">
import { useGalleryLayout } from '~/composables/useGalleryLayout'
import { LOCATION_DETAILS } from '~/utils/site-data'

const route = useRoute()

// Query collection document using Nuxt Content v3
const { data: collection } = await useAsyncData(`gallery-doc-${route.path}`, () =>
  queryCollection('gallery').path(route.path).first())

if (!collection.value) {
  throw createError({ statusCode: 404, statusMessage: 'Gallery Collection Not Found' })
}

// Initialize layout composable
const {
  density,
  bgIntervalSeconds,
  masonryContainerClasses,
  masonryItemClasses,
  getPhotoAspectClass,
} = useGalleryLayout()

// Lightbox modal state & auto-centering ref
const activePhotoIndex = ref<number | null>(null)
const filmstripContainerRef = ref<HTMLElement | null>(null)

const activePhoto = computed(() =>
  activePhotoIndex.value !== null && collection.value?.photos ? collection.value.photos[activePhotoIndex.value] : null,
)

// Auto-scroll active thumbnail into the center of the filmstrip bar
function scrollToActiveThumbnail(index: number | null) {
  if (index === null || !filmstripContainerRef.value)
    return
  nextTick(() => {
    const activeThumb = filmstripContainerRef.value?.children[index] as HTMLElement
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  })
}

watch(activePhotoIndex, (newIndex) => {
  scrollToActiveThumbnail(newIndex)
})

function openPhoto(index: number) {
  activePhotoIndex.value = index
}

function closePhoto() {
  activePhotoIndex.value = null
}

function prevPhoto() {
  if (activePhotoIndex.value !== null && collection.value?.photos) {
    activePhotoIndex.value = (activePhotoIndex.value - 1 + collection.value.photos.length) % collection.value.photos.length
  }
}

function nextPhoto() {
  if (activePhotoIndex.value !== null && collection.value?.photos) {
    activePhotoIndex.value = (activePhotoIndex.value + 1) % collection.value.photos.length
  }
}

// Hero Background Loop
const heroBgIndex = ref(0)
let bgIntervalId: ReturnType<typeof setInterval> | null = null

const currentHeroImage = computed(() => {
  if (collection.value?.photos?.length) {
    return collection.value.photos[heroBgIndex.value].url
  }
  if (collection.value?.coverImage) {
    return typeof collection.value.coverImage === 'string'
      ? collection.value.coverImage
      : collection.value.coverImage.src
  }
  return ''
})

onMounted(() => {
  // Keyboard event handling
  const handleKeyDown = (e: KeyboardEvent) => {
    if (activePhotoIndex.value === null)
      return
    if (e.key === 'ArrowLeft')
      prevPhoto()
    if (e.key === 'ArrowRight')
      nextPhoto()
    if (e.key === 'Escape')
      closePhoto()
  }
  window.addEventListener('keydown', handleKeyDown)

  // Start Background Image Loop
  if (collection.value?.photos && collection.value.photos.length > 1) {
    bgIntervalId = setInterval(() => {
      heroBgIndex.value = (heroBgIndex.value + 1) % collection.value!.photos!.length
    }, bgIntervalSeconds.value * 1000)
  }

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    if (bgIntervalId)
      clearInterval(bgIntervalId)
  })
})

useSeoMeta({
  title: `${collection.value.title} | ${LOCATION_DETAILS.company}`,
  description: collection.value.description,
})
</script>

<template>
  <div v-if="collection" class="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white pb-16 sm:pb-24 transition-colors duration-300">
    <!-- Edge-to-Edge Hero Header with Looping Background -->
    <div class="relative w-full bg-neutral-900 overflow-hidden">
      <div class="absolute inset-0 opacity-40 overflow-hidden bg-black">
        <Transition
          enter-active-class="transition-opacity duration-1000 ease-in-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-1000 ease-in-out"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <NuxtImg
            v-if="currentHeroImage"
            :key="currentHeroImage"
            :src="currentHeroImage"
            class="absolute inset-0 w-full h-full object-cover"
            format="webp"
            quality="60"
          />
        </Transition>
      </div>

      <UContainer class="relative z-10 max-w-[1400px] py-10 sm:py-16 md:py-20 text-center space-y-2.5 sm:space-y-3 px-4 sm:px-6">
        <NuxtLink
          to="/gallery"
          class="inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold text-white/80 hover:text-white transition-colors uppercase tracking-widest mb-0.5 drop-shadow-md"
        >
          <UIcon name="i-tabler-arrow-left" class="size-3.5 sm:size-4" />
          <span>Collections</span>
        </NuxtLink>

        <h1 class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-white drop-shadow-lg tracking-tight leading-tight">
          {{ collection.title }}
        </h1>

        <p class="text-xs sm:text-sm md:text-base text-white/90 max-w-xl md:max-w-2xl mx-auto drop-shadow-md font-medium leading-relaxed">
          {{ collection.description }}
        </p>
      </UContainer>
    </div>

    <!-- Sticky Centered S | M | L Density Switcher -->
    <div class="sticky top-[var(--ui-header-height,3.5rem)] z-30 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50 py-2.5 sm:py-3 mb-4 sm:mb-8 shadow-xs">
      <UContainer class="max-w-[1400px] flex justify-center items-center px-4">
        <div class="flex items-center gap-5 sm:gap-8 font-sans font-bold text-xs sm:text-sm tracking-widest">
          <span class="text-[10px] sm:text-xs text-neutral-400 font-mono uppercase tracking-widest mr-1 sm:mr-2">Density:</span>
          <button
            v-for="size in (['S', 'M', 'L'] as const)"
            :key="size"
            class="p-1.5 sm:p-2 transition-all cursor-pointer relative touch-manipulation min-w-[28px] text-center"
            :class="[
              density === size
                ? 'text-black dark:text-white underline underline-offset-4 decoration-2 font-black'
                : 'text-neutral-400 hover:text-black dark:hover:text-white font-medium',
            ]"
            @click="density = size"
          >
            {{ size }}
          </button>
        </div>
      </UContainer>
    </div>

    <!-- True Staggered Editorial Masonry Wall -->
    <UContainer class="max-w-[1800px] px-2.5 sm:px-6 lg:px-8">
      <div v-if="collection.photos?.length" :class="masonryContainerClasses">
        <div
          v-for="(photo, idx) in collection.photos"
          :key="idx"
          :class="[
            masonryItemClasses,
            getPhotoAspectClass(idx, photo),
          ]"
          class="group relative overflow-hidden cursor-pointer bg-neutral-100 dark:bg-neutral-900 rounded-lg sm:rounded-none active:scale-[0.98] sm:active:scale-100 transition-all duration-300"
          @click="openPhoto(idx)"
        >
          <!-- Frameless Edge-to-Edge NuxtImg -->
          <NuxtImg
            :src="photo.url"
            :alt="photo.caption || collection.title"
            format="webp"
            quality="85"
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />

          <!-- Touch/Hover Overlay with Top-Right Expand Icon & Bottom Caption -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2.5 sm:p-4 flex flex-col justify-between">
            <!-- Top Right Expand Badge -->
            <div class="flex justify-end">
              <div class="flex size-7 sm:size-8 items-center justify-center rounded-full bg-black/60 hover:bg-lime-500 hover:text-neutral-950 text-white backdrop-blur-md border border-white/20 transition-all shadow-md">
                <UIcon name="i-tabler-arrows-maximize" class="size-3.5 sm:size-4" />
              </div>
            </div>

            <!-- Bottom Caption -->
            <p v-if="photo.caption" class="text-white text-[11px] sm:text-xs font-medium tracking-wide drop-shadow-sm line-clamp-2">
              {{ photo.caption }}
            </p>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Glassmorphic Lightbox Modal Overlay with Centering Filmstrip -->
    <UModal
      :open="activePhotoIndex !== null"
      :ui="{
        content: 'sm:max-w-7xl w-[98vw] sm:w-[95vw] max-w-[98vw] p-0 border-0 bg-transparent shadow-none ring-0',
        overlay: 'bg-black/85 backdrop-blur-xl',
      }"
      @update:open="closePhoto"
    >
      <template #content>
        <div v-if="activePhoto" class="relative flex flex-col justify-between w-full h-[92dvh] py-3 sm:py-4 select-none overflow-hidden">
          <!-- Top Control Bar: Index Counter & Close Button -->
          <div class="flex items-center justify-between px-3 sm:px-8 z-30 shrink-0">
            <span class="font-mono text-[11px] sm:text-xs font-bold text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg">
              {{ activePhotoIndex! + 1 }} / {{ collection.photos?.length }}
            </span>

            <button
              class="flex size-9 sm:size-11 items-center justify-center rounded-full bg-black/60 hover:bg-neutral-800 text-white/90 hover:text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-lg active:scale-95"
              aria-label="Close preview"
              @click="closePhoto"
            >
              <UIcon name="i-tabler-x" class="size-5 sm:size-6" />
            </button>
          </div>

          <!-- Main View Stage Area -->
          <div class="relative flex-1 w-full flex items-center justify-center px-2 sm:px-12 my-1.5 sm:my-2 min-h-0 overflow-hidden">
            <NuxtImg
              :src="activePhoto.url"
              :alt="activePhoto.caption || 'Photo'"
              format="webp"
              quality="95"
              class="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl transition-all duration-300"
            />

            <!-- Left / Right Navigation Chevrons -->
            <button
              class="absolute left-1.5 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-12 items-center justify-center rounded-full bg-black/60 hover:bg-lime-500 hover:text-neutral-950 text-white backdrop-blur-md border border-white/10 shadow-xl transition-all cursor-pointer active:scale-90"
              aria-label="Previous photo"
              @click.stop="prevPhoto"
            >
              <UIcon name="i-tabler-chevron-left" class="size-5 sm:size-7" />
            </button>

            <button
              class="absolute right-1.5 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-12 items-center justify-center rounded-full bg-black/60 hover:bg-lime-500 hover:text-neutral-950 text-white backdrop-blur-md border border-white/10 shadow-xl transition-all cursor-pointer active:scale-90"
              aria-label="Next photo"
              @click.stop="nextPhoto"
            >
              <UIcon name="i-tabler-chevron-right" class="size-5 sm:size-7" />
            </button>
          </div>

          <!-- Bottom Bar: Active Caption & Auto-Centering Filmstrip -->
          <div class="flex flex-col items-center gap-2 sm:gap-3 px-2 sm:px-4 shrink-0 text-center max-w-full">
            <p v-if="activePhoto.caption" class="text-[11px] sm:text-xs font-medium text-white/90 drop-shadow-md max-w-2xl truncate px-2">
              {{ activePhoto.caption }}
            </p>

            <!-- Filmstrip Horizontal Carousel -->
            <div
              ref="filmstripContainerRef"
              class="flex items-center gap-2 sm:gap-2.5 overflow-x-auto max-w-full px-3 py-1.5 scroll-smooth scrollbar-none rounded-xl bg-black/40 backdrop-blur-md border border-white/10 touch-pan-x"
            >
              <button
                v-for="(p, pIdx) in collection.photos"
                :key="pIdx"
                class="relative h-10 w-14 sm:h-13 sm:w-18 shrink-0 overflow-hidden rounded-md sm:rounded-lg border-2 transition-all duration-300 cursor-pointer active:scale-95"
                :class="[
                  pIdx === activePhotoIndex
                    ? 'border-lime-400 scale-105 shadow-xl ring-2 ring-lime-400/50 opacity-100 z-10'
                    : 'border-transparent opacity-40 hover:opacity-80',
                ]"
                @click="openPhoto(pIdx)"
              >
                <NuxtImg
                  :src="p.url"
                  format="webp"
                  quality="40"
                  class="h-full w-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
