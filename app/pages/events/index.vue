<script setup lang="ts">
import { useEventsCatalog } from '~/composables/useEventsCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

const viewMode = ref<'grid' | 'list'>('grid')

const {
  events,
  getImageSrc,
  getStatusBadge,
} = await useEventsCatalog()

const hasAnyEvent = computed(() => (events.value?.length || 0) > 0)

useSeoMeta({
  title: `Events & Activities | ${LOCATION_DETAILS.company}`,
  description: 'Explore Recreation Yard Runners activities, group experiences, community challenges and active living opportunities in Kericho.',
  ogTitle: `Events & Activities | ${LOCATION_DETAILS.company}`,
  ogDescription: 'Explore Recreation Yard Runners activities, group experiences, community challenges and active living opportunities in Kericho.',
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
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-12 sm:pb-20 transition-colors duration-300 w-full overflow-x-clip">
    <div class="pt-4 sm:pt-12 pb-4 sm:pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
          <div class="space-y-2 sm:space-y-2.5">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] px-2.5 sm:px-3 py-0.5 rounded-md"
            >
              <UIcon name="i-tabler-calendar-event" class="size-3.5 mr-1 text-lime-500 shrink-0" />
              <span>Community & Sports</span>
            </UBadge>

            <h1 class="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
              Events & Tournaments
            </h1>

            <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Discover Recreation Yard Runners, group experiences, community activities and partnership opportunities in Kericho.
            </p>
          </div>
        </div>
      </UContainer>
    </div>

    <div class="sticky top-(--ui-header-height,4rem) z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-none sm:shadow-xs transition-all">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-3 sm:gap-4">
          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            Total Scheduled: <span class="text-lime-600 dark:text-lime-400 font-extrabold text-sm">{{ events?.length || 0 }}</span>
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
        v-if="viewMode === 'grid' && hasAnyEvent"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
      >
        <NuxtLink
          v-for="event in events"
          :key="event.id || event.path"
          :to="event.path"
          class="group flex flex-col justify-between p-0 sm:p-4 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-4 sm:pb-0"
        >
          <div class="space-y-2.5 sm:space-y-3">
            <div class="relative aspect-16/10 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
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
                class="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 font-black text-[9px] uppercase px-2 py-0.5 rounded-md text-neutral-950"
              >
                {{ event.badge }}
              </UBadge>

              <UBadge
                :color="getStatusBadge(event.status).color"
                :variant="getStatusBadge(event.status).variant"
                class="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 font-bold text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-md"
              >
                <UIcon :name="getStatusBadge(event.status).icon" class="size-3" />
                <span>{{ getStatusBadge(event.status).label }}</span>
              </UBadge>
            </div>

            <div class="space-y-1.5 sm:space-y-2 min-w-0">
              <div class="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <UBadge v-if="event.category" color="neutral" variant="subtle" class="rounded-md px-2 py-0.5 uppercase text-[9px]">
                  {{ event.category }}
                </UBadge>

                <span v-if="event.date" class="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <UIcon name="i-tabler-calendar" class="size-3.5 text-lime-500 shrink-0" />
                  <span>{{ event.date }}</span>
                </span>
              </div>

              <h2 class="text-base sm:text-lg font-black text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1 leading-snug">
                {{ event.title }}
              </h2>

              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                {{ event.description }}
              </p>

              <div v-if="event.location" class="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 pt-0.5 font-medium">
                <UIcon name="i-tabler-map-pin" class="size-3.5 text-lime-500 shrink-0" />
                <span class="truncate">{{ event.location }}</span>
              </div>
            </div>
          </div>

          <div class="pt-2.5 sm:pt-3 mt-3 sm:mt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-2">
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

      <div
        v-else-if="viewMode === 'list' && hasAnyEvent"
        class="space-y-3 sm:space-y-4 w-full"
      >
        <NuxtLink
          v-for="event in events"
          :key="event.id || event.path"
          :to="event.path"
          class="group block p-0 sm:p-5 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-4 sm:pb-0"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
            <div class="flex items-start gap-3 sm:gap-4 min-w-0 flex-1 w-full sm:w-auto">
              <div class="shrink-0 relative">
                <NuxtImg
                  v-if="getImageSrc(event)"
                  :src="getImageSrc(event)"
                  :alt="event.title"
                  format="webp"
                  quality="85"
                  loading="lazy"
                  class="size-16 sm:size-24 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300"
                />
                <div v-else class="flex size-16 sm:size-24 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800">
                  <UIcon name="i-tabler-calendar-event" class="size-7 sm:size-8" />
                </div>

                <UBadge
                  v-if="event.badge"
                  color="primary"
                  variant="solid"
                  class="absolute top-1 left-1 font-black text-[8px] uppercase px-1.5 py-0.5 rounded-md text-neutral-950"
                >
                  {{ event.badge }}
                </UBadge>
              </div>

              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                  <UBadge v-if="event.category" color="neutral" variant="subtle" class="rounded-md px-1.5 py-0.5 uppercase text-[9px]">
                    {{ event.category }}
                  </UBadge>

                  <UBadge
                    :color="getStatusBadge(event.status).color"
                    :variant="getStatusBadge(event.status).variant"
                    class="rounded-md px-1.5 py-0.5 text-[9px] flex items-center gap-1"
                  >
                    <UIcon :name="getStatusBadge(event.status).icon" class="size-3" />
                    <span>{{ getStatusBadge(event.status).label }}</span>
                  </UBadge>

                  <span v-if="event.date" class="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                    <UIcon name="i-tabler-calendar" class="size-3 text-lime-500 shrink-0" />
                    <span>{{ event.date }}</span>
                  </span>
                </div>

                <h2 class="text-sm sm:text-lg font-black text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                  {{ event.title }}
                </h2>

                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                  {{ event.description }}
                </p>

                <div class="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 pt-0.5 font-medium">
                  <div v-if="event.location" class="flex items-center gap-1 min-w-0">
                    <UIcon name="i-tabler-map-pin" class="size-3.5 text-lime-500 shrink-0" />
                    <span class="truncate">{{ event.location }}</span>
                  </div>
                  <div v-if="event.time" class="flex items-center gap-1">
                    <UIcon name="i-tabler-clock" class="size-3.5 text-lime-500 shrink-0" />
                    <span>{{ event.time }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800/60 shrink-0">
              <div class="text-left sm:text-right">
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Entry Fee</span>
                <span class="text-sm sm:text-base font-black text-lime-600 dark:text-lime-400">
                  {{ event.entryFee || 'Free Entry' }}
                </span>
              </div>

              <span class="inline-flex items-center gap-1 font-black uppercase text-xs text-neutral-950 dark:text-white bg-lime-500 group-hover:bg-lime-400 px-3.5 py-2 rounded-md transition-colors">
                <span>{{ event.cta?.label || 'View Details' }}</span>
                <UIcon name="i-tabler-arrow-right" class="size-4" />
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="py-12 sm:py-20 text-center space-y-4 max-w-md mx-auto">
        <div class="flex size-14 sm:size-16 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-calendar-off" class="size-7 sm:size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
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
