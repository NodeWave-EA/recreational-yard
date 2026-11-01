<script setup lang="ts">
import { LOCATION_DETAILS } from '~/utils/site-data'

const siteUrl = useRuntimeConfig().public.siteUrl

useSeoMeta({
  title: `${LOCATION_DETAILS.company} | Outdoor Recreation, Sports & Shared Experiences Kericho`,
  description: 'Recreation Yard Limited connects outdoor recreation, running, sports merchandise, and group experiences at Kooma along the Kericho–Kisumu Highway.',
  ogTitle: LOCATION_DETAILS.company,
  ogDescription: LOCATION_DETAILS.tagline,
  ogImage: `${siteUrl}/logo.png`,
  ogUrl: siteUrl,
})

useSchemaOrg([{
  '@type': 'WebPage',
  '@id': `${siteUrl}/#webpage`,
  'url': siteUrl,
  'name': LOCATION_DETAILS.company,
  'description': LOCATION_DETAILS.tagline,
  'isPartOf': { '@id': `${siteUrl}/#website` },
  'about': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <UContainer class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white space-y-12 sm:space-y-16 pb-16 transition-colors duration-300 w-full overflow-x-clip">
    <HomeHero />

    <HomeFacilitiesTeaser />

    <HomeCompanyProfile />

    <HomeExperienceGrid />

    <HomeTestimonials />

    <HomeFaq />

    <HomeCtaBanner />
  </UContainer>
</template>
