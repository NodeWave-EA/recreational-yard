<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'

const { getCollection } = useContentQuery()

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
  <section v-if="generalFaqs?.length" class="space-y-3 sm:space-y-6 py-2 sm:py-6 w-full">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-3 sm:pb-5 px-0">
      <div>
        <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-1.5 sm:mb-2 rounded-xs">
          General Information
        </UBadge>
        <h2 class="text-xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
          Frequently Asked Questions
        </h2>
      </div>
    </div>

    <div class="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-transparent divide-y divide-neutral-200 dark:divide-neutral-800 w-full">
      <div
        v-for="(faq, idx) in generalFaqs"
        :key="idx"
        class="p-4 sm:p-5 hover:bg-neutral-100/30 dark:hover:bg-neutral-800/20 transition-colors duration-200 w-full"
      >
        <button
          type="button"
          :aria-expanded="openItems.includes(idx)"
          :aria-controls="`faq-answer-${idx}`"
          class="w-full flex items-center justify-between text-left font-extrabold text-xs sm:text-sm text-neutral-950 dark:text-white group cursor-pointer"
          @click="toggleItem(idx)"
        >
          <span class="group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors pr-4">
            {{ faq.question }}
          </span>
          <UIcon
            name="i-tabler-chevron-down"
            class="size-4 text-neutral-400 transition-transform duration-200 shrink-0"
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
            class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pr-2 pt-3 font-medium overflow-hidden"
          >
            {{ faq.answer }}
          </p>
        </Transition>
      </div>
    </div>
  </section>
</template>
