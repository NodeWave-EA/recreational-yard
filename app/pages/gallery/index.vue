<script setup lang="ts">
import { useGalleryCatalog } from '~/composables/useGalleryCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

const viewMode = ref<'grid' | 'list'>('grid')

const {
  collections,
  getCoverImageSrc,
} = await useGalleryCatalog()

const hasAnyCollection = computed(() => (collections.value?.length || 0) > 0)

useSeoMeta({
  title: `Photo Gallery & Collections | ${LOCATION_DETAILS.company}`,
  description: 'Explore Recreation Yard Limited’s outdoor recreation, running, sportswear and group experience collections.',
  ogTitle: `Photo Gallery & Collections | ${LOCATION_DETAILS.company}`,
  ogDescription: 'Explore Recreation Yard Limited’s outdoor recreation, running, sportswear and group experience collections.',
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}/gallery`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
useSchemaOrg([{
  '@type': 'CollectionPage',
  '@id': `${siteUrl}/gallery#webpage`,
  'url': `${siteUrl}/gallery`,
  'name': `Photo Gallery & Collections | ${LOCATION_DETAILS.company}`,
  'description': 'Explore Recreation Yard Limited’s outdoor recreation, running, sportswear and group experience collections.',
  'isPartOf': { '@id': `${siteUrl}/#website` },
  'about': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-12 sm:pb-16 transition-colors duration-300 w-full overflow-x-clip">
    <div class="pt-4 sm:pt-10 pb-4 sm:pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="space-y-2 sm:space-y-3 text-left sm:text-center">
          <div class="inline-flex">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-0.5 rounded-md"
            >
              <UIcon name="i-tabler-photo" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
              <span>Visual Collections</span>
            </UBadge>
          </div>

          <h1 class="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
            Yard Photo Gallery
          </h1>

          <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            A showcase of recreation, running, sports merchandise and shared experiences from Recreation Yard Limited.
          </p>
        </div>
      </UContainer>
    </div>

    <div class="sticky top-[var(--ui-header-height,4rem)] z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-none sm:shadow-xs transition-all">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-3 sm:gap-4">
          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            Available Collections: <span class="text-lime-600 dark:text-lime-400 font-extrabold text-sm">{{ collections?.length || 0 }}</span>
          </span>

          <div class="flex items-center p-1 rounded-md bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
            <UButton
              size="xs"
              :color="viewMode === 'grid' ? 'primary' : 'neutral'"
              :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
              icon="i-tabler-layout-grid"
              aria-label="Grid View"
              class="rounded-md font-bold"
              @click="viewMode = 'grid'"
            />
            <UButton
              size="xs"
              :color="viewMode === 'list' ? 'primary' : 'neutral'"
              :variant="viewMode === 'list' ? 'solid' : 'ghost'"
              icon="i-tabler-list"
              aria-label="List View"
              class="rounded-md font-bold"
              @click="viewMode = 'list'"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="pt-4 sm:pt-8 px-3 sm:px-6 lg:px-8">
      <div
        v-if="viewMode === 'grid' && hasAnyCollection"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
      >
        <NuxtLink
          v-for="collection in collections"
          :key="collection.path"
          :to="collection.path"
          class="group flex flex-col justify-between p-0 sm:p-4 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-4 sm:pb-0"
        >
          <div class="space-y-2.5 sm:space-y-3">
            <div class="relative aspect-16/10 rounded-md overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-100 dark:bg-neutral-900">
              <NuxtImg
                v-if="getCoverImageSrc(collection)"
                :src="getCoverImageSrc(collection)"
                :alt="collection.title"
                format="webp"
                quality="80"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="flex size-full items-center justify-center bg-lime-500/10 text-lime-600 dark:text-lime-400"
              >
                <UIcon name="i-tabler-photo" class="size-10" />
              </div>

              <div class="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex items-center gap-1.5">
                <UBadge
                  v-if="collection.badge"
                  color="primary"
                  variant="soft"
                  class="font-bold rounded-md px-2 py-0.5 text-[10px] uppercase backdrop-blur-md"
                >
                  {{ collection.badge }}
                </UBadge>
              </div>

              <span
                v-if="collection.photos?.length"
                class="absolute bottom-2 left-2 sm:bottom-2.5 sm:right-2.5 px-2 py-0.5 rounded-md bg-neutral-900/80 text-white font-bold text-[10px] backdrop-blur-md border border-white/10 flex items-center gap-1"
              >
                <UIcon name="i-tabler-photo" class="size-3 text-lime-400" />
                {{ collection.photos.length }}
              </span>
            </div>

            <div class="space-y-1 sm:space-y-1.5 min-w-0">
              <div class="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                <UBadge v-if="collection.category" color="neutral" variant="subtle" class="rounded-md px-1.5 py-0.5 uppercase text-[9px]">
                  {{ collection.category }}
                </UBadge>
                <span v-if="collection.date" class="text-neutral-500 flex items-center gap-1">
                  <UIcon name="i-tabler-calendar" class="size-3.5 text-lime-500" /> {{ collection.date }}
                </span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
                {{ collection.title }}
              </h2>

              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                {{ collection.description }}
              </p>
            </div>
          </div>

          <div class="pt-2.5 sm:pt-3 mt-3 sm:mt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between">
            <span class="text-xs font-bold text-lime-600 dark:text-lime-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Explore Collection
            </span>
            <UIcon name="i-tabler-arrow-right" class="size-4 text-neutral-400 group-hover:text-lime-500 transition-colors" />
          </div>
        </NuxtLink>
      </div>

      <div
        v-else-if="viewMode === 'list' && hasAnyCollection"
        class="space-y-3 sm:space-y-4 w-full"
      >
        <NuxtLink
          v-for="collection in collections"
          :key="collection.path"
          :to="collection.path"
          class="group block p-0 sm:p-5 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-4 sm:pb-0"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
            <div class="flex items-start gap-3 sm:gap-4 min-w-0 flex-1 w-full sm:w-auto">
              <div class="shrink-0 relative">
                <NuxtImg
                  v-if="getCoverImageSrc(collection)"
                  :src="getCoverImageSrc(collection)"
                  :alt="collection.title"
                  format="webp"
                  quality="80"
                  loading="lazy"
                  class="size-16 sm:size-24 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  v-else
                  class="flex size-16 sm:size-24 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800"
                >
                  <UIcon name="i-tabler-photo" class="size-7 sm:size-8" />
                </div>
              </div>

              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-[10px]">
                  <UBadge v-if="collection.category" color="neutral" variant="subtle" class="font-bold rounded-md px-1.5 py-0.5 text-[9px] uppercase">
                    {{ collection.category }}
                  </UBadge>
                  <UBadge v-if="collection.badge" color="primary" variant="soft" class="font-bold rounded-md px-1.5 py-0.5 text-[9px]">
                    {{ collection.badge }}
                  </UBadge>
                  <span v-if="collection.photos?.length" class="text-neutral-500 font-bold flex items-center gap-1">
                    <UIcon name="i-tabler-photo" class="size-3.5 text-lime-500" /> {{ collection.photos.length }} Photos
                  </span>
                  <span v-if="collection.date" class="text-neutral-400 font-medium hidden sm:inline-flex items-center gap-0.5">
                    • {{ collection.date }}
                  </span>
                </div>

                <h2 class="text-sm sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                  {{ collection.title }}
                </h2>

                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                  {{ collection.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800/60 shrink-0">
              <span class="inline-flex items-center gap-1 font-black uppercase text-xs text-neutral-950 dark:text-white bg-lime-500 group-hover:bg-lime-400 px-3.5 py-2 rounded-md transition-colors">
                <span>View Collection</span>
                <UIcon name="i-tabler-arrow-right" class="size-4" />
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="py-12 sm:py-20 text-center space-y-4 max-w-md mx-auto">
        <div class="flex size-14 sm:size-16 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-photo-off" class="size-7 sm:size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
            No Collections Available
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            There are currently no photo collections or galleries published. Please check back later as we update our visual lookbooks, or contact us directly.
          </p>
        </div>

        <div class="pt-2 flex items-center justify-center gap-3">
          <UButton
            to="/contact"
            size="sm"
            color="primary"
            icon="i-tabler-mail"
            class="rounded-md font-bold text-xs px-4 py-2 text-neutral-950 cursor-pointer"
          >
            Contact Us
          </UButton>
          <UButton
            to="/"
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-home"
            class="rounded-md font-bold text-xs px-4 py-2 cursor-pointer"
          >
            Return Home
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
