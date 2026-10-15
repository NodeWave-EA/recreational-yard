<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedCategory = ref('all')

const { getCollection } = useContentQuery()

const { data: faqs } = await getCollection('faqs-index', 'faqs', {
  sort: [{ key: 'order', order: 'ASC' }],
  enableLogging: false,
})

// Extract unique categories
const categoryOptions = computed(() => {
  const set = new Set<string>()
  faqs.value?.forEach((f: any) => {
    if (f.category)
      set.add(f.category)
  })
  return [
    { id: 'all', label: 'All Categories' },
    ...Array.from(set).map(cat => ({ id: cat, label: cat })),
  ]
})

// Filtered FAQs based on Search & Category
const filteredFaqs = computed(() => {
  let list = faqs.value || []

  if (selectedCategory.value !== 'all') {
    list = list.filter((item: any) => item.category === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter((item: any) =>
      item.question?.toLowerCase().includes(q)
      || item.answer?.toLowerCase().includes(q)
      || item.category?.toLowerCase().includes(q),
    )
  }

  return list
})

// Grouped FAQs by Category
const groupedFaqs = computed(() => {
  const groups = new Map<string, typeof faqs.value>()

  for (const faq of filteredFaqs.value) {
    const category = faq.category || 'General'
    const items = groups.get(category) || []
    items.push(faq)
    groups.set(category, items)
  }

  return [...groups.entries()].map(([category, items]) => ({ category, items }))
})

function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'all'
}

useSeoMeta({
  title: `Frequently Asked Questions | ${LOCATION_DETAILS.company}`,
  description: 'Find clear information about bookings, recreation, running club, sports kits, and visiting Recreation Yard in Kericho.',
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-20 transition-colors duration-300 w-full overflow-x-clip">
    <!-- Hero Banner Header -->
    <div class="pt-8 sm:pt-12 pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <UContainer>
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="space-y-2.5">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] px-3 py-0.5 rounded-md"
            >
              <UIcon name="i-tabler-help-circle" class="size-3.5 mr-1 text-lime-500 shrink-0" />
              <span>Help & Information</span>
            </UBadge>

            <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
              Frequently Asked Questions
            </h1>

            <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Find clear information about bookings, recreation, running, sports merchandise, group experiences and contacting Recreation Yard Limited.
            </p>
          </div>

          <div class="shrink-0 text-xs font-bold text-neutral-400">
            Total Answers: <span class="text-lime-600 dark:text-lime-400 font-extrabold text-sm">{{ filteredFaqs.length }}</span>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Sticky Toolbar Controls -->
    <div class="sticky top-[var(--ui-header-height,4rem)] z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs transition-all">
      <UContainer>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="w-full sm:flex-1 min-w-0">
            <UInput
              v-model="searchQuery"
              icon="i-tabler-search"
              placeholder="Search questions or keywords..."
              size="md"
              color="primary"
              class="w-full rounded-md"
              clearable
            />
          </div>

          <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0">
            <USelectMenu
              v-model="selectedCategory"
              :items="categoryOptions"
              value-key="id"
              label-key="label"
              placeholder="Select Category..."
              class="w-48 shrink-0 rounded-md"
            />

            <!-- View Mode Switcher -->
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
        </div>
      </UContainer>
    </div>

    <!-- Main FAQ List Container -->
    <UContainer class="pt-8">
      <!-- Active Filter Pill Summary -->
      <div v-if="selectedCategory !== 'all' || searchQuery" class="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-bold text-neutral-400">Active Filters:</span>
          <UBadge v-if="searchQuery" color="primary" variant="soft" class="rounded-md font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Query: "{{ searchQuery }}"</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="searchQuery = ''" />
          </UBadge>
          <UBadge v-if="selectedCategory !== 'all'" color="primary" variant="soft" class="rounded-md font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Category: {{ selectedCategory }}</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="selectedCategory = 'all'" />
          </UBadge>
          <UButton size="xs" color="neutral" variant="link" class="text-xs font-bold text-neutral-400" @click="resetFilters">
            Clear All
          </UButton>
        </div>
      </div>

      <!-- 1. Grid View Option (Clickable Cards with All-Side Borders on Hover) -->
      <div
        v-if="viewMode === 'grid' && filteredFaqs.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <NuxtLink
          v-for="faq in filteredFaqs"
          :key="faq.path"
          :to="faq.path"
          class="group flex flex-col justify-between p-4.5 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs hover:shadow-md min-w-0"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <UBadge color="primary" variant="soft" class="font-bold text-[9px] uppercase px-2 py-0.5 rounded-md">
                {{ faq.category || 'General' }}
              </UBadge>
              <UIcon name="i-tabler-help-circle" class="size-4 text-lime-500 shrink-0" />
            </div>

            <h3 class="text-base font-extrabold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors leading-snug break-words line-clamp-2">
              {{ faq.question }}
            </h3>

            <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed font-medium">
              {{ faq.answer }}
            </p>
          </div>

          <div class="pt-3 mt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-extrabold text-lime-600 dark:text-lime-400">
            <span>View Dedicated FAQ Page</span>
            <UIcon name="i-tabler-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </NuxtLink>
      </div>

      <!-- 2. List View Option (Grouped Flat Card Rows) -->
      <div v-else-if="viewMode === 'list' && groupedFaqs.length" class="space-y-10">
        <section v-for="group in groupedFaqs" :key="group.category" class="space-y-4">
          <div class="flex items-center justify-between pb-2 border-b-2 border-neutral-200 dark:border-neutral-800">
            <h2 class="text-lg sm:text-xl font-black text-neutral-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <UIcon name="i-tabler-folder" class="size-5 text-lime-500 shrink-0" />
              <span>{{ group.category }}</span>
            </h2>
            <span class="text-xs font-bold text-neutral-400">
              {{ group.items?.length }} {{ group.items?.length === 1 ? 'question' : 'questions' }}
            </span>
          </div>

          <div class="space-y-3">
            <NuxtLink
              v-for="faq in group.items"
              :key="faq.path"
              :to="faq.path"
              class="group block p-4 sm:p-5 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs hover:shadow-md min-w-0"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1.5 min-w-0 flex-1">
                  <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors leading-snug break-words">
                    {{ faq.question }}
                  </h3>

                  <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium line-clamp-2">
                    {{ faq.answer }}
                  </p>
                </div>

                <div class="flex items-center gap-1.5 text-xs font-black text-lime-600 dark:text-lime-400 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                  <span>View Details</span>
                  <UIcon name="i-tabler-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </NuxtLink>
          </div>
        </section>
      </div>

      <!-- Empty State -->
      <div v-else class="py-16 text-center space-y-4 max-w-md mx-auto">
        <UIcon name="i-tabler-help-off" class="size-12 text-neutral-400 mx-auto" />
        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
            No matching questions found
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            We couldn't find any FAQs matching your query "{{ searchQuery }}". Try adjusting your filters.
          </p>
        </div>
        <UButton size="sm" color="neutral" variant="outline" icon="i-tabler-rotate-clockwise" class="rounded-md font-bold text-xs" @click="resetFilters">
          Reset Filters
        </UButton>
      </div>

      <!-- Bottom Contact CTA Bar -->
      <div class="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h3 class="text-base font-bold text-neutral-950 dark:text-white">
            Still have questions?
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            Can't find what you're looking for? Get in touch with our team directly.
          </p>
        </div>

        <UButton
          to="/contact"
          color="primary"
          size="md"
          icon="i-tabler-mail"
          class="font-black uppercase text-xs text-neutral-950 rounded-md px-5 py-2.5 shrink-0 cursor-pointer"
        >
          Contact Support
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
