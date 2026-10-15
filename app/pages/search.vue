<script setup lang="ts">
import { useAdvancedSearch } from '~/composables/useAdvancedSearch'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const {
  searchQuery,
  selectedCollection,
  sortBy,
  minPrice,
  maxPrice,
  inStockOnly,
  isMobileFiltersOpen,
  openSections,
  categoryOptions,
  sortOptions,
  selectedCategoryMeta,
  fetchFullTextCatalog,
  processedResults,
  grandTotalCount,
  activeFilterCount,
  resetFilters,
  toggleSection,
} = useAdvancedSearch()

await fetchFullTextCatalog()

const pageTitle = computed(() =>
  searchQuery.value.trim()
    ? `Search results for "${searchQuery.value}" | ${LOCATION_DETAILS.company}`
    : `Search Catalog | ${LOCATION_DETAILS.company}`,
)

useSeoMeta({
  title: pageTitle,
  description: 'Search facilities, services, sports merchandise, and community activities across Recreation Yard Limited.',
  robots: 'noindex, nofollow',
  ogTitle: pageTitle,
  ogDescription: 'Search facilities, services, sports merchandise, and community activities across Recreation Yard Limited.',
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}/search`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
useSchemaOrg([{
  '@type': 'SearchResultsPage',
  '@id': `${siteUrl}/search#webpage`,
  'url': `${siteUrl}/search`,
  'name': pageTitle,
  'description': 'Search facilities, passes, merchandise, and community events.',
  'isPartOf': { '@id': `${siteUrl}/#website` },
}])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-16 transition-colors duration-300 w-full overflow-x-clip">
    <!-- Page Header Banner -->
    <div class="pt-6 sm:pt-10 pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <UContainer>
        <div class="space-y-3 text-left sm:text-center">
          <div class="inline-flex">
            <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-3 py-0.5 rounded-md">
              <UIcon name="i-tabler-search" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
              <span>Search Catalog</span>
            </UBadge>
          </div>

          <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
            Explore Recreation Yard
          </h1>

          <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Search facilities, lawn games, sports merchandise, and community activities. Use the filters below to narrow your search results.
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Sticky Search Bar & View Mode Toolbar -->
    <div class="sticky top-[var(--ui-header-height,4rem)] z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs transition-all">
      <UContainer>
        <div class="flex items-center gap-2 sm:gap-3 w-full min-w-0">
          <div class="flex-1 min-w-0">
            <UInput
              v-model="searchQuery"
              icon="i-tabler-search"
              placeholder="Type keywords to search catalog..."
              size="md"
              color="primary"
              class="w-full rounded-md"
              clearable
              autofocus
            />
          </div>

          <!-- Mobile Sidebar Filter Trigger Button -->
          <UButton
            color="neutral"
            variant="outline"
            icon="i-tabler-adjustments-horizontal"
            size="md"
            class="lg:hidden rounded-md font-bold text-xs shrink-0 uppercase cursor-pointer"
            @click="isMobileFiltersOpen = true"
          >
            <span class="hidden sm:inline">Filters</span>
            <UBadge v-if="activeFilterCount > 0" color="primary" size="sm" class="ml-0.5 sm:ml-1 rounded-md font-black text-[10px]">
              {{ activeFilterCount }}
            </UBadge>
          </UButton>

          <!-- View Mode Switcher (Grid vs List) -->
          <div class="flex items-center p-1 rounded-md bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
            <UButton
              size="xs"
              :color="viewMode === 'grid' ? 'primary' : 'neutral'"
              :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
              icon="i-tabler-layout-grid"
              aria-label="Grid View"
              class="rounded-md font-bold cursor-pointer"
              @click="viewMode = 'grid'"
            />
            <UButton
              size="xs"
              :color="viewMode === 'list' ? 'primary' : 'neutral'"
              :variant="viewMode === 'list' ? 'solid' : 'ghost'"
              icon="i-tabler-list"
              aria-label="List View"
              class="rounded-md font-bold cursor-pointer"
              @click="viewMode = 'list'"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Layout: Sidebar + Results Grid -->
    <UContainer class="pt-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <!-- Desktop Sidebar Filters -->
        <aside class="hidden lg:block lg:col-span-1 space-y-6 sticky top-[calc(var(--ui-header-height,4rem)+4.5rem)] h-fit p-4 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs">
          <div class="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div class="flex items-center gap-2">
              <UIcon name="i-tabler-adjustments-horizontal" class="size-4 text-lime-500" />
              <h3 class="font-black text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
                Filters
              </h3>
            </div>
            <UButton
              v-if="activeFilterCount > 0"
              size="xs"
              color="neutral"
              variant="link"
              class="text-[11px] font-bold text-lime-600 dark:text-lime-400 p-0 cursor-pointer"
              @click="resetFilters"
            >
              Reset
            </UButton>
          </div>

          <!-- Category Select Dropdown -->
          <div class="space-y-2">
            <label class="text-[11px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Category
            </label>
            <USelectMenu
              v-model="selectedCollection"
              :items="categoryOptions"
              :options="categoryOptions"
              value-key="id"
              label-key="label"
              value-attribute="id"
              option-attribute="label"
              searchable
              placeholder="Select Category..."
              class="w-full rounded-md"
            >
              <template #leading>
                <UIcon :name="selectedCategoryMeta.icon" class="size-4 text-lime-500 shrink-0" />
              </template>
              <template #item="{ item }">
                <div class="flex items-center gap-2 truncate">
                  <UIcon :name="item?.icon || 'i-tabler-folder'" class="size-4 text-lime-500 shrink-0" />
                  <span class="truncate">{{ item?.label }}</span>
                </div>
              </template>
            </USelectMenu>
          </div>

          <!-- Price Range Filter -->
          <div class="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <label class="text-[11px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Price Range (KES)
            </label>
            <div class="grid grid-cols-2 gap-2">
              <UInput
                v-model="minPrice"
                type="number"
                placeholder="Min"
                size="xs"
                color="neutral"
                class="rounded-md"
              />
              <UInput
                v-model="maxPrice"
                type="number"
                placeholder="Max"
                size="xs"
                color="neutral"
                class="rounded-md"
              />
            </div>
          </div>

          <!-- Availability Filter -->
          <div class="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <label class="text-[11px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Availability
            </label>
            <UCheckbox
              v-model="inStockOnly"
              label="Available Items Only"
            />
          </div>

          <!-- Sort Filter Dropdown -->
          <div class="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <label class="text-[11px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Sort Results
            </label>
            <USelectMenu
              v-model="sortBy"
              :items="sortOptions"
              :options="sortOptions"
              value-key="id"
              label-key="label"
              value-attribute="id"
              option-attribute="label"
              class="w-full rounded-md"
            />
          </div>

          <!-- Reset Button -->
          <div v-if="activeFilterCount > 0" class="pt-2">
            <UButton
              color="neutral"
              variant="soft"
              block
              size="xs"
              class="font-bold rounded-md text-[11px] cursor-pointer"
              @click="resetFilters"
            >
              Clear All Filters
            </UButton>
          </div>
        </aside>

        <!-- Search Results View -->
        <main class="lg:col-span-3 space-y-6 min-w-0 w-full">
          <!-- Active Filter Pills & Results Counter -->
          <div v-if="activeFilterCount > 0 || searchQuery" class="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-bold text-neutral-400 mr-1">Active:</span>

              <UBadge v-if="searchQuery" color="primary" variant="soft" class="rounded-md font-bold text-[11px] py-0.5 px-2 flex items-center gap-1.5">
                <span>Query: "{{ searchQuery }}"</span>
                <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="searchQuery = ''" />
              </UBadge>

              <UBadge v-if="selectedCollection !== 'all'" color="primary" variant="soft" class="rounded-md font-bold text-[11px] py-0.5 px-2 flex items-center gap-1.5">
                <span>Category: {{ selectedCategoryMeta.label }}</span>
                <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="selectedCollection = 'all'" />
              </UBadge>

              <UBadge v-if="minPrice || maxPrice" color="primary" variant="soft" class="rounded-md font-bold text-[11px] py-0.5 px-2 flex items-center gap-1.5">
                <span>KES {{ minPrice || '0' }} - {{ maxPrice || '∞' }}</span>
                <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="minPrice = ''; maxPrice = ''" />
              </UBadge>

              <UBadge v-if="inStockOnly" color="primary" variant="soft" class="rounded-md font-bold text-[11px] py-0.5 px-2 flex items-center gap-1.5">
                <span>Available Only</span>
                <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="inStockOnly = false" />
              </UBadge>

              <UButton
                size="xs"
                color="neutral"
                variant="link"
                class="text-xs font-bold text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                @click="resetFilters"
              >
                Clear All
              </UButton>
            </div>

            <span class="font-bold text-neutral-500">
              Found {{ grandTotalCount }} {{ grandTotalCount === 1 ? 'match' : 'matches' }}
            </span>
          </div>

          <!-- Search Results Groups -->
          <div v-if="processedResults.length" class="space-y-8 min-w-0 w-full">
            <div
              v-for="group in processedResults"
              :key="group.config.key"
              class="space-y-3 min-w-0 w-full"
            >
              <!-- Section Header -->
              <button
                type="button"
                class="w-full pb-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
                @click="toggleSection(group.config.key)"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <UIcon :name="group.config.icon" class="size-5 text-lime-500 shrink-0" />
                  <h2 class="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-white truncate">
                    {{ group.config.label }}
                  </h2>
                  <UBadge color="primary" variant="soft" size="sm" class="rounded-md font-bold text-xs px-2 shrink-0">
                    {{ group.items.length }}
                  </UBadge>
                </div>

                <UIcon
                  name="i-tabler-chevron-down"
                  class="size-4 text-neutral-400 transition-transform duration-200 shrink-0"
                  :class="{ 'rotate-180': openSections[group.config.key] }"
                />
              </button>

              <!-- 1. Grid View Option (Clickable Cards with 4-Side Hover Borders) -->
              <div
                v-if="viewMode === 'grid' && openSections[group.config.key]"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2"
              >
                <NuxtLink
                  v-for="item in group.items"
                  :key="item.id"
                  :to="item.path"
                  class="group flex flex-col justify-between p-4 rounded-md bg-white dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs hover:shadow-md min-w-0"
                >
                  <div class="space-y-3">
                    <div class="relative aspect-16/10 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
                      <NuxtImg
                        v-if="item.image"
                        :src="item.image"
                        :alt="item.title"
                        format="webp"
                        quality="80"
                        loading="lazy"
                        class="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        v-else
                        class="flex size-full items-center justify-center bg-lime-500/10 text-lime-600 dark:text-lime-400"
                      >
                        <UIcon :name="item.icon" class="size-8" />
                      </div>

                      <UBadge
                        v-if="item.badge"
                        color="neutral"
                        variant="subtle"
                        class="absolute top-2 left-2 font-bold rounded-md px-1.5 py-0.5 text-[9px] uppercase backdrop-blur-md"
                      >
                        {{ item.badge }}
                      </UBadge>
                    </div>

                    <div class="space-y-1 min-w-0">
                      <span v-if="item.meta" class="text-[10px] text-neutral-400 font-bold block">
                        {{ item.meta }}
                      </span>

                      <h3 class="text-base font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
                        {{ item.title }}
                      </h3>

                      <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                        {{ item.description }}
                      </p>

                      <div v-if="item.snippet" class="text-[11px] text-lime-600 dark:text-lime-400 font-medium leading-relaxed mt-1 flex items-start gap-1">
                        <span class="font-bold text-[10px] uppercase text-lime-700 dark:text-lime-300 shrink-0">Match:</span>
                        <span class="line-clamp-2">{{ item.snippet }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="pt-3 mt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-bold text-lime-600 dark:text-lime-400">
                    <span>View Details</span>
                    <UIcon name="i-tabler-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </NuxtLink>
              </div>

              <!-- 2. Flat List Row View Option (Clickable Cards) -->
              <div
                v-else-if="viewMode === 'list' && openSections[group.config.key]"
                class="space-y-3 pt-2 min-w-0 w-full"
              >
                <NuxtLink
                  v-for="item in group.items"
                  :key="item.id"
                  :to="item.path"
                  class="group block p-4 sm:p-5 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs hover:shadow-md min-w-0"
                >
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="flex items-start gap-3.5 min-w-0 flex-1 w-full sm:w-auto">
                      <NuxtImg
                        v-if="item.image"
                        :src="item.image"
                        :alt="item.title"
                        format="webp"
                        quality="80"
                        loading="lazy"
                        class="size-14 sm:size-16 shrink-0 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        v-else
                        class="flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800"
                      >
                        <UIcon :name="item.icon" class="size-6 sm:size-7" />
                      </div>

                      <div class="space-y-1 min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2 text-[10px]">
                          <UBadge v-if="item.badge" color="neutral" variant="subtle" class="font-bold rounded-md px-1.5 py-0.5 text-[9px] uppercase shrink-0">
                            {{ item.badge }}
                          </UBadge>
                          <span v-if="item.meta" class="text-neutral-400 font-medium truncate">• {{ item.meta }}</span>
                        </div>

                        <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                          {{ item.title }}
                        </h3>

                        <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                          {{ item.description }}
                        </p>

                        <!-- Body Snippet Match -->
                        <div v-if="item.snippet" class="text-[11px] text-lime-600 dark:text-lime-400 font-medium leading-relaxed mt-1 flex items-start gap-1 min-w-0">
                          <span class="font-bold text-[10px] uppercase text-lime-700 dark:text-lime-300 shrink-0">Match:</span>
                          <span class="line-clamp-2 min-w-0">{{ item.snippet }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800/60 shrink-0">
                      <span class="inline-flex items-center gap-1 font-black uppercase text-xs text-neutral-950 dark:text-white bg-lime-500 group-hover:bg-lime-400 px-3.5 py-2 rounded-md transition-colors">
                        <span>View Details</span>
                        <UIcon name="i-tabler-arrow-right" class="size-4" />
                      </span>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="py-20 text-center space-y-4 max-w-md mx-auto">
            <div class="flex size-16 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
              <UIcon name="i-tabler-search-off" class="size-8 text-neutral-400 dark:text-neutral-500" />
            </div>
            <div class="space-y-1">
              <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
                No matches found
              </h3>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                We couldn't find anything matching "<span class="font-bold text-neutral-800 dark:text-neutral-200">{{ searchQuery }}</span>".
              </p>
            </div>
            <div class="pt-2">
              <UButton
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-tabler-rotate-clockwise"
                class="rounded-md font-bold text-xs px-4 py-2 cursor-pointer"
                @click="resetFilters"
              >
                Clear Search Filters
              </UButton>
            </div>
          </div>
        </main>
      </div>
    </UContainer>

    <!-- Mobile Slideover Drawer -->
    <USlideover
      v-model:open="isMobileFiltersOpen"
      title="Search Filters"
      description="Filter by category, price, availability, and sorting"
    >
      <template #content>
        <div class="flex h-full flex-col justify-between p-6 space-y-6 overflow-y-auto">
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div class="flex items-center gap-2">
                <UIcon name="i-tabler-adjustments-horizontal" class="size-5 text-lime-500" />
                <h3 class="font-extrabold text-base text-neutral-950 dark:text-white">
                  Filter Catalog
                </h3>
              </div>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-tabler-x"
                aria-label="Close filters"
                class="rounded-md cursor-pointer"
                @click="isMobileFiltersOpen = false"
              />
            </div>

            <!-- Category -->
            <div class="space-y-2">
              <label class="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Category
              </label>
              <USelectMenu
                v-model="selectedCollection"
                :items="categoryOptions"
                :options="categoryOptions"
                value-key="id"
                label-key="label"
                value-attribute="id"
                option-attribute="label"
                searchable
                placeholder="Select Category..."
                class="w-full rounded-md"
              >
                <template #leading>
                  <UIcon :name="selectedCategoryMeta.icon" class="size-4 text-lime-500 shrink-0" />
                </template>
                <template #item="{ item }">
                  <div class="flex items-center gap-2 truncate">
                    <UIcon :name="item?.icon || 'i-tabler-folder'" class="size-4 text-lime-500 shrink-0" />
                    <span class="truncate">{{ item?.label }}</span>
                  </div>
                </template>
              </USelectMenu>
            </div>

            <!-- Price -->
            <div class="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <label class="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Price Range (KES)
              </label>
              <div class="grid grid-cols-2 gap-3">
                <UInput
                  v-model="minPrice"
                  type="number"
                  placeholder="Min KES"
                  size="sm"
                  color="neutral"
                  class="rounded-md"
                />
                <UInput
                  v-model="maxPrice"
                  type="number"
                  placeholder="Max KES"
                  size="sm"
                  color="neutral"
                  class="rounded-md"
                />
              </div>
            </div>

            <!-- Availability -->
            <div class="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <label class="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Availability
              </label>
              <UCheckbox
                v-model="inStockOnly"
                label="Available Items Only"
              />
            </div>

            <!-- Sort -->
            <div class="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <label class="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Sort By
              </label>
              <USelectMenu
                v-model="sortBy"
                :items="sortOptions"
                :options="sortOptions"
                value-key="id"
                label-key="label"
                value-attribute="id"
                option-attribute="label"
                class="w-full rounded-md"
              />
            </div>
          </div>

          <div class="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
            <UButton
              color="primary"
              block
              size="lg"
              class="font-black uppercase text-xs rounded-md text-neutral-950 cursor-pointer justify-center"
              @click="isMobileFiltersOpen = false"
            >
              Apply Filters ({{ grandTotalCount }} matches)
            </UButton>

            <UButton
              color="neutral"
              variant="outline"
              block
              size="md"
              class="font-bold text-xs rounded-md cursor-pointer justify-center"
              @click="resetFilters()"
            >
              Reset Filters
            </UButton>
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>
