<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { usePricingCatalog } from '~/composables/usePricingCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const { getCollection } = useContentQuery()

const {
  pricingPlans,
  filteredPlans,
  resetFilters,
} = await usePricingCatalog()

// Evaluates whether any pricing plans exist overall in the database catalog
const hasAnyPlan = computed(() => (pricingPlans.value?.length || 0) > 0)

// Fetch pricing-specific FAQs
const { data: pricingFaqs } = await getCollection('pricing-faqs-collection', 'faqs', {
  where: { category: 'Pricing & Passes' },
  sort: [{ key: 'order', order: 'ASC' }],
  enableLogging: false,
})

// Fetch pricing-specific testimonials
const { data: pricingTestimonials } = await getCollection('pricing-testimonials-collection', 'testimonials', {
  where: { category: 'Pricing & Passes', featured: true },
  limit: 3,
  enableLogging: false,
})

// Active open FAQ accordion items state
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
  <div class="min-h-screen bg-default text-default pb-16 transition-colors duration-300">
    <!-- Hero Banner -->
    <div class="pt-6 sm:pt-10 pb-2 sm:pb-4 text-left sm:text-center space-y-3 max-w-3xl mx-auto px-4">
      <div class="inline-flex">
        <UBadge
          color="primary"
          variant="soft"
          class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-3.5 py-1 sm:py-0.5 rounded-full"
        >
          <UIcon name="i-tabler-ticket" class="size-3.5 mr-1.5 text-primary shrink-0" />
          <span>Services & quotations</span>
        </UBadge>
      </div>

      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-highlighted leading-tight">
        Services built around your needs
      </h1>

      <p class="text-xs sm:text-base text-muted leading-relaxed max-w-2xl mx-0 sm:mx-auto">
        We coordinate outdoor recreation, group experiences, sports kits, uniforms and selected equipment. Requirements, availability and pricing are confirmed before an arrangement is finalised.
      </p>
    </div>

    <!-- Main Content Container -->
    <UContainer class="pt-6 space-y-16">
      <div class="mb-6 flex justify-end" role="group" aria-label="View mode">
        <div class="flex items-center gap-1 p-1 rounded-sm bg-elevated border border-default">
          <UButton size="xs" :color="viewMode === 'grid' ? 'primary' : 'neutral'" :variant="viewMode === 'grid' ? 'solid' : 'ghost'" icon="i-tabler-layout-grid" aria-label="Grid View" :aria-pressed="viewMode === 'grid'" class="rounded-sm" @click="viewMode = 'grid'" />
          <UButton size="xs" :color="viewMode === 'list' ? 'primary' : 'neutral'" :variant="viewMode === 'list' ? 'solid' : 'ghost'" icon="i-tabler-list" aria-label="List View" :aria-pressed="viewMode === 'list'" class="rounded-sm" @click="viewMode = 'list'" />
        </div>
      </div>

      <!-- Grid View Option -->
      <div
        v-if="viewMode === 'grid' && filteredPlans.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
      >
        <NuxtLink
          v-for="plan in filteredPlans"
          :key="plan.id || plan.path"
          :to="plan.path"
          class="group flex flex-col justify-between transition-all duration-300"
        >
          <!-- Badge & Content -->
          <div>
            <div class="flex items-center justify-between gap-2 mb-4">
              <div
                class="flex size-12 items-center justify-center  transition-colors"
                :class="[
                  plan.isPopular
                    ? 'bg-primary/15 text-primary'
                    : 'bg-elevated text-muted',
                ]"
              >
                <UIcon :name="plan.isPopular ? 'i-tabler-crown' : 'i-tabler-ticket'" class="size-6" />
              </div>

              <UBadge
                v-if="plan.badge"
                :color="plan.isPopular ? 'primary' : 'neutral'"
                variant="soft"
                class="font-bold rounded-lg px-2.5 py-0.5 text-[10px] uppercase"
              >
                {{ plan.badge }}
              </UBadge>
            </div>

            <!-- Title & Description -->
            <h2 class="text-xl font-black text-highlighted group-hover:text-primary transition-colors">
              {{ plan.title }}
            </h2>

            <p class="text-xs text-muted line-clamp-2 mt-1.5 leading-relaxed">
              {{ plan.description }}
            </p>

            <!-- Price Banner -->
            <div class="my-4 pt-3 border-t border-default">
              <span v-if="plan.price" class="text-[9px] font-bold uppercase tracking-wider text-muted block">{{ plan.currency || 'KES' }}</span>
              <div class="flex items-baseline gap-1 mt-0.5">
                <span class="text-2xl sm:text-3xl font-black text-highlighted">
                  {{ plan.price ? plan.price.toLocaleString() : 'Quote on request' }}
                </span>
                <span class="text-xs text-muted font-medium">/ {{ plan.billingCycle }}</span>
              </div>
            </div>

            <!-- Feature Bullet List -->
            <div v-if="plan.features?.length" class="space-y-2 pt-1 text-xs text-muted">
              <div v-for="(feat, idx) in plan.features.slice(0, 4)" :key="idx" class="flex items-start gap-2">
                <UIcon name="i-tabler-circle-check-filled" class="size-4 text-primary shrink-0 mt-0.5" />
                <span class="leading-tight">{{ feat }}</span>
              </div>
            </div>
          </div>

          <!-- Footer CTA Button -->
          <div class="pt-4 mt-4 border-t border-default">
            <UButton
              :to="plan.path"
              :color="plan.isPopular ? 'primary' : 'neutral'"
              :variant="plan.isPopular ? 'solid' : 'outline'"
              size="md"
              icon="i-tabler-arrow-right"
              trailing
              class="w-full font-black uppercase text-xs rounded-sm justify-center py-2.5"
              :class="[plan.isPopular ? 'text-highlighted' : '']"
            >
              {{ plan.cta?.label || 'Get Pass' }}
            </UButton>
          </div>
        </NuxtLink>
      </div>

      <!-- Flat Row List View Option -->
      <div
        v-else-if="viewMode === 'list' && filteredPlans.length"
        data-catalog-list class="divide-y divide-default dark:divide-default"
      >
        <div
          v-for="plan in filteredPlans"
          :key="plan.id || plan.path"
          data-catalog-list-row class="group py-5 transition-colors"
        >
          <!-- Top Row: Icon, Info & Price/CTA -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <!-- Badge Icon + Plan Details -->
            <div class="flex items-start gap-4 min-w-0 flex-1">
              <div
                class="flex size-16 sm:size-20 shrink-0 items-center justify-center  transition-colors"
                :class="[
                  plan.isPopular
                    ? 'bg-primary/15 text-primary'
                    : 'bg-elevated text-muted',
                ]"
              >
                <UIcon :name="plan.isPopular ? 'i-tabler-crown' : 'i-tabler-ticket'" class="size-8" />
              </div>

              <div class="space-y-1.5 min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-[10px]">
                  <UBadge
                    v-if="plan.badge"
                    :color="plan.isPopular ? 'primary' : 'neutral'"
                    variant="soft"
                    class="font-bold rounded px-1.5 py-0.5 text-[9px] uppercase"
                  >
                    {{ plan.badge }}
                  </UBadge>
                  <span class="text-muted font-medium">• {{ plan.billingCycle }} access</span>
                </div>

                <h2 class="text-base sm:text-xl font-black text-highlighted group-hover:text-primary transition-colors truncate">
                  <NuxtLink :to="plan.path">
                    {{ plan.title }}
                  </NuxtLink>
                </h2>

                <p class="text-xs text-muted line-clamp-2 leading-relaxed max-w-2xl">
                  {{ plan.description }}
                </p>
              </div>
            </div>

            <!-- Price & Action Button -->
            <div class="flex items-center justify-between sm:justify-end gap-5 w-full lg:w-auto pt-3 sm:pt-0 shrink-0">
              <div class="text-left sm:text-right">
                <span v-if="plan.price" class="text-[10px] font-bold uppercase tracking-wider text-muted block">{{ plan.currency || 'KES' }}</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-xl sm:text-2xl font-black text-highlighted">
                    {{ plan.price ? plan.price.toLocaleString() : 'Quote on request' }}
                  </span>
                  <span class="text-[11px] text-muted">/ {{ plan.billingCycle }}</span>
                </div>
              </div>

              <UButton
                :to="plan.path"
                :color="plan.isPopular ? 'primary' : 'neutral'"
                :variant="plan.isPopular ? 'solid' : 'outline'"
                size="sm"
                icon="i-tabler-arrow-right"
                trailing
                class="font-black uppercase text-xs rounded-sm px-4 py-2"
                :class="[plan.isPopular ? 'text-highlighted' : '']"
              >
                {{ plan.cta?.label || 'View Details' }}
              </UButton>
            </div>
          </div>

          <!-- Bottom Row: Features -->
          <div v-if="plan.features?.length" class="mt-3.5 pt-3 border-t border-default w-full">
            <div class="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-muted">
              <div v-for="(feat, idx) in plan.features" :key="idx" class="inline-flex items-center gap-1.5">
                <UIcon name="i-tabler-circle-check-filled" class="size-4 text-primary shrink-0" />
                <span class="font-medium">{{ feat }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Empty State -->
      <div v-else-if="hasAnyPlan" class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center  bg-elevated mx-auto border border-default">
          <UIcon name="i-tabler-filter-off" class="size-8 text-muted" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-highlighted">
            No Matching Services
          </h3>
          <p class="text-xs text-muted leading-relaxed">
            No services match your current search query or active filter selections. Try clearing your filters or searching for something else.
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
          <UIcon name="i-tabler-ticket-off" class="size-8 text-muted" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-highlighted">
            No Services Available
          </h3>
          <p class="text-xs text-muted leading-relaxed">
            Services are arranged around your requirements. Contact us to discuss recreation, group experiences, sports kits or selected equipment.
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

      <!-- Testimonials Section -->
      <div v-if="pricingTestimonials?.length" class="pt-10 border-t border-default space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-default pb-5">
          <div>
            <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-xs mb-2">
              Pass Member Reviews
            </UBadge>
            <h2 class="text-2xl sm:text-3xl font-black text-highlighted">
              Why Members Love Their Passes
            </h2>
          </div>
          <p class="text-xs text-muted max-w-md leading-relaxed">
            Hear from monthly and annual pass holders about ground access, guest discounts, and value.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-default dark:divide-default">
          <div
            v-for="(item, idx) in pricingTestimonials"
            :key="idx"
            class="space-y-4 pt-6 md:pt-0"
            :class="{ 'md:pl-8': idx > 0 }"
          >
            <div class="flex items-center gap-1 text-primary">
              <UIcon
                v-for="star in (item.rating || 5)"
                :key="star"
                name="i-tabler-star-filled"
                class="size-4"
              />
            </div>

            <p class="text-xs sm:text-sm font-medium text-muted leading-relaxed italic">
              "{{ item.comment }}"
            </p>

            <div class="flex items-center gap-3 pt-2">
              <NuxtImg
                v-if="item.avatar"
                :src="item.avatar"
                :alt="item.author"
                format="webp"
                quality="80"
                class="size-9 rounded-full object-cover border border-default shrink-0"
              />
              <div
                v-else
                class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs"
              >
                {{ item.author.charAt(0) }}
              </div>

              <div class="space-y-0.5">
                <h3 class="text-xs font-bold text-highlighted">
                  {{ item.author }}
                </h3>
                <p class="text-[10px] text-muted font-medium">
                  {{ item.role }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Group & Corporate Booking Banner -->
      <div class="py-10 border-y border-default">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-8 space-y-3">
            <UBadge color="primary" variant="soft" class="font-bold text-xs uppercase tracking-wider">
              <UIcon name="i-tabler-users" class="size-3.5 mr-1.5 text-primary shrink-0" />
              Group & Corporate Bookings
            </UBadge>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-highlighted">
              Planning a group, school or corporate experience?
            </h3>
            <p class="text-xs sm:text-base text-muted leading-relaxed">
              We discuss suitable programmes for birthdays, graduations, meetings and team-building activities based on your objectives, group size, preferred activities and available time.
            </p>
          </div>
          <div class="lg:col-span-4 flex lg:justify-end">
            <UButton
              to="/contact?type=group-booking"
              size="lg"
              color="primary"
              icon="i-tabler-users"
              class="w-full lg:w-auto font-black uppercase text-xs text-highlighted rounded-sm px-6 py-3.5 justify-center"
            >
              Request a Quote
            </UButton>
          </div>
        </div>
      </div>

      <!-- Pass & Membership FAQs -->
      <div v-if="pricingFaqs?.length" class="space-y-6 pt-2">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-default pb-5">
          <div>
            <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-xs mb-2">
              Pass & Billing Guidance
            </UBadge>
            <h2 class="text-2xl sm:text-3xl font-black text-highlighted">
              Pass & Membership FAQs
            </h2>
          </div>
        </div>

        <div data-catalog-list class="divide-y divide-default dark:divide-default">
          <div
            v-for="(faq, idx) in pricingFaqs"
            :key="idx"
            class="py-4 space-y-2"
          >
            <button
              type="button"
              class="w-full flex items-center justify-between text-left font-extrabold text-sm sm:text-base text-highlighted group cursor-pointer transition-colors"
              @click="toggleFaqItem(idx)"
            >
              <span class="group-hover:text-primary transition-colors pr-4">
                {{ faq.question }}
              </span>
              <UIcon
                name="i-tabler-chevron-down"
                class="size-5 text-muted transition-transform duration-200 shrink-0"
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
                class="text-xs sm:text-sm text-muted leading-relaxed pr-6 pt-1 font-medium overflow-hidden"
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
