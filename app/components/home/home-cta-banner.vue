<template>
  <section class="py-2 sm:py-8 w-full">
    <div class="p-0 sm:p-8 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs w-full">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center w-full">
        <div class="lg:col-span-7 space-y-2 sm:space-y-3 min-w-0">
          <UBadge color="primary" variant="soft" class="font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-md">
            <UIcon name="i-tabler-ticket" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
            <span>Move. Play. Connect. Thrive.</span>
          </UBadge>

          <h2 class="text-xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-tight">
            Let’s create an active experience together.
          </h2>

          <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
            Contact us to plan a recreational visit, join Recreation Yard Runners, source sports kits, or arrange a group, school or corporate experience. Availability, specifications and pricing are confirmed before booking or ordering.
          </p>
        </div>

        <div class="lg:col-span-5 flex flex-col xl:flex-row items-stretch justify-end gap-2 sm:gap-3 w-full min-w-0">
          <UButton
            to="/pricing"
            size="lg"
            color="primary"
            icon="i-tabler-ticket"
            class="w-full xl:w-auto font-black uppercase text-xs text-neutral-950 rounded-md px-5 py-3 cursor-pointer justify-center shadow-xs"
          >
            Discuss requirements
          </UButton>

          <UButton
            to="/contact"
            size="lg"
            color="neutral"
            variant="outline"
            icon="i-tabler-headset"
            class="w-full xl:w-auto font-extrabold uppercase text-xs rounded-md px-5 py-3 cursor-pointer justify-center"
          >
            Contact Us
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
