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
        <UIcon name="i-tabler-building-community" class="size-3.5 mr-1.5 text-primary" />
        About Recreation Yard Limited
      </UBadge>
      <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-highlighted">
        A space for recreation, active living and shared experiences.
      </h2>
      <p class="text-sm sm:text-base text-muted leading-relaxed">
        We bring together outdoor recreation, running and walking, sports merchandise, and group experiences so individuals, families, schools, companies, clubs and communities can move, play, connect, relax and thrive.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2  bg-default text-inverted p-6 sm:p-8 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="space-y-2">
            <p class="text-[10px] font-black uppercase tracking-widest text-primary">
              Our vision
            </p>
            <p class="text-sm leading-relaxed text-muted">
              To become a recognized destination for outdoor recreation, running, sports merchandise and memorable social experiences in Kenya.
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] font-black uppercase tracking-widest text-primary">
              Our mission
            </p>
            <p class="text-sm leading-relaxed text-muted">
              To provide welcoming recreational spaces, encourage active lifestyles, supply dependable sports products and create opportunities for people to connect.
            </p>
          </div>
        </div>
        <div class="border-t border-white/15 pt-5">
          <p class="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
            Our promise
          </p>
          <p class="text-xl sm:text-2xl font-black tracking-tight">
            MOVE. PLAY. CONNECT. THRIVE.
          </p>
        </div>
      </div>

      <div class=" border border-default p-6 sm:p-8 space-y-4">
        <p class="text-[10px] font-black uppercase tracking-widest text-primary">
          Our values
        </p>
        <div class="grid grid-cols-2 gap-x-4 gap-y-3">
          <span v-for="value in values" :key="value" class="flex items-center gap-2 text-xs font-bold text-muted">
            <UIcon name="i-tabler-circle-check-filled" class="size-4 text-primary shrink-0" />
            {{ value }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-5  bg-primary/10 p-6 sm:p-8">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-primary">
            Who we serve
          </p>
          <h3 class="mt-2 text-2xl font-black text-highlighted">
            Built for different journeys.
          </h3>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="audience in audiences" :key="audience" color="neutral" variant="soft" class="rounded-full px-3 py-1 text-xs font-bold">
            {{ audience }}
          </UBadge>
        </div>
      </div>

      <div class="space-y-5  border border-default p-6 sm:p-8">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-primary">
            Why choose us
          </p>
          <h3 class="mt-2 text-2xl font-black text-highlighted">
            Complementary services, one trusted partner.
          </h3>
        </div>
        <ul class="space-y-2 text-sm text-muted">
          <li v-for="reason in reasons" :key="reason" class="flex items-start gap-2">
            <UIcon name="i-tabler-arrow-up-right" class="size-4 text-primary shrink-0 mt-0.5" />
            <span>{{ reason }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-4">
        <p class="text-[10px] font-black uppercase tracking-widest text-primary">
          Our commitment
        </p>
        <h3 class="text-2xl sm:text-3xl font-black text-highlighted">
          Growing healthier, more connected communities.
        </h3>
        <p class="text-sm leading-relaxed text-muted">
          We encourage regular movement, responsible participation, positive social interaction and dependable support for schools, clubs and organisations. We welcome people who want to begin, participate, improve or simply enjoy the journey.
        </p>
      </div>
      <div class="space-y-4  bg-elevated p-6 sm:p-8">
        <p class="text-[10px] font-black uppercase tracking-widest text-primary">
          Partnerships
        </p>
        <h3 class="text-2xl font-black text-highlighted">
          Let’s create more opportunities to participate.
        </h3>
        <p class="text-sm leading-relaxed text-muted">
          We welcome collaboration with schools, corporate organisations, running clubs, marathon organisers, sporting suppliers, wellness organisations, community groups and event planners.
        </p>
        <UButton to="/contact?type=group-booking" color="primary" icon="i-tabler-arrow-right" trailing class="font-black uppercase text-xs text-highlighted rounded-sm px-5 py-3">
          Discuss a partnership
        </UButton>
      </div>
    </div>
  </section>
</template>
