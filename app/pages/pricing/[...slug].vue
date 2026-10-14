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
  <div class="py-8 sm:py-14 bg-default text-muted min-h-screen">
    <UContainer v-if="plan">
      <!-- Back Link -->
      <NuxtLink
        to="/pricing"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary dark:hover:text-primary transition-colors mb-6"
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

            <h1 class="text-3xl sm:text-4xl font-black text-highlighted">
              {{ plan.title }}
            </h1>

            <p class="text-xs sm:text-sm text-muted leading-relaxed">
              {{ plan.description }}
            </p>
          </div>

          <!-- Included Features List -->
          <div class="pt-6 border-t border-default space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-wider text-muted">
              Pass Benefits & Features
            </h2>

            <ul class="space-y-3 text-xs sm:text-sm text-muted">
              <li
                v-for="(feature, idx) in plan.features"
                :key="idx"
                class="flex items-start gap-3"
              >
                <UIcon name="i-tabler-circle-check-filled" class="size-5 shrink-0 text-primary mt-0.5" />
                <span class="leading-snug">{{ feature }}</span>
              </li>

              <li
                v-for="(item, idx) in plan.notIncluded"
                :key="`not-${idx}`"
                class="flex items-start gap-3 text-muted line-through"
              >
                <UIcon name="i-tabler-circle-x" class="size-5 shrink-0 text-muted mt-0.5" />
                <span class="leading-snug">{{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- Markdown Content Body -->
          <div class="prose dark:prose-invert max-w-none text-xs leading-relaxed pt-6 border-t border-default">
            <ContentRenderer :value="plan" />
          </div>
        </div>

        <!-- Sticky Sidebar Action Details -->
        <div class="lg:col-span-4 sticky top-[calc(var(--ui-header-height,4rem)+1.5rem)] space-y-6 lg:border-l lg:border-default lg:dark:border-default lg:pl-8">
          <div class="space-y-6">
            <div class="border-b border-default pb-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-muted block">Rate & Billing</span>
              <div class="flex items-baseline gap-1.5 mt-2">
                <span class="text-xs font-bold text-muted">{{ plan.currency || 'KES' }}</span>
                <span class="text-4xl font-black tracking-tight text-highlighted">
                  {{ (plan.price || 0).toLocaleString() }}
                </span>
                <span class="text-xs font-medium text-muted">/ {{ plan.billingCycle }}</span>
              </div>
            </div>

            <div class="space-y-3 pt-2">
              <UButton
                :to="contactCtaUrl"
                block
                size="xl"
                color="primary"
                icon="i-tabler-ticket"
                class="font-black uppercase text-xs text-highlighted rounded-sm py-3.5"
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
                class="font-bold text-xs rounded-sm py-2.5 text-success dark:text-success"
              >
                Inquire via WhatsApp
              </UButton>
            </div>

            <p class="text-[11px] text-center text-muted leading-tight">
              * All passes are subject to availability and may be limited to certain days or times. Please contact us for more details.
            </p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
