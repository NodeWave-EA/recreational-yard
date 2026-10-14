<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { usePricingCatalog } from '~/composables/usePricingCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const { getCollection } = useContentQuery()

const {
  pricingPlans,
  searchQuery,
  selectedCategory,
  sortBy,
  categoryOptions,
  sortOptions,
  selectedCategoryMeta,
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
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-16 transition-colors duration-300">
    <!-- Hero Banner -->
    <div class="pt-6 sm:pt-10 pb-2 sm:pb-4 text-left sm:text-center space-y-3 max-w-3xl mx-auto px-4">
      <div class="inline-flex">
        <UBadge
          color="primary"
          variant="soft"
          class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-3.5 py-1 sm:py-0.5 rounded-full"
        >
          <UIcon name="i-tabler-ticket" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
          <span>Services & quotations</span>
        </UBadge>
      </div>

      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
        Services built around your needs
      </h1>

      <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-0 sm:mx-auto">
        We coordinate outdoor recreation, group experiences, sports kits, uniforms and selected equipment. Requirements, availability and pricing are confirmed before an arrangement is finalised.
      </p>
    </div>

    <!-- Sticky Toolbar -->
    <div class="sticky top-(--ui-header-height,4rem) z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs transition-all">
      <UContainer class="w-full">
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          <UInput
            v-model="searchQuery"
            icon="i-tabler-search"
            placeholder="Search passes, features, or access levels..."
            size="md"
            color="primary"
            class="w-full md:w-80 shadow-xs rounded-xl"
            clearable
          />

          <!-- Filter Dropdowns & View Mode Switcher -->
          <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <!-- Pass Type Dropdown with Search -->
            <USelectMenu
              v-model="selectedCategory"
              :items="categoryOptions"
              :options="categoryOptions"
              value-key="id"
              label-key="label"
              value-attribute="id"
              option-attribute="label"
              searchable
              placeholder="Filter Pass Type..."
              class="w-44 shrink-0"
            >
              <template #leading>
                <UIcon :name="selectedCategoryMeta.icon" class="size-4 text-lime-500 shrink-0" />
              </template>
              <template #item="{ item }">
                <div class="flex items-center gap-2 truncate">
                  <UIcon :name="item?.icon || 'i-tabler-ticket'" class="size-4 text-lime-500 shrink-0" />
                  <span class="truncate">{{ item?.label }}</span>
                </div>
              </template>
            </USelectMenu>

            <!-- Sort Dropdown -->
            <USelectMenu
              v-model="sortBy"
              :items="sortOptions"
              :options="sortOptions"
              value-key="id"
              label-key="label"
              value-attribute="id"
              option-attribute="label"
              class="w-40 shrink-0"
            />

            <!-- View Mode Switcher (Grid vs List) -->
            <div class="flex items-center p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
              <UButton
                size="xs"
                :color="viewMode === 'grid' ? 'primary' : 'neutral'"
                :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
                icon="i-tabler-layout-grid"
                aria-label="Grid View"
                class="rounded-lg font-bold"
                @click="viewMode = 'grid'"
              />
              <UButton
                size="xs"
                :color="viewMode === 'list' ? 'primary' : 'neutral'"
                :variant="viewMode === 'list' ? 'solid' : 'ghost'"
                icon="i-tabler-list"
                aria-label="List View"
                class="rounded-lg font-bold"
                @click="viewMode = 'list'"
              />
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content Container -->
    <UContainer class="w-full pt-6 space-y-16">
      <!-- Active Filter Summary Bar -->
      <div v-if="selectedCategory !== 'all' || searchQuery" class="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-bold text-neutral-400">Active Filters:</span>
          <UBadge v-if="searchQuery" color="primary" variant="soft" class="rounded-lg font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Query: "{{ searchQuery }}"</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="searchQuery = ''" />
          </UBadge>
          <UBadge v-if="selectedCategory !== 'all'" color="primary" variant="soft" class="rounded-lg font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Pass Type: {{ selectedCategoryMeta.label }}</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="selectedCategory = 'all'" />
          </UBadge>
          <UButton size="xs" color="neutral" variant="link" class="text-xs font-bold text-neutral-400" @click="resetFilters">
            Clear All
          </UButton>
        </div>
        <span class="font-bold text-neutral-500">
          Showing {{ filteredPlans.length }} {{ filteredPlans.length === 1 ? 'option' : 'options' }}
        </span>
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
                class="flex size-12 items-center justify-center rounded-2xl transition-colors"
                :class="[
                  plan.isPopular
                    ? 'bg-lime-500/15 text-lime-600 dark:text-lime-400'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400',
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
            <h2 class="text-xl font-black text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
              {{ plan.title }}
            </h2>

            <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
              {{ plan.description }}
            </p>

            <!-- Price Banner -->
            <div class="my-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60">
              <span v-if="plan.price" class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">{{ plan.currency || 'KES' }}</span>
              <div class="flex items-baseline gap-1 mt-0.5">
                <span class="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
                  {{ plan.price ? plan.price.toLocaleString() : 'Quote on request' }}
                </span>
                <span class="text-xs text-neutral-400 font-medium">/ {{ plan.billingCycle }}</span>
              </div>
            </div>

            <!-- Feature Bullet List -->
            <div v-if="plan.features?.length" class="space-y-2 pt-1 text-xs text-neutral-600 dark:text-neutral-300">
              <div v-for="(feat, idx) in plan.features.slice(0, 4)" :key="idx" class="flex items-start gap-2">
                <UIcon name="i-tabler-circle-check-filled" class="size-4 text-lime-500 shrink-0 mt-0.5" />
                <span class="leading-tight">{{ feat }}</span>
              </div>
            </div>
          </div>

          <!-- Footer CTA Button -->
          <div class="pt-4 mt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <UButton
              :to="plan.path"
              :color="plan.isPopular ? 'primary' : 'neutral'"
              :variant="plan.isPopular ? 'solid' : 'outline'"
              size="md"
              icon="i-tabler-arrow-right"
              trailing
              class="w-full font-black uppercase text-xs rounded-xl justify-center py-2.5"
              :class="[plan.isPopular ? 'text-neutral-950' : '']"
            >
              {{ plan.cta?.label || 'Get Pass' }}
            </UButton>
          </div>
        </NuxtLink>
      </div>

      <!-- Flat Row List View Option -->
      <div
        v-else-if="viewMode === 'list' && filteredPlans.length"
        class="divide-y divide-neutral-200/70 dark:divide-neutral-800/70"
      >
        <div
          v-for="plan in filteredPlans"
          :key="plan.id || plan.path"
          class="group py-5 transition-colors"
        >
          <!-- Top Row: Icon, Info & Price/CTA -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <!-- Badge Icon + Plan Details -->
            <div class="flex items-start gap-4 min-w-0 flex-1">
              <div
                class="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-2xl transition-colors"
                :class="[
                  plan.isPopular
                    ? 'bg-lime-500/15 text-lime-600 dark:text-lime-400'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400',
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
                  <span class="text-neutral-400 font-medium">• {{ plan.billingCycle }} access</span>
                </div>

                <h2 class="text-base sm:text-xl font-black text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                  <NuxtLink :to="plan.path">
                    {{ plan.title }}
                  </NuxtLink>
                </h2>

                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed max-w-2xl">
                  {{ plan.description }}
                </p>
              </div>
            </div>

            <!-- Price & Action Button -->
            <div class="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 shrink-0">
              <div class="text-left sm:text-right">
                <span v-if="plan.price" class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">{{ plan.currency || 'KES' }}</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
                    {{ plan.price ? plan.price.toLocaleString() : 'Quote on request' }}
                  </span>
                  <span class="text-[11px] text-neutral-400">/ {{ plan.billingCycle }}</span>
                </div>
              </div>

              <UButton
                :to="plan.path"
                :color="plan.isPopular ? 'primary' : 'neutral'"
                :variant="plan.isPopular ? 'solid' : 'outline'"
                size="sm"
                icon="i-tabler-arrow-right"
                trailing
                class="font-black uppercase text-xs rounded-xl px-4 py-2"
                :class="[plan.isPopular ? 'text-neutral-950' : '']"
              >
                {{ plan.cta?.label || 'View Details' }}
              </UButton>
            </div>
          </div>

          <!-- Bottom Row: Features -->
          <div v-if="plan.features?.length" class="mt-3.5 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 w-full">
            <div class="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
              <div v-for="(feat, idx) in plan.features" :key="idx" class="inline-flex items-center gap-1.5">
                <UIcon name="i-tabler-circle-check-filled" class="size-4 text-lime-500 shrink-0" />
                <span class="font-medium">{{ feat }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Empty State -->
      <div v-else-if="hasAnyPlan" class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-filter-off" class="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
            No Matching Services
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            No services match your current search query or active filter selections. Try clearing your filters or searching for something else.
          </p>
        </div>

        <div class="pt-2">
          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-rotate-clockwise"
            class="rounded-xl font-bold text-xs px-4 py-2 cursor-pointer"
            @click="resetFilters"
          >
            Reset All Filters
          </UButton>
        </div>
      </div>

      <!-- Catalog Empty State -->
      <div v-else class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-ticket-off" class="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
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
            class="rounded-xl font-bold text-xs px-4 py-2 text-neutral-950 cursor-pointer"
          >
            Contact Us
          </UButton>
          <UButton
            to="/"
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-home"
            class="rounded-xl font-bold text-xs px-4 py-2 cursor-pointer"
          >
            Return Home
          </UButton>
        </div>
      </div>

      <!-- Testimonials Section -->
      <div v-if="pricingTestimonials?.length" class="pt-10 border-t border-neutral-200 dark:border-neutral-800 space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <div>
            <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-xs mb-2">
              Pass Member Reviews
            </UBadge>
            <h2 class="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
              Why Members Love Their Passes
            </h2>
          </div>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed">
            Hear from monthly and annual pass holders about ground access, guest discounts, and value.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
          <div
            v-for="(item, idx) in pricingTestimonials"
            :key="idx"
            class="space-y-4 pt-6 md:pt-0"
            :class="{ 'md:pl-8': idx > 0 }"
          >
            <div class="flex items-center gap-1 text-lime-500">
              <UIcon
                v-for="star in (item.rating || 5)"
                :key="star"
                name="i-tabler-star-filled"
                class="size-4"
              />
            </div>

            <p class="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
              "{{ item.comment }}"
            </p>

            <div class="flex items-center gap-3 pt-2">
              <NuxtImg
                v-if="item.avatar"
                :src="item.avatar"
                :alt="item.author"
                format="webp"
                quality="80"
                class="size-9 rounded-full object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
              />
              <div
                v-else
                class="flex size-9 shrink-0 items-center justify-center rounded-full bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs"
              >
                {{ item.author.charAt(0) }}
              </div>

              <div class="space-y-0.5">
                <h3 class="text-xs font-bold text-neutral-950 dark:text-white">
                  {{ item.author }}
                </h3>
                <p class="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                  {{ item.role }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Group & Corporate Booking Banner -->
      <div class="py-10 border-y border-neutral-200 dark:border-neutral-800">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-8 space-y-3">
            <UBadge color="primary" variant="soft" class="font-bold text-xs uppercase tracking-wider">
              <UIcon name="i-tabler-users" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
              Group & Corporate Bookings
            </UBadge>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
              Planning a group, school or corporate experience?
            </h3>
            <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              We discuss suitable programmes for birthdays, graduations, meetings and team-building activities based on your objectives, group size, preferred activities and available time.
            </p>
          </div>
          <div class="lg:col-span-4 flex lg:justify-end">
            <UButton
              to="/contact?type=group-booking"
              size="lg"
              color="primary"
              icon="i-tabler-users"
              class="w-full sm:w-auto font-black uppercase text-xs text-neutral-950 rounded-xl px-6 py-3.5 justify-center"
            >
              Request a Quote
            </UButton>
          </div>
        </div>
      </div>

      <!-- Pass & Membership FAQs -->
      <div v-if="pricingFaqs?.length" class="space-y-6 pt-2">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <div>
            <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-xs mb-2">
              Pass & Billing Guidance
            </UBadge>
            <h2 class="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
              Pass & Membership FAQs
            </h2>
          </div>
        </div>

        <div class="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
          <div
            v-for="(faq, idx) in pricingFaqs"
            :key="idx"
            class="py-4 space-y-2"
          >
            <button
              type="button"
              class="w-full flex items-center justify-between text-left font-extrabold text-sm sm:text-base text-neutral-950 dark:text-white group cursor-pointer transition-colors"
              @click="toggleFaqItem(idx)"
            >
              <span class="group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors pr-4">
                {{ faq.question }}
              </span>
              <UIcon
                name="i-tabler-chevron-down"
                class="size-5 text-neutral-400 transition-transform duration-200 shrink-0"
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
                class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pr-6 pt-1 font-medium overflow-hidden"
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
