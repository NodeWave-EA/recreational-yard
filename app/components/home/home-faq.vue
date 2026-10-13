<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'

const { getCollection } = useContentQuery()

// Query ONLY General FAQs for the Homepage
const { data: generalFaqs } = await getCollection('home-general-faqs', 'faqs', {
  where: { category: 'General' },
  sort: [{ key: 'order', order: 'ASC' }],
  enableLogging: false,
})

const openItems = ref<number[]>([0])

function toggleItem(index: number) {
  if (openItems.value.includes(index)) {
    openItems.value = openItems.value.filter(i => i !== index)
  } else {
    openItems.value.push(index)
  }
}
</script>

<template>
  <section v-if="generalFaqs?.length" class="space-y-6 py-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
      <div>
        <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-xs mb-2">
          General Information
        </UBadge>
        <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
          Frequently Asked Questions
        </h2>
      </div>
    </div>

    <!-- Accordion List -->
    <div class="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
      <div
        v-for="(faq, idx) in generalFaqs"
        :key="idx"
        class="py-4 space-y-2"
      >
        <button
          type="button"
          :aria-expanded="openItems.includes(idx)"
          :aria-controls="`faq-answer-${idx}`"
          class="w-full flex items-center justify-between text-left font-extrabold text-sm sm:text-base text-neutral-950 dark:text-white group cursor-pointer transition-colors"
          @click="toggleItem(idx)"
        >
          <span class="group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors pr-4">
            {{ faq.question }}
          </span>
          <UIcon
            name="i-tabler-chevron-down"
            class="size-5 text-neutral-400 transition-transform duration-200 shrink-0"
            :class="{ 'rotate-180 text-lime-500': openItems.includes(idx) }"
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
            v-show="openItems.includes(idx)"
            :id="`faq-answer-${idx}`"
            class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pr-6 pt-1 font-medium overflow-hidden"
          >
            {{ faq.answer }}
          </p>
        </Transition>
      </div>
    </div>
  </section>
</template>
