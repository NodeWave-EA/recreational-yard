<script setup lang="ts">
const values = [
  'Wellness',
  'Inclusivity',
  'Community',
  'Safety',
  'Integrity',
  'Quality',
  'Affordability',
  'Sustainability',
]

const audiences = [
  'Individuals',
  'Families',
  'Schools',
  'Companies',
  'Running clubs',
  'Sports clubs',
  'Event organisers',
  'Community groups',
]

const reasons = [
  'Recreation and sports merchandise under one business',
  'Flexible physical and virtual participation',
  'A welcoming green setting for games and gatherings',
  'Coordinated kits based on requirements and budget',
]
</script>

<template>
  <section class="space-y-12 sm:space-y-16">
    <div class="max-w-3xl space-y-3">
      <UBadge color="primary" variant="soft" class="font-bold text-[10px] sm:text-xs uppercase tracking-widest">
        <UIcon name="i-tabler-building-community" class="size-3.5 mr-1.5 text-lime-500" />
        About Recreation Yard Limited
      </UBadge>
      <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
        A space for recreation, active living and shared experiences.
      </h2>
      <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
        We bring together outdoor recreation, running and walking, sports merchandise, and group experiences so individuals, families, schools, companies, clubs and communities can move, play, connect, relax and thrive.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 rounded-3xl bg-neutral-950 text-white p-6 sm:p-8 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="space-y-2">
            <p class="text-[10px] font-black uppercase tracking-widest text-lime-400">
              Our vision
            </p>
            <p class="text-sm leading-relaxed text-neutral-200">
              To become a recognized destination for outdoor recreation, running, sports merchandise and memorable social experiences in Kenya.
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] font-black uppercase tracking-widest text-lime-400">
              Our mission
            </p>
            <p class="text-sm leading-relaxed text-neutral-200">
              To provide welcoming recreational spaces, encourage active lifestyles, supply dependable sports products and create opportunities for people to connect.
            </p>
          </div>
        </div>
        <div class="border-t border-white/15 pt-5">
          <p class="text-[10px] font-black uppercase tracking-widest text-lime-400 mb-3">
            Our promise
          </p>
          <p class="text-xl sm:text-2xl font-black tracking-tight">
            MOVE. PLAY. CONNECT. THRIVE.
          </p>
        </div>
      </div>

      <div class="rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-4">
        <p class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400">
          Our values
        </p>
        <div class="grid grid-cols-2 gap-x-4 gap-y-3">
          <span v-for="value in values" :key="value" class="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
            <UIcon name="i-tabler-circle-check-filled" class="size-4 text-lime-500 shrink-0" />
            {{ value }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-5 rounded-3xl bg-lime-500/10 p-6 sm:p-8">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-lime-700 dark:text-lime-400">
            Who we serve
          </p>
          <h3 class="mt-2 text-2xl font-black text-neutral-950 dark:text-white">
            Built for different journeys.
          </h3>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="audience in audiences" :key="audience" color="neutral" variant="soft" class="rounded-full px-3 py-1 text-xs font-bold">
            {{ audience }}
          </UBadge>
        </div>
      </div>

      <div class="space-y-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400">
            Why choose us
          </p>
          <h3 class="mt-2 text-2xl font-black text-neutral-950 dark:text-white">
            Complementary services, one trusted partner.
          </h3>
        </div>
        <ul class="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <li v-for="reason in reasons" :key="reason" class="flex items-start gap-2">
            <UIcon name="i-tabler-arrow-up-right" class="size-4 text-lime-500 shrink-0 mt-0.5" />
            <span>{{ reason }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-4">
        <p class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400">
          Our commitment
        </p>
        <h3 class="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
          Growing healthier, more connected communities.
        </h3>
        <p class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          We encourage regular movement, responsible participation, positive social interaction and dependable support for schools, clubs and organisations. We welcome people who want to begin, participate, improve or simply enjoy the journey.
        </p>
      </div>
      <div class="space-y-4 rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-6 sm:p-8">
        <p class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400">
          Partnerships
        </p>
        <h3 class="text-2xl font-black text-neutral-950 dark:text-white">
          Let’s create more opportunities to participate.
        </h3>
        <p class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          We welcome collaboration with schools, corporate organisations, running clubs, marathon organisers, sporting suppliers, wellness organisations, community groups and event planners.
        </p>
        <UButton to="/contact?type=group-booking" color="primary" icon="i-tabler-arrow-right" trailing class="font-black uppercase text-xs text-neutral-950 rounded-xl px-5 py-3">
          Discuss a partnership
        </UButton>
      </div>
    </div>
  </section>
</template>
