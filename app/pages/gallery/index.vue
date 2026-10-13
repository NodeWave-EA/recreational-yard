<script setup lang="ts">
import { useGalleryCatalog } from '~/composables/useGalleryCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const {
  collections,
  searchQuery,
  selectedCategory,
  sortBy,
  categoryOptions,
  sortOptions,
  selectedCategoryMeta,
  filteredCollections,
  getCoverImageSrc,
  resetFilters,
} = await useGalleryCatalog()

// Evaluates whether any collections exist overall in the database catalog
const hasAnyCollection = computed(() => (collections.value?.length || 0) > 0)

useSeoMeta({
  title: `Photo Gallery & Collections | ${LOCATION_DETAILS.company}`,
  description: 'Explore high-resolution photo collections from our lawn tennis opens, tea estate vistas, and recreation grounds.',
  ogTitle: `Photo Gallery & Collections | ${LOCATION_DETAILS.company}`,
  ogDescription: 'Explore high-resolution photo collections from our lawn tennis opens, tea estate vistas, and recreation grounds.',
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}/gallery`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
useSchemaOrg([{
  '@type': 'CollectionPage',
  '@id': `${siteUrl}/gallery#webpage`,
  'url': `${siteUrl}/gallery`,
  'name': `Photo Gallery & Collections | ${LOCATION_DETAILS.company}`,
  'description': 'Explore high-resolution photo collections from our lawn tennis opens, tea estate vistas, and recreation grounds.',
  'isPartOf': { '@id': `${siteUrl}/#website` },
  'about': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-16 transition-colors duration-300">
    <!-- Left-Aligned Mobile Hero Banner -->
    <div class="pt-6 sm:pt-10 pb-2 sm:pb-4 text-left sm:text-center space-y-3 max-w-3xl mx-auto px-4">
      <div class="inline-flex">
        <UBadge
          color="primary"
          variant="soft"
          class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-3.5 py-1 sm:py-0.5 rounded-full"
        >
          <UIcon name="i-tabler-photo" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
          <span>Visual Collections</span>
        </UBadge>
      </div>

      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
        Yard Photo Gallery
      </h1>

      <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-0 sm:mx-auto">
        A curated showcase of lawn sports action, highland tea garden panoramas, and community gatherings in Kericho.
      </p>
    </div>

    <!-- Sticky Search, Filter & View Toggle Toolbar -->
    <div class="sticky top-(--ui-header-height,4rem) z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs transition-all">
      <UContainer class="max-w-5xl">
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          <!-- Gallery Search Input -->
          <UInput
            v-model="searchQuery"
            icon="i-tabler-search"
            placeholder="Search galleries or topics..."
            size="md"
            color="primary"
            class="w-full md:w-80 shadow-xs rounded-xl"
            clearable
          />

          <!-- Controls Group: Category, Sorting & View Mode Switcher -->
          <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <!-- Category Dropdown -->
            <USelectMenu
              v-model="selectedCategory"
              :items="categoryOptions"
              :options="categoryOptions"
              value-key="id"
              label-key="label"
              value-attribute="id"
              option-attribute="label"
              searchable
              placeholder="Filter Category..."
              class="w-44 shrink-0"
            >
              <template #leading>
                <UIcon :name="selectedCategoryMeta.icon" class="size-4 text-lime-500 shrink-0" />
              </template>
              <template #item="{ item }">
                <div class="flex items-center gap-2 truncate">
                  <UIcon :name="item?.icon || 'i-tabler-photo'" class="size-4 text-lime-500 shrink-0" />
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

    <!-- Main Content Container -->
    <UContainer class="max-w-5xl pt-6">
      <!-- Active Filter Summary -->
      <div v-if="selectedCategory !== 'all' || searchQuery" class="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-bold text-neutral-400">Active Filters:</span>
          <UBadge v-if="searchQuery" color="primary" variant="soft" class="rounded-lg font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Query: "{{ searchQuery }}"</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="searchQuery = ''" />
          </UBadge>
          <UBadge v-if="selectedCategory !== 'all'" color="primary" variant="soft" class="rounded-lg font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Category: {{ selectedCategoryMeta.label }}</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="selectedCategory = 'all'" />
          </UBadge>
          <UButton size="xs" color="neutral" variant="link" class="text-xs font-bold text-neutral-400" @click="resetFilters">
            Clear All
          </UButton>
        </div>
        <span class="font-bold text-neutral-500">
          Showing {{ filteredCollections.length }} {{ filteredCollections.length === 1 ? 'collection' : 'collections' }}
        </span>
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
          class="group flex flex-col justify-between transition-all duration-300"
        >
          <div class="space-y-3">
            <!-- Thumbnail Image Cover -->
            <div class="relative aspect-16/10 rounded-2xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-100 dark:bg-neutral-900">
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
                class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-neutral-900/80 text-white font-bold text-[10px] backdrop-blur-md border border-white/10 flex items-center gap-1"
              >
                <UIcon name="i-tabler-photo" class="size-3 text-lime-400" />
                {{ collection.photos.length }}
              </span>
            </div>

            <!-- Details -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                <UBadge v-if="collection.category" color="neutral" variant="subtle" class="rounded px-1.5 py-0.5 uppercase text-[9px]">
                  {{ collection.category }}
                </UBadge>
                <span v-if="collection.date" class="text-neutral-500 flex items-center gap-1">
                  <UIcon name="i-tabler-calendar" class="size-3.5 text-lime-500" /> {{ collection.date }}
                </span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
                {{ collection.title }}
              </h2>

              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {{ collection.description }}
              </p>
            </div>
          </div>

          <div class="pt-3 mt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between">
            <span class="text-xs font-bold text-lime-600 dark:text-lime-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Explore Collection
            </span>
            <UIcon name="i-tabler-arrow-right" class="size-4 text-neutral-400 group-hover:text-lime-500 transition-colors" />
          </div>
        </NuxtLink>
      </div>

      <!-- Flat List Row View Option -->
      <div
        v-else-if="viewMode === 'list' && filteredCollections.length"
        class="divide-y divide-neutral-200/70 dark:divide-neutral-800/70"
      >
        <div
          v-for="collection in filteredCollections"
          :key="collection.path"
          class="group py-5 transition-colors"
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
                  class="size-20 sm:size-24 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  v-else
                  class="flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800"
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
                  <span v-if="collection.photos?.length" class="text-neutral-500 font-bold flex items-center gap-1">
                    <UIcon name="i-tabler-photo" class="size-3.5 text-lime-500" /> {{ collection.photos.length }} Photos
                  </span>
                  <span v-if="collection.date" class="text-neutral-400 font-medium hidden sm:inline-flex items-center gap-0.5">
                    • {{ collection.date }}
                  </span>
                </div>

                <h2 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                  <NuxtLink :to="collection.path">
                    {{ collection.title }}
                  </NuxtLink>
                </h2>

                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed max-w-2xl">
                  {{ collection.description }}
                </p>
              </div>
            </div>

            <!-- Action Button -->
            <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 shrink-0">
              <UButton
                :to="collection.path"
                color="primary"
                size="sm"
                icon="i-tabler-arrow-right"
                trailing
                class="font-black uppercase text-xs text-neutral-950 rounded-xl px-4 py-2 w-full sm:w-auto justify-center"
              >
                View Collection
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Empty State -->
      <div v-else-if="hasAnyCollection" class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-filter-off" class="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
            No Matching Collections
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            No photo galleries match your current search query or active filter selections. Try clearing your filters or searching for something else.
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
          <UIcon name="i-tabler-photo-off" class="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
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
