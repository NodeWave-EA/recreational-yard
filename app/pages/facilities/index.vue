<script setup lang="ts">
import { useFacilitiesCatalog } from '~/composables/useFacilitiesCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const {
  facilities,
  searchQuery,
  selectedCategory,
  sortBy,
  categoryOptions,
  sortOptions,
  selectedCategoryMeta,
  filteredFacilities,
  getImageSrc,
  resetFilters,
} = await useFacilitiesCatalog()

// Evaluates whether any facilities exist in the database catalog overall
const hasAnyFacility = computed(() => (facilities.value?.length || 0) > 0)

useSeoMeta({
  title: `Facilities | ${LOCATION_DETAILS.company}`,
  description: 'Explore our sports grounds, outdoor recreation spaces, and event venues in Kericho.',
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-16 transition-colors duration-300">
    <!-- Left-Aligned Mobile Header -->
    <div class="pt-6 sm:pt-10 pb-2 sm:pb-4 text-left sm:text-center space-y-3 max-w-3xl mx-auto px-4">
      <div class="inline-flex">
        <UBadge
          color="primary"
          variant="soft"
          class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-3.5 py-1 sm:py-0.5 rounded-full"
        >
          <UIcon name="i-tabler-trees" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
          <span>Our Venues & Grounds</span>
        </UBadge>
      </div>

      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
        Explore Our Facilities
      </h1>

      <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-0 sm:mx-auto">
        Discover a variety of sports grounds, outdoor recreation spaces, and event venues in Kericho. Use the search and filter options below to find the perfect facility for your needs.
      </p>
    </div>

    <!-- Sticky Search, Filter & View Mode Toolbar -->
    <div class="sticky top-(--ui-header-height,4rem) z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs transition-all">
      <UContainer class="max-w-5xl">
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          <!-- Facility Search Input -->
          <UInput
            v-model="searchQuery"
            icon="i-tabler-search"
            placeholder="Search grounds, courts, or amenities..."
            size="md"
            color="primary"
            class="w-full md:w-80 shadow-xs rounded-xl"
            clearable
          />

          <!-- Controls Group: Category, Sorting & View Toggle -->
          <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <!-- Category Search Dropdown -->
            <USelectMenu
              v-model="selectedCategory"
              :items="categoryOptions"
              :options="categoryOptions"
              value-key="id"
              label-key="label"
              value-attribute="id"
              option-attribute="label"
              searchable
              placeholder="Filter Venue..."
              class="w-44 shrink-0"
            >
              <template #leading>
                <UIcon :name="selectedCategoryMeta.icon" class="size-4 text-lime-500 shrink-0" />
              </template>
              <template #item="{ item }">
                <div class="flex items-center gap-2 truncate">
                  <UIcon :name="item?.icon || 'i-tabler-trees'" class="size-4 text-lime-500 shrink-0" />
                  <span class="truncate">{{ item?.label }}</span>
                </div>
              </template>
            </USelectMenu>

            <!-- Sort Dropdown -->
            <USelectMenu
              v-model="sortBy"
              :items="sortOptions"
              :options="sortOptions"
              value-key="id"
              label-key="label"
              value-attribute="id"
              option-attribute="label"
              class="w-40 shrink-0"
            />

            <!-- View Mode Switcher (Grid vs List) -->
            <div class="flex items-center p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
              <UButton
                size="xs"
                :color="viewMode === 'grid' ? 'primary' : 'neutral'"
                :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
                icon="i-tabler-layout-grid"
                aria-label="Grid View"
                class="rounded-lg font-bold"
                @click="viewMode = 'grid'"
              />
              <UButton
                size="xs"
                :color="viewMode === 'list' ? 'primary' : 'neutral'"
                :variant="viewMode === 'list' ? 'solid' : 'ghost'"
                icon="i-tabler-list"
                aria-label="List View"
                class="rounded-lg font-bold"
                @click="viewMode = 'list'"
              />
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content Display -->
    <UContainer class="max-w-5xl pt-6">
      <!-- Active Filter Summary Bar -->
      <div v-if="selectedCategory !== 'all' || searchQuery" class="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-bold text-neutral-400">Active Filters:</span>
          <UBadge v-if="searchQuery" color="primary" variant="soft" class="rounded-lg font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Query: "{{ searchQuery }}"</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="searchQuery = ''" />
          </UBadge>
          <UBadge v-if="selectedCategory !== 'all'" color="primary" variant="soft" class="rounded-lg font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Venue: {{ selectedCategoryMeta.label }}</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="selectedCategory = 'all'" />
          </UBadge>
          <UButton size="xs" color="neutral" variant="link" class="text-xs font-bold text-neutral-400" @click="resetFilters">
            Clear All
          </UButton>
        </div>
        <span class="font-bold text-neutral-500">
          Showing {{ filteredFacilities.length }} {{ filteredFacilities.length === 1 ? 'venue' : 'venues' }}
        </span>
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
            <div class="relative aspect-16/10 rounded-2xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-100 dark:bg-neutral-900">
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
                class="absolute top-2.5 left-2.5 font-bold rounded-lg px-2.5 py-0.5 text-[10px] uppercase backdrop-blur-md"
              >
                {{ facility.badge }}
              </UBadge>
            </div>

            <!-- Details -->
            <div class="space-y-2">
              <div v-if="facility.capacity" class="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 truncate">
                <UIcon name="i-tabler-users" class="size-3.5 text-lime-500 shrink-0" />
                <span class="truncate">{{ facility.capacity }}</span>
              </div>

              <h2 class="text-lg font-extrabold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
                {{ facility.title }}
              </h2>

              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {{ facility.description }}
              </p>

              <!-- Feature List -->
              <div v-if="facility.features?.length" class="space-y-1.5 pt-1.5 text-xs text-neutral-600 dark:text-neutral-300 font-medium">
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

          <!-- Footer with Rate & Action -->
          <div class="pt-3 mt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-2">
            <div v-if="facility.pricing?.rate">
              <span class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">Rate</span>
              <span class="text-sm font-extrabold text-neutral-950 dark:text-white">
                {{ facility.pricing.rate }}
                <span v-if="facility.pricing.unit" class="text-[10px] font-normal text-neutral-400">/ {{ facility.pricing.unit }}</span>
              </span>
            </div>

            <span class="text-xs font-bold text-lime-600 dark:text-lime-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
              View Facility
              <UIcon name="i-tabler-arrow-right" class="size-4" />
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Flat Row List View Option -->
      <div
        v-else-if="viewMode === 'list' && filteredFacilities.length"
        class="divide-y divide-neutral-200/70 dark:divide-neutral-800/70"
      >
        <div
          v-for="facility in filteredFacilities"
          :key="facility.id || facility.path"
          class="group py-5 transition-colors"
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
                  class="size-20 sm:size-24 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  v-else
                  class="flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800"
                >
                  <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-8" />
                </div>
              </NuxtLink>

              <div class="space-y-1.5 min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-[10px]">
                  <UBadge v-if="facility.badge" color="primary" variant="soft" class="font-bold rounded px-1.5 py-0.5 text-[9px] uppercase">
                    {{ facility.badge }}
                  </UBadge>
                  <span v-if="facility.capacity" class="text-neutral-500 font-bold flex items-center gap-1">
                    <UIcon name="i-tabler-users" class="size-3.5 text-lime-500" /> {{ facility.capacity }}
                  </span>
                </div>

                <h2 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                  <NuxtLink :to="facility.path">
                    {{ facility.title }}
                  </NuxtLink>
                </h2>

                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed max-w-2xl">
                  {{ facility.description }}
                </p>
              </div>
            </div>

            <!-- Rate & Action Button -->
            <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 shrink-0">
              <div v-if="facility.pricing" class="text-left sm:text-right">
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Rate</span>
                <span class="text-sm sm:text-base font-extrabold text-neutral-950 dark:text-white">
                  {{ facility.pricing.rate }}
                  <span v-if="facility.pricing.unit" class="text-[10px] font-normal text-neutral-400">/ {{ facility.pricing.unit }}</span>
                </span>
              </div>

              <UButton
                :to="facility.path"
                color="primary"
                size="sm"
                icon="i-tabler-arrow-right"
                trailing
                class="font-black uppercase text-xs text-neutral-950 rounded-xl px-4 py-2"
              >
                View Facility
              </UButton>
            </div>
          </div>

          <!-- Bottom Row: Features -->
          <div v-if="facility.features?.length" class="mt-3.5 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 w-full">
            <div class="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
              <div v-for="(feat, idx) in facility.features" :key="idx" class="inline-flex items-center gap-1.5">
                <UIcon name="i-tabler-circle-check-filled" class="size-4 text-lime-500 shrink-0" />
                <span class="font-medium">{{ feat }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Empty State -->
      <div v-else-if="hasAnyFacility" class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-filter-off" class="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
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
            class="rounded-xl font-bold text-xs px-4 py-2 cursor-pointer"
            @click="resetFilters"
          >
            Reset All Filters
          </UButton>
        </div>
      </div>

      <!-- Catalog Empty State -->
      <div v-else class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-trees-off" class="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
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
            class="rounded-xl font-bold text-xs px-4 py-2 text-neutral-950 cursor-pointer"
          >
            Contact Us
          </UButton>
          <UButton
            to="/"
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-home"
            class="rounded-xl font-bold text-xs px-4 py-2 cursor-pointer"
          >
            Return Home
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
