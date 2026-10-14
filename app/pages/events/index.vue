<script setup lang="ts">
import { useEventsCatalog } from '~/composables/useEventsCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const {
  events,
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
  <div class="min-h-screen bg-default text-default pb-20 transition-colors duration-300">
    <!-- Hero Header Banner -->
    <div class="pt-8 sm:pt-12 pb-6 border-b border-default">
      <UContainer>
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="space-y-2.5 max-w-3xl">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] px-3 py-0.5 rounded-full"
            >
              <UIcon name="i-tabler-calendar-event" class="size-3.5 mr-1 text-primary shrink-0" />
              <span>Community & Sports</span>
            </UBadge>

            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-highlighted leading-tight">
              Events & Tournaments
            </h1>

            <p class="text-xs sm:text-base text-muted leading-relaxed">
              Discover Recreation Yard Runners, group experiences, community activities and partnership opportunities in Kericho.
            </p>
          </div>

          <div class="shrink-0 text-xs font-bold text-muted">
            Total Scheduled: <span class="text-primary font-extrabold text-sm">{{ filteredEvents.length }}</span>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="pt-8">
      <div class="mb-6 flex justify-end" role="group" aria-label="View mode">
        <div class="flex items-center gap-1 p-1 rounded-sm bg-elevated border border-default">
          <UButton size="xs" :color="viewMode === 'grid' ? 'primary' : 'neutral'" :variant="viewMode === 'grid' ? 'solid' : 'ghost'" icon="i-tabler-layout-grid" aria-label="Grid View" :aria-pressed="viewMode === 'grid'" class="rounded-sm" @click="viewMode = 'grid'" />
          <UButton size="xs" :color="viewMode === 'list' ? 'primary' : 'neutral'" :variant="viewMode === 'list' ? 'solid' : 'ghost'" icon="i-tabler-list" aria-label="List View" :aria-pressed="viewMode === 'list'" class="rounded-sm" @click="viewMode = 'list'" />
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
            <div class="relative aspect-16/10  overflow-hidden bg-elevated">
              <NuxtImg
                v-if="getImageSrc(event)"
                :src="getImageSrc(event)"
                :alt="event.title"
                format="webp"
                quality="85"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="flex size-full items-center justify-center bg-primary/10 text-primary">
                <UIcon name="i-tabler-calendar-event" class="size-12" />
              </div>

              <!-- Top Left: Ribbon Badge -->
              <UBadge
                v-if="event.badge"
                color="primary"
                variant="solid"
                class="absolute top-2.5 left-2.5 font-black text-[9px] uppercase px-2 py-0.5 rounded text-highlighted"
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

                <span v-if="event.date" class="text-muted flex items-center gap-1">
                  <UIcon name="i-tabler-calendar" class="size-3.5 text-primary shrink-0" />
                  <span>{{ event.date }}</span>
                </span>
              </div>

              <h2 class="text-xl font-black text-highlighted group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {{ event.title }}
              </h2>

              <p class="text-xs sm:text-sm text-muted line-clamp-2 leading-relaxed">
                {{ event.description }}
              </p>

              <div v-if="event.location" class="flex items-center gap-1.5 text-xs text-muted pt-1 font-medium">
                <UIcon name="i-tabler-map-pin" class="size-4 text-primary shrink-0" />
                <span class="truncate">{{ event.location }}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="pt-3 mt-4 border-t border-default flex items-center justify-between gap-2">
            <div>
              <span class="text-[9px] font-bold uppercase tracking-wider text-muted block">Entry Fee</span>
              <span class="text-sm font-extrabold text-primary">
                {{ event.entryFee || 'Free Entry' }}
              </span>
            </div>

            <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
              <span>View Details</span>
              <UIcon name="i-tabler-arrow-right" class="size-4" />
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Flat List Row View Option -->
      <div
        v-else-if="viewMode === 'list' && filteredEvents.length"
        data-catalog-list class="divide-y divide-default dark:divide-default"
      >
        <article
          v-for="event in filteredEvents"
          :key="event.id || event.path"
          data-catalog-list-row class="py-6 first:pt-0 group transition-all"
        >
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <!-- Thumbnail Image -->
            <div class="md:col-span-3 lg:col-span-3 xl:col-span-2 shrink-0">
              <NuxtLink :to="event.path" class="block relative aspect-16/10 rounded-sm overflow-hidden bg-elevated">
                <NuxtImg
                  v-if="getImageSrc(event)"
                  :src="getImageSrc(event)"
                  :alt="event.title"
                  format="webp"
                  quality="85"
                  loading="lazy"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="flex size-full items-center justify-center bg-primary/10 text-primary">
                  <UIcon name="i-tabler-calendar-event" class="size-10" />
                </div>

                <UBadge
                  v-if="event.badge"
                  color="primary"
                  variant="solid"
                  class="absolute top-2 left-2 font-black text-[9px] uppercase px-2 py-0.5 rounded text-highlighted"
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

                <span v-if="event.date" class="text-muted flex items-center gap-1">
                  <UIcon name="i-tabler-calendar" class="size-3.5 text-primary shrink-0" />
                  <span>{{ event.date }}</span>
                </span>
              </div>

              <h2 class="text-xl sm:text-2xl font-black text-highlighted group-hover:text-primary transition-colors leading-snug">
                <NuxtLink :to="event.path">
                  {{ event.title }}
                </NuxtLink>
              </h2>

              <p class="text-xs sm:text-sm text-muted line-clamp-2 leading-relaxed">
                {{ event.description }}
              </p>

              <div class="flex flex-wrap items-center gap-4 text-xs text-muted pt-1 font-medium">
                <div v-if="event.location" class="flex items-center gap-1.5 min-w-0">
                  <UIcon name="i-tabler-map-pin" class="size-4 text-primary shrink-0" />
                  <span class="truncate">{{ event.location }}</span>
                </div>
                <div v-if="event.time" class="flex items-center gap-1.5">
                  <UIcon name="i-tabler-clock" class="size-4 text-primary shrink-0" />
                  <span>{{ event.time }}</span>
                </div>
              </div>
            </div>

            <!-- Price & CTA Column -->
            <div class="md:col-span-3 lg:col-span-3 xl:col-span-3 flex md:flex-col justify-between md:justify-center md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-default">
              <div class="text-left md:text-right">
                <span class="text-[10px] font-bold uppercase tracking-wider text-muted block">Entry Fee</span>
                <span class="text-base sm:text-lg font-black text-primary">
                  {{ event.entryFee || 'Free Entry' }}
                </span>
              </div>

              <UButton
                :to="event.path"
                color="primary"
                size="md"
                icon="i-tabler-arrow-right"
                trailing
                class="font-black uppercase text-xs text-highlighted rounded-sm px-5 py-2.5 shrink-0"
              >
                {{ event.cta?.label || 'Event Details' }}
              </UButton>
            </div>
          </div>
        </article>
      </div>

      <!-- Filter Empty State -->
      <div v-else-if="hasAnyEvent" class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center  bg-elevated mx-auto border border-default">
          <UIcon name="i-tabler-filter-off" class="size-8 text-muted" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-highlighted">
            No Matching Events
          </h3>
          <p class="text-xs text-muted">
            No events match your current filter criteria. Try adjusting your search query or resetting filters.
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
          <UIcon name="i-tabler-calendar-off" class="size-8 text-muted" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-highlighted">
            No Events Scheduled
          </h3>
          <p class="text-xs text-muted leading-relaxed">
            There are currently no upcoming events or tournaments scheduled. Please check back later as we post new community activities, or contact us directly.
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
