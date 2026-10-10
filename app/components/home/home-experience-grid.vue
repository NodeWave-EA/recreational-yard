<template>
  <section class="grid grid-cols-1 md:grid-cols-2 gap-12 py-10 border-y border-neutral-200 dark:border-neutral-800">
    <!-- Community Events Teaser -->
    <div class="space-y-4">
      <UBadge color="neutral" variant="soft" class="font-bold text-[10px] uppercase tracking-wider">
        <UIcon name="i-tabler-calendar-event" class="size-3.5 mr-1.5 text-lime-500" />
        Community Events
      </UBadge>

      <h3 class="text-2xl font-black text-neutral-950 dark:text-white">
        Upcoming Events
      </h3>

      <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
        From lawn tennis tournaments and highland trail marathons to weekend family BBQ socials - discover upcoming sports fixtures and weekend activities in Kericho.
      </p>

      <div class="pt-2">
        <UButton
          to="/events"
          color="primary"
          icon="i-tabler-calendar-event"
          class="font-black uppercase text-xs text-neutral-950 rounded-xl px-6 py-3"
        >
          View Events Calendar
        </UButton>
      </div>
    </div>

    <!-- Store Teaser -->
    <div class="space-y-4 md:border-l md:border-neutral-200 md:dark:border-neutral-800 md:pl-12">
      <UBadge color="neutral" variant="soft" class="font-bold text-[10px] uppercase tracking-wider">
        <UIcon name="i-tabler-shopping-bag" class="size-3.5 mr-1.5 text-lime-500" />
        Official Store
      </UBadge>

      <h3 class="text-2xl font-black text-neutral-950 dark:text-white">
        Official Recreation Yard Store
      </h3>

      <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Take home fresh single-origin Kericho loose-leaf tea harvested directly from surrounding highland estates, branded sportswear caps, and outdoor equipment.
      </p>

      <div class="pt-2">
        <UButton
          to="/shop"
          color="neutral"
          variant="outline"
          icon="i-tabler-shopping-bag"
          class="font-extrabold uppercase text-xs rounded-xl px-6 py-3"
        >
          Visit Store
        </UButton>
      </div>
    </div>
  </section>
</template>
