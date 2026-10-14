<script setup lang="ts">
import { useEventsCatalog } from '~/composables/useEventsCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const {
  events,
  searchQuery,
  selectedCategory,
  selectedStatus,
  sortBy,
  categoryOptions,
  statusOptions,
  sortOptions,
  selectedCategoryMeta,
  filteredEvents,
  getImageSrc,
  getStatusBadge,
  resetFilters,
} = await useEventsCatalog()

// Evaluates whether any events exist overall in the database catalog
const hasAnyEvent = computed(() => (events.value?.length || 0) > 0)

useSeoMeta({
  title: `Events & Tournaments | ${LOCATION_DETAILS.company}`,
  description: 'Upcoming sports tournaments, family weekend festivals, and community marathons in Kericho.',
  ogTitle: `Events & Tournaments | ${LOCATION_DETAILS.company}`,
  ogDescription: 'Upcoming sports tournaments, family weekend festivals, and community marathons in Kericho.',
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}/events`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
useSchemaOrg([{
  '@type': 'CollectionPage',
  '@id': `${siteUrl}/events#webpage`,
  'url': `${siteUrl}/events`,
  'name': `Events & Tournaments | ${LOCATION_DETAILS.company}`,
  'description': 'Upcoming sports tournaments, family weekend festivals, and community marathons in Kericho.',
  'isPartOf': { '@id': `${siteUrl}/#website` },
  'about': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-20 transition-colors duration-300">
    <!-- Hero Header Banner -->
    <div class="pt-8 sm:pt-12 pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <UContainer>
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="space-y-2.5 max-w-3xl">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] px-3 py-0.5 rounded-full"
            >
              <UIcon name="i-tabler-calendar-event" class="size-3.5 mr-1 text-lime-500 shrink-0" />
              <span>Community & Sports</span>
            </UBadge>

            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
              Events & Tournaments
            </h1>

            <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Discover Recreation Yard Runners, group experiences, community activities and partnership opportunities in Kericho.
            </p>
          </div>

          <div class="shrink-0 text-xs font-bold text-neutral-400">
            Total Scheduled: <span class="text-lime-600 dark:text-lime-400 font-extrabold text-sm">{{ filteredEvents.length }}</span>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Sticky Controls Toolbar -->
    <div class="sticky top-(--ui-header-height,4rem) z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-4 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <UContainer>
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <!-- Search Input -->
          <div class="w-full md:w-80 shrink-0">
            <UInput
              v-model="searchQuery"
              icon="i-tabler-search"
              placeholder="Search events, tags, or locations..."
              size="md"
              color="primary"
              class="w-full rounded-xl"
              clearable
            />
          </div>

          <!-- Filter Dropdowns & View Switcher -->
          <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
            <USelectMenu
              v-model="selectedCategory"
              :items="categoryOptions"
              value-key="id"
              label-key="label"
              placeholder="Category..."
              class="w-full sm:w-44 shrink-0"
            >
              <template #leading>
                <UIcon :name="selectedCategoryMeta?.icon" class="size-4 text-lime-500 shrink-0" />
              </template>
            </USelectMenu>

            <USelectMenu
              v-model="selectedStatus"
              :items="statusOptions"
              value-key="id"
              label-key="label"
              placeholder="Status..."
              class="w-full sm:w-36 shrink-0"
            />

            <USelectMenu
              v-model="sortBy"
              :items="sortOptions"
              value-key="id"
              label-key="label"
              class="w-full sm:w-44 shrink-0"
            />

            <!-- Grid vs List View Toggle -->
            <div class="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0 ml-auto md:ml-0">
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

    <!-- Main Content -->
    <UContainer class="pt-8">
      <!-- Active Filter -->
      <div v-if="selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery" class="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-bold text-neutral-400">Active Filters:</span>
          <UBadge v-if="searchQuery" color="primary" variant="soft" class="rounded-md font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Query: "{{ searchQuery }}"</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="searchQuery = ''" />
          </UBadge>
          <UBadge v-if="selectedCategory !== 'all'" color="primary" variant="soft" class="rounded-md font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <UIcon :name="selectedCategoryMeta?.icon" class="size-4 text-lime-500 shrink-0" />
            <span>Category: {{ selectedCategoryMeta?.label }}</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="selectedCategory = 'all'" />
          </UBadge>
          <UBadge v-if="selectedStatus !== 'all'" color="primary" variant="soft" class="rounded-md font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Status: {{ selectedStatus }}</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="selectedStatus = 'all'" />
          </UBadge>
          <UButton size="xs" color="neutral" variant="link" class="text-xs font-bold text-neutral-400" @click="resetFilters">
            Clear All
          </UButton>
        </div>
      </div>

      <!-- Grid View Option -->
      <div
        v-if="viewMode === 'grid' && filteredEvents.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
      >
        <NuxtLink
          v-for="event in filteredEvents"
          :key="event.id || event.path"
          :to="event.path"
          class="group flex flex-col justify-between transition-all duration-300"
        >
          <div class="space-y-3.5">
            <!-- Thumbnail Image -->
            <div class="relative aspect-16/10 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-900">
              <NuxtImg
                v-if="getImageSrc(event)"
                :src="getImageSrc(event)"
                :alt="event.title"
                format="webp"
                quality="85"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="flex size-full items-center justify-center bg-lime-500/10 text-lime-600 dark:text-lime-400">
                <UIcon name="i-tabler-calendar-event" class="size-12" />
              </div>

              <!-- Top Left: Ribbon Badge -->
              <UBadge
                v-if="event.badge"
                color="primary"
                variant="solid"
                class="absolute top-2.5 left-2.5 font-black text-[9px] uppercase px-2 py-0.5 rounded text-neutral-950"
              >
                {{ event.badge }}
              </UBadge>

              <!-- Top Right: Status Badge -->
              <UBadge
                :color="getStatusBadge(event.status).color"
                :variant="getStatusBadge(event.status).variant"
                class="absolute top-2.5 right-2.5 font-bold text-[9px] px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-md"
              >
                <UIcon :name="getStatusBadge(event.status).icon" class="size-3" />
                <span>{{ getStatusBadge(event.status).label }}</span>
              </UBadge>
            </div>

            <!-- Details -->
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <UBadge v-if="event.category" color="neutral" variant="subtle" class="rounded px-2 py-0.5 uppercase text-[9px]">
                  {{ event.category }}
                </UBadge>

                <span v-if="event.date" class="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <UIcon name="i-tabler-calendar" class="size-3.5 text-lime-500 shrink-0" />
                  <span>{{ event.date }}</span>
                </span>
              </div>

              <h2 class="text-xl font-black text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-2 leading-snug">
                {{ event.title }}
              </h2>

              <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {{ event.description }}
              </p>

              <div v-if="event.location" class="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 pt-1 font-medium">
                <UIcon name="i-tabler-map-pin" class="size-4 text-lime-500 shrink-0" />
                <span class="truncate">{{ event.location }}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="pt-3 mt-4 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between gap-2">
            <div>
              <span class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">Entry Fee</span>
              <span class="text-sm font-extrabold text-lime-600 dark:text-lime-400">
                {{ event.entryFee || 'Free Entry' }}
              </span>
            </div>

            <span class="text-xs font-bold text-lime-600 dark:text-lime-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
              <span>View Details</span>
              <UIcon name="i-tabler-arrow-right" class="size-4" />
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Flat List Row View Option -->
      <div
        v-else-if="viewMode === 'list' && filteredEvents.length"
        class="divide-y divide-neutral-200 dark:divide-neutral-800"
      >
        <article
          v-for="event in filteredEvents"
          :key="event.id || event.path"
          class="py-6 first:pt-0 group transition-all"
        >
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <!-- Thumbnail Image -->
            <div class="md:col-span-3 lg:col-span-3 xl:col-span-2 shrink-0">
              <NuxtLink :to="event.path" class="block relative aspect-16/10 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-900">
                <NuxtImg
                  v-if="getImageSrc(event)"
                  :src="getImageSrc(event)"
                  :alt="event.title"
                  format="webp"
                  quality="85"
                  loading="lazy"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="flex size-full items-center justify-center bg-lime-500/10 text-lime-600 dark:text-lime-400">
                  <UIcon name="i-tabler-calendar-event" class="size-10" />
                </div>

                <UBadge
                  v-if="event.badge"
                  color="primary"
                  variant="solid"
                  class="absolute top-2 left-2 font-black text-[9px] uppercase px-2 py-0.5 rounded text-neutral-950"
                >
                  {{ event.badge }}
                </UBadge>
              </NuxtLink>
            </div>

            <!-- Content Details -->
            <div class="md:col-span-6 lg:col-span-6 xl:col-span-7 space-y-2 min-w-0">
              <div class="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <UBadge v-if="event.category" color="neutral" variant="subtle" class="rounded px-2 py-0.5 uppercase text-[9px]">
                  {{ event.category }}
                </UBadge>

                <UBadge
                  :color="getStatusBadge(event.status).color"
                  :variant="getStatusBadge(event.status).variant"
                  class="rounded px-2 py-0.5 text-[9px] flex items-center gap-1"
                >
                  <UIcon :name="getStatusBadge(event.status).icon" class="size-3" />
                  <span>{{ getStatusBadge(event.status).label }}</span>
                </UBadge>

                <span v-if="event.date" class="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <UIcon name="i-tabler-calendar" class="size-3.5 text-lime-500 shrink-0" />
                  <span>{{ event.date }}</span>
                </span>
              </div>

              <h2 class="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors leading-snug">
                <NuxtLink :to="event.path">
                  {{ event.title }}
                </NuxtLink>
              </h2>

              <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {{ event.description }}
              </p>

              <div class="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 pt-1 font-medium">
                <div v-if="event.location" class="flex items-center gap-1.5 min-w-0">
                  <UIcon name="i-tabler-map-pin" class="size-4 text-lime-500 shrink-0" />
                  <span class="truncate">{{ event.location }}</span>
                </div>
                <div v-if="event.time" class="flex items-center gap-1.5">
                  <UIcon name="i-tabler-clock" class="size-4 text-lime-500 shrink-0" />
                  <span>{{ event.time }}</span>
                </div>
              </div>
            </div>

            <!-- Price & CTA Column -->
            <div class="md:col-span-3 lg:col-span-3 xl:col-span-3 flex md:flex-col justify-between md:justify-center md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-200 dark:border-neutral-800">
              <div class="text-left md:text-right">
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Entry Fee</span>
                <span class="text-base sm:text-lg font-black text-lime-600 dark:text-lime-400">
                  {{ event.entryFee || 'Free Entry' }}
                </span>
              </div>

              <UButton
                :to="event.path"
                color="primary"
                size="md"
                icon="i-tabler-arrow-right"
                trailing
                class="font-black uppercase text-xs text-neutral-950 rounded-xl px-5 py-2.5 shrink-0"
              >
                {{ event.cta?.label || 'Event Details' }}
              </UButton>
            </div>
          </div>
        </article>
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
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            No events match your current filter criteria. Try adjusting your search query or resetting filters.
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
            No Events Scheduled
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
