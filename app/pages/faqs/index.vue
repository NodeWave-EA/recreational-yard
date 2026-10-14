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
  <div class="min-h-screen bg-default text-default pb-20 transition-colors duration-300 w-full overflow-x-clip">
    <!-- Hero Banner Header -->
    <div class="pt-8 sm:pt-12 pb-6 border-b border-default">
      <UContainer>
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="space-y-2.5 max-w-2xl">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] px-3 py-0.5 rounded-full"
            >
              <UIcon name="i-tabler-help-circle" class="size-3.5 mr-1 text-primary shrink-0" />
              <span>Help & Information</span>
            </UBadge>

            <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-highlighted leading-tight">
              Frequently Asked Questions
            </h1>

            <p class="text-xs sm:text-base text-muted leading-relaxed">
              Find clear information about bookings, recreation, running, sports merchandise, group experiences and contacting Recreation Yard Limited.
            </p>
          </div>

          <div class="shrink-0 text-xs font-bold text-muted">
            Total Answers: <span class="text-primary font-extrabold text-sm">{{ filteredFaqs.length }}</span>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main FAQ List Container -->
    <UContainer class="pt-8">
      <!-- Flat Grouped List -->
      <div v-if="groupedFaqs.length" class="space-y-12">
        <section v-for="group in groupedFaqs" :key="group.category" class="space-y-4">
          <div class="flex items-center justify-between pb-2 border-b-2 border-default">
            <h2 class="text-lg sm:text-xl font-black text-highlighted uppercase tracking-wider flex items-center gap-2">
              <UIcon name="i-tabler-folder" class="size-5 text-primary shrink-0" />
              <span>{{ group.category }}</span>
            </h2>
            <span class="text-xs font-bold text-muted">
              {{ group.items?.length }} {{ group.items?.length === 1 ? 'question' : 'questions' }}
            </span>
          </div>

          <div class="divide-y divide-default dark:divide-default">
            <div
              v-for="faq in group.items"
              :key="faq.path"
              class="py-4 space-y-2 transition-colors min-w-0"
            >
              <div class="flex items-start justify-between gap-4 cursor-pointer group" @click="toggleFaq(faq.path)">
                <h3 class="text-base sm:text-lg font-bold text-highlighted group-hover:text-primary transition-colors leading-snug wrap-break-word">
                  {{ faq.question }}
                </h3>

                <div class="flex items-center gap-2 shrink-0 pt-0.5">
                  <UIcon
                    name="i-tabler-chevron-down"
                    class="size-5 text-muted transition-transform duration-200 group-hover:text-primary"
                    :class="{ 'rotate-180 text-primary': openFaqPaths.has(faq.path) }"
                  />
                </div>
              </div>

              <!-- Inline Expanded Answer -->
              <div v-show="openFaqPaths.has(faq.path)" class="pt-2 pl-1 space-y-3 min-w-0">
                <p class="text-xs sm:text-sm text-muted leading-relaxed font-medium wrap-break-word">
                  {{ faq.answer }}
                </p>

                <div class="flex items-center gap-4 pt-1">
                  <NuxtLink
                    :to="faq.path"
                    class="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:underline"
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
        <UIcon name="i-tabler-help-off" class="size-12 text-muted mx-auto" />
        <div class="space-y-1">
          <h3 class="text-lg font-bold text-highlighted">
            No matching questions found
          </h3>
          <p class="text-xs text-muted">
            We couldn't find any FAQs matching your query "{{ searchQuery }}". Try adjusting your filters.
          </p>
        </div>
        <UButton size="sm" color="neutral" variant="outline" icon="i-tabler-rotate-clockwise" class="rounded-sm font-bold text-xs" @click="resetFilters">
          Reset Filters
        </UButton>
      </div>

      <!-- Bottom Contact CTA Bar -->
      <div class="mt-16 pt-8 border-t border-default flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h3 class="text-base font-bold text-highlighted">
            Still have questions?
          </h3>
          <p class="text-xs text-muted">
            Can't find what you're looking for? Get in touch with our team directly.
          </p>
        </div>

        <UButton
          to="/contact"
          color="primary"
          size="md"
          icon="i-tabler-mail"
          class="font-black uppercase text-xs text-highlighted rounded-sm px-5 py-2.5 shrink-0"
        >
          Contact Support
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
