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
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white space-y-12 sm:space-y-16 pb-16 transition-colors duration-300 w-full overflow-x-clip">
    <!-- 1. Main Visual Hero Section -->
    <HomeHero />

    <!-- 2. Primary Services & Facilities Teaser (Immediate Catalog Exposure) -->
    <UContainer>
      <HomeFacilitiesTeaser />
    </UContainer>

    <!-- 3. Company Profile, Mission & Core Values -->
    <UContainer>
      <HomeCompanyProfile />
    </UContainer>

    <!-- 4. Community Events & Sports Merchandise Grid -->
    <UContainer>
      <HomeExperienceGrid />
    </UContainer>

    <!-- 5. Social Proof & Community Testimonials -->
    <UContainer>
      <HomeTestimonials />
    </UContainer>

    <!-- 6. General Guidance FAQ Section -->
    <UContainer>
      <HomeFaq />
    </UContainer>

    <!-- 7. High-Conversion Call to Action Banner -->
    <UContainer>
      <HomeCtaBanner />
    </UContainer>
  </div>
</template>
