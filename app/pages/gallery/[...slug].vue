<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { useGalleryLayout } from '~/composables/useGalleryLayout'
import { LOCATION_DETAILS } from '~/utils/site-data'

const route = useRoute()
const { getByPath } = useContentQuery()

// Fetch collection metadata
const { data: collection } = await getByPath(
  `gallery-doc-${route.path}`,
  'gallery',
  route.path,
  { enableLogging: false },
)

if (!collection.value) {
  throw createError({ statusCode: 404, statusMessage: 'Gallery Collection Not Found', fatal: true })
}

const slug = computed(() => route.path.split('/').pop() || '')

// Fetch dynamic local folder images from server API
const { data: dynamicGallery } = await useFetch(`/api/gallery/${slug.value}`)

// Combined photos: Merges dynamic local folder images with Markdown frontmatter photos (including external URLs)
const allPhotos = computed(() => {
  const scanned = dynamicGallery.value?.images || []
  const explicit = collection.value?.photos || []

  const merged = [...scanned, ...explicit]

  // Deduplicate by image URL
  const seenUrls = new Set<string>()
  return merged.filter((photo) => {
    if (!photo?.url || seenUrls.has(photo.url))
      return false
    seenUrls.add(photo.url)
    return true
  })
})

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
  activePhotoIndex.value !== null && allPhotos.value ? allPhotos.value[activePhotoIndex.value] : null,
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
  if (activePhotoIndex.value !== null && allPhotos.value.length) {
    activePhotoIndex.value = (activePhotoIndex.value - 1 + allPhotos.value.length) % allPhotos.value.length
  }
}

function nextPhoto() {
  if (activePhotoIndex.value !== null && allPhotos.value.length) {
    activePhotoIndex.value = (activePhotoIndex.value + 1) % allPhotos.value.length
  }
}

// Hero Background Loop
const heroBgIndex = ref(0)
let bgIntervalId: ReturnType<typeof setInterval> | null = null

const currentHeroImage = computed(() => {
  if (allPhotos.value.length) {
    return allPhotos.value[heroBgIndex.value]?.url
  }
  return dynamicGallery.value?.coverImage || ''
})

onMounted(() => {
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

  if (allPhotos.value.length > 1) {
    bgIntervalId = setInterval(() => {
      heroBgIndex.value = (heroBgIndex.value + 1) % allPhotos.value.length
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
  ogTitle: `${collection.value.title} | ${LOCATION_DETAILS.company}`,
  ogDescription: collection.value.description,
  ogImage: allPhotos.value[0]?.url || undefined,
  ogUrl: `${useRuntimeConfig().public.siteUrl}${route.path}`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
const pageUrl = `${siteUrl}${route.path}`
useSchemaOrg([{
  '@type': 'ImageGallery',
  '@id': `${pageUrl}#gallery`,
  'url': pageUrl,
  'name': collection.value.title,
  'description': collection.value.description,
  'image': allPhotos.value.map(photo => photo.url),
  'isPartOf': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div v-if="collection" class="min-h-screen bg-default text-muted pb-16 sm:pb-24 transition-colors duration-300">
    <!-- Edge-to-Edge Hero Header with Looping Background -->
    <div class="relative w-full bg-elevated overflow-hidden">
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

      <UContainer class="relative z-10 py-10 sm:py-16 md:py-20 text-center space-y-2.5 sm:space-y-3">
        <NuxtLink
          to="/gallery"
          class="inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold text-inverted/80 hover:text-inverted transition-colors uppercase tracking-widest mb-0.5 drop-shadow-md"
        >
          <UIcon name="i-tabler-arrow-left" class="size-3.5 sm:size-4" />
          <span>Collections</span>
        </NuxtLink>

        <h1 class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-inverted drop-shadow-lg tracking-tight leading-tight">
          {{ collection.title }}
        </h1>

        <p class="text-xs sm:text-sm md:text-base text-inverted/90 max-w-xl md:max-w-2xl mx-auto drop-shadow-md font-medium leading-relaxed">
          {{ collection.description }}
        </p>
      </UContainer>
    </div>

    <!-- Density Switcher Toolbar -->
    <div class="sticky top-(--ui-header-height,3.5rem) z-30 bg-default/95 backdrop-blur-md border-b border-default py-2.5 sm:py-3 mb-4 sm:mb-8 shadow-xs" role="toolbar" aria-label="Gallery density controls">
      <UContainer class="flex justify-center items-center">
        <div class="flex items-center gap-5 sm:gap-8 font-sans font-bold text-xs sm:text-sm tracking-widest">
          <button
            v-for="size in (['S', 'M', 'L'] as const)"
            :key="size"
            class="p-1.5 sm:p-2 transition-all cursor-pointer relative touch-manipulation min-w-7 text-center"
            :class="[
              density === size
                ? 'text-black underline underline-offset-4 decoration-2 font-black'
                : 'text-muted hover:text-black dark:hover:text-inverted font-medium',
            ]"
            @click="density = size"
          >
            {{ size }}
          </button>
        </div>
      </UContainer>
    </div>

    <!-- Masonry Wall -->
    <UContainer>
      <div v-if="allPhotos.length" :class="masonryContainerClasses">
        <div
          v-for="(photo, idx) in allPhotos"
          :key="idx"
          :class="[
            masonryItemClasses,
            getPhotoAspectClass(idx, photo),
          ]"
          class="group relative overflow-hidden cursor-pointer bg-elevated rounded-lg sm:rounded-none active:scale-[0.98] sm:active:scale-100 transition-all duration-300"
          @click="openPhoto(idx)"
        >
          <NuxtImg
            :src="photo.url"
            :alt="photo.caption || collection.title"
            format="webp"
            quality="85"
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />

          <div class="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2.5 sm:p-4 flex flex-col justify-between">
            <div class="flex justify-end">
              <div class="flex size-7 sm:size-8 items-center justify-center rounded-full bg-black/60 hover:bg-primary hover:text-highlighted text-inverted backdrop-blur-md border border-white/20 transition-all shadow-md">
                <UIcon name="i-tabler-arrows-maximize" class="size-3.5 sm:size-4" />
              </div>
            </div>

            <!-- Bottom Caption -->
            <p v-if="photo.caption" class="text-inverted text-[11px] sm:text-xs font-medium tracking-wide drop-shadow-sm line-clamp-2">
              {{ photo.caption }}
            </p>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Glassmorphic Lightbox Modal Overlay -->
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
            <span class="font-mono text-[11px] sm:text-xs font-bold text-inverted/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg">
              {{ activePhotoIndex! + 1 }} / {{ allPhotos.length }}
            </span>

            <button
              class="flex size-9 sm:size-11 items-center justify-center rounded-full bg-black/60 hover:bg-elevated text-inverted/90 hover:text-inverted backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-lg active:scale-95"
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
              class="absolute left-1.5 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-12 items-center justify-center rounded-full bg-black/60 hover:bg-primary hover:text-highlighted text-inverted backdrop-blur-md border border-white/10 shadow-xl transition-all cursor-pointer active:scale-90"
              aria-label="Previous photo"
              @click.stop="prevPhoto"
            >
              <UIcon name="i-tabler-chevron-left" class="size-5 sm:size-7" />
            </button>

            <button
              class="absolute right-1.5 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-12 items-center justify-center rounded-full bg-black/60 hover:bg-primary hover:text-highlighted text-inverted backdrop-blur-md border border-white/10 shadow-xl transition-all cursor-pointer active:scale-90"
              aria-label="Next photo"
              @click.stop="nextPhoto"
            >
              <UIcon name="i-tabler-chevron-right" class="size-5 sm:size-7" />
            </button>
          </div>

          <!-- Bottom Bar: Active Caption & Auto-Centering Filmstrip -->
          <div class="flex flex-col items-center gap-2 sm:gap-3 px-2 sm:px-4 shrink-0 text-center max-w-full">
            <p v-if="activePhoto.caption" class="text-[11px] sm:text-xs font-medium text-inverted/90 drop-shadow-md max-w-2xl truncate px-2">
              {{ activePhoto.caption }}
            </p>

            <!-- Filmstrip Horizontal Carousel -->
            <div
              ref="filmstripContainerRef"
              class="flex items-center gap-2 sm:gap-2.5 overflow-x-auto max-w-full px-3 py-1.5 scroll-smooth scrollbar-none rounded-sm bg-black/40 backdrop-blur-md border border-white/10 touch-pan-x"
            >
              <button
                v-for="(p, pIdx) in allPhotos"
                :key="pIdx"
                class="relative h-10 w-14 sm:h-13 sm:w-18 shrink-0 overflow-hidden rounded-md sm:rounded-lg border-2 transition-all duration-300 cursor-pointer active:scale-95"
                :class="[
                  pIdx === activePhotoIndex
                    ? 'border-primary scale-105 shadow-xl ring-2 ring-lime-400/50 opacity-100 z-10'
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
