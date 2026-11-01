<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { LOCATION_DETAILS } from '~/utils/site-data'

const viewMode = ref<'grid' | 'list'>('grid')

const { getCollection } = useContentQuery()

const { data: faqs } = await getCollection('faqs-index', 'faqs', {
  sort: [{ key: 'order', order: 'ASC' }],
  enableLogging: false,
})

const hasAnyFaq = computed(() => (faqs.value?.length || 0) > 0)

const groupedFaqs = computed(() => {
  const groups = new Map<string, typeof faqs.value>()

  for (const faq of faqs.value || []) {
    const category = faq.category || 'General'
    const items = groups.get(category) || []
    items.push(faq)
    groups.set(category, items)
  }

  return [...groups.entries()].map(([category, items]) => ({ category, items }))
})

useSeoMeta({
  title: `Frequently Asked Questions | ${LOCATION_DETAILS.company}`,
  description: 'Find clear information about bookings, recreation, running club, sports kits, and visiting Recreation Yard in Kericho.',
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-12 sm:pb-20 transition-colors duration-300 w-full overflow-x-clip">
    <div class="pt-4 sm:pt-12 pb-4 sm:pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
          <div class="space-y-2 sm:space-y-2.5">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] px-2.5 sm:px-3 py-0.5 rounded-md"
            >
              <UIcon name="i-tabler-help-circle" class="size-3.5 mr-1 text-lime-500 shrink-0" />
              <span>Help & Information</span>
            </UBadge>

            <h1 class="text-2xl sm:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
              Frequently Asked Questions
            </h1>

            <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Find clear information about bookings, recreation, running, sports merchandise, group experiences and contacting Recreation Yard Limited.
            </p>
          </div>
        </div>
      </UContainer>
    </div>

    <div class="sticky top-[var(--ui-header-height,4rem)] z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-none sm:shadow-xs transition-all">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-3 sm:gap-4">
          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            Total Questions: <span class="text-lime-600 dark:text-lime-400 font-extrabold text-sm">{{ faqs?.length || 0 }}</span>
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

    <UContainer class="pt-4 sm:pt-8 px-3 sm:px-6 lg:px-8">
      <div
        v-if="viewMode === 'grid' && hasAnyFaq"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
      >
        <NuxtLink
          v-for="faq in faqs"
          :key="faq.path"
          :to="faq.path"
          class="group flex flex-col justify-between p-0 sm:p-4.5 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-4 sm:pb-0"
        >
          <div class="space-y-2.5 sm:space-y-3">
            <div class="flex items-center justify-between gap-2">
              <UBadge color="primary" variant="soft" class="font-bold text-[9px] uppercase px-2 py-0.5 rounded-md">
                {{ faq.category || 'General' }}
              </UBadge>
              <UIcon name="i-tabler-help-circle" class="size-4 text-lime-500 shrink-0" />
            </div>

            <h3 class="text-sm sm:text-base font-extrabold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors leading-snug break-words line-clamp-2">
              {{ faq.question }}
            </h3>

            <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed font-medium">
              {{ faq.answer }}
            </p>
          </div>

          <div class="pt-2.5 sm:pt-3 mt-3 sm:mt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-extrabold text-lime-600 dark:text-lime-400">
            <span>View Dedicated FAQ Page</span>
            <UIcon name="i-tabler-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </NuxtLink>
      </div>

      <div v-else-if="viewMode === 'list' && groupedFaqs.length" class="space-y-6 sm:space-y-10 w-full">
        <section v-for="group in groupedFaqs" :key="group.category" class="space-y-3 sm:space-y-4">
          <div class="flex items-center justify-between pb-2 border-b-2 border-neutral-200 dark:border-neutral-800">
            <h2 class="text-base sm:text-xl font-black text-neutral-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <UIcon name="i-tabler-folder" class="size-4 sm:size-5 text-lime-500 shrink-0" />
              <span>{{ group.category }}</span>
            </h2>
            <span class="text-xs font-bold text-neutral-400">
              {{ group.items?.length }} {{ group.items?.length === 1 ? 'question' : 'questions' }}
            </span>
          </div>

          <div class="space-y-3 w-full">
            <NuxtLink
              v-for="faq in group.items"
              :key="faq.path"
              :to="faq.path"
              class="group block p-0 sm:p-5 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-3 sm:pb-0"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                <div class="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                  <h3 class="text-sm sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors leading-snug break-words">
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

      <div v-else class="py-12 sm:py-16 text-center space-y-4 max-w-md mx-auto">
        <UIcon name="i-tabler-help-off" class="size-10 sm:size-12 text-neutral-400 mx-auto" />
        <div class="space-y-1">
          <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
            No FAQs available
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            There are currently no general FAQs listed. Please check back later or contact us directly.
          </p>
        </div>
        <UButton
          to="/contact"
          size="sm"
          color="primary"
          icon="i-tabler-mail"
          class="rounded-md font-bold text-xs text-neutral-950 px-4 py-2 cursor-pointer"
        >
          Contact Support
        </UButton>
      </div>

      <div class="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
