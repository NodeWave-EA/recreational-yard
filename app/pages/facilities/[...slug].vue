<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { CONTACTS, LOCATION_DETAILS } from '~/utils/site-data'

const route = useRoute()
const { getByPath, getCollection } = useContentQuery()

const facilitySlug = computed(() => route.path.split('/').pop() || '')

// Fetch single facility document
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

// Fetch all "Facilities & Sports" FAQs
const { data: rawFaqs } = await getCollection(
  `facility-faqs-${route.path}`,
  'faqs',
  {
    where: { category: 'Facilities & Sports' },
    sort: [{ key: 'order', order: 'ASC' }],
    enableLogging: false,
  },
)

// Active FAQs: Specific to this facility + General facility FAQs
const activeFaqs = computed(() => {
  if (!rawFaqs.value)
    return []
  return rawFaqs.value.filter((faq: any) =>
    !faq.facility || faq.facility === 'all' || faq.facility === facilitySlug.value,
  )
})

// Fetch all "Facilities & Sports" Testimonials
const { data: rawTestimonials } = await getCollection(
  `facility-testimonials-${route.path}`,
  'testimonials',
  {
    where: { category: 'Facilities & Sports', featured: true },
    limit: 10,
    enableLogging: false,
  },
)

// Active Testimonials: Specific to this facility + General facility reviews
const activeTestimonials = computed(() => {
  if (!rawTestimonials.value)
    return []
  return rawTestimonials.value.filter((item: any) =>
    !item.facility || item.facility === 'all' || item.facility === facilitySlug.value,
  )
})

// Accordion state for FAQs
const openFaqItems = ref<number[]>([0])

function toggleFaqItem(index: number) {
  if (openFaqItems.value.includes(index)) {
    openFaqItems.value = openFaqItems.value.filter(i => i !== index)
  } else {
    openFaqItems.value.push(index)
  }
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
  ogTitle: `${facility.value.title} | Facilities | ${LOCATION_DETAILS.company}`,
  ogDescription: facility.value.description,
  ogImage: coverImgSrc.value || undefined,
  ogUrl: `${useRuntimeConfig().public.siteUrl}${route.path}`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
const pageUrl = `${siteUrl}${route.path}`
useSchemaOrg([{
  '@type': 'Place',
  '@id': `${pageUrl}#facility`,
  'url': pageUrl,
  'name': facility.value.title,
  'description': facility.value.description,
  'image': coverImgSrc.value || undefined,
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': LOCATION_DETAILS.address,
    'addressLocality': 'Kericho',
    'addressCountry': 'KE',
  },
  'isPartOf': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div class="py-8 sm:py-14 bg-default text-default min-h-screen transition-colors duration-300">
    <UContainer v-if="facility" class="space-y-10">
      <!-- Back Link -->
      <NuxtLink
        to="/facilities"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary dark:hover:text-primary transition-colors"
      >
        <UIcon name="i-tabler-arrow-left" class="size-4" />
        <span>Back to All Facilities</span>
      </NuxtLink>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <!-- Main Content -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Cover Banner -->
          <div class="relative  overflow-hidden bg-elevated border border-default">
            <NuxtImg
              v-if="coverImgSrc"
              :src="coverImgSrc"
              :alt="facility.title"
              format="webp"
              quality="85"
              class="w-full h-72 sm:h-100 object-cover"
            />
            <div v-else class="flex h-72 sm:h-100 w-full items-center justify-center text-muted">
              <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-16" />
            </div>

            <UBadge
              v-if="facility.badge"
              color="primary"
              variant="soft"
              class="absolute top-4 left-4 font-bold text-xs rounded-md uppercase backdrop-blur-md"
            >
              {{ facility.badge }}
            </UBadge>
          </div>

          <!-- Title Header & Summary -->
          <div class="space-y-3">
            <h1 class="text-2xl sm:text-4xl font-black text-highlighted leading-tight">
              {{ facility.title }}
            </h1>
            <p class="text-xs sm:text-sm text-muted leading-relaxed">
              {{ facility.description }}
            </p>
          </div>

          <!-- Quote -->
          <div
            v-if="facility.quote?.text"
            class="py-1 pl-4 border-l-2 border-primary space-y-1"
          >
            <p class="text-xs sm:text-sm font-medium italic text-muted leading-relaxed">
              "{{ facility.quote.text }}"
            </p>
            <p v-if="facility.quote.author" class="text-[10px] font-bold text-primary uppercase tracking-widest">
              — {{ facility.quote.author }}
            </p>
          </div>

          <!-- Equipment & Inclusions (Features) -->
          <div v-if="facility.features?.length" class="pt-6 border-t border-default space-y-3">
            <h3 class="text-xs font-black uppercase tracking-wider text-muted flex items-center gap-2">
              <UIcon name="i-tabler-circle-check-filled" class="size-4 text-primary" />
              Equipment & Features Included
            </h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted">
              <li v-for="(feat, idx) in facility.features" :key="idx" class="flex items-center gap-2 font-medium">
                <UIcon name="i-tabler-check" class="size-3.5 text-primary shrink-0" />
                <span>{{ feat }}</span>
              </li>
            </ul>
          </div>

          <!-- Dress Code & Rules -->
          <div v-if="facility.rules?.length" class="pt-6 border-t border-default space-y-3">
            <h3 class="text-xs font-black uppercase tracking-wider text-muted flex items-center gap-2">
              <UIcon name="i-tabler-shield-check" class="size-4 text-primary" />
              Dress Code & Safety Rules
            </h3>
            <ul class="space-y-2 text-xs text-muted">
              <li v-for="(rule, idx) in facility.rules" :key="idx" class="flex items-start gap-2 font-medium">
                <UIcon name="i-tabler-alert-circle" class="size-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{{ rule }}</span>
              </li>
            </ul>
          </div>

          <!-- Photo Gallery Link Banner -->
          <div class="pt-6 border-t border-default flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <UIcon name="i-tabler-photo" class="size-5 text-primary shrink-0" />
              <div class="space-y-0.5">
                <h4 class="text-xs font-bold text-highlighted">
                  Facility Photo Album
                </h4>
                <p class="text-[11px] text-muted">
                  Explore full photo gallery collections for this specific facility.
                </p>
              </div>
            </div>

            <UButton
              :to="`/gallery/${facility.stem.split('/').pop()}`"
              size="sm"
              color="primary"
              variant="link"
              icon="i-tabler-arrow-right"
              trailing
              class="font-bold text-xs p-0 text-primary hover:underline shrink-0"
            >
              View Gallery
            </UButton>
          </div>

          <!-- Markdown Content Body -->
          <div class="prose dark:prose-invert max-w-none text-xs leading-relaxed pt-6 border-t border-default">
            <ContentRenderer :value="facility" />
          </div>

          <!-- Visitor Testimonials -->
          <div v-if="activeTestimonials.length" class="pt-8 border-t border-default space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-default pb-4">
              <div>
                <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-[10px] mb-1">
                  Visitor Reviews
                </UBadge>
                <h3 class="text-xl font-black text-highlighted">
                  What Guests Say About {{ facility.title }}
                </h3>
              </div>
              <p class="text-xs text-muted max-w-xs leading-relaxed">
                Authentic feedback from visitors who booked this venue.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-default dark:divide-default">
              <div
                v-for="(item, idx) in activeTestimonials"
                :key="idx"
                class="space-y-3 pt-4 md:pt-0"
                :class="{ 'md:pl-8': idx > 0 }"
              >
                <div class="flex items-center gap-1 text-primary">
                  <UIcon
                    v-for="star in (item.rating || 5)"
                    :key="star"
                    name="i-tabler-star-filled"
                    class="size-3.5"
                  />
                </div>

                <p class="text-xs font-medium text-muted leading-relaxed italic">
                  "{{ item.comment }}"
                </p>

                <div class="flex items-center gap-2.5 pt-1">
                  <NuxtImg
                    v-if="item.avatar"
                    :src="item.avatar"
                    :alt="item.author"
                    format="webp"
                    quality="80"
                    class="size-8 rounded-full object-cover border border-default shrink-0"
                  />
                  <div
                    v-else
                    class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs"
                  >
                    {{ item.author.charAt(0) }}
                  </div>

                  <div class="space-y-0.5">
                    <h4 class="text-xs font-bold text-highlighted">
                      {{ item.author }}
                    </h4>
                    <p class="text-[10px] text-muted font-medium">
                      {{ item.role }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Facility FAQs -->
          <div v-if="activeFaqs.length" class="pt-8 border-t border-default space-y-4">
            <div class="flex items-center justify-between border-b border-default pb-3">
              <div>
                <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-[10px] mb-1">
                  Court & Venue FAQ
                </UBadge>
                <h3 class="text-xl font-black text-highlighted">
                  Frequently Asked Questions
                </h3>
              </div>
            </div>

            <div class="divide-y divide-default dark:divide-default">
              <div
                v-for="(faq, idx) in activeFaqs"
                :key="idx"
                class="py-3.5 space-y-1.5"
              >
                <button
                  type="button"
                  class="w-full flex items-center justify-between text-left font-extrabold text-xs sm:text-sm text-highlighted group cursor-pointer transition-colors"
                  @click="toggleFaqItem(idx)"
                >
                  <span class="group-hover:text-primary transition-colors pr-4">
                    {{ faq.question }}
                  </span>
                  <UIcon
                    name="i-tabler-chevron-down"
                    class="size-4 text-muted transition-transform duration-200 shrink-0"
                    :class="{ 'rotate-180 text-primary': openFaqItems.includes(idx) }"
                  />
                </button>

                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 max-h-0"
                  enter-to-class="opacity-100 max-h-40"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 max-h-40"
                  leave-to-class="opacity-0 max-h-0"
                >
                  <p
                    v-show="openFaqItems.includes(idx)"
                    class="text-xs text-muted leading-relaxed pr-6 pt-1 font-medium overflow-hidden"
                  >
                    {{ faq.answer }}
                  </p>
                </Transition>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Reservation Details -->
        <div class="lg:col-span-4 sticky top-[calc(var(--ui-header-height,4rem)+1.5rem)] space-y-6">
          <div class="space-y-6 pb-6 border-b border-default">
            <div v-if="facility.pricing">
              <span class="text-[10px] font-bold uppercase tracking-wider text-muted block">Booking Rate</span>
              <div class="text-2xl font-black text-highlighted mt-1">
                {{ facility.pricing.rate }}
                <span v-if="facility.pricing.unit" class="text-xs font-medium text-muted">/ {{ facility.pricing.unit }}</span>
              </div>
              <p v-if="facility.pricing.note" class="text-[11px] text-muted mt-1 font-medium">
                {{ facility.pricing.note }}
              </p>
            </div>

            <ul class="space-y-3 text-xs divide-y divide-default dark:divide-default">
              <li v-if="facility.capacity" class="flex items-center justify-between pt-3 first:pt-0">
                <span class="text-muted font-medium">Guest Capacity</span>
                <span class="font-bold text-highlighted">{{ facility.capacity }}</span>
              </li>
              <li v-if="facility.operatingHours" class="flex items-center justify-between pt-3">
                <span class="text-muted font-medium">Operating Hours</span>
                <span class="font-bold text-highlighted">{{ facility.operatingHours }}</span>
              </li>
              <li v-if="facility.ageGroup" class="flex items-center justify-between pt-3">
                <span class="text-muted font-medium">Target Age</span>
                <span class="font-bold text-highlighted">{{ facility.ageGroup }}</span>
              </li>
            </ul>

            <div class="space-y-3 pt-2">
              <UButton
                :to="`/contact?facility=${route.path.split('/').pop()}`"
                block
                size="lg"
                color="primary"
                icon="i-tabler-calendar-event"
                class="font-black uppercase text-xs text-highlighted rounded-sm py-3.5 cursor-pointer justify-center"
              >
                Reserve Slot
              </UButton>
              <UButton
                :to="`https://wa.me/${CONTACTS.whatsapp}?text=Hello! I would like to inquire about the ${facility.title} facility.`"
                target="_blank"
                block
                color="neutral"
                variant="ghost"
                icon="i-tabler-brand-whatsapp"
                class="font-bold text-xs rounded-sm py-2.5 text-success dark:text-success cursor-pointer justify-center"
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
