<script setup lang="ts">
import { LOCATION_DETAILS } from '~/utils/site-data'

const siteUrl = useRuntimeConfig().public.siteUrl

useSeoMeta({
  title: `Recreation Yard Limited  Kericho`,
  description: LOCATION_DETAILS.tagline,
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
  <div class="space-y-16 sm:space-y-24 pb-16">
    <!-- Hero Section -->
    <HomeHero />

    <!-- Facilities Teaser -->
    <UContainer>
      <HomeFacilitiesTeaser />
    </UContainer>

    <!-- Experience Grid -->
    <UContainer>
      <HomeExperienceGrid />
    </UContainer>

    <!-- Testimonials Section -->
    <UContainer>
      <HomeTestimonials />
    </UContainer>

    <!-- FAQ Accordion Section -->
    <UContainer>
      <HomeFaq />
    </UContainer>

    <!-- Call to Action -->
    <UContainer>
      <HomeCtaBanner />
    </UContainer>
  </div>
</template>
