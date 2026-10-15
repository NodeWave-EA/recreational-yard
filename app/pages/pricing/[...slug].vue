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
  <div class="py-6 sm:py-12 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen transition-colors duration-300 w-full overflow-x-clip">
    <UContainer v-if="plan" class="space-y-8">
      <!-- Back Link -->
      <div>
        <NuxtLink
          to="/pricing"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
          <UIcon name="i-tabler-arrow-left" class="size-4" />
          <span>Back to All Passes & Memberships</span>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <!-- Main Pass Info -->
        <div class="lg:col-span-8 space-y-6 min-w-0">
          <div class="space-y-3">
            <UBadge
              v-if="plan.badge"
              :color="plan.isPopular ? 'primary' : 'neutral'"
              variant="soft"
              class="font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-md"
            >
              {{ plan.badge }}
            </UBadge>

            <h1 class="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white leading-tight">
              {{ plan.title }}
            </h1>

            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
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
                class="flex items-start gap-3 font-medium"
              >
                <UIcon name="i-tabler-circle-check-filled" class="size-5 shrink-0 text-lime-500 mt-0.5" />
                <span class="leading-snug">{{ feature }}</span>
              </li>

              <li
                v-for="(item, idx) in plan.notIncluded"
                :key="`not-${idx}`"
                class="flex items-start gap-3 text-neutral-400 dark:text-neutral-600 line-through font-medium"
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

        <!-- Sticky Sidebar Action Details Card -->
        <div class="lg:col-span-4 sticky top-[calc(var(--ui-header-height,4rem)+1.5rem)] space-y-6">
          <div class="p-5 sm:p-6 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs space-y-6">
            <div class="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Pricing & Quotation</span>
              <div v-if="plan.price" class="flex items-baseline gap-1.5 mt-2">
                <span class="text-xs font-bold text-neutral-500">{{ plan.currency || 'KES' }}</span>
                <span class="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
                  {{ plan.price.toLocaleString() }}
                </span>
                <span v-if="plan.billingCycle" class="text-xs font-medium text-neutral-500">/ {{ plan.billingCycle }}</span>
              </div>
              <div v-else class="mt-2">
                <span class="text-2xl font-black tracking-tight text-neutral-950 dark:text-white">
                  Quote on Request
                </span>
                <span class="block text-xs text-neutral-500 mt-1 font-medium leading-relaxed">Pricing confirmed based on agreed requirements and specifications</span>
              </div>
            </div>

            <div class="space-y-3 pt-1">
              <UButton
                :to="contactCtaUrl"
                block
                size="lg"
                color="primary"
                icon="i-tabler-ticket"
                class="font-black uppercase text-xs text-neutral-950 rounded-md py-3.5 cursor-pointer justify-center"
              >
                {{ plan.cta?.label || 'Request a Quotation' }}
              </UButton>

              <UButton
                :to="`https://wa.me/${CONTACTS.whatsapp}?text=Hello!%20I%20would%20like%20to%20inquire%20about%20${plan.title}.`"
                target="_blank"
                block
                color="neutral"
                variant="ghost"
                icon="i-tabler-brand-whatsapp"
                class="font-bold text-xs rounded-md py-2.5 text-emerald-600 dark:text-emerald-400 cursor-pointer justify-center"
              >
                Inquire via WhatsApp
              </UButton>
            </div>

            <p class="text-[11px] text-center text-neutral-400 leading-relaxed font-medium">
              * Prior booking is mandatory. Venue access, activity schedules and merchandise specifications are confirmed through customer service before confirmation.
            </p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
