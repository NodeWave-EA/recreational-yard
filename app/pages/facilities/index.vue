<script setup lang="ts">
import { useFacilitiesCatalog } from '~/composables/useFacilitiesCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const {
  facilities,
  filteredFacilities,
  getImageSrc,
  resetFilters,
} = await useFacilitiesCatalog()

// Evaluates whether any facilities exist in the database catalog overall
const hasAnyFacility = computed(() => (facilities.value?.length || 0) > 0)

useSeoMeta({
  title: `Facilities | ${LOCATION_DETAILS.company}`,
  description: 'Explore our sports grounds, outdoor recreation spaces, and event venues in Kericho.',
  ogTitle: `Facilities | ${LOCATION_DETAILS.company}`,
  ogDescription: 'Explore our sports grounds, outdoor recreation spaces, and event venues in Kericho.',
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}/facilities`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
useSchemaOrg([{
  '@type': 'CollectionPage',
  '@id': `${siteUrl}/facilities#webpage`,
  'url': `${siteUrl}/facilities`,
  'name': `Facilities | ${LOCATION_DETAILS.company}`,
  'description': 'Explore our sports grounds, outdoor recreation spaces, and event venues in Kericho.',
  'isPartOf': { '@id': `${siteUrl}/#website` },
  'about': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div class="min-h-screen bg-default text-muted pb-16 transition-colors duration-300">
    <!-- Left-Aligned Mobile Header -->
    <div class="pt-6 sm:pt-10 pb-2 sm:pb-4 text-left sm:text-center space-y-3 max-w-3xl mx-auto px-4">
      <div class="inline-flex">
        <UBadge
          color="primary"
          variant="soft"
          class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-3.5 py-1 sm:py-0.5 rounded-full"
        >
          <UIcon name="i-tabler-trees" class="size-3.5 mr-1.5 text-primary shrink-0" />
          <span>Our Venues & Grounds</span>
        </UBadge>
      </div>

      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-highlighted leading-tight">
        Explore Our Facilities
      </h1>

      <p class="text-xs sm:text-base text-muted leading-relaxed max-w-2xl mx-0 sm:mx-auto">
        Discover a variety of sports grounds, outdoor recreation spaces, and event venues in Kericho. Use the search and filter options below to find the perfect facility for your needs.
      </p>
    </div>

    <!-- Main Content Display -->
    <UContainer class="pt-6">
      <div class="mb-6 flex justify-end" role="group" aria-label="View mode">
        <div class="flex items-center gap-1 p-1 rounded-sm bg-elevated border border-default">
          <UButton size="xs" :color="viewMode === 'grid' ? 'primary' : 'neutral'" :variant="viewMode === 'grid' ? 'solid' : 'ghost'" icon="i-tabler-layout-grid" aria-label="Grid View" :aria-pressed="viewMode === 'grid'" class="rounded-sm" @click="viewMode = 'grid'" />
          <UButton size="xs" :color="viewMode === 'list' ? 'primary' : 'neutral'" :variant="viewMode === 'list' ? 'solid' : 'ghost'" icon="i-tabler-list" aria-label="List View" :aria-pressed="viewMode === 'list'" class="rounded-sm" @click="viewMode = 'list'" />
        </div>
      </div>

      <!-- Grid View Option -->
      <div
        v-if="viewMode === 'grid' && filteredFacilities.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
      >
        <NuxtLink
          v-for="facility in filteredFacilities"
          :key="facility.id || facility.path"
          :to="facility.path"
          class="group flex flex-col justify-between transition-all duration-300"
        >
          <div class="space-y-3">
            <!-- Facility Image Thumbnail -->
            <div class="relative aspect-16/10  overflow-hidden border border-default bg-elevated">
              <NuxtImg
                v-if="getImageSrc(facility)"
                :src="getImageSrc(facility)"
                :alt="facility.title"
                format="webp"
                quality="80"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="flex size-full items-center justify-center bg-primary/10 text-primary"
              >
                <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-10" />
              </div>

              <UBadge
                v-if="facility.badge"
                color="primary"
                variant="soft"
                class="absolute top-2.5 left-2.5 font-bold rounded-lg px-2.5 py-0.5 text-[10px] uppercase backdrop-blur-md"
              >
                {{ facility.badge }}
              </UBadge>
            </div>

            <!-- Details -->
            <div class="space-y-2">
              <div v-if="facility.capacity" class="text-[11px] font-bold text-muted flex items-center gap-1.5 truncate">
                <UIcon name="i-tabler-users" class="size-3.5 text-primary shrink-0" />
                <span class="truncate">{{ facility.capacity }}</span>
              </div>

              <h2 class="text-lg font-extrabold text-highlighted group-hover:text-primary transition-colors line-clamp-1">
                {{ facility.title }}
              </h2>

              <p class="text-xs text-muted line-clamp-2 leading-relaxed">
                {{ facility.description }}
              </p>

              <!-- Feature List -->
              <div v-if="facility.features?.length" class="space-y-1.5 pt-1.5 text-xs text-muted font-medium">
                <div
                  v-for="(feat, idx) in facility.features.slice(0, 3)"
                  :key="idx"
                  class="flex items-start gap-1.5 min-w-0"
                >
                  <UIcon name="i-tabler-circle-check-filled" class="size-3.5 text-primary shrink-0 mt-0.5" />
                  <span class="truncate text-[11px] leading-tight">{{ feat }}</span>
                </div>
                <div v-if="facility.features.length > 3" class="text-[10px] text-muted font-bold pl-5">
                  +{{ facility.features.length - 3 }} more
                </div>
              </div>
            </div>
          </div>

          <!-- Footer with Rate & Action -->
          <div class="pt-3 mt-3 border-t border-default flex items-center justify-between gap-2">
            <div v-if="facility.pricing?.rate">
              <span class="text-[9px] font-bold uppercase tracking-wider text-muted block">Rate</span>
              <span class="text-sm font-extrabold text-highlighted">
                {{ facility.pricing.rate }}
                <span v-if="facility.pricing.unit" class="text-[10px] font-normal text-muted">/ {{ facility.pricing.unit }}</span>
              </span>
            </div>

            <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
              View Facility
              <UIcon name="i-tabler-arrow-right" class="size-4" />
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Flat Row List View Option -->
      <div
        v-else-if="viewMode === 'list' && filteredFacilities.length"
        data-catalog-list class="divide-y divide-default dark:divide-default"
      >
        <div
          v-for="facility in filteredFacilities"
          :key="facility.id || facility.path"
          data-catalog-list-row class="group py-5 transition-colors"
        >
          <!-- Top Row: Thumbnail, Info & Action -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <!-- Thumbnail & Title/Desc -->
            <div class="flex items-start gap-4 min-w-0 flex-1">
              <NuxtLink :to="facility.path" class="shrink-0">
                <NuxtImg
                  v-if="getImageSrc(facility)"
                  :src="getImageSrc(facility)"
                  :alt="facility.title"
                  format="webp"
                  quality="80"
                  loading="lazy"
                  class="size-20 sm:size-24 rounded-sm object-cover border border-default group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  v-else
                  class="flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary border border-default"
                >
                  <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-8" />
                </div>
              </NuxtLink>

              <div class="space-y-1.5 min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-[10px]">
                  <UBadge v-if="facility.badge" color="primary" variant="soft" class="font-bold rounded px-1.5 py-0.5 text-[9px] uppercase">
                    {{ facility.badge }}
                  </UBadge>
                  <span v-if="facility.capacity" class="text-muted font-bold flex items-center gap-1">
                    <UIcon name="i-tabler-users" class="size-3.5 text-primary" /> {{ facility.capacity }}
                  </span>
                </div>

                <h2 class="text-base sm:text-lg font-bold text-highlighted group-hover:text-primary transition-colors truncate">
                  <NuxtLink :to="facility.path">
                    {{ facility.title }}
                  </NuxtLink>
                </h2>

                <p class="text-xs text-muted line-clamp-2 leading-relaxed max-w-2xl">
                  {{ facility.description }}
                </p>
              </div>
            </div>

            <!-- Rate & Action Button -->
            <div class="flex items-center justify-between sm:justify-end gap-4 w-full lg:w-auto pt-2 sm:pt-0 shrink-0">
              <div v-if="facility.pricing" class="text-left sm:text-right">
                <span class="text-[10px] font-bold uppercase tracking-wider text-muted block">Rate</span>
                <span class="text-sm sm:text-base font-extrabold text-highlighted">
                  {{ facility.pricing.rate }}
                  <span v-if="facility.pricing.unit" class="text-[10px] font-normal text-muted">/ {{ facility.pricing.unit }}</span>
                </span>
              </div>

              <UButton
                :to="facility.path"
                color="primary"
                size="sm"
                icon="i-tabler-arrow-right"
                trailing
                class="font-black uppercase text-xs text-highlighted rounded-sm px-4 py-2"
              >
                View Facility
              </UButton>
            </div>
          </div>

          <!-- Bottom Row: Features -->
          <div v-if="facility.features?.length" class="mt-3.5 pt-3 border-t border-default w-full">
            <div class="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-muted">
              <div v-for="(feat, idx) in facility.features" :key="idx" class="inline-flex items-center gap-1.5">
                <UIcon name="i-tabler-circle-check-filled" class="size-4 text-primary shrink-0" />
                <span class="font-medium">{{ feat }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Empty State -->
      <div v-else-if="hasAnyFacility" class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center  bg-elevated mx-auto border border-default">
          <UIcon name="i-tabler-filter-off" class="size-8 text-muted" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-highlighted">
            No Matching Facilities
          </h3>
          <p class="text-xs text-muted leading-relaxed">
            No venues or grounds match your current search query or active filter selections. Try clearing your filters or searching for something else.
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
          <UIcon name="i-tabler-trees" class="size-8 text-muted" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-highlighted">
            No Facilities Available
          </h3>
          <p class="text-xs text-muted leading-relaxed">
            There are currently no facilities or venues listed in the catalog. Please check back later as we add new sports grounds and event spaces, or contact us directly.
          </p>
        </div>

        <div class="pt-2 flex items-center justify-center gap-3">
          <UButton
            to="/contact"
            size="sm"
            color="primary"
            icon="i-tabler-mail"
            class="rounded-sm font-bold text-xs px-4 py-2 text-highlighted cursor-pointer"
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
