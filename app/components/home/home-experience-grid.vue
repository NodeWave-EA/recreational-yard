<template>
  <section class="grid grid-cols-1 md:grid-cols-2 gap-12 py-10 border-y border-neutral-200 dark:border-neutral-800">
    <!-- Community and partnership teaser -->
    <div class="space-y-4">
      <UBadge color="neutral" variant="soft" class="font-bold text-[10px] uppercase tracking-wider">
        <UIcon name="i-tabler-calendar-event" class="size-3.5 mr-1.5 text-lime-500" />
        Community & partnerships
      </UBadge>

      <h3 class="text-2xl font-black text-neutral-950 dark:text-white">
        Opportunities to participate
      </h3>

      <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Join running, jogging and walking activities, community challenges, group recreation and other shared experiences. We welcome partnerships with schools, clubs, companies and event organisers.
      </p>

      <div class="pt-2">
        <UButton
          to="/events"
          color="primary"
          icon="i-tabler-calendar-event"
          class="font-black uppercase text-xs text-neutral-950 rounded-xl px-6 py-3"
        >
          Explore opportunities
        </UButton>
      </div>
    </div>

    <!-- Sports merchandise teaser -->
    <div class="space-y-4 md:border-l md:border-neutral-200 md:dark:border-neutral-800 md:pl-12">
      <UBadge color="neutral" variant="soft" class="font-bold text-[10px] uppercase tracking-wider">
        <UIcon name="i-tabler-shopping-bag" class="size-3.5 mr-1.5 text-lime-500" />
        Sports merchandise and kits
      </UBadge>

      <h3 class="text-2xl font-black text-neutral-950 dark:text-white">
        Running kits, uniforms and equipment
      </h3>

      <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Source running apparel, complete marathon kits, school games uniforms, corporate sportswear and selected sporting equipment, coordinated to your sizes, quantities, branding and budget.
      </p>

      <div class="pt-2">
        <UButton
          to="/shop"
          color="neutral"
          variant="outline"
          icon="i-tabler-shopping-bag"
          class="font-extrabold uppercase text-xs rounded-xl px-6 py-3"
        >
          View sportswear services
        </UButton>
      </div>
    </div>
  </section>
</template>
