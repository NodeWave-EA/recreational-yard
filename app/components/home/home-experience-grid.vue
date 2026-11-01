<template>
  <section class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 py-2 sm:py-8 w-full">
    <div class="p-0 sm:p-8 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs flex flex-col justify-between space-y-3 sm:space-y-4 w-full">
      <div class="space-y-2 sm:space-y-3">
        <UBadge color="neutral" variant="soft" class="font-bold text-[10px] uppercase tracking-wider rounded-md">
          <UIcon name="i-tabler-calendar-event" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
          Community & partnerships
        </UBadge>

        <h3 class="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
          Opportunities to participate
        </h3>

        <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
          Join running, jogging and walking activities, community challenges, group recreation and other shared experiences. We welcome partnerships with schools, clubs, companies and event organisers.
        </p>
      </div>

      <div class="pt-1 sm:pt-2">
        <UButton
          to="/events"
          color="primary"
          icon="i-tabler-calendar-event"
          class="w-full sm:w-auto font-black uppercase text-xs text-neutral-950 rounded-md px-6 py-3 cursor-pointer justify-center"
        >
          Explore opportunities
        </UButton>
      </div>
    </div>

    <div class="p-0 sm:p-8 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs flex flex-col justify-between space-y-3 sm:space-y-4 w-full">
      <div class="space-y-2 sm:space-y-3">
        <UBadge color="neutral" variant="soft" class="font-bold text-[10px] uppercase tracking-wider rounded-md">
          <UIcon name="i-tabler-shopping-bag" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
          Sports merchandise and kits
        </UBadge>

        <h3 class="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
          Running kits, uniforms and equipment
        </h3>

        <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
          Source running apparel, complete marathon kits, school games uniforms, corporate sportswear and selected sporting equipment, coordinated to your sizes, quantities, branding and budget.
        </p>
      </div>

      <div class="pt-1 sm:pt-2">
        <UButton
          to="/shop"
          color="neutral"
          variant="outline"
          icon="i-tabler-shopping-bag"
          class="w-full sm:w-auto font-extrabold uppercase text-xs rounded-md px-6 py-3 cursor-pointer justify-center"
        >
          View sportswear services
        </UButton>
      </div>
    </div>
  </section>
</template>
