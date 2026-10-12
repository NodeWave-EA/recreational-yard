<script setup lang="ts">
import AppLogo from '~/components/app/app-logo.vue'
import { HIGHLIGHTS, LOCATION_DETAILS, NAV_LINKS, SOCIAL_LINKS } from '~/utils/site-data'
</script>

<template>
  <footer id="contact" class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300">
    <UContainer class="py-10 sm:py-14">
      <!-- Main Footer -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
        <!-- Brand Column -->
        <div class="space-y-4 sm:col-span-2 lg:col-span-5">
          <NuxtLink to="/" class="inline-block focus:outline-none" aria-label="Home">
            <AppLogo class="h-9 sm:h-10 w-auto" />
          </NuxtLink>

          <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md">
            Kericho's premier outdoor sports and recreation destination, offering grass lawn tennis courts, target archery, wellness trails, and tea estate views.
          </p>

          <!-- Highlights -->
          <div class="space-y-2">
            <p v-for="highlight in HIGHLIGHTS" :key="highlight.text" class="text-xs text-lime-600 dark:text-lime-400 font-semibold flex items-center gap-1.5">
              <UIcon :name="highlight.icon" class="size-3.5 text-lime-500 shrink-0" />
              <span>{{ highlight.text }}</span>
            </p>
          </div>

          <!-- Social Links Pills -->
          <div class="flex items-center gap-2 pt-1">
            <a
              v-for="item in SOCIAL_LINKS"
              :key="item.name"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="item.name"
              class="flex size-9 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-lime-500 hover:text-neutral-950 dark:hover:bg-lime-500 dark:hover:text-neutral-950 transition-colors"
            >
              <UIcon :name="item.icon" class="size-4" />
            </a>
          </div>
        </div>

        <!-- Quick Navigation -->
        <div class="space-y-3 sm:col-span-1 lg:col-span-3">
          <h4 class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Navigation
          </h4>
          <ul class="space-y-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <li
              v-for="link in NAV_LINKS"
              :key="link.label"
              class="flex items-center gap-1.5"
            >
              <NuxtLink
                :to="link.to"
                class="hover:text-lime-600 dark:hover:text-lime-400 transition-colors inline-block py-0.5"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact & Location Details -->
        <div class="space-y-3 sm:col-span-1 lg:col-span-4">
          <h4 class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Contact & Location
          </h4>

          <ul class="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
            <li class="flex items-start gap-2.5">
              <UIcon name="i-tabler-map-pin" class="size-4 text-lime-500 shrink-0 mt-0.5" />
              <span>{{ LOCATION_DETAILS.address }}</span>
            </li>
            <li class="flex items-center gap-2.5">
              <UIcon name="i-tabler-phone" class="size-4 text-lime-500 shrink-0" />
              <a :href="`tel:${LOCATION_DETAILS.phone}`" class="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                {{ LOCATION_DETAILS.phone }}
              </a>
            </li>
            <li class="flex items-center gap-2.5">
              <UIcon name="i-tabler-mail" class="size-4 text-lime-500 shrink-0" />
              <a :href="`mailto:${LOCATION_DETAILS.email}`" class="hover:text-lime-600 dark:hover:text-lime-400 transition-colors truncate">
                {{ LOCATION_DETAILS.email }}
              </a>
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

      <!-- Copyright -->
      <div class="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
        <p>
          &copy; {{ new Date().getFullYear() }} {{ LOCATION_DETAILS.parentCompany }} - OUTDOOR RECREATION.
        </p>
        <p class="flex items-center gap-1">
          <UIcon name="i-tabler-heart" class="size-3.5 text-lime-500 shrink-0" />
          <span>PLAY. COMPETE. RELAX.</span>
        </p>
      </div>
    </UContainer>
  </footer>
</template>
