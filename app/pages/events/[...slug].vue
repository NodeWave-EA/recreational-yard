<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { LOCATION_DETAILS } from '~/utils/site-data'

const route = useRoute()
const { getByPath } = useContentQuery()

// Fetch single event document by route path
const { data: event } = await getByPath(
  `event-${route.path}`,
  'events',
  route.path,
  { enableLogging: true },
)

if (!event.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Event Not Found',
    fatal: true,
  })
}

// Image src helper
function getImageSrc(item: any) {
  if (typeof item.coverImage === 'string')
    return item.coverImage
  if (item.coverImage?.src)
    return item.coverImage.src
  return ''
}

// Status badge helper
function getStatusBadge(status?: string) {
  switch (status) {
    case 'registration_open':
      return { label: 'Registration Open', color: 'primary' as const, variant: 'solid' as const, icon: 'i-tabler-ticket' }
    case 'upcoming':
      return { label: 'Upcoming', color: 'info' as const, variant: 'soft' as const, icon: 'i-tabler-calendar' }
    case 'ongoing':
      return { label: 'Happening Now', color: 'warning' as const, variant: 'solid' as const, icon: 'i-tabler-point-filled' }
    case 'sold_out':
      return { label: 'Sold Out', color: 'error' as const, variant: 'soft' as const, icon: 'i-tabler-circle-x' }
    case 'completed':
      return { label: 'Completed', color: 'neutral' as const, variant: 'subtle' as const, icon: 'i-tabler-check' }
    case 'cancelled':
      return { label: 'Cancelled', color: 'error' as const, variant: 'subtle' as const, icon: 'i-tabler-x' }
    default:
      return { label: status || 'Event', color: 'neutral' as const, variant: 'soft' as const, icon: 'i-tabler-calendar-event' }
  }
}

// CTA Target Link
const targetCtaUrl = computed(() => {
  return event.value?.registrationUrl || event.value?.cta?.to || '/contact?type=event-registration'
})

// Schema.org Event structured metadata
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Event',
        'name': event.value.title,
        'description': event.value.description,
        'startDate': event.value.startDate || undefined,
        'endDate': event.value.endDate || undefined,
        'eventStatus': event.value.status === 'cancelled' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
        'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
        'location': {
          '@type': 'Place',
          'name': event.value.location || LOCATION_DETAILS.company,
          'address': LOCATION_DETAILS.address,
        },
        'image': getImageSrc(event.value) ? [getImageSrc(event.value)] : undefined,
        'organizer': {
          '@type': 'Organization',
          'name': event.value.organizer?.name || LOCATION_DETAILS.company,
          'telephone': event.value.organizer?.phone || LOCATION_DETAILS.phone,
          'email': event.value.organizer?.email || LOCATION_DETAILS.email,
        },
        'offers': {
          '@type': 'Offer',
          'price': event.value.entryFee === 'Free' ? '0' : event.value.entryFee,
          'priceCurrency': 'KES',
          'url': targetCtaUrl.value,
          'availability': event.value.status === 'sold_out' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        },
      }),
    },
  ],
})

useSeoMeta({
  title: `${event.value.title} | Events | ${LOCATION_DETAILS.company}`,
  description: event.value.description,
})
</script>

<template>
  <div class="py-8 sm:py-12 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen transition-colors duration-300">
    <UContainer v-if="event" class="space-y-8">
      <!-- Back Link -->
      <div>
        <NuxtLink
          to="/events"
          class="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
          <UIcon name="i-tabler-arrow-left" class="size-4" />
          <span>Back to All Events</span>
        </NuxtLink>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <!-- Main Content Column -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Cover Banner -->
          <div class="relative rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-900">
            <img
              v-if="getImageSrc(event)"
              :src="getImageSrc(event)"
              :alt="event.title"
              class="w-full h-64 sm:h-96 xl:h-112 object-cover"
            >
            <div v-else class="flex h-64 sm:h-96 w-full items-center justify-center bg-lime-500/10 text-lime-600 dark:text-lime-400">
              <UIcon name="i-tabler-calendar-event" class="size-16" />
            </div>

            <!-- Overlay Badges -->
            <div class="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <UBadge
                v-if="event.badge"
                color="primary"
                variant="solid"
                class="font-black text-xs rounded-md text-neutral-950 px-3 py-1"
              >
                {{ event.badge }}
              </UBadge>
              <UBadge
                :color="getStatusBadge(event.status).color"
                :variant="getStatusBadge(event.status).variant"
                class="font-bold text-xs rounded-md flex items-center gap-1.5 backdrop-blur-md px-3 py-1"
              >
                <UIcon :name="getStatusBadge(event.status).icon" class="size-4" />
                <span>{{ getStatusBadge(event.status).label }}</span>
              </UBadge>
            </div>
          </div>

          <!-- Title & Summary Header -->
          <div class="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <div class="flex items-center gap-2">
              <UBadge color="neutral" variant="soft" class="text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded">
                {{ event.category }}
              </UBadge>
            </div>

            <h1 class="text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white leading-tight">
              {{ event.title }}
            </h1>

            <p class="text-sm sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              {{ event.description }}
            </p>
          </div>

          <!-- Schedule Program List -->
          <div v-if="event.schedule?.length" class="space-y-4 pt-2">
            <h2 class="text-xl font-black text-neutral-950 dark:text-white flex items-center gap-2">
              <UIcon name="i-tabler-list-check" class="size-5 text-lime-500 shrink-0" />
              <span>Event Schedule & Program</span>
            </h2>

            <div class="divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800">
              <div
                v-for="(item, idx) in event.schedule"
                :key="idx"
                class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div class="space-y-0.5 min-w-0 flex-1">
                  <span class="text-sm font-extrabold text-neutral-950 dark:text-white block">
                    {{ item.activity }}
                  </span>
                  <p v-if="item.details" class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {{ item.details }}
                  </p>
                </div>
                <UBadge color="neutral" variant="subtle" class="shrink-0 font-bold text-[11px] sm:self-center self-start px-2.5 py-1 rounded">
                  {{ item.time }}
                </UBadge>
              </div>
            </div>
          </div>

          <!-- ContentRenderer Markdown Body -->
          <div class="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <ContentRenderer :value="event" />
          </div>

          <!-- Tags -->
          <div v-if="event.tags?.length" class="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold text-neutral-400">Tags:</span>
            <UBadge
              v-for="tag in event.tags"
              :key="tag"
              color="neutral"
              variant="outline"
              class="text-[10px] font-semibold rounded px-2.5 py-1"
            >
              #{{ tag }}
            </UBadge>
          </div>
        </div>

        <!-- Sidebar Event Details -->
        <div class="lg:col-span-4 sticky top-[calc(var(--ui-header-height,4rem)+1.5rem)] space-y-6 lg:border-l lg:border-neutral-200 lg:dark:border-neutral-800 lg:pl-8">
          <div class="space-y-6">
            <h2 class="text-xl font-black text-neutral-950 dark:text-white pb-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
              <UIcon name="i-tabler-info-circle" class="size-5 text-lime-500 shrink-0" />
              <span>Event Details</span>
            </h2>

            <ul class="space-y-5 text-xs">
              <!-- Date -->
              <li class="flex items-start gap-3.5">
                <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 mt-0.5">
                  <UIcon name="i-tabler-calendar" class="size-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Date
                  </div>
                  <div class="font-extrabold text-neutral-950 dark:text-white text-sm mt-0.5 wrap-break-word">
                    {{ event.date }}
                  </div>
                </div>
              </li>

              <!-- Time -->
              <li class="flex items-start gap-3.5">
                <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 mt-0.5">
                  <UIcon name="i-tabler-clock" class="size-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Time
                  </div>
                  <div class="font-extrabold text-neutral-950 dark:text-white text-sm mt-0.5 wrap-break-word">
                    {{ event.time }}
                  </div>
                </div>
              </li>

              <!-- Location -->
              <li class="flex items-start gap-3.5">
                <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 mt-0.5">
                  <UIcon name="i-tabler-map-pin" class="size-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Location
                  </div>
                  <div class="font-extrabold text-neutral-950 dark:text-white text-sm mt-0.5 wrap-break-word leading-snug">
                    {{ event.location }}
                  </div>
                </div>
              </li>

              <!-- Entry Fee -->
              <li class="flex items-start gap-3.5">
                <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 mt-0.5">
                  <UIcon name="i-tabler-ticket" class="size-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Entry Fee
                  </div>
                  <div class="font-black text-lime-600 dark:text-lime-400 text-base mt-0.5 wrap-break-word">
                    {{ event.entryFee }}
                  </div>
                </div>
              </li>

              <!-- Capacity -->
              <li v-if="event.capacity" class="flex items-start gap-3.5">
                <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 mt-0.5">
                  <UIcon name="i-tabler-users" class="size-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Capacity
                  </div>
                  <div class="font-extrabold text-neutral-950 dark:text-white text-sm mt-0.5 wrap-break-word">
                    {{ event.capacity }}
                  </div>
                </div>
              </li>

              <!-- Organizer Details -->
              <li v-if="event.organizer" class="flex items-start gap-3.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 mt-0.5">
                  <UIcon name="i-tabler-building-community" class="size-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Organizer
                  </div>
                  <div class="font-extrabold text-neutral-950 dark:text-white text-sm mt-0.5 wrap-break-word">
                    {{ event.organizer.name }}
                  </div>
                  <div v-if="event.organizer.phone" class="text-neutral-500 text-xs mt-0.5">
                    Tel: {{ event.organizer.phone }}
                  </div>
                </div>
              </li>
            </ul>

            <!-- Primary Registration Button -->
            <div class="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <UButton
                :to="targetCtaUrl"
                :target="event.registrationUrl ? '_blank' : undefined"
                block
                size="xl"
                color="primary"
                icon="i-tabler-circle-check"
                class="font-black uppercase text-xs text-neutral-950 rounded-xl py-3.5 w-full justify-center cursor-pointer"
              >
                {{ event.cta?.label || 'Register Now' }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
