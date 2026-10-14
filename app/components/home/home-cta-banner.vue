<template>
  <section class="py-8 sm:py-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <!-- Left Content -->
      <div class="lg:col-span-7 space-y-2.5 sm:space-y-3">
        <UBadge color="primary" variant="soft" class="font-bold text-[10px] sm:text-xs uppercase tracking-wider">
          <UIcon name="i-tabler-ticket" class="size-3.5 mr-1.5 text-primary" />
          <span>Move. Play. Connect. Thrive.</span>
        </UBadge>

        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-highlighted uppercase leading-tight">
          Let’s create an active experience together.
        </h2>

        <p class="text-xs sm:text-base text-muted leading-relaxed">
          Contact us to plan a recreational visit, join Recreation Yard Runners, source sports kits, or arrange a group, school or corporate experience. Availability, specifications and pricing are confirmed before booking or ordering.
        </p>
      </div>

      <!-- Right Action Buttons -->
      <div class="lg:col-span-5 flex flex-col sm:flex-row items-center lg:justify-end gap-3 w-full shrink-0">
        <UButton
          to="/pricing"
          size="lg"
          color="primary"
          icon="i-tabler-ticket"
          class="w-full sm:w-auto font-black uppercase text-xs text-highlighted rounded-sm px-6 py-3.5 whitespace-nowrap justify-center shadow-xs"
        >
          Discuss your requirements
        </UButton>

        <UButton
          to="/contact"
          size="lg"
          color="neutral"
          variant="outline"
          icon="i-tabler-headset"
          class="w-full sm:w-auto font-extrabold uppercase text-xs rounded-sm px-6 py-3.5 whitespace-nowrap justify-center"
        >
          Contact Recreation Yard
        </UButton>
      </div>
    </div>
  </section>
</template>
