<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { CONTACTS, LOCATION_DETAILS } from '~/utils/site-data'

const route = useRoute()
const { getByPath } = useContentQuery()

// Fetch single pricing plan by path
const { data: plan } = await getByPath(
  `pricing-plan-${route.path}`,
  'pricing',
  route.path,
  { enableLogging: false },
)

if (!plan.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Pricing Pass Not Found',
    fatal: true,
  })
}

// Direct contact URL helper
const contactCtaUrl = computed(() => {
  if (plan.value?.cta?.to)
    return plan.value.cta.to
  const slug = route.path.split('/').pop() || ''
  return `/contact?pass=${slug}`
})

useSeoMeta({
  title: `${plan.value.title} | Pricing | ${LOCATION_DETAILS.company}`,
  description: plan.value.description,
  ogTitle: `${plan.value.title} | Pricing | ${LOCATION_DETAILS.company}`,
  ogDescription: plan.value.description,
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}${route.path}`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
const pageUrl = `${siteUrl}${route.path}`
useSchemaOrg([{
  '@type': 'Product',
  '@id': `${pageUrl}#product`,
  'url': pageUrl,
  'name': plan.value.title,
  'description': plan.value.description,
  'brand': { '@type': 'Brand', 'name': LOCATION_DETAILS.company },
  'offers': {
    '@type': 'Offer',
    'url': `${siteUrl}${contactCtaUrl.value}`,
    'price': plan.value.price,
    'priceCurrency': plan.value.currency || 'KES',
    'availability': 'https://schema.org/InStock',
  },
}])
</script>

<template>
  <div class="py-8 sm:py-14 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen">
    <UContainer v-if="plan" class="max-w-5xl">
      <!-- Back Link -->
      <NuxtLink
        to="/pricing"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors mb-6"
      >
        <UIcon name="i-tabler-arrow-left" class="size-4" />
        <span>Back to All Passes & Memberships</span>
      </NuxtLink>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Main Pass Info -->
        <div class="lg:col-span-8 space-y-6">
          <div class="space-y-3">
            <UBadge
              v-if="plan.badge"
              :color="plan.isPopular ? 'primary' : 'neutral'"
              variant="soft"
              class="font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full"
            >
              {{ plan.badge }}
            </UBadge>

            <h1 class="text-3xl sm:text-4xl font-black text-neutral-950 dark:text-white">
              {{ plan.title }}
            </h1>

            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {{ plan.description }}
            </p>
          </div>

          <!-- Included Features List -->
          <div class="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Pass Benefits & Features
            </h2>

            <ul class="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
              <li
                v-for="(feature, idx) in plan.features"
                :key="idx"
                class="flex items-start gap-3"
              >
                <UIcon name="i-tabler-circle-check-filled" class="size-5 shrink-0 text-lime-500 mt-0.5" />
                <span class="leading-snug">{{ feature }}</span>
              </li>

              <li
                v-for="(item, idx) in plan.notIncluded"
                :key="`not-${idx}`"
                class="flex items-start gap-3 text-neutral-400 dark:text-neutral-600 line-through"
              >
                <UIcon name="i-tabler-circle-x" class="size-5 shrink-0 text-neutral-300 dark:text-neutral-700 mt-0.5" />
                <span class="leading-snug">{{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- Markdown Content Body -->
          <div class="prose dark:prose-invert max-w-none text-xs leading-relaxed pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <ContentRenderer :value="plan" />
          </div>
        </div>

        <!-- Sticky Sidebar Action Details -->
        <div class="lg:col-span-4 sticky top-[calc(var(--ui-header-height,4rem)+1.5rem)] space-y-6 lg:border-l lg:border-neutral-200/80 lg:dark:border-neutral-800 lg:pl-8">
          <div class="space-y-6">
            <div class="border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Rate & Billing</span>
              <div class="flex items-baseline gap-1.5 mt-2">
                <span class="text-xs font-bold text-neutral-500">{{ plan.currency || 'KES' }}</span>
                <span class="text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
                  {{ (plan.price || 0).toLocaleString() }}
                </span>
                <span class="text-xs font-medium text-neutral-500">/ {{ plan.billingCycle }}</span>
              </div>
            </div>

            <div class="space-y-3 pt-2">
              <UButton
                :to="contactCtaUrl"
                block
                size="xl"
                color="primary"
                icon="i-tabler-ticket"
                class="font-black uppercase text-xs text-neutral-950 rounded-xl py-3.5"
              >
                {{ plan.cta?.label || 'Get This Pass' }}
              </UButton>

              <UButton
                :to="`https://wa.me/${CONTACTS.whatsapp}?text=Hello!%20I%20would%20like%20to%20inquire%20about%20the%20${plan.title}%20pass.`"
                target="_blank"
                block
                color="neutral"
                variant="ghost"
                icon="i-tabler-brand-whatsapp"
                class="font-bold text-xs rounded-xl py-2.5 text-emerald-600 dark:text-emerald-400"
              >
                Inquire via WhatsApp
              </UButton>
            </div>

            <p class="text-[11px] text-center text-neutral-400 leading-tight">
              * All passes are subject to availability and may be limited to certain days or times. Please contact us for more details.
            </p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
