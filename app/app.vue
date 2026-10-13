<script setup lang="ts">
import { LOCATION_DETAILS, SITE_DESCRIPTION, SITE_NAME } from '~/utils/site-data'

useSeoMeta({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  ogTitle: SITE_NAME,
  ogDescription: SITE_DESCRIPTION,
  ogType: 'website',
  ogImage: 'https://recreational-yard.vercel.app/logo.webp',
  ogImageAlt: `${SITE_NAME} logo`,
  twitterCard: 'summary_large_image',
  twitterTitle: SITE_NAME,
  twitterDescription: SITE_DESCRIPTION,
  twitterImage: 'https://recreational-yard.vercel.app/logo.webp',
})

useSchemaOrg([
  defineOrganization({
    name: LOCATION_DETAILS.company,
    url: 'https://recreational-yard.vercel.app',
    logo: '/logo.webp',
    telephone: LOCATION_DETAILS.phone,
    email: LOCATION_DETAILS.email,
    address: {
      streetAddress: LOCATION_DETAILS.address,
      addressLocality: 'Kericho',
      addressCountry: 'KE',
    },
  }),
])
</script>

<template>
  <UApp>
    <NuxtLayout name="default">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
