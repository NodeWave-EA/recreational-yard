<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { LOCATION_DETAILS } from '~/utils/site-data'

const route = useRoute()
const { getByPath } = useContentQuery()

// Fetch single facility
const { data: facility } = await getByPath(
  `facility-${route.path}`,
  'facilities',
  route.path,
  { enableLogging: false },
)

if (!facility.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Facility Not Found',
    fatal: true,
  })
}

// Cover image helper
const coverImgSrc = computed(() => {
  if (typeof facility.value?.coverImage === 'string')
    return facility.value.coverImage
  if (facility.value?.coverImage?.src)
    return facility.value.coverImage.src
  return ''
})

useSeoMeta({
  title: `${facility.value.title} | Facilities | ${LOCATION_DETAILS.company}`,
  description: facility.value.description,
})
</script>

<template>
  <div class="py-8 sm:py-14 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen">
    <UContainer v-if="facility" class="max-w-5xl">
      <!-- Back Link -->
      <NuxtLink
        to="/facilities"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors mb-6"
      >
        <UIcon name="i-tabler-arrow-left" class="size-4" />
        <span>Back to All Facilities</span>
      </NuxtLink>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <!-- Main Content -->
        <div class="lg:col-span-8 space-y-6">
          <div class="relative rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <img
              v-if="coverImgSrc"
              :src="coverImgSrc"
              :alt="facility.title"
              class="w-full h-72 sm:h-96 object-cover"
            >
            <div v-else class="flex h-72 sm:h-96 w-full items-center justify-center text-neutral-400">
              <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-16" />
            </div>

            <UBadge
              v-if="facility.badge"
              color="primary"
              class="absolute top-4 left-4 font-bold text-xs rounded-md shadow-md"
            >
              {{ facility.badge }}
            </UBadge>
          </div>

          <div class="space-y-3">
            <h1 class="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white">
              {{ facility.title }}
            </h1>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {{ facility.description }}
            </p>
          </div>

          <!-- Feature Highlights -->
          <div v-if="facility.features?.length" class="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Facility Features & Amenities
            </h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 dark:text-neutral-300">
              <li v-for="(feat, idx) in facility.features" :key="idx" class="flex items-center gap-2">
                <UIcon name="i-tabler-circle-check-filled" class="size-4 text-lime-500 shrink-0" />
                <span>{{ feat }}</span>
              </li>
            </ul>
          </div>

          <!-- Markdown Content Body -->
          <div class="prose dark:prose-invert max-w-none text-xs leading-relaxed pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <ContentRenderer :value="facility" />
          </div>
        </div>

        <!-- Sidebar Sticky Reservation Details -->
        <div class="lg:col-span-4 sticky top-[calc(var(--ui-header-height,4rem)+1.5rem)] space-y-6 lg:border-l lg:border-neutral-200/80 lg:dark:border-neutral-800 lg:pl-8">
          <div class="space-y-6">
            <div v-if="facility.pricing" class="border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Booking Rate</span>
              <div class="text-2xl font-black text-neutral-950 dark:text-white mt-1">
                {{ facility.pricing.rate }}
                <span v-if="facility.pricing.unit" class="text-xs font-medium text-neutral-400">/ {{ facility.pricing.unit }}</span>
              </div>
            </div>

            <ul class="space-y-3.5 text-xs">
              <li v-if="facility.capacity" class="flex items-center justify-between">
                <span class="text-neutral-400 font-medium">Guest Capacity</span>
                <span class="font-bold text-neutral-950 dark:text-white">{{ facility.capacity }}</span>
              </li>
              <li class="flex items-center justify-between">
                <span class="text-neutral-400 font-medium">Opening Hours</span>
                <span class="font-bold text-neutral-950 dark:text-white">8:00 AM – 7:00 PM</span>
              </li>
              <li class="flex items-center justify-between">
                <span class="text-neutral-400 font-medium">Location</span>
                <span class="font-bold text-neutral-950 dark:text-white">Kericho Highlands</span>
              </li>
            </ul>

            <div class="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <UButton
                :to="`/contact?facility=${route.path.split('/').pop()}`"
                block
                size="lg"
                color="primary"
                icon="i-tabler-calendar-event"
                class="font-black uppercase text-xs text-neutral-950 rounded-xl py-3.5"
              >
                Reserve Facility
              </UButton>
              <UButton
                :to="`https://wa.me/${CONTACTS.whatsapp}?text=Hello! I would like to inquire about the ${facility.title} facility.`"
                target="_blank"
                block
                color="neutral"
                variant="ghost"
                icon="i-tabler-brand-whatsapp"
                class="font-bold text-xs rounded-xl py-2.5 text-emerald-600 dark:text-emerald-400"
              >
                Chat on WhatsApp
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
