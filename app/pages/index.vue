<script setup lang="ts">
import { LOCATION_DETAILS } from '~/utils/site-data'

useSeoMeta({
  title: `Recreation Yard Limited  Kericho`,
  description: LOCATION_DETAILS.tagline,
  ogTitle: LOCATION_DETAILS.company,
  ogDescription: LOCATION_DETAILS.tagline,
})
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

    <!-- Call to Action -->
    <UContainer>
      <HomeCtaBanner />
    </UContainer>
  </div>
</template>
