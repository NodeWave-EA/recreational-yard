<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased dark:bg-neutral-950 dark:text-neutral-100 flex flex-col justify-between">
    <AppHeader />

    <UMain>
      <slot />
    </UMain>

    <AppFooter />

    <CartSlideover />
  </div>
</template>
