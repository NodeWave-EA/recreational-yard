<script setup lang="ts">
import { LOCATION_DETAILS, SITE_DESCRIPTION, SITE_NAME } from '~/utils/site-data'

const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl
const logoUrl = `${siteUrl}/logo.webp`

useSeoMeta({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  ogTitle: SITE_NAME,
  ogDescription: SITE_DESCRIPTION,
  ogType: 'website',
  ogUrl: siteUrl,
  ogImage: logoUrl,
  ogImageAlt: `${SITE_NAME} logo`,
  twitterCard: 'summary_large_image',
  twitterTitle: SITE_NAME,
  twitterDescription: SITE_DESCRIPTION,
  twitterImage: logoUrl,
})

useSchemaOrg([
  defineOrganization({
    name: LOCATION_DETAILS.company,
    url: siteUrl,
    logo: logoUrl,
    telephone: LOCATION_DETAILS.phone,
    email: LOCATION_DETAILS.email,
    sameAs: Object.values(LOCATION_DETAILS.socials),
    address: {
      streetAddress: LOCATION_DETAILS.address,
      addressLocality: 'Kericho',
      addressCountry: 'KE',
    },
    openingHours: ['Mo-Su 07:30-18:00'],
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
