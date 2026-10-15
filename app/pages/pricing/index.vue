<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { usePricingCatalog } from '~/composables/usePricingCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

const viewMode = ref<'grid' | 'list'>('grid')

const { getCollection } = useContentQuery()
const { pricingPlans } = await usePricingCatalog()

const hasAnyPlan = computed(() => (pricingPlans.value?.length || 0) > 0)

const { data: pricingFaqs } = await getCollection('pricing-faqs-collection', 'faqs', {
  where: { category: 'Pricing & Passes' },
  sort: [{ key: 'order', order: 'ASC' }],
  enableLogging: false,
})

const { data: pricingTestimonials } = await getCollection('pricing-testimonials-collection', 'testimonials', {
  where: { category: 'Pricing & Passes', featured: true },
  limit: 3,
  enableLogging: false,
})

const openFaqItems = ref<number[]>([0])

function toggleFaqItem(index: number) {
  if (openFaqItems.value.includes(index)) {
    openFaqItems.value = openFaqItems.value.filter(i => i !== index)
  } else {
    openFaqItems.value.push(index)
  }
}

useSeoMeta({
  title: `Pricing & Passes | ${LOCATION_DETAILS.company}`,
  description: 'Explore Recreation Yard Limited services and request arrangements or quotations based on your requirements.',
  ogTitle: `Pricing & Passes | ${LOCATION_DETAILS.company}`,
  ogDescription: 'Explore Recreation Yard Limited services and request arrangements or quotations based on your requirements.',
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}/pricing`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
useSchemaOrg([{
  '@type': 'CollectionPage',
  '@id': `${siteUrl}/pricing#webpage`,
  'url': `${siteUrl}/pricing`,
  'name': `Pricing & Passes | ${LOCATION_DETAILS.company}`,
  'description': 'Explore Recreation Yard Limited services and request arrangements or quotations based on your requirements.',
  'isPartOf': { '@id': `${siteUrl}/#website` },
  'about': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-12 sm:pb-16 transition-colors duration-300 w-full overflow-x-clip">
    <div class="pt-4 sm:pt-10 pb-4 sm:pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="space-y-2 sm:space-y-3 text-left sm:text-center">
          <div class="inline-flex">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-0.5 rounded-md"
            >
              <UIcon name="i-tabler-ticket" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
              <span>Services & quotations</span>
            </UBadge>
          </div>

          <h1 class="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
            Services built around your needs
          </h1>

          <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            We coordinate outdoor recreation, group experiences, sports kits, uniforms and selected equipment. Requirements, availability and pricing are confirmed before an arrangement is finalised.
          </p>
        </div>
      </UContainer>
    </div>

    <div class="sticky top-[var(--ui-header-height,4rem)] z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-none sm:shadow-xs transition-all">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-3 sm:gap-4">
          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            Available Options: <span class="text-lime-600 dark:text-lime-400 font-extrabold text-sm">{{ pricingPlans?.length || 0 }}</span>
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

    <UContainer class="pt-4 sm:pt-8 px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
      <div
        v-if="viewMode === 'grid' && hasAnyPlan"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
      >
        <NuxtLink
          v-for="plan in pricingPlans"
          :key="plan.id || plan.path"
          :to="plan.path"
          class="group flex flex-col justify-between p-0 sm:p-5 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-4 sm:pb-0"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-3 sm:mb-4">
              <div
                class="flex size-9 sm:size-11 items-center justify-center rounded-md transition-colors"
                :class="[
                  plan.isPopular
                    ? 'bg-lime-500/15 text-lime-600 dark:text-lime-400'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400',
                ]"
              >
                <UIcon :name="plan.isPopular ? 'i-tabler-crown' : 'i-tabler-ticket'" class="size-4 sm:size-5" />
              </div>

              <UBadge
                v-if="plan.badge"
                :color="plan.isPopular ? 'primary' : 'neutral'"
                variant="soft"
                class="font-bold rounded-md px-2 sm:px-2.5 py-0.5 text-[10px] uppercase"
              >
                {{ plan.badge }}
              </UBadge>
            </div>

            <h2 class="text-lg sm:text-xl font-black text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
              {{ plan.title }}
            </h2>

            <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed font-medium">
              {{ plan.description }}
            </p>

            <div class="my-3 sm:my-4 pt-2.5 sm:pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60">
              <span v-if="plan.price" class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">{{ plan.currency || 'KES' }}</span>
              <div class="flex items-baseline gap-1 mt-0.5">
                <span class="text-xl sm:text-3xl font-black text-neutral-950 dark:text-white">
                  {{ plan.price ? plan.price.toLocaleString() : 'Quote on request' }}
                </span>
                <span v-if="plan.billingCycle" class="text-xs text-neutral-400 font-medium">/ {{ plan.billingCycle }}</span>
              </div>
            </div>

            <div v-if="plan.features?.length" class="space-y-1.5 sm:space-y-2 pt-1 text-xs text-neutral-600 dark:text-neutral-300">
              <div v-for="(feat, idx) in plan.features.slice(0, 4)" :key="idx" class="flex items-start gap-2">
                <UIcon name="i-tabler-circle-check-filled" class="size-4 text-lime-500 shrink-0 mt-0.5" />
                <span class="leading-tight text-[11px] font-medium">{{ feat }}</span>
              </div>
            </div>
          </div>

          <div class="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <span
              class="inline-flex w-full items-center justify-center gap-1.5 font-black uppercase text-xs rounded-md py-2.5 transition-colors"
              :class="[
                plan.isPopular
                  ? 'bg-lime-500 text-neutral-950 group-hover:bg-lime-400'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white group-hover:bg-lime-500 group-hover:text-neutral-950',
              ]"
            >
              <span>{{ plan.cta?.label || 'Get Pass' }}</span>
              <UIcon name="i-tabler-arrow-right" class="size-4" />
            </span>
          </div>
        </NuxtLink>
      </div>

      <div
        v-else-if="viewMode === 'list' && hasAnyPlan"
        class="space-y-3 sm:space-y-4 w-full"
      >
        <NuxtLink
          v-for="plan in pricingPlans"
          :key="plan.id || plan.path"
          :to="plan.path"
          class="group block p-0 sm:p-5 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-4 sm:pb-0"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
            <div class="flex items-start gap-3 sm:gap-4 min-w-0 flex-1 w-full sm:w-auto">
              <div
                class="flex size-12 sm:size-16 shrink-0 items-center justify-center rounded-md transition-colors"
                :class="[
                  plan.isPopular
                    ? 'bg-lime-500/15 text-lime-600 dark:text-lime-400'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400',
                ]"
              >
                <UIcon :name="plan.isPopular ? 'i-tabler-crown' : 'i-tabler-ticket'" class="size-6 sm:size-7" />
              </div>

              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-[10px]">
                  <UBadge
                    v-if="plan.badge"
                    :color="plan.isPopular ? 'primary' : 'neutral'"
                    variant="soft"
                    class="font-bold rounded-md px-1.5 py-0.5 text-[9px] uppercase"
                  >
                    {{ plan.badge }}
                  </UBadge>
                  <span v-if="plan.billingCycle" class="text-neutral-400 font-medium">• {{ plan.billingCycle }} access</span>
                </div>

                <h2 class="text-sm sm:text-lg font-black text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                  {{ plan.title }}
                </h2>

                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                  {{ plan.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800/60 shrink-0">
              <div class="text-left sm:text-right">
                <span v-if="plan.price" class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">{{ plan.currency || 'KES' }}</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-base sm:text-xl font-black text-neutral-950 dark:text-white">
                    {{ plan.price ? plan.price.toLocaleString() : 'Quote on request' }}
                  </span>
                  <span v-if="plan.billingCycle" class="text-[11px] text-neutral-400">/ {{ plan.billingCycle }}</span>
                </div>
              </div>

              <span
                class="inline-flex items-center gap-1 font-black uppercase text-xs px-3.5 py-2 rounded-md transition-colors"
                :class="[
                  plan.isPopular
                    ? 'bg-lime-500 text-neutral-950 group-hover:bg-lime-400'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white group-hover:bg-lime-500 group-hover:text-neutral-950',
                ]"
              >
                <span>{{ plan.cta?.label || 'View Details' }}</span>
                <UIcon name="i-tabler-arrow-right" class="size-4" />
              </span>
            </div>
          </div>

          <div v-if="plan.features?.length" class="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 w-full">
            <div class="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1 sm:gap-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
              <div v-for="(feat, idx) in plan.features" :key="idx" class="inline-flex items-center gap-1.5">
                <UIcon name="i-tabler-circle-check-filled" class="size-3.5 text-lime-500 shrink-0" />
                <span class="font-medium text-[11px] sm:text-xs">{{ feat }}</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="py-12 sm:py-20 text-center space-y-4 max-w-md mx-auto">
        <div class="flex size-14 sm:size-16 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-ticket-off" class="size-7 sm:size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
            No Services Available
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Services are arranged around your requirements. Contact us to discuss recreation, group experiences, sports kits or selected equipment.
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

      <div v-if="pricingTestimonials?.length" class="pt-6 sm:pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-4 sm:space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-3 sm:pb-4">
          <div>
            <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-[10px] mb-1 rounded-md">
              Pass Member Reviews
            </UBadge>
            <h2 class="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
              Why Members Love Their Passes
            </h2>
          </div>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed">
            Hear from monthly and annual pass holders about ground access, guest discounts, and value.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full">
          <div
            v-for="(item, idx) in pricingTestimonials"
            :key="idx"
            class="p-0 sm:p-4 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs space-y-2.5 sm:space-y-3 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-3 sm:pb-0"
          >
            <div class="flex items-center gap-1 text-lime-500">
              <UIcon
                v-for="star in (item.rating || 5)"
                :key="star"
                name="i-tabler-star-filled"
                class="size-3.5"
              />
            </div>

            <p class="text-xs font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
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
                <h3 class="text-xs font-bold text-neutral-950 dark:text-white truncate">
                  {{ item.author }}
                </h3>
                <p class="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
                  {{ item.role }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-0 sm:p-8 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
          <div class="lg:col-span-8 space-y-2 sm:space-y-2.5">
            <UBadge color="primary" variant="soft" class="font-bold text-[10px] uppercase tracking-wider rounded-md">
              <UIcon name="i-tabler-users" class="size-3.5 mr-1 text-lime-500 shrink-0" />
              Group & Corporate Bookings
            </UBadge>
            <h3 class="text-lg sm:text-2xl font-black text-neutral-950 dark:text-white">
              Planning a group, school or corporate experience?
            </h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
              We discuss suitable programmes for birthdays, graduations, meetings and team-building activities based on your objectives, group size, preferred activities and available time.
            </p>
          </div>
          <div class="lg:col-span-4 flex lg:justify-end pt-1 lg:pt-0">
            <UButton
              to="/contact?type=group-booking"
              size="md"
              color="primary"
              icon="i-tabler-users"
              class="w-full sm:w-auto font-black uppercase text-xs text-neutral-950 rounded-md px-6 py-3 justify-center cursor-pointer"
            >
              Request a Quote
            </UButton>
          </div>
        </div>
      </div>

      <div v-if="pricingFaqs?.length" class="space-y-3 sm:space-y-4 pt-2">
        <div class="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-[10px] mb-1 rounded-md">
            Pass & Billing Guidance
          </UBadge>
          <h2 class="text-lg sm:text-xl font-black text-neutral-950 dark:text-white">
            Pass & Membership FAQs
          </h2>
        </div>

        <div class="space-y-3">
          <div
            v-for="(faq, idx) in pricingFaqs"
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
    </UContainer>
  </div>
</template>
