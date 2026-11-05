<script setup lang="ts">
import { useFacilitiesCatalog } from '~/composables/useFacilitiesCatalog'

const viewMode = ref<'grid' | 'list'>('grid')

const {
  facilities,
  filteredFacilities,
  getImageSrc,
  resetFilters,
} = await useFacilitiesCatalog()

const hasAnyFacility = computed(() => (facilities.value?.length || 0) > 0)

useSeoMeta({
  title: `Recreation Yard Kericho | Lawn Games, Sports & Outdoor Experiences`,
  description: 'Explore Recreation Yard Kericho: a green space for lawn games, board games, picnics, celebrations, and outdoor group experiences.',
  ogTitle: `Recreation Yard Kericho | Lawn Games, Sports & Outdoor Experiences`,
  ogDescription: 'Explore Recreation Yard Kericho: a green space for lawn games, board games, picnics, celebrations, and outdoor group experiences.',
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}/facilities`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
useSchemaOrg([{
  '@type': 'CollectionPage',
  '@id': `${siteUrl}/facilities#webpage`,
  'url': `${siteUrl}/facilities`,
  'name': `Recreation Yard Kericho | Lawn Games & Recreation`,
  'description': 'A green outdoor environment for lawn games, board games, picnics, celebrations, and active living.',
  'isPartOf': { '@id': `${siteUrl}/#website` },
  'about': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-12 sm:pb-16 transition-colors duration-300 w-full overflow-x-clip">
    <div class="pt-4 sm:pt-10 pb-4 sm:pb-6 border-b border-neutral-200 dark:border-neutral-800">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="space-y-2 sm:space-y-3 text-left sm:text-center">
          <div class="inline-flex">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-0.5 rounded-xs"
            >
              <UIcon name="i-tabler-trees" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
              <span>Recreation Yard Kericho</span>
            </UBadge>
          </div>

          <h1 class="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
            Lawn Games & Recreation Space
          </h1>

          <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-4xl mx-auto font-medium">
            A green outdoor environment where you can enjoy lawn games, relax, spend time with family and friends, celebrate special occasions or participate in group activities. Prior booking is mandatory.
          </p>
        </div>
      </UContainer>
    </div>

    <div class="sticky top-[var(--ui-header-height,4rem)] z-30 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md py-2.5 sm:py-3 border-b border-neutral-200 dark:border-neutral-800 transition-all">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-3 sm:gap-4">
          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            Available Facilities: <span class="text-lime-600 dark:text-lime-400 font-extrabold font-mono text-sm">{{ filteredFacilities.length }}</span>
          </span>

          <div class="flex items-center p-1 rounded-xs bg-transparent border border-neutral-200 dark:border-neutral-800 shrink-0">
            <UButton
              size="xs"
              :color="viewMode === 'grid' ? 'primary' : 'neutral'"
              :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
              icon="i-tabler-layout-grid"
              aria-label="Grid View"
              class="rounded-xs font-bold cursor-pointer"
              @click="viewMode = 'grid'"
            />
            <UButton
              size="xs"
              :color="viewMode === 'list' ? 'primary' : 'neutral'"
              :variant="viewMode === 'list' ? 'solid' : 'ghost'"
              icon="i-tabler-list"
              aria-label="List View"
              class="rounded-xs font-bold cursor-pointer"
              @click="viewMode = 'list'"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="pt-4 sm:pt-8 px-3 sm:px-6 lg:px-8">
      <div
        v-if="viewMode === 'grid' && filteredFacilities.length"
        class="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-transparent grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 lg:divide-x divide-neutral-200 dark:divide-neutral-800 w-full"
      >
        <NuxtLink
          v-for="facility in filteredFacilities"
          :key="facility.id || facility.path"
          :to="facility.path"
          class="group flex flex-col justify-between p-5 sm:p-6 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200 min-w-0 border-b last:border-b-0"
        >
          <div class="space-y-3">
            <div class="relative aspect-16/10 rounded-xs overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100 dark:bg-neutral-900">
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
                class="flex size-full items-center justify-center bg-lime-500/10 text-lime-600 dark:text-lime-400"
              >
                <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-10" />
              </div>

              <UBadge
                v-if="facility.badge"
                color="primary"
                variant="soft"
                class="absolute top-2 left-2 font-bold rounded-xs px-2 py-0.5 text-[10px] uppercase backdrop-blur-md"
              >
                {{ facility.badge }}
              </UBadge>
            </div>

            <div class="space-y-2 min-w-0">
              <div v-if="facility.capacity" class="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 truncate">
                <UIcon name="i-tabler-users" class="size-3.5 text-lime-500 shrink-0" />
                <span class="truncate">{{ facility.capacity }}</span>
              </div>

              <h2 class="text-base sm:text-lg font-extrabold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
                {{ facility.title }}
              </h2>

              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {{ facility.description }}
              </p>

              <div v-if="facility.features?.length" class="space-y-1.5 pt-1 text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                <div
                  v-for="(feat, idx) in facility.features.slice(0, 3)"
                  :key="idx"
                  class="flex items-start gap-1.5 min-w-0"
                >
                  <UIcon name="i-tabler-circle-check-filled" class="size-3.5 text-lime-500 shrink-0 mt-0.5" />
                  <span class="truncate text-[11px] leading-tight">{{ feat }}</span>
                </div>
                <div v-if="facility.features.length > 3" class="text-[10px] text-neutral-400 font-bold pl-5">
                  +{{ facility.features.length - 3 }} more
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 mt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-2">
            <div v-if="facility.pricing?.rate">
              <span class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">Rate</span>
              <span class="text-xs sm:text-sm font-extrabold text-neutral-950 dark:text-white">
                {{ facility.pricing.rate }}
                <span v-if="facility.pricing.unit" class="text-[10px] font-normal text-neutral-400">/ {{ facility.pricing.unit }}</span>
              </span>
            </div>

            <span class="text-xs font-bold text-lime-600 dark:text-lime-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0 ml-auto">
              <span>View Facility</span>
              <UIcon name="i-tabler-arrow-right" class="size-4" />
            </span>
          </div>
        </NuxtLink>
      </div>

      <div
        v-else-if="viewMode === 'list' && filteredFacilities.length"
        class="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-transparent divide-y divide-neutral-200 dark:divide-neutral-800 w-full"
      >
        <NuxtLink
          v-for="facility in filteredFacilities"
          :key="facility.id || facility.path"
          :to="facility.path"
          class="group block p-5 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200 min-w-0"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div class="flex items-start gap-4 min-w-0 flex-1 w-full sm:w-auto">
              <div class="shrink-0">
                <NuxtImg
                  v-if="getImageSrc(facility)"
                  :src="getImageSrc(facility)"
                  :alt="facility.title"
                  format="webp"
                  quality="80"
                  loading="lazy"
                  class="size-16 sm:size-24 rounded-xs object-cover border border-neutral-200 dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  v-else
                  class="flex size-16 sm:size-24 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800"
                >
                  <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-7 sm:size-8" />
                </div>
              </div>

              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-[10px]">
                  <UBadge v-if="facility.badge" color="primary" variant="soft" class="font-bold rounded-xs px-1.5 py-0.5 text-[9px] uppercase">
                    {{ facility.badge }}
                  </UBadge>
                  <span v-if="facility.capacity" class="text-neutral-500 font-bold flex items-center gap-1">
                    <UIcon name="i-tabler-users" class="size-3.5 text-lime-500" /> {{ facility.capacity }}
                  </span>
                </div>

                <h2 class="text-sm sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                  {{ facility.title }}
                </h2>

                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {{ facility.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 shrink-0">
              <div v-if="facility.pricing" class="text-left sm:text-right">
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Rate</span>
                <span class="text-xs sm:text-base font-extrabold text-neutral-950 dark:text-white">
                  {{ facility.pricing.rate }}
                  <span v-if="facility.pricing.unit" class="text-[10px] font-normal text-neutral-400">/ {{ facility.pricing.unit }}</span>
                </span>
              </div>

              <span class="inline-flex items-center gap-1 font-black uppercase text-xs text-neutral-950 bg-lime-500 group-hover:bg-lime-400 px-3.5 py-2 rounded-xs transition-colors">
                <span>View Facility</span>
                <UIcon name="i-tabler-arrow-right" class="size-4" />
              </span>
            </div>
          </div>

          <div v-if="facility.features?.length" class="mt-3 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 w-full">
            <div class="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
              <div v-for="(feat, idx) in facility.features" :key="idx" class="inline-flex items-center gap-1.5">
                <UIcon name="i-tabler-circle-check-filled" class="size-3.5 text-lime-500 shrink-0" />
                <span class="font-medium text-[11px] sm:text-xs">{{ feat }}</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else-if="hasAnyFacility" class="py-12 sm:py-20 text-center space-y-4 max-w-md mx-auto">
        <div class="flex size-14 sm:size-16 items-center justify-center rounded-xs bg-transparent border border-neutral-200 dark:border-neutral-800 mx-auto">
          <UIcon name="i-tabler-filter-off" class="size-7 sm:size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
            No Matching Facilities
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            No venues or grounds match your current search query or active filter selections. Try clearing your filters or searching for something else.
          </p>
        </div>

        <div class="pt-2">
          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-rotate-clockwise"
            class="rounded-xs font-bold text-xs px-4 py-2 cursor-pointer"
            @click="resetFilters"
          >
            Reset All Filters
          </UButton>
        </div>
      </div>

      <div v-else class="py-12 sm:py-20 text-center space-y-4 max-w-md mx-auto">
        <div class="flex size-14 sm:size-16 items-center justify-center rounded-xs bg-transparent border border-neutral-200 dark:border-neutral-800 mx-auto">
          <UIcon name="i-tabler-trees" class="size-7 sm:size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
            No Facilities Available
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            There are currently no facilities or venues listed in the catalog. Please check back later as we add new sports grounds and event spaces, or contact us directly.
          </p>
        </div>

        <div class="pt-2 flex items-center justify-center gap-3">
          <UButton
            to="/contact"
            size="sm"
            color="primary"
            icon="i-tabler-mail"
            class="rounded-xs font-bold text-xs px-4 py-2 text-neutral-950 cursor-pointer"
          >
            Contact Us
          </UButton>
          <UButton
            to="/"
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-home"
            class="rounded-xs font-bold text-xs px-4 py-2 cursor-pointer"
          >
            Return Home
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
