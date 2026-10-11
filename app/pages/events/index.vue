<script setup lang="ts">
import { useEventsCatalog } from '~/composables/useEventsCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const {
  events,
  searchQuery,
  selectedCategory,
  sortBy,
  categoryOptions,
  sortOptions,
  selectedCategoryMeta,
  filteredEvents,
  getImageSrc,
  resetFilters,
} = await useEventsCatalog()

// Evaluates whether any events exist overall in the database catalog
const hasAnyEvent = computed(() => (events.value?.length || 0) > 0)

useSeoMeta({
  title: `Events & Tournaments | ${LOCATION_DETAILS.company}`,
  description: 'Upcoming sports tournaments, family weekend festivals, and community marathons in Kericho.',
})
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
          <UIcon name="i-tabler-calendar-event" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
          <span>Community & Sports</span>
        </UBadge>
      </div>

      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
        Upcoming Events & Tournaments
      </h1>

      <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-0 sm:mx-auto">
        From lawn tennis opens and highland trail marathons to weekend family BBQ festivals — discover upcoming activities in Kericho.
      </p>
    </div>

    <!-- Sticky Search, Filter & View Toggle Toolbar -->
    <div class="sticky top-(--ui-header-height,4rem) z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs transition-all">
      <UContainer class="max-w-5xl">
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          <!-- Event Search Input -->
          <UInput
            v-model="searchQuery"
            icon="i-tabler-search"
            placeholder="Search events, locations, or topics..."
            size="md"
            color="primary"
            class="w-full md:w-80 shadow-xs rounded-xl"
            clearable
          />

          <!-- Controls Group: Category, Sorting & View Mode -->
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
              placeholder="Filter Category..."
              class="w-44 shrink-0"
            >
              <template #leading>
                <UIcon :name="selectedCategoryMeta.icon" class="size-4 text-lime-500 shrink-0" />
              </template>
              <template #item="{ item }">
                <div class="flex items-center gap-2 truncate">
                  <UIcon :name="item?.icon || 'i-tabler-calendar-event'" class="size-4 text-lime-500 shrink-0" />
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
          Showing {{ filteredEvents.length }} {{ filteredEvents.length === 1 ? 'event' : 'events' }}
        </span>
      </div>

      <!-- 1. Grid View Option -->
      <div
        v-if="viewMode === 'grid' && filteredEvents.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
      >
        <NuxtLink
          v-for="event in filteredEvents"
          :key="event.id || event.path"
          :to="event.path"
          class="group flex flex-col justify-between transition-all duration-300"
        >
          <div class="space-y-3">
            <!-- Thumbnail Image -->
            <div class="relative aspect-16/10 rounded-2xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-100 dark:bg-neutral-900">
              <NuxtImg
                v-if="getImageSrc(event)"
                :src="getImageSrc(event)"
                :alt="event.title"
                format="webp"
                quality="80"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="flex size-full items-center justify-center bg-lime-500/10 text-lime-600 dark:text-lime-400"
              >
                <UIcon name="i-tabler-calendar-event" class="size-10" />
              </div>

              <UBadge
                v-if="event.badge"
                color="primary"
                variant="soft"
                class="absolute top-2.5 left-2.5 font-bold rounded-lg px-2.5 py-0.5 text-[10px] uppercase backdrop-blur-md"
              >
                {{ event.badge }}
              </UBadge>
            </div>

            <!-- Details -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                <UBadge v-if="event.category" color="neutral" variant="subtle" class="rounded px-1.5 py-0.5 uppercase text-[9px]">
                  {{ event.category }}
                </UBadge>
                <span v-if="event.date" class="text-neutral-500 flex items-center gap-1">
                  <UIcon name="i-tabler-calendar" class="size-3.5 text-lime-500" /> {{ event.date }}
                </span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
                {{ event.title }}
              </h2>

              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {{ event.description }}
              </p>

              <div v-if="event.location" class="flex items-center gap-1 text-[11px] text-neutral-400 pt-1 font-medium">
                <UIcon name="i-tabler-map-pin" class="size-3.5 text-lime-500 shrink-0" />
                <span class="truncate">{{ event.location }}</span>
              </div>
            </div>
          </div>

          <div class="pt-3 mt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-2">
            <div>
              <span class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">Entry Fee</span>
              <span class="text-sm font-extrabold text-lime-600 dark:text-lime-400">
                {{ event.entryFee || 'Free Entry' }}
              </span>
            </div>

            <span class="text-xs font-bold text-lime-600 dark:text-lime-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              {{ event.cta?.label || 'Details' }}
              <UIcon name="i-tabler-arrow-right" class="size-3.5" />
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Flat List Row View Option -->
      <div
        v-else-if="viewMode === 'list' && filteredEvents.length"
        class="divide-y divide-neutral-200/70 dark:divide-neutral-800/70"
      >
        <div
          v-for="event in filteredEvents"
          :key="event.id || event.path"
          class="group py-5 transition-colors"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <!-- Thumbnail & Event Details -->
            <div class="flex items-start gap-4 min-w-0 flex-1">
              <NuxtLink :to="event.path" class="shrink-0">
                <NuxtImg
                  v-if="getImageSrc(event)"
                  :src="getImageSrc(event)"
                  :alt="event.title"
                  format="webp"
                  quality="80"
                  loading="lazy"
                  class="size-20 sm:size-24 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  v-else
                  class="flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800"
                >
                  <UIcon name="i-tabler-calendar-event" class="size-8" />
                </div>
              </NuxtLink>

              <div class="space-y-1.5 min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-[10px]">
                  <UBadge v-if="event.category" color="neutral" variant="subtle" class="font-bold rounded px-1.5 py-0.5 text-[9px] uppercase">
                    {{ event.category }}
                  </UBadge>
                  <UBadge v-if="event.badge" color="primary" variant="soft" class="font-bold rounded px-1.5 py-0.5 text-[9px]">
                    {{ event.badge }}
                  </UBadge>
                  <span v-if="event.date" class="text-neutral-500 font-bold flex items-center gap-1">
                    <UIcon name="i-tabler-calendar" class="size-3.5 text-lime-500" /> {{ event.date }}
                  </span>
                  <span v-if="event.location" class="text-neutral-400 font-medium hidden sm:inline-flex items-center gap-0.5">
                    • <UIcon name="i-tabler-map-pin" class="size-3 text-neutral-400" /> {{ event.location }}
                  </span>
                </div>

                <h2 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                  <NuxtLink :to="event.path">
                    {{ event.title }}
                  </NuxtLink>
                </h2>

                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed max-w-2xl">
                  {{ event.description }}
                </p>
              </div>
            </div>

            <!-- Entry Fee & Action Button -->
            <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 shrink-0">
              <div class="text-left sm:text-right">
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Entry Fee</span>
                <span class="text-sm sm:text-base font-extrabold text-lime-600 dark:text-lime-400">
                  {{ event.entryFee || 'Free Entry' }}
                </span>
              </div>

              <UButton
                :to="event.path"
                color="primary"
                size="sm"
                icon="i-tabler-arrow-right"
                trailing
                class="font-black uppercase text-xs text-neutral-950 rounded-xl px-4 py-2"
              >
                {{ event.cta?.label || 'Event Details' }}
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Empty State -->
      <div v-else-if="hasAnyEvent" class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-filter-off" class="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
            No Matching Events
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            No tournaments or events match your current search query or active filter selections. Try clearing your filters or searching for something else.
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
          <UIcon name="i-tabler-calendar-off" class="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
            No Events Available
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            There are currently no upcoming events or tournaments scheduled. Please check back later as we post new community activities, or contact us directly.
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
