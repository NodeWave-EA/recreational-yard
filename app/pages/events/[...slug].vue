<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { LOCATION_DETAILS } from '~/utils/site-data'

const route = useRoute()
const { getByPath } = useContentQuery()

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

function getImageSrc(item: any) {
  if (typeof item.coverImage === 'string')
    return item.coverImage
  if (item.coverImage?.src)
    return item.coverImage.src
  return ''
}

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

const targetCtaUrl = computed(() => {
  return event.value?.registrationUrl || event.value?.cta?.to || '/contact?type=event-registration'
})

useSeoMeta({
  title: `${event.value.title} | Events | ${LOCATION_DETAILS.company}`,
  description: event.value.description,
  ogTitle: `${event.value.title} | Events | ${LOCATION_DETAILS.company}`,
  ogDescription: event.value.description,
  ogImage: getImageSrc(event.value) || undefined,
  ogUrl: `${useRuntimeConfig().public.siteUrl}${route.path}`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
const pageUrl = `${siteUrl}${route.path}`
useSchemaOrg([{
  '@type': 'Event',
  '@id': `${pageUrl}#event`,
  'url': pageUrl,
  'name': event.value.title,
  'description': event.value.description,
  'startDate': event.value.startDate || undefined,
  'endDate': event.value.endDate || undefined,
  'eventStatus': event.value.status === 'cancelled' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
  'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
  'location': {
    '@type': 'Place',
    'name': event.value.location || LOCATION_DETAILS.company,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': LOCATION_DETAILS.address,
      'addressLocality': 'Kericho',
      'addressCountry': 'KE',
    },
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
}])
</script>

<template>
  <div class="py-4 sm:py-10 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen transition-colors duration-300 w-full overflow-x-clip">
    <UContainer v-if="event" class="space-y-6 px-3 sm:px-6 lg:px-8">
      <div>
        <NuxtLink
          to="/events"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
          <UIcon name="i-tabler-arrow-left" class="size-4" />
          <span>Back to All Events</span>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div class="lg:col-span-8 space-y-6 min-w-0">
          <div class="relative rounded-xs overflow-hidden bg-transparent border border-neutral-200 dark:border-neutral-800">
            <NuxtImg
              v-if="getImageSrc(event)"
              :src="getImageSrc(event)"
              :alt="event.title"
              width="1200"
              height="675"
              sizes="(max-width: 1024px) 100vw, 66vw"
              format="webp"
              quality="80"
              loading="eager"
              class="w-full h-56 sm:h-96 xl:h-105 object-cover"
            />
            <div v-else class="flex h-56 sm:h-96 w-full items-center justify-center bg-lime-500/10 text-lime-600 dark:text-lime-400">
              <UIcon name="i-tabler-calendar-event" class="size-16" />
            </div>

            <div class="absolute top-3 left-3 flex flex-wrap items-center gap-2">
              <UBadge
                v-if="event.badge"
                color="primary"
                variant="solid"
                class="font-black text-xs rounded-xs text-neutral-950 px-2.5 py-1 uppercase backdrop-blur-md"
              >
                {{ event.badge }}
              </UBadge>
              <UBadge
                :color="getStatusBadge(event.status).color"
                :variant="getStatusBadge(event.status).variant"
                class="font-bold text-xs rounded-xs flex items-center gap-1.5 backdrop-blur-md px-2.5 py-1"
              >
                <UIcon :name="getStatusBadge(event.status).icon" class="size-4" />
                <span>{{ getStatusBadge(event.status).label }}</span>
              </UBadge>
            </div>
          </div>

          <div class="space-y-2">
            <UBadge color="neutral" variant="soft" class="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-xs border border-neutral-200/60 dark:border-neutral-800/60">
              {{ event.category }}
            </UBadge>

            <h1 class="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white leading-tight">
              {{ event.title }}
            </h1>

            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              {{ event.description }}
            </p>
          </div>

          <div v-if="event.schedule?.length" class="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <h2 class="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <UIcon name="i-tabler-list-check" class="size-4 text-lime-500 shrink-0" />
              <span>Event Schedule & Program</span>
            </h2>

            <div class="border border-neutral-200 dark:border-neutral-800 rounded-xs overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800">
              <div
                v-for="(item, idx) in event.schedule"
                :key="idx"
                class="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <div class="space-y-0.5 min-w-0 flex-1">
                  <span class="text-xs sm:text-sm font-extrabold text-neutral-950 dark:text-white block">
                    {{ item.activity }}
                  </span>
                  <p v-if="item.details" class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                    {{ item.details }}
                  </p>
                </div>
                <UBadge color="neutral" variant="subtle" class="shrink-0 font-bold text-[10px] font-mono sm:self-center self-start px-2 py-0.5 rounded-xs border border-neutral-200/60 dark:border-neutral-800/60">
                  {{ item.time }}
                </UBadge>
              </div>
            </div>
          </div>

          <div class="prose dark:prose-invert max-w-none text-xs leading-relaxed pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <ContentRenderer :value="event" />
          </div>

          <div v-if="event.tags?.length" class="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold text-neutral-400">Tags:</span>
            <UBadge
              v-for="tag in event.tags"
              :key="tag"
              color="neutral"
              variant="outline"
              class="text-[10px] font-semibold rounded-xs px-2.5 py-0.5 border border-neutral-200/60 dark:border-neutral-800/60"
            >
              #{{ tag }}
            </UBadge>
          </div>
        </div>

        <div class="lg:col-span-4 lg:sticky lg:top-[calc(var(--ui-header-height,4rem)+1.5rem)] pt-4 lg:pt-0">
          <div class="p-5 sm:p-6 rounded-xs border border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-100/20 dark:hover:bg-neutral-800/10 transition-colors duration-200 space-y-5">
            <h2 class="text-sm font-black uppercase tracking-wider text-neutral-950 dark:text-white pb-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
              <UIcon name="i-tabler-info-circle" class="size-4 text-lime-500 shrink-0" />
              <span>Event Details</span>
            </h2>

            <ul class="space-y-3.5 text-xs">
              <li class="flex items-start gap-3">
                <div class="flex size-8 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200/50 dark:border-neutral-800/50 mt-0.5">
                  <UIcon name="i-tabler-calendar" class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Date
                  </div>
                  <div class="font-extrabold text-neutral-950 dark:text-white text-xs mt-0.5 break-words">
                    {{ event.date }}
                  </div>
                </div>
              </li>

              <li class="flex items-start gap-3">
                <div class="flex size-8 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200/50 dark:border-neutral-800/50 mt-0.5">
                  <UIcon name="i-tabler-clock" class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Time
                  </div>
                  <div class="font-extrabold text-neutral-950 dark:text-white text-xs mt-0.5 break-words">
                    {{ event.time }}
                  </div>
                </div>
              </li>

              <li class="flex items-start gap-3">
                <div class="flex size-8 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200/50 dark:border-neutral-800/50 mt-0.5">
                  <UIcon name="i-tabler-map-pin" class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Location
                  </div>
                  <div class="font-extrabold text-neutral-950 dark:text-white text-xs mt-0.5 break-words leading-snug">
                    {{ event.location }}
                  </div>
                </div>
              </li>

              <li class="flex items-start gap-3">
                <div class="flex size-8 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200/50 dark:border-neutral-800/50 mt-0.5">
                  <UIcon name="i-tabler-ticket" class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Entry Fee
                  </div>
                  <div class="font-black text-lime-600 dark:text-lime-400 text-sm mt-0.5 break-words">
                    {{ event.entryFee }}
                  </div>
                </div>
              </li>

              <li v-if="event.capacity" class="flex items-start gap-3">
                <div class="flex size-8 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200/50 dark:border-neutral-800/50 mt-0.5">
                  <UIcon name="i-tabler-users" class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Capacity
                  </div>
                  <div class="font-extrabold text-neutral-950 dark:text-white text-xs mt-0.5 break-words">
                    {{ event.capacity }}
                  </div>
                </div>
              </li>

              <li v-if="event.organizer" class="flex items-start gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <div class="flex size-8 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200/50 dark:border-neutral-800/50 mt-0.5">
                  <UIcon name="i-tabler-building-community" class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-neutral-400 uppercase text-[10px] font-bold tracking-wider">
                    Organizer
                  </div>
                  <div class="font-extrabold text-neutral-950 dark:text-white text-xs mt-0.5 break-words">
                    {{ event.organizer.name }}
                  </div>
                  <div v-if="event.organizer.phone" class="text-neutral-500 text-xs mt-0.5">
                    Tel: {{ event.organizer.phone }}
                  </div>
                </div>
              </li>
            </ul>

            <div class="pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <UButton
                :to="targetCtaUrl"
                :target="event.registrationUrl ? '_blank' : undefined"
                block
                size="lg"
                color="primary"
                icon="i-tabler-circle-check"
                class="font-black uppercase text-xs text-neutral-950 rounded-xs py-3.5 w-full justify-center cursor-pointer"
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
