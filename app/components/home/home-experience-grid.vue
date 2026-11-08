<template>
  <section class="w-full py-2 sm:py-6">
    <div class="-mx-3 sm:mx-0 border-y sm:border border-neutral-200 dark:border-neutral-800 rounded-none sm:rounded-sm overflow-hidden bg-transparent grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 w-auto">
      <div class="p-5 sm:p-8 flex flex-col justify-between space-y-6 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <UBadge color="neutral" variant="soft" class="font-bold text-[10px] uppercase tracking-widest rounded-xs px-2.5 py-1">
              <UIcon name="i-tabler-calendar-event" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
              Community & Partnerships
            </UBadge>
            <span class="text-xs font-mono font-bold text-neutral-400 dark:text-neutral-600">01</span>
          </div>

          <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
            Opportunities to participate
          </h3>

          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
            Join running, jogging and walking activities, community challenges, group recreation and other shared experiences. We welcome partnerships with schools, clubs, companies and event organisers.
          </p>
        </div>

        <div class="pt-2">
          <UButton
            to="/events"
            color="primary"
            icon="i-tabler-calendar-event"
            class="w-full sm:w-auto font-black uppercase text-xs text-neutral-950 rounded-xs px-6 py-3 justify-center"
          >
            Explore opportunities
          </UButton>
        </div>
      </div>

      <div class="p-5 sm:p-8 flex flex-col justify-between space-y-6 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <UBadge color="neutral" variant="soft" class="font-bold text-[10px] uppercase tracking-widest rounded-xs px-2.5 py-1">
              <UIcon name="i-tabler-shopping-bag" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
              Sports Merchandise & Kits
            </UBadge>
            <span class="text-xs font-mono font-bold text-neutral-400 dark:text-neutral-600">02</span>
          </div>

          <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
            Running kits, uniforms & equipment
          </h3>

          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
            Source running apparel, complete marathon kits, school games uniforms, corporate sportswear and selected sporting equipment, coordinated to your sizes, quantities, branding and budget.
          </p>
        </div>

        <div class="pt-2">
          <UButton
            to="/shop"
            color="neutral"
            variant="outline"
            icon="i-tabler-shopping-bag"
            class="w-full sm:w-auto font-extrabold uppercase text-xs rounded-xs px-6 py-3 justify-center"
          >
            View sportswear services
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
