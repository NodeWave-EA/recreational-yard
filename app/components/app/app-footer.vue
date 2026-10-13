<script setup lang="ts">
import AppLogo from '~/components/app/app-logo.vue'
import { FOOTER_LINKS, HIGHLIGHTS, LOCATION_DETAILS, SOCIAL_LINKS } from '~/utils/site-data'

const route = useRoute()
const [exploreLinks, communityLinks] = FOOTER_LINKS.map(category => category.links)

// Active link route matching
function isLinkActive(path: string) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <footer id="contact" class="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300 w-full">
    <UContainer class="py-12 sm:py-16">
      <!-- Main Footer Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
        <!-- Brand Column -->
        <div class="space-y-4 sm:col-span-2 lg:col-span-5">
          <NuxtLink to="/" class="inline-block focus:outline-none" aria-label="Home">
            <AppLogo class="h-9 sm:h-10 w-auto" />
          </NuxtLink>

          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md">
            Kericho's premier outdoor sports and recreation destination, offering natural grass lawn tennis courts, target archery, wellness trails, and tea estate views.
          </p>

          <!-- Highlights -->
          <div class="space-y-2 pt-1">
            <div
              v-for="highlight in HIGHLIGHTS"
              :key="highlight.text"
              class="text-xs text-lime-600 dark:text-lime-400 font-bold flex items-center gap-2"
            >
              <UIcon :name="highlight.icon" class="size-4 text-lime-500 shrink-0" />
              <span>{{ highlight.text }}</span>
            </div>
          </div>

          <!-- Social Links Pills -->
          <div class="pt-2">
            <span class="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-2">Connect With Us</span>
            <div class="flex items-center gap-2">
              <NuxtLink
                v-for="item in SOCIAL_LINKS"
                :key="item.label"
                :to="item.to"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="item.label"
                class="flex size-9 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-lime-500 hover:text-neutral-950 dark:hover:bg-lime-500 dark:hover:text-neutral-950 transition-colors"
              >
                <UIcon :name="item.icon" class="size-4.5" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Explore & Activities -->
        <div class="space-y-3.5 sm:col-span-1 lg:col-span-2">
          <h4 class="text-[11px] font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            Explore
          </h4>
          <ul class="space-y-2 text-xs">
            <li v-for="link in exploreLinks" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="inline-flex items-center gap-2 py-1 transition-colors relative"
                :class="[
                  isLinkActive(link.to as string)
                    ? 'text-lime-600 dark:text-lime-400 font-extrabold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white font-medium',
                ]"
              >
                <span v-if="isLinkActive(link.to as string)" class="size-1.5 rounded-full bg-lime-500 shrink-0" />
                <span>{{ link.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Community & Resources -->
        <div class="space-y-3.5 sm:col-span-1 lg:col-span-2">
          <h4 class="text-[11px] font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            Community
          </h4>
          <ul class="space-y-2 text-xs">
            <li v-for="link in communityLinks" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="inline-flex items-center gap-2 py-1 transition-colors relative"
                :class="[
                  isLinkActive(link.to as string)
                    ? 'text-lime-600 dark:text-lime-400 font-extrabold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white font-medium',
                ]"
              >
                <span v-if="isLinkActive(link.to as string)" class="size-1.5 rounded-full bg-lime-500 shrink-0" />
                <span>{{ link.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact & Location Details -->
        <div class="space-y-3.5 sm:col-span-1 lg:col-span-3">
          <h4 class="text-[11px] font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            Visit & Contact
          </h4>

          <ul class="space-y-3 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            <li class="flex items-start gap-2.5">
              <UIcon name="i-tabler-map-pin" class="size-4 text-lime-500 shrink-0 mt-0.5" />
              <span class="leading-snug">{{ LOCATION_DETAILS.address }}</span>
            </li>

            <li class="flex items-center gap-2.5">
              <UIcon name="i-tabler-phone" class="size-4 text-lime-500 shrink-0" />
              <NuxtLink
                :href="`tel:${LOCATION_DETAILS.phone}`"
                class="hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
              >
                {{ LOCATION_DETAILS.phone }}
              </NuxtLink>
            </li>

            <li class="flex items-center gap-2.5">
              <UIcon name="i-tabler-mail" class="size-4 text-lime-500 shrink-0" />
              <NuxtLink
                :href="`mailto:${LOCATION_DETAILS.email}`"
                class="hover:text-lime-600 dark:hover:text-lime-400 transition-colors truncate"
              >
                {{ LOCATION_DETAILS.email }}
              </NuxtLink>
            </li>

            <li class="flex items-center gap-2.5">
              <UIcon name="i-tabler-clock" class="size-4 text-lime-500 shrink-0" />
              <span>{{ LOCATION_DETAILS.hours }}</span>
            </li>
          </ul>

          <div class="pt-2">
            <UButton
              :to="LOCATION_DETAILS.googleMapsUrl"
              target="_blank"
              size="sm"
              color="primary"
              icon="i-tabler-location"
              class="font-black uppercase text-xs text-neutral-950 rounded-xl px-4 py-2.5"
            >
              Get Directions
            </UButton>
          </div>
        </div>
      </div>

      <!-- Bottom Copyright Bar -->
      <div class="mt-12 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
        <p>
          &copy; {{ new Date().getFullYear() }} {{ LOCATION_DETAILS.company }} • OUTDOOR RECREATION.
        </p>

        <div class="flex items-center gap-2 text-lime-600 dark:text-lime-400">
          <UIcon name="i-tabler-heart" class="size-3.5 text-lime-500 shrink-0" />
          <span class="uppercase tracking-wider text-[10px]">Play. Compete. Relax.</span>
        </div>
      </div>
    </UContainer>
  </footer>
</template>
