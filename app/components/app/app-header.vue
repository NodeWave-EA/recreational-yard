<script setup lang="ts">
import AppLogo from '~/components/app/app-logo.vue'
import CommonGlobalSearchModal from '~/components/common/global-search-modal.vue'
import { NAV_LINKS } from '~/utils/site-data'

const { itemCount, toggleCart } = useCart()

const isMobileOpen = ref(false)
const isSearchModalOpen = ref(false)

// Register ⌘K / Ctrl+K keyboard shortcut
defineShortcuts({
  meta_k: {
    handler: () => {
      isSearchModalOpen.value = true
    },
  },
})
</script>

<template>
  <div class="sticky top-0 z-50 w-full">
    <AppAnnouncement />

    <header class="border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-colors dark:border-neutral-800/80 dark:bg-neutral-950/95 w-full">
      <UContainer class="flex items-center justify-between py-2.5">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5 shrink-0" aria-label="Home">
          <AppLogo class="h-7 sm:h-8 lg:h-9 w-auto" />
        </NuxtLink>

        <!-- Desktop Navigation (1024px+) -->
        <nav class="hidden lg:flex items-center gap-0.5 xl:gap-1 text-[11px] xl:text-xs font-bold uppercase tracking-wider">
          <NuxtLink
            v-for="link in NAV_LINKS"
            :key="link.label"
            :to="link.to"
            class="inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-md hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
            active-class="text-lime-600 dark:text-lime-400 font-black"
          >
            <UIcon :name="link.icon" class="hidden xl:inline-block size-4 text-lime-500 shrink-0" />
            <span>{{ link.label }}</span>
          </NuxtLink>
        </nav>

        <!-- Header Controls & Actions -->
        <div class="flex items-center gap-1.5 sm:gap-2.5">
          <!-- Search Button -->
          <UButton
            color="neutral"
            variant="ghost"
            aria-label="Open Search"
            class="relative min-h-10 min-w-10 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 justify-center cursor-pointer text-neutral-700 dark:text-neutral-200 hover:text-lime-600"
            @click="isSearchModalOpen = true"
          >
            <UIcon name="i-tabler-search" class="size-5" />
            <UKbd class="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 border">
              ⌘K
            </UKbd>
          </UButton>

          <!-- Theme Mode Switcher -->
          <CommonThemeToggle />

          <!-- Shopping Cart Drawer Button -->
          <UButton
            color="neutral"
            variant="ghost"
            aria-label="Open shopping bag"
            class="relative min-h-10 min-w-10 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 justify-center cursor-pointer text-neutral-700 dark:text-neutral-200 hover:text-lime-600"
            @click="toggleCart"
          >
            <UIcon name="i-tabler-shopping-bag" class="size-5" />
            <UBadge v-if="itemCount > 0" color="primary" variant="solid" class="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-md p-0 text-[9px] font-black">
              {{ itemCount }}
            </UBadge>
          </UButton>

          <!-- Book Visit Primary CTA -->
          <UButton
            to="/contact"
            size="md"
            color="primary"
            class="hidden sm:inline-flex rounded-md px-3.5 py-2 text-xs font-black uppercase text-neutral-950 cursor-pointer justify-center"
          >
            BOOK A VISIT
          </UButton>

          <!-- Mobile Menu Toggle (< 1024px) -->
          <UButton
            color="neutral"
            variant="ghost"
            class="lg:hidden rounded-md border border-neutral-200/80 dark:border-neutral-800/80 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 min-h-10 min-w-10 justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
            @click="isMobileOpen = !isMobileOpen"
          >
            <UIcon :name="isMobileOpen ? 'i-tabler-x' : 'i-tabler-menu-2'" class="size-5" />
          </UButton>
        </div>
      </UContainer>
    </header>

    <!-- Slideover Drawer for Mobile & Tablet Viewports -->
    <USlideover v-model:open="isMobileOpen" title="Navigation Menu">
      <template #content>
        <div class="p-4 sm:p-6 space-y-6 flex flex-col justify-between h-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white">
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <AppLogo class="h-8 w-auto" />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-tabler-x"
                aria-label="Close navigation menu"
                class="rounded-md cursor-pointer"
                @click="isMobileOpen = false"
              />
            </div>

            <nav class="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider">
              <NuxtLink
                v-for="link in NAV_LINKS"
                :key="link.label"
                :to="link.to"
                class="flex items-center gap-3 px-3.5 py-3 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs cursor-pointer"
                active-class="border-lime-500 dark:border-lime-500 text-lime-600 dark:text-lime-400 font-black"
                @click="isMobileOpen = false"
              >
                <UIcon :name="link.icon" class="size-5 text-lime-500 shrink-0" />
                <span>{{ link.label }}</span>
              </NuxtLink>
            </nav>
          </div>

          <div class="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <UButton
              to="/contact"
              block
              size="lg"
              color="primary"
              class="font-black uppercase text-xs text-neutral-950 rounded-md py-3.5 justify-center cursor-pointer"
              @click="isMobileOpen = false"
            >
              BOOK A VISIT
            </UButton>

            <div class="flex items-center justify-between pt-2">
              <span class="text-xs text-neutral-400 font-bold">Theme Mode</span>
              <CommonThemeToggle />
            </div>
          </div>
        </div>
      </template>
    </USlideover>

    <!-- Global Search Modal -->
    <CommonGlobalSearchModal v-model:open="isSearchModalOpen" />
  </div>
</template>
