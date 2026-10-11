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

useSeoMeta({
  title: `${event.value.title} | Events | ${LOCATION_DETAILS.company}`,
  description: event.value.description,
})
</script>

<template>
  <div class="py-10 sm:py-16 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen transition-colors duration-300">
    <UContainer v-if="event" class="max-w-5xl space-y-8">
      <!-- Back Button -->
      <NuxtLink
        to="/events"
        class="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
      >
        <UIcon name="i-tabler-arrow-left" class="size-4" />
        Back to All Events
      </NuxtLink>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <!-- Main Content -->
        <div class="lg:col-span-8 space-y-6">
          <div class="relative rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
            <img
              v-if="getImageSrc(event)"
              :src="getImageSrc(event)"
              :alt="event.title"
              class="w-full h-72 sm:h-96 object-cover"
            >
            <UBadge
              v-if="event.badge"
              color="primary"
              class="absolute top-4 right-4 font-bold text-xs rounded-lg"
            >
              {{ event.badge }}
            </UBadge>
          </div>

          <div class="space-y-3">
            <UBadge color="neutral" variant="soft" class="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-md">
              {{ event.category }}
            </UBadge>
            <h1 class="text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white leading-tight">
              {{ event.title }}
            </h1>
            <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {{ event.description }}
            </p>
          </div>

          <!-- ContentRenderer for Markdown Body -->
          <div class="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <ContentRenderer :value="event" />
          </div>
        </div>

        <!-- Sidebar Event Metadata -->
        <div class="lg:col-span-4 sticky top-[calc(var(--ui-header-height,4rem)+1.5rem)] lg:border-l lg:border-neutral-200/80 lg:dark:border-neutral-800 lg:pl-8 space-y-6">
          <h2 class="text-xl font-black text-neutral-950 dark:text-white border-b border-neutral-200/80 dark:border-neutral-800 pb-3">
            Event Information
          </h2>

          <ul class="space-y-5 text-xs">
            <li class="flex items-start gap-3.5">
              <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400">
                <UIcon name="i-tabler-calendar" class="size-5" />
              </div>
              <div>
                <div class="text-neutral-400 uppercase text-[10px] font-bold">
                  Date
                </div>
                <div class="font-extrabold text-neutral-950 dark:text-white text-sm mt-0.5">
                  {{ event.date }}
                </div>
              </div>
            </li>

            <li class="flex items-start gap-3.5">
              <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400">
                <UIcon name="i-tabler-clock" class="size-5" />
              </div>
              <div>
                <div class="text-neutral-400 uppercase text-[10px] font-bold">
                  Time
                </div>
                <div class="font-extrabold text-neutral-950 dark:text-white text-sm mt-0.5">
                  {{ event.time }}
                </div>
              </div>
            </li>

            <li class="flex items-start gap-3.5">
              <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400">
                <UIcon name="i-tabler-map-pin" class="size-5" />
              </div>
              <div>
                <div class="text-neutral-400 uppercase text-[10px] font-bold">
                  Location
                </div>
                <div class="font-extrabold text-neutral-950 dark:text-white text-sm mt-0.5">
                  {{ event.location }}
                </div>
              </div>
            </li>

            <li class="flex items-start gap-3.5">
              <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400">
                <UIcon name="i-tabler-ticket" class="size-5" />
              </div>
              <div>
                <div class="text-neutral-400 uppercase text-[10px] font-bold">
                  Entry / Registration Fee
                </div>
                <div class="font-extrabold text-lime-600 dark:text-lime-400 text-sm mt-0.5">
                  {{ event.entryFee }}
                </div>
              </div>
            </li>
          </ul>

          <div class="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <UButton
              :to="event.cta?.to || '/contact'"
              block
              size="xl"
              color="primary"
              icon="i-tabler-circle-check"
              class="font-black uppercase text-xs text-neutral-950 rounded-xl py-3.5"
            >
              {{ event.cta?.label || 'Register Now' }}
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
