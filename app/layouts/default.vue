<template>
  <div class="min-h-screen bg-default text-default font-sans antialiased flex flex-col justify-between">
    <!-- Global Sticky Header with Announcement Bar -->
    <AppHeader />

    <!-- Main Page Content Slot -->
    <UMain id="main-content" class="flex-1">
      <slot />
    </UMain>

    <!-- Global Footer -->
    <AppFooter />

    <!-- Shopping Cart Drawer -->
    <CartSlideover />
  </div>
</template>
