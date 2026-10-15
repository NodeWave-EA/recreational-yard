<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { CONTACTS, LOCATION_DETAILS } from '~/utils/site-data'

const route = useRoute()
const { getByPath, getCollection } = useContentQuery()

const facilitySlug = computed(() => route.path.split('/').pop() || '')

const testimonialViewMode = ref<'grid' | 'list'>('grid')

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

const { data: rawFaqs } = await getCollection(
  `facility-faqs-${route.path}`,
  'faqs',
  {
    where: { category: 'Facilities & Sports' },
    sort: [{ key: 'order', order: 'ASC' }],
    enableLogging: false,
  },
)

const activeFaqs = computed(() => {
  if (!rawFaqs.value)
    return []
  return rawFaqs.value.filter((faq: any) =>
    !faq.facility || faq.facility === 'all' || faq.facility === facilitySlug.value,
  )
})

const { data: rawTestimonials } = await getCollection(
  `facility-testimonials-${route.path}`,
  'testimonials',
  {
    where: { category: 'Facilities & Sports', featured: true },
    limit: 10,
    enableLogging: false,
  },
)

const activeTestimonials = computed(() => {
  if (!rawTestimonials.value)
    return []
  return rawTestimonials.value.filter((item: any) =>
    !item.facility || item.facility === 'all' || item.facility === facilitySlug.value,
  )
})

const openFaqItems = ref<number[]>([0])

function toggleFaqItem(index: number) {
  if (openFaqItems.value.includes(index)) {
    openFaqItems.value = openFaqItems.value.filter(i => i !== index)
  } else {
    openFaqItems.value.push(index)
  }
}

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
  <div class="py-4 sm:py-12 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen transition-colors duration-300 w-full overflow-x-clip">
    <UContainer v-if="facility" class="space-y-6 sm:space-y-8 px-3 sm:px-6 lg:px-8">
      <NuxtLink
        to="/facilities"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
      >
        <UIcon name="i-tabler-arrow-left" class="size-4" />
        <span>Back to All Facilities</span>
      </NuxtLink>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        <div class="lg:col-span-8 space-y-6 sm:space-y-8 min-w-0">
          <div class="relative rounded-none sm:rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs">
            <NuxtImg
              v-if="coverImgSrc"
              :src="coverImgSrc"
              :alt="facility.title"
              format="webp"
              quality="85"
              class="w-full h-56 sm:h-96 object-cover"
            />
            <div v-else class="flex h-56 sm:h-96 w-full items-center justify-center text-neutral-400">
              <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-16" />
            </div>

            <UBadge
              v-if="facility.badge"
              color="primary"
              variant="soft"
              class="absolute top-3 left-3 sm:top-4 sm:left-4 font-bold text-xs rounded-md uppercase backdrop-blur-md"
            >
              {{ facility.badge }}
            </UBadge>
          </div>

          <div class="space-y-2">
            <h1 class="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white leading-tight">
              {{ facility.title }}
            </h1>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              {{ facility.description }}
            </p>
          </div>

          <div
            v-if="facility.quote?.text"
            class="py-2 px-3 sm:px-4 rounded-none sm:rounded-md border-l-4 border-l-lime-500 border-y-0 sm:border-y border-r-0 sm:border-r border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 space-y-1"
          >
            <p class="text-xs sm:text-sm font-medium italic text-neutral-800 dark:text-neutral-200 leading-relaxed">
              "{{ facility.quote.text }}"
            </p>
            <p v-if="facility.quote.author" class="text-[10px] font-bold text-lime-600 dark:text-lime-400 uppercase tracking-widest">
              — {{ facility.quote.author }}
            </p>
          </div>

          <div v-if="facility.features?.length" class="pt-5 sm:pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <h3 class="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <UIcon name="i-tabler-circle-check-filled" class="size-4 text-lime-500" />
              Equipment & Features Included
            </h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
              <li v-for="(feat, idx) in facility.features" :key="idx" class="flex items-center gap-2 font-medium">
                <UIcon name="i-tabler-check" class="size-3.5 text-lime-500 shrink-0" />
                <span>{{ feat }}</span>
              </li>
            </ul>
          </div>

          <div v-if="facility.rules?.length" class="pt-5 sm:pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <h3 class="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <UIcon name="i-tabler-shield-check" class="size-4 text-lime-500" />
              Dress Code & Safety Rules
            </h3>
            <ul class="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
              <li v-for="(rule, idx) in facility.rules" :key="idx" class="flex items-start gap-2 font-medium">
                <UIcon name="i-tabler-alert-circle" class="size-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{{ rule }}</span>
              </li>
            </ul>
          </div>

          <NuxtLink
            :to="`/gallery/${facility.stem.split('/').pop()}`"
            class="group block p-0 sm:p-5 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs"
          >
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-600 dark:text-lime-400">
                  <UIcon name="i-tabler-photo" class="size-5" />
                </div>
                <div class="space-y-0.5 min-w-0">
                  <h4 class="text-sm font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                    Facility Photo Album
                  </h4>
                  <p class="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                    Explore full photo gallery collections for this specific facility.
                  </p>
                </div>
              </div>

              <span class="inline-flex items-center gap-1 font-bold text-xs text-lime-600 dark:text-lime-400 group-hover:translate-x-1 transition-transform shrink-0">
                <span>View Gallery</span>
                <UIcon name="i-tabler-arrow-right" class="size-4" />
              </span>
            </div>
          </NuxtLink>

          <div class="prose dark:prose-invert max-w-none text-xs leading-relaxed pt-5 sm:pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <ContentRenderer :value="facility" />
          </div>

          <div v-if="activeTestimonials.length" class="pt-6 sm:pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-4 sm:space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-3 sm:pb-4">
              <div>
                <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-[10px] mb-1 rounded-md">
                  Visitor Reviews
                </UBadge>
                <h3 class="text-lg sm:text-xl font-black text-neutral-950 dark:text-white">
                  What Guests Say About {{ facility.title }}
                </h3>
              </div>

              <div class="flex items-center p-1 rounded-md bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0 self-start sm:self-auto">
                <UButton
                  size="xs"
                  :color="testimonialViewMode === 'grid' ? 'primary' : 'neutral'"
                  :variant="testimonialViewMode === 'grid' ? 'solid' : 'ghost'"
                  icon="i-tabler-layout-grid"
                  aria-label="Grid View"
                  class="rounded-md font-bold"
                  @click="testimonialViewMode = 'grid'"
                />
                <UButton
                  size="xs"
                  :color="testimonialViewMode === 'list' ? 'primary' : 'neutral'"
                  :variant="testimonialViewMode === 'list' ? 'solid' : 'ghost'"
                  icon="i-tabler-list"
                  aria-label="List View"
                  class="rounded-md font-bold"
                  @click="testimonialViewMode = 'list'"
                />
              </div>
            </div>

            <div v-if="testimonialViewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <NuxtLink
                v-for="(item, idx) in activeTestimonials"
                :key="idx"
                :to="item.path || '/testimonials'"
                class="group block p-0 sm:p-4 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 space-y-2.5 sm:space-y-3 min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-3 sm:pb-0"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1 text-lime-500">
                    <UIcon
                      v-for="star in (item.rating || 5)"
                      :key="star"
                      name="i-tabler-star-filled"
                      class="size-3.5"
                    />
                  </div>
                  <UBadge v-if="item.category" color="neutral" variant="subtle" class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md">
                    {{ item.category }}
                  </UBadge>
                </div>

                <p class="text-xs font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed italic line-clamp-3 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                  "{{ item.comment }}"
                </p>

                <div class="flex items-center gap-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <NuxtImg
                    v-if="item.avatar"
                    :src="item.avatar"
                    :alt="item.author"
                    format="webp"
                    quality="80"
                    class="size-8 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
                  />
                  <div
                    v-else
                    class="flex size-8 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs"
                  >
                    {{ item.author.charAt(0) }}
                  </div>

                  <div class="space-y-0.5 min-w-0 flex-1">
                    <h4 class="text-xs font-bold text-neutral-950 dark:text-white truncate">
                      {{ item.author }}
                    </h4>
                    <p class="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
                      {{ item.role }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </div>

            <div v-else-if="testimonialViewMode === 'list'" class="space-y-3">
              <NuxtLink
                v-for="(item, idx) in activeTestimonials"
                :key="idx"
                :to="item.path || '/testimonials'"
                class="group block p-0 sm:p-4 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-3 sm:pb-0"
              >
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                  <div class="space-y-1.5 min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-1 text-lime-500">
                        <UIcon
                          v-for="star in (item.rating || 5)"
                          :key="star"
                          name="i-tabler-star-filled"
                          class="size-3.5"
                        />
                      </div>
                      <UBadge v-if="item.category" color="neutral" variant="subtle" class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md">
                        {{ item.category }}
                      </UBadge>
                    </div>

                    <p class="text-xs font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed italic group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                      "{{ item.comment }}"
                    </p>
                  </div>

                  <div class="flex items-center gap-2.5 pt-2 sm:pt-0 shrink-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                    <NuxtImg
                      v-if="item.avatar"
                      :src="item.avatar"
                      :alt="item.author"
                      format="webp"
                      quality="80"
                      class="size-8 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
                    />
                    <div
                      v-else
                      class="flex size-8 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs"
                    >
                      {{ item.author.charAt(0) }}
                    </div>

                    <div class="text-xs">
                      <span class="font-bold text-neutral-950 dark:text-white">{{ item.author }}</span>
                      <span v-if="item.role" class="text-neutral-400 ml-1.5">• {{ item.role }}</span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <div v-if="activeFaqs.length" class="pt-6 sm:pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
            <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-[10px] mb-1 rounded-md">
                  Court & Venue FAQ
                </UBadge>
                <h3 class="text-lg sm:text-xl font-black text-neutral-950 dark:text-white">
                  Frequently Asked Questions
                </h3>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="(faq, idx) in activeFaqs"
                :key="idx"
                class="rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 p-0 sm:p-4 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-3 sm:pb-0"
              >
                <button
                  type="button"
                  class="w-full flex items-center justify-between text-left font-extrabold text-xs sm:text-sm text-neutral-950 dark:text-white group cursor-pointer"
                  @click="toggleFaqItem(idx)"
                >
                  <span class="group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors pr-3 sm:pr-4">
                    {{ faq.question }}
                  </span>
                  <UIcon
                    name="i-tabler-chevron-down"
                    class="size-4 text-neutral-400 transition-transform duration-200 shrink-0"
                    :class="{ 'rotate-180 text-lime-500': openFaqItems.includes(idx) }"
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
                    class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pr-2 pt-2 font-medium overflow-hidden"
                  >
                    {{ faq.answer }}
                  </p>
                </Transition>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 lg:sticky lg:top-[calc(var(--ui-header-height,4rem)+1.5rem)] space-y-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-200 dark:border-neutral-800">
          <div class="p-0 sm:p-6 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs space-y-4 sm:space-y-6">
            <div v-if="facility.pricing">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Booking Rate</span>
              <div class="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white mt-0.5 sm:mt-1">
                {{ facility.pricing.rate }}
                <span v-if="facility.pricing.unit" class="text-xs font-medium text-neutral-400">/ {{ facility.pricing.unit }}</span>
              </div>
              <p v-if="facility.pricing.note" class="text-[11px] text-neutral-500 mt-1 font-medium">
                {{ facility.pricing.note }}
              </p>
            </div>

            <ul class="space-y-2.5 sm:space-y-3 text-xs divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
              <li v-if="facility.capacity" class="flex items-center justify-between pt-2.5 sm:pt-3 first:pt-0">
                <span class="text-neutral-400 font-medium">Guest Capacity</span>
                <span class="font-bold text-neutral-950 dark:text-white">{{ facility.capacity }}</span>
              </li>
              <li v-if="facility.operatingHours" class="flex items-center justify-between pt-2.5 sm:pt-3">
                <span class="text-neutral-400 font-medium">Operating Hours</span>
                <span class="font-bold text-neutral-950 dark:text-white">{{ facility.operatingHours }}</span>
              </li>
              <li v-if="facility.ageGroup" class="flex items-center justify-between pt-2.5 sm:pt-3">
                <span class="text-neutral-400 font-medium">Target Age</span>
                <span class="font-bold text-neutral-950 dark:text-white">{{ facility.ageGroup }}</span>
              </li>
            </ul>

            <div class="space-y-2.5 sm:space-y-3 pt-2">
              <UButton
                :to="`/contact?facility=${route.path.split('/').pop()}`"
                block
                size="lg"
                color="primary"
                icon="i-tabler-calendar-event"
                class="font-black uppercase text-xs text-neutral-950 rounded-md py-3.5 cursor-pointer justify-center"
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
                class="font-bold text-xs rounded-md py-2.5 text-emerald-600 dark:text-emerald-400 cursor-pointer justify-center"
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
