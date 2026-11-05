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
  <div class="py-6 sm:py-12 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen transition-colors duration-300 w-full overflow-x-clip">
    <UContainer v-if="faq" class="max-w-3xl space-y-6 sm:space-y-8 px-4 sm:px-6">
      <div>
        <NuxtLink
          to="/faqs"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
          <UIcon name="i-tabler-arrow-left" class="size-4" />
          <span>Back to All FAQs</span>
        </NuxtLink>
      </div>

      <header class="space-y-3 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div class="flex flex-wrap items-center gap-2">
          <UBadge color="primary" variant="soft" class="font-bold uppercase text-[10px] tracking-wider px-2.5 py-0.5 rounded-xs">
            {{ faq.category }}
          </UBadge>
          <UBadge v-if="faq.facility" color="neutral" variant="subtle" class="font-bold uppercase text-[10px] tracking-wider px-2.5 py-0.5 rounded-xs border border-neutral-200/60 dark:border-neutral-800/60">
            {{ faq.facility }}
          </UBadge>
        </div>

        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 dark:text-white leading-tight tracking-tight">
          {{ faq.question }}
        </h1>
      </header>

      <article class="space-y-6">
        <div class="pl-4 border-l-2 border-lime-500 py-1">
          <p class="text-sm sm:text-base lg:text-lg leading-relaxed text-neutral-800 dark:text-neutral-200 font-medium">
            {{ faq.answer }}
          </p>
        </div>

        <div v-if="faq.body" class="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed pt-2">
          <ContentRenderer :value="faq" />
        </div>
      </article>

      <footer class="pt-6 sm:pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
        <div class="space-y-1">
          <h2 class="text-xs font-black uppercase tracking-wider text-neutral-400">
            Need Further Assistance?
          </h2>
          <p class="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            Have additional questions or specific requirements for your visit? Contact our team.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 pt-1">
          <UButton
            to="/contact"
            color="primary"
            size="md"
            icon="i-tabler-mail"
            class="font-black uppercase text-xs text-neutral-950 rounded-xs px-5 py-2.5 cursor-pointer justify-center"
          >
            Send Inquiry
          </UButton>

          <UButton
            :to="`https://wa.me/${CONTACTS.whatsapp}?text=Hello! I have a question regarding: ${encodeURIComponent(faq.question)}`"
            target="_blank"
            color="neutral"
            variant="outline"
            icon="i-tabler-brand-whatsapp"
            class="font-bold text-xs rounded-xs py-2.5 text-emerald-600 dark:text-emerald-400 border border-neutral-200/80 dark:border-neutral-800 cursor-pointer justify-center"
          >
            WhatsApp Support
          </UButton>
        </div>
      </footer>
    </UContainer>
  </div>
</template>
