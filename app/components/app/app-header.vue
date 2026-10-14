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
  <div class="sticky top-0 z-50">
    <AppAnnouncement />

    <header class="border-b border-default bg-default/95 backdrop-blur-md transition-colors">
      <UContainer class="flex items-center justify-between py-2.5">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5 shrink-0" aria-label="Home">
          <AppLogo class="h-7 sm:h-8 lg:h-9 w-auto" />
        </NuxtLink>

        <!-- Desktop & Desktop-Wide Navigation (1024px+) -->
        <nav class="hidden lg:flex items-center gap-0.5 xl:gap-1 text-[11px] xl:text-xs font-bold uppercase tracking-wider">
          <NuxtLink
            v-for="link in NAV_LINKS"
            :key="link.label"
            :to="link.to"
            class="inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-md hover:text-primary dark:hover:text-primary transition-colors"
            active-class="text-primary font-black"
          >
            <UIcon :name="link.icon" class="hidden xl:inline-block size-4 text-primary shrink-0" />
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
            class="relative min-h-11 min-w-11 justify-center cursor-pointer text-muted hover:text-primary"
            @click="isSearchModalOpen = true"
          >
            <UIcon name="i-tabler-search" class="size-5" />
            <UKbd class="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-elevated border">
              ⌘K
            </UKbd>
          </UButton>

          <!-- Theme Mode Switcher -->
          <CommonThemeToggle />

          <!-- Shopping Cart Drawer Button -->
          <UButton color="neutral" variant="ghost" aria-label="Open shopping bag" class="cursor-pointer relative justify-center min-h-11 min-w-11" @click="toggleCart">
            <UIcon name="i-tabler-shopping-bag" class="size-5" />
            <UBadge v-if="itemCount > 0" color="primary" variant="solid" class="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full p-0 text-[9px] font-black">
              {{ itemCount }}
            </UBadge>
          </UButton>

          <!-- Join Now Primary CTA -->
          <UButton to="/pricing" size="md" color="primary" class="hidden sm:inline-flex rounded-sm px-3 xl:px-4 text-xs font-black uppercase text-highlighted">
            JOIN NOW
          </UButton>

          <!-- Tablet & Mobile Menu Toggle (< 1024px) -->
          <UButton
            color="neutral"
            variant="ghost"
            class="lg:hidden"
            aria-label="Toggle Navigation Menu"
            @click="isMobileOpen = !isMobileOpen"
          >
            <UIcon :name="isMobileOpen ? 'i-tabler-x' : 'i-tabler-menu-2'" class="size-6" />
          </UButton>
        </div>
      </UContainer>
    </header>

    <!-- Slideover Drawer for Mobile & Tablet Viewports -->
    <USlideover v-model:open="isMobileOpen" title="Navigation Menu">
      <template #content>
        <div class="p-6 space-y-6 flex flex-col justify-between h-full bg-default text-default">
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-default pb-4">
              <AppLogo class="h-8 w-auto" />
              <UButton color="neutral" variant="ghost" icon="i-tabler-x" aria-label="Close navigation menu" class="size-11" @click="isMobileOpen = false" />
            </div>

            <nav class="flex flex-col gap-1.5 text-sm font-bold uppercase tracking-wider">
              <NuxtLink
                v-for="link in NAV_LINKS"
                :key="link.label"
                :to="link.to"
                class="flex items-center gap-3 px-3.5 py-3 rounded-sm hover:bg-elevated dark:hover:bg-elevated transition-colors"
                active-class="bg-primary/15 text-primary font-black"
                @click="isMobileOpen = false"
              >
                <UIcon :name="link.icon" class="size-5 text-primary shrink-0" />
                <span>{{ link.label }}</span>
              </NuxtLink>
            </nav>
          </div>

          <div class="space-y-4 pt-6 border-t border-default">
            <UButton
              to="/pricing"
              block
              size="lg"
              color="primary"
              class="font-black uppercase text-xs text-highlighted rounded-sm py-3.5"
              @click="isMobileOpen = false"
            >
              JOIN NOW
            </UButton>

            <div class="flex items-center justify-between pt-2">
              <span class="text-xs text-muted font-bold">Theme Mode</span>
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
