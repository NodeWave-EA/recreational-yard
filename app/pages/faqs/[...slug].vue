<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { CONTACTS, LOCATION_DETAILS } from '~/utils/site-data'

const route = useRoute()
const { getByPath } = useContentQuery()

const { data: faq } = await getByPath(`faq-${route.path}`, 'faqs', route.path, {
  enableLogging: false,
})

if (!faq.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'FAQ Not Found',
    fatal: true,
  })
}

useSeoMeta({
  title: `${faq.value.question} | FAQs | ${LOCATION_DETAILS.company}`,
  description: faq.value.answer,
})
</script>

<template>
  <div class="py-4 sm:py-12 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen transition-colors duration-300 w-full overflow-x-clip">
    <UContainer v-if="faq" class="space-y-6 sm:space-y-8 px-3 sm:px-6 lg:px-8">
      <div>
        <NuxtLink
          to="/faqs"
          class="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
          <UIcon name="i-tabler-arrow-left" class="size-4" />
          <span>Back to All FAQs</span>
        </NuxtLink>
      </div>

      <div class="space-y-3 sm:space-y-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 sm:pb-6">
        <div class="flex flex-wrap items-center gap-2">
          <UBadge color="primary" variant="soft" class="font-extrabold uppercase text-[10px] tracking-wider px-2.5 py-1 rounded-md">
            {{ faq.category }}
          </UBadge>
          <UBadge v-if="faq.facility" color="neutral" variant="subtle" class="font-bold uppercase text-[10px] tracking-wider px-2.5 py-1 rounded-md">
            {{ faq.facility }}
          </UBadge>
        </div>

        <h1 class="text-xl sm:text-4xl font-black text-neutral-950 dark:text-white leading-tight">
          {{ faq.question }}
        </h1>
      </div>

      <div class="space-y-4 sm:space-y-6">
        <div class="p-0 sm:p-5 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs pl-3 sm:pl-4 border-l-4 border-l-lime-500">
          <p class="text-xs sm:text-base leading-relaxed text-neutral-800 dark:text-neutral-200 font-medium">
            {{ faq.answer }}
          </p>
        </div>

        <div v-if="faq.body" class="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed pt-3 sm:pt-4">
          <ContentRenderer :value="faq" />
        </div>
      </div>

      <div class="pt-6 sm:pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-3 sm:space-y-4">
        <h3 class="text-xs font-black uppercase tracking-wider text-neutral-400">
          Need Further Assistance?
        </h3>

        <div class="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <UButton
            to="/contact"
            color="primary"
            size="md"
            icon="i-tabler-mail"
            class="font-black uppercase text-xs text-neutral-950 rounded-md px-5 py-2.5 cursor-pointer"
          >
            Send Inquiry
          </UButton>

          <UButton
            :to="`https://wa.me/${CONTACTS.whatsapp}?text=Hello! I have a question regarding: ${faq.question}`"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-tabler-brand-whatsapp"
            class="font-bold text-xs rounded-md py-2.5 text-emerald-600 dark:text-emerald-400 cursor-pointer"
          >
            WhatsApp Support
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
