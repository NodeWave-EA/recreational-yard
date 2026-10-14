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
  <div class="py-8 sm:py-12 bg-default text-default min-h-screen transition-colors duration-300 w-full">
    <UContainer v-if="faq" class="space-y-8">
      <!-- Back Link -->
      <div>
        <NuxtLink
          to="/faqs"
          class="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-primary dark:hover:text-primary transition-colors"
        >
          <UIcon name="i-tabler-arrow-left" class="size-4" />
          <span>Back to All FAQs</span>
        </NuxtLink>
      </div>

      <!-- FAQ Header Section -->
      <div class="space-y-4 border-b border-default pb-6">
        <div class="flex flex-wrap items-center gap-2">
          <UBadge color="primary" variant="soft" class="font-extrabold uppercase text-[10px] tracking-wider px-2.5 py-1 rounded">
            {{ faq.category }}
          </UBadge>
          <UBadge v-if="faq.facility" color="neutral" variant="subtle" class="font-bold uppercase text-[10px] tracking-wider px-2.5 py-1 rounded">
            {{ faq.facility }}
          </UBadge>
        </div>

        <h1 class="text-2xl sm:text-4xl font-black text-highlighted leading-tight">
          {{ faq.question }}
        </h1>
      </div>

      <!-- Flat Answer Body -->
      <div class="space-y-6">
        <div class="pl-4 border-l-4 border-primary">
          <p class="text-sm sm:text-base leading-relaxed text-muted font-medium">
            {{ faq.answer }}
          </p>
        </div>

        <div v-if="faq.body" class="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed pt-4">
          <ContentRenderer :value="faq" />
        </div>
      </div>

      <!-- Bottom Assistance Links -->
      <div class="pt-8 border-t border-default space-y-4">
        <h3 class="text-xs font-black uppercase tracking-wider text-muted">
          Need Further Assistance?
        </h3>

        <div class="flex flex-wrap items-center gap-3">
          <UButton
            to="/contact"
            color="primary"
            size="md"
            icon="i-tabler-mail"
            class="font-black uppercase text-xs text-highlighted rounded-sm px-5 py-2.5"
          >
            Send Inquiry
          </UButton>

          <UButton
            :to="`https://wa.me/${CONTACTS.whatsapp}?text=Hello! I have a question regarding: ${faq.question}`"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-tabler-brand-whatsapp"
            class="font-bold text-xs rounded-sm py-2.5 text-success dark:text-success"
          >
            WhatsApp Support
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
