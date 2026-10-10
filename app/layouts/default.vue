<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased dark:bg-neutral-950 dark:text-neutral-100 flex flex-col justify-between">
    <!-- Global Sticky Header with Announcement Bar -->
    <AppHeader />

    <!-- Main Page Content Slot -->
    <UMain id="main-content" class="flex-1">
      <UContainer>
        <slot />
      </UContainer>
    </UMain>

    <!-- Global Footer -->
    <AppFooter />

    <!-- Shopping Cart Drawer -->
    <CartSlideover />
  </div>
</template>
