<script setup lang="ts">
import { usePricingCatalog } from '~/composables/usePricingCatalog'
import { FAQ_ITEMS, LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const {
  searchQuery,
  selectedCategory,
  sortBy,
  categoryOptions,
  sortOptions,
  selectedCategoryMeta,
  filteredPlans,
  resetFilters,
} = await usePricingCatalog()

// Accordion helper for FAQ items
const faqAccordionItems = computed(() =>
  FAQ_ITEMS.map((item, index) => ({
    label: item.question,
    content: item.answer,
    value: `item-${index}`,
  })),
)

useSeoMeta({
  title: `Pricing & Passes | ${LOCATION_DETAILS.company}`,
  description: 'Simple, transparent pass options for general recreation, lawn sports, and monthly memberships.',
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-16 transition-colors duration-300">
    <!-- Left-Aligned Mobile Hero Banner -->
    <div class="pt-6 sm:pt-10 pb-2 sm:pb-4 text-left sm:text-center space-y-3 max-w-3xl mx-auto px-4">
      <div class="inline-flex">
        <UBadge
          color="primary"
          variant="soft"
          class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-3.5 py-1 sm:py-0.5 rounded-full"
        >
          <UIcon name="i-tabler-ticket" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
          <span>
            Passes & Memberships
          </span>
        </UBadge>
      </div>

      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
        Simple, Transparent Pricing
      </h1>

      <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-0 sm:mx-auto">
        Whether you're here for a day of fun or looking to become a regular, we have a pass that fits your needs. Explore our entry-level passes, monthly memberships, and annual VIP options to find the perfect fit for your recreational adventures.
      </p>
    </div>

    <!-- Sticky Search, Filter & View Toggle Toolbar -->
    <div class="sticky top-(--ui-header-height,4rem) z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs transition-all">
      <UContainer class="w-full">
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          <!-- Pass Search Input -->
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
      <!-- Active Filter Summary -->
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
              <span class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">{{ plan.currency || 'KES' }}</span>
              <div class="flex items-baseline gap-1 mt-0.5">
                <span class="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
                  {{ (plan.price || 0).toLocaleString() }}
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
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">{{ plan.currency || 'KES' }}</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
                    {{ (plan.price || 0).toLocaleString() }}
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

      <!-- Empty State -->
      <div v-else class="py-16 text-center space-y-3 max-w-md mx-auto">
        <UIcon name="i-tabler-ticket-off" class="size-12 text-neutral-400 mx-auto" />
        <h3 class="text-lg font-bold">
          No passes found
        </h3>
        <p class="text-xs text-neutral-500">
          We couldn't find any passes matching your search or filter criteria. Try adjusting your filters or search terms to see more options.
        </p>
        <UButton
          size="sm"
          color="neutral"
          variant="outline"
          class="rounded-xl font-bold text-xs"
          @click="resetFilters"
        >
          Reset Filters
        </UButton>
      </div>

      <!-- Feature Comparison Breakdown -->
      <!-- <div class="pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <div class="max-w-xl mb-6 text-left sm:text-center mx-auto">
          <h3 class="text-lg sm:text-xl font-extrabold text-neutral-950 dark:text-white">
            Feature Comparison
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Compare the benefits and access levels of our Day Pass, Monthly Membership, and Annual VIP options to find the right fit for your recreational needs.
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">
                <th class="py-3.5 px-4">
                  Feature / Access
                </th>
                <th class="py-3.5 px-4 text-center">
                  Day Pass
                </th>
                <th class="py-3.5 px-4 text-center text-lime-600 dark:text-lime-400">
                  Monthly Member
                </th>
                <th class="py-3.5 px-4 text-center">
                  Annual VIP
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200/60 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300">
              <tr class="hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors">
                <td class="py-3.5 px-4 font-semibold text-neutral-950 dark:text-white">
                  Full Ground Access (8 Zones)
                </td>
                <td class="py-3.5 px-4 text-center">
                  <UIcon name="i-tabler-check" class="size-4 text-lime-500 mx-auto" />
                </td>
                <td class="py-3.5 px-4 text-center">
                  <UIcon name="i-tabler-check" class="size-4 text-lime-500 mx-auto" />
                </td>
                <td class="py-3.5 px-4 text-center">
                  <UIcon name="i-tabler-check" class="size-4 text-lime-500 mx-auto" />
                </td>
              </tr>
              <tr class="hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors">
                <td class="py-3.5 px-4 font-semibold text-neutral-950 dark:text-white">
                  Free Racket & Archery Rental
                </td>
                <td class="py-3.5 px-4 text-center text-neutral-400 dark:text-neutral-500">
                  Paid Rental
                </td>
                <td class="py-3.5 px-4 text-center">
                  <UIcon name="i-tabler-check" class="size-4 text-lime-500 mx-auto" />
                </td>
                <td class="py-3.5 px-4 text-center">
                  <UIcon name="i-tabler-check" class="size-4 text-lime-500 mx-auto" />
                </td>
              </tr>
              <tr class="hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors">
                <td class="py-3.5 px-4 font-semibold text-neutral-950 dark:text-white">
                  Monthly Guest Passes
                </td>
                <td class="py-3.5 px-4 text-center text-neutral-400 dark:text-neutral-500">
                  —
                </td>
                <td class="py-3.5 px-4 text-center font-bold text-neutral-900 dark:text-white">
                  3 / month
                </td>
                <td class="py-3.5 px-4 text-center font-bold text-neutral-900 dark:text-white">
                  10 / year
                </td>
              </tr>
              <tr class="hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors">
                <td class="py-3.5 px-4 font-semibold text-neutral-950 dark:text-white">
                  Shop & Produce Discount
                </td>
                <td class="py-3.5 px-4 text-center text-neutral-400 dark:text-neutral-500">
                  —
                </td>
                <td class="py-3.5 px-4 text-center font-bold text-lime-600 dark:text-lime-400">
                  15% Off
                </td>
                <td class="py-3.5 px-4 text-center font-bold text-lime-600 dark:text-lime-400">
                  20% Off
                </td>
              </tr>
              <tr class="hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-colors">
                <td class="py-3.5 px-4 font-semibold text-neutral-950 dark:text-white">
                  Personal Storage Locker
                </td>
                <td class="py-3.5 px-4 text-center text-neutral-400 dark:text-neutral-500">
                  —
                </td>
                <td class="py-3.5 px-4 text-center text-neutral-400 dark:text-neutral-500">
                  —
                </td>
                <td class="py-3.5 px-4 text-center">
                  <UIcon name="i-tabler-check" class="size-4 text-lime-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> -->

      <!-- Group & Corporate Booking Banner -->
      <div class="py-10 border-y border-neutral-200 dark:border-neutral-800">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-8 space-y-3">
            <UBadge color="primary" variant="soft" class="font-bold text-xs uppercase tracking-wider">
              <UIcon name="i-tabler-users" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
              Group & Corporate Bookings
            </UBadge>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
              Hosting a Team Building Event or Party?
            </h3>
            <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              We offer tailored group packages for corporate events, birthday parties, and team-building activities. Contact us to create a memorable experience for your group.
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

      <!-- Frequently Asked Questions -->
      <div class="space-y-6">
        <div class="text-left space-y-2">
          <h2 class="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            Have questions about entry passes or membership terms? We've got answers.
          </p>
        </div>

        <UAccordion
          :items="faqAccordionItems"
          type="single"
          collapsible
          class="space-y-2"
        />
      </div>
    </UContainer>
  </div>
</template>
