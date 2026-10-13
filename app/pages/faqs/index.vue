<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { LOCATION_DETAILS } from '~/utils/site-data'

const { getCollection } = useContentQuery()

const searchQuery = ref('')
const selectedCategory = ref('all')

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

// Open Accordion state
const openFaqPaths = ref<Set<string>>(new Set())

function toggleFaq(path: string) {
  if (openFaqPaths.value.has(path)) {
    openFaqPaths.value.delete(path)
  } else {
    openFaqPaths.value.add(path)
  }
}

function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'all'
}

useSeoMeta({
  title: `Frequently Asked Questions | ${LOCATION_DETAILS.company}`,
  description: 'Find answers about passes, facilities, bookings, events, and visiting Recreation Yard in Kericho.',
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-20 transition-colors duration-300 w-full overflow-x-clip">
    <!-- Hero Banner Header -->
    <div class="pt-8 sm:pt-12 pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <UContainer class="max-w-4xl">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="space-y-2.5 max-w-2xl">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] px-3 py-0.5 rounded-full"
            >
              <UIcon name="i-tabler-help-circle" class="size-3.5 mr-1 text-lime-500 shrink-0" />
              <span>Help & Information</span>
            </UBadge>

            <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
              Frequently Asked Questions
            </h1>

            <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Everything you need to know about court bookings, day passes, facilities, and visiting Recreation Yard Kericho.
            </p>
          </div>

          <div class="shrink-0 text-xs font-bold text-neutral-400">
            Total Answers: <span class="text-lime-600 dark:text-lime-400 font-extrabold text-sm">{{ filteredFaqs.length }}</span>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Sticky Toolbar -->
    <div class="sticky top-(--ui-header-height,4rem) z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-4 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs transition-all">
      <UContainer class="max-w-4xl">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="w-full sm:flex-1 min-w-0">
            <UInput
              v-model="searchQuery"
              icon="i-tabler-search"
              placeholder="Search questions or keywords..."
              size="md"
              color="primary"
              class="w-full rounded-xl"
              clearable
            />
          </div>

          <div class="w-full sm:w-auto shrink-0">
            <USelectMenu
              v-model="selectedCategory"
              :items="categoryOptions"
              value-key="id"
              label-key="label"
              placeholder="Select Category..."
              class="w-full sm:w-48"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main FAQ List Container -->
    <UContainer class="max-w-4xl pt-8">
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

      <!-- Flat Grouped List -->
      <div v-if="groupedFaqs.length" class="space-y-12">
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

          <div class="divide-y divide-neutral-200 dark:divide-neutral-800">
            <div
              v-for="faq in group.items"
              :key="faq.path"
              class="py-4 space-y-2 transition-colors min-w-0"
            >
              <div class="flex items-start justify-between gap-4 cursor-pointer group" @click="toggleFaq(faq.path)">
                <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors leading-snug wrap-break-word">
                  {{ faq.question }}
                </h3>

                <div class="flex items-center gap-2 shrink-0 pt-0.5">
                  <UIcon
                    name="i-tabler-chevron-down"
                    class="size-5 text-neutral-400 transition-transform duration-200 group-hover:text-lime-500"
                    :class="{ 'rotate-180 text-lime-500': openFaqPaths.has(faq.path) }"
                  />
                </div>
              </div>

              <!-- Inline Expanded Answer -->
              <div v-show="openFaqPaths.has(faq.path)" class="pt-2 pl-1 space-y-3 min-w-0">
                <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium wrap-break-word">
                  {{ faq.answer }}
                </p>

                <div class="flex items-center gap-4 pt-1">
                  <NuxtLink
                    :to="faq.path"
                    class="inline-flex items-center gap-1 text-xs font-extrabold text-lime-600 dark:text-lime-400 hover:underline"
                  >
                    <span>View Dedicated FAQ Page</span>
                    <UIcon name="i-tabler-arrow-right" class="size-3.5" />
                  </NuxtLink>
                </div>
              </div>
            </div>
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
        <UButton size="sm" color="neutral" variant="outline" icon="i-tabler-rotate-clockwise" class="rounded-xl font-bold text-xs" @click="resetFilters">
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
          class="font-black uppercase text-xs text-neutral-950 rounded-xl px-5 py-2.5 shrink-0"
        >
          Contact Support
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
