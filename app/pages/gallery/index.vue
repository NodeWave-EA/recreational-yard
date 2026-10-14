<script setup lang="ts">
import { useGalleryCatalog } from '~/composables/useGalleryCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const {
  collections,
  filteredCollections,
  getCoverImageSrc,
  resetFilters,
} = await useGalleryCatalog()

// Evaluates whether any collections exist overall in the database catalog
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
  <div class="min-h-screen bg-default text-default pb-16 transition-colors duration-300">
    <!-- Left-Aligned Mobile Hero Banner -->
    <UContainer class="pt-6 sm:pt-10 pb-2 sm:pb-4 text-left sm:text-center space-y-3">
      <div class="inline-flex">
        <UBadge
          color="primary"
          variant="soft"
          class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-3.5 py-1 sm:py-0.5 rounded-full"
        >
          <UIcon name="i-tabler-photo" class="size-3.5 mr-1.5 text-primary shrink-0" />
          <span>Visual Collections</span>
        </UBadge>
      </div>

      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-highlighted leading-tight">
        Yard Photo Gallery
      </h1>

      <p class="text-xs sm:text-base text-muted leading-relaxed">
        A showcase of recreation, running, sports merchandise and shared experiences from Recreation Yard Limited.
      </p>
    </UContainer>

    <!-- Main Content Container -->
    <UContainer class="pt-6">
      <div class="mb-6 flex justify-end" role="group" aria-label="View mode">
        <div class="flex items-center gap-1 p-1 rounded-sm bg-elevated border border-default">
          <UButton size="xs" :color="viewMode === 'grid' ? 'primary' : 'neutral'" :variant="viewMode === 'grid' ? 'solid' : 'ghost'" icon="i-tabler-layout-grid" aria-label="Grid View" :aria-pressed="viewMode === 'grid'" class="rounded-sm" @click="viewMode = 'grid'" />
          <UButton size="xs" :color="viewMode === 'list' ? 'primary' : 'neutral'" :variant="viewMode === 'list' ? 'solid' : 'ghost'" icon="i-tabler-list" aria-label="List View" :aria-pressed="viewMode === 'list'" class="rounded-sm" @click="viewMode = 'list'" />
        </div>
      </div>

      <!-- Grid View Option -->
      <div
        v-if="viewMode === 'grid' && filteredCollections.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
      >
        <NuxtLink
          v-for="collection in filteredCollections"
          :key="collection.path"
          :to="collection.path"
          class="group flex flex-col justify-between transition-all duration-300 rounded-sm focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
        >
          <div class="space-y-3">
            <!-- Thumbnail Image Cover -->
            <div class="relative aspect-16/10  overflow-hidden border border-default bg-elevated">
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
                class="flex size-full items-center justify-center bg-primary/10 text-primary"
              >
                <UIcon name="i-tabler-photo" class="size-10" />
              </div>

              <!-- Badges Layer -->
              <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <UBadge
                  v-if="collection.badge"
                  color="primary"
                  variant="soft"
                  class="font-bold rounded-lg px-2 py-0.5 text-[10px] uppercase backdrop-blur-md"
                >
                  {{ collection.badge }}
                </UBadge>
              </div>

              <!-- Photos Count Pill -->
              <span
                v-if="collection.photos?.length"
                class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-inverted/80 text-inverted font-bold text-[10px] backdrop-blur-md border border-inverted/10 flex items-center gap-1"
              >
                <UIcon name="i-tabler-photo" class="size-3 text-primary" />
                {{ collection.photos.length }}
              </span>
            </div>

            <!-- Details -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                <UBadge v-if="collection.category" color="neutral" variant="subtle" class="rounded px-1.5 py-0.5 uppercase text-[9px]">
                  {{ collection.category }}
                </UBadge>
                <span v-if="collection.date" class="text-muted flex items-center gap-1">
                  <UIcon name="i-tabler-calendar" class="size-3.5 text-primary" /> {{ collection.date }}
                </span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-highlighted group-hover:text-primary transition-colors line-clamp-1">
                {{ collection.title }}
              </h2>

              <p class="text-xs text-muted line-clamp-2 leading-relaxed">
                {{ collection.description }}
              </p>
            </div>
          </div>

          <div class="pt-3 mt-3 border-t border-default flex items-center justify-between">
            <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Explore Collection
            </span>
            <UIcon name="i-tabler-arrow-right" class="size-4 text-muted group-hover:text-primary transition-colors" />
          </div>
        </NuxtLink>
      </div>

      <!-- Flat List Row View Option -->
      <div
        v-else-if="viewMode === 'list' && filteredCollections.length"
        data-catalog-list class="divide-y divide-default"
      >
        <div
          v-for="collection in filteredCollections"
          :key="collection.path"
          data-catalog-list-row class="group py-5 transition-colors"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <!-- Cover Thumbnail & Collection Info -->
            <div class="flex items-start gap-4 min-w-0 flex-1">
              <NuxtLink :to="collection.path" class="shrink-0 relative">
                <NuxtImg
                  v-if="getCoverImageSrc(collection)"
                  :src="getCoverImageSrc(collection)"
                  :alt="collection.title"
                  format="webp"
                  quality="80"
                  loading="lazy"
                  class="size-20 sm:size-24 rounded-sm object-cover border border-default group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  v-else
                  class="flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary border border-default"
                >
                  <UIcon name="i-tabler-photo" class="size-8" />
                </div>
              </NuxtLink>

              <div class="space-y-1.5 min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-[10px]">
                  <UBadge v-if="collection.category" color="neutral" variant="subtle" class="font-bold rounded px-1.5 py-0.5 text-[9px] uppercase">
                    {{ collection.category }}
                  </UBadge>
                  <UBadge v-if="collection.badge" color="primary" variant="soft" class="font-bold rounded px-1.5 py-0.5 text-[9px]">
                    {{ collection.badge }}
                  </UBadge>
                  <span v-if="collection.photos?.length" class="text-muted font-bold flex items-center gap-1">
                    <UIcon name="i-tabler-photo" class="size-3.5 text-primary" /> {{ collection.photos.length }} Photos
                  </span>
                  <span v-if="collection.date" class="text-muted font-medium hidden sm:inline-flex items-center gap-0.5">
                    • {{ collection.date }}
                  </span>
                </div>

                <h2 class="text-base sm:text-lg font-bold text-highlighted group-hover:text-primary transition-colors truncate">
                  <NuxtLink :to="collection.path">
                    {{ collection.title }}
                  </NuxtLink>
                </h2>

                <p class="text-xs text-muted line-clamp-2 leading-relaxed max-w-2xl">
                  {{ collection.description }}
                </p>
              </div>
            </div>

            <!-- Action Button -->
            <div class="flex items-center justify-between sm:justify-end gap-4 w-full lg:w-auto pt-2 sm:pt-0 shrink-0">
              <UButton
                :to="collection.path"
                color="primary"
                size="sm"
                icon="i-tabler-arrow-right"
                trailing
                class="font-black uppercase text-xs rounded-sm px-4 py-2 w-full lg:w-auto justify-center"
              >
                View Collection
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Empty State -->
      <div v-else-if="hasAnyCollection" class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center  bg-elevated mx-auto border border-default">
          <UIcon name="i-tabler-filter-off" class="size-8 text-muted" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-highlighted">
            No Matching Collections
          </h3>
          <p class="text-xs text-muted leading-relaxed">
            No photo galleries match your current search query or active filter selections. Try clearing your filters or searching for something else.
          </p>
        </div>

        <div class="pt-2">
          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-rotate-clockwise"
            class="rounded-sm font-bold text-xs px-4 py-2 cursor-pointer"
            @click="resetFilters"
          >
            Reset All Filters
          </UButton>
        </div>
      </div>

      <!-- Catalog Empty State -->
      <div v-else class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center  bg-elevated mx-auto border border-default">
          <UIcon name="i-tabler-photo-off" class="size-8 text-muted" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-highlighted">
            No Collections Available
          </h3>
          <p class="text-xs text-muted leading-relaxed">
            There are currently no photo collections or galleries published. Please check back later as we update our visual lookbooks, or contact us directly.
          </p>
        </div>

        <div class="pt-2 flex items-center justify-center gap-3">
          <UButton
            to="/contact"
            size="sm"
            color="primary"
            icon="i-tabler-mail"
            class="rounded-sm font-bold text-xs px-4 py-2 cursor-pointer"
          >
            Contact Us
          </UButton>
          <UButton
            to="/"
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-home"
            class="rounded-sm font-bold text-xs px-4 py-2 cursor-pointer"
          >
            Return Home
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
