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
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-12 sm:pb-16 transition-colors duration-300 w-full overflow-x-clip">
    <div class="pt-4 sm:pt-10 pb-4 sm:pb-6 border-b border-neutral-200 dark:border-neutral-800">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="space-y-2 sm:space-y-3 text-left sm:text-center">
          <div class="inline-flex">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-0.5 rounded-xs"
            >
              <UIcon name="i-tabler-help-circle" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
              <span>Help & Information</span>
            </UBadge>
          </div>

          <h1 class="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
            Frequently Asked Questions
          </h1>

          <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-4xl mx-auto font-medium">
            Find clear information about bookings, recreation, running, sports merchandise, group experiences and contacting Recreation Yard Limited.
          </p>
        </div>
      </UContainer>
    </div>

    <div class="sticky top-[var(--ui-header-height,4rem)] z-30 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md py-2.5 sm:py-3 border-b border-neutral-200 dark:border-neutral-800 transition-all">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-3 sm:gap-4">
          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            Total Questions: <span class="text-lime-600 dark:text-lime-400 font-extrabold font-mono text-sm">{{ faqs?.length || 0 }}</span>
          </span>

          <div class="flex items-center p-1 rounded-xs bg-transparent border border-neutral-200 dark:border-neutral-800 shrink-0">
            <UButton
              size="xs"
              :color="viewMode === 'grid' ? 'primary' : 'neutral'"
              :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
              icon="i-tabler-layout-grid"
              aria-label="Grid View"
              class="rounded-xs font-bold cursor-pointer"
              @click="viewMode = 'grid'"
            />
            <UButton
              size="xs"
              :color="viewMode === 'list' ? 'primary' : 'neutral'"
              :variant="viewMode === 'list' ? 'solid' : 'ghost'"
              icon="i-tabler-list"
              aria-label="List View"
              class="rounded-xs font-bold cursor-pointer"
              @click="viewMode = 'list'"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="pt-4 sm:pt-8 px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
      <div
        v-if="viewMode === 'grid' && hasAnyFaq"
        class="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-transparent grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 lg:divide-x divide-neutral-200 dark:divide-neutral-800 w-full"
      >
        <NuxtLink
          v-for="faq in faqs"
          :key="faq.path"
          :to="faq.path"
          class="group flex flex-col justify-between p-5 sm:p-6 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200 min-w-0 border-b last:border-b-0"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <UBadge color="primary" variant="soft" class="font-bold text-[9px] uppercase px-2 py-0.5 rounded-xs border border-neutral-200/60 dark:border-neutral-800/60">
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

          <div class="pt-3 mt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-extrabold text-lime-600 dark:text-lime-400">
            <span>View Dedicated FAQ Page</span>
            <UIcon name="i-tabler-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </NuxtLink>
      </div>

      <div v-else-if="viewMode === 'list' && groupedFaqs.length" class="space-y-6 sm:space-y-8 w-full">
        <section v-for="group in groupedFaqs" :key="group.category" class="space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <h2 class="text-sm sm:text-base font-black text-neutral-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <UIcon name="i-tabler-folder" class="size-4 text-lime-500 shrink-0" />
              <span>{{ group.category }}</span>
            </h2>
            <span class="text-xs font-bold font-mono text-neutral-400">
              {{ group.items?.length }} {{ group.items?.length === 1 ? 'question' : 'questions' }}
            </span>
          </div>

          <div class="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-transparent divide-y divide-neutral-200 dark:divide-neutral-800 w-full">
            <NuxtLink
              v-for="faq in group.items"
              :key="faq.path"
              :to="faq.path"
              class="group block p-4 sm:p-5 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200 min-w-0"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1 min-w-0 flex-1">
                  <h3 class="text-sm sm:text-base font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors leading-snug break-words">
                    {{ faq.question }}
                  </h3>

                  <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium line-clamp-2">
                    {{ faq.answer }}
                  </p>
                </div>

                <div class="flex items-center gap-1 text-xs font-bold text-lime-600 dark:text-lime-400 shrink-0 pt-2 sm:pt-0">
                  <span>View Details</span>
                  <UIcon name="i-tabler-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </NuxtLink>
          </div>
        </section>
      </div>

      <div v-else class="py-12 sm:py-20 text-center space-y-4 max-w-md mx-auto">
        <div class="flex size-14 sm:size-16 items-center justify-center rounded-xs bg-transparent border border-neutral-200 dark:border-neutral-800 mx-auto">
          <UIcon name="i-tabler-help-off" class="size-7 sm:size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
            No FAQs available
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            There are currently no general FAQs listed. Please check back later or contact us directly.
          </p>
        </div>

        <div class="pt-2">
          <UButton
            to="/contact"
            size="sm"
            color="primary"
            icon="i-tabler-mail"
            class="rounded-xs font-bold text-xs px-4 py-2 text-neutral-950 cursor-pointer"
          >
            Contact Support
          </UButton>
        </div>
      </div>

      <div class="p-6 sm:p-8 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-100/30 dark:hover:bg-neutral-800/20 transition-colors duration-200 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h3 class="text-base sm:text-lg font-black text-neutral-950 dark:text-white">
            Still have questions?
          </h3>
          <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            Can't find what you're looking for? Get in touch with our team directly.
          </p>
        </div>

        <UButton
          to="/contact"
          color="primary"
          size="md"
          icon="i-tabler-mail"
          class="font-black uppercase text-xs text-neutral-950 rounded-xs px-5 py-3 shrink-0 cursor-pointer justify-center"
        >
          Contact Support
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
