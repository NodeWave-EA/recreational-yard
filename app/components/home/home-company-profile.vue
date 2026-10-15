<script setup lang="ts">
const values = [
  { name: 'Wellness', desc: 'Encouraging physical activity and healthy lifestyle choices.' },
  { name: 'Inclusivity', desc: 'Welcoming people with different interests, ages and fitness levels.' },
  { name: 'Community', desc: 'Bringing people together through sport and shared recreation.' },
  { name: 'Safety', desc: 'Promoting responsible participation and safe use of our facilities.' },
  { name: 'Integrity', desc: 'Valuing professionalism, transparency, trust and honest communication.' },
  { name: 'Quality', desc: 'Striving to provide dependable products and positive customer experiences.' },
  { name: 'Affordability', desc: 'Offering flexible recreational, group and purchasing options.' },
  { name: 'Sustainability', desc: 'Encouraging responsible use and care of our recreational environment.' },
]

const missions = [
  'Provide welcoming recreational spaces and green grounds for all visitors.',
  'Encourage running, walking, lawn games and active lifestyles across Kenya.',
  'Supply dependable sports apparel, team uniforms and sporting equipment.',
  'Create opportunities for families, friends, schools and organizations to connect.',
  'Build a sustainable business supporting community participation.',
]

const audiences = [
  'Individuals',
  'Families',
  'Schools',
  'Corporate Organizations',
  'Running Clubs',
  'Marathon Participants',
  'Sports Clubs & Teams',
  'Event Organizers',
  'Community Groups',
]

const reasons = [
  'Recreation and sports merchandise under one trusted business',
  'A green outdoor recreational setting for games, picnics and celebrations',
  'Activities for different interests: badminton, tennis, chess, cornhole, archery and running',
  'Physical meet-ups in Kericho and virtual participation anywhere',
  'Flexible picnic experiences: bring your own meals and permitted refreshments',
  'Coordinated sports kits: apparel and equipment customized to specifications and budgets',
  'Tailored group and corporate experiences for team building and meetings',
  'Advance planning: prior booking confirms availability and transparent conditions',
]
</script>

<template>
  <section class="space-y-6 sm:space-y-16 text-neutral-900 dark:text-white transition-colors duration-300 w-full">
    <div class="space-y-2 sm:space-y-3 pb-4 sm:pb-8 border-b border-neutral-200 dark:border-neutral-800 px-0">
      <UBadge color="primary" variant="soft" class="font-bold text-[10px] sm:text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-md">
        <UIcon name="i-tabler-building-community" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
        <span>Who We Are • Recreation Yard Limited</span>
      </UBadge>
      <h2 class="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
        Your space for recreation, active living, sports and shared experiences.
      </h2>
      <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
        We are a recreation, sports, wellness, events and sports merchandise business committed to making active living and outdoor experiences more accessible and enjoyable. Operating two distinct brands — <strong class="text-neutral-950 dark:text-white font-bold">Recreation Yard Kericho</strong> and <strong class="text-neutral-950 dark:text-white font-bold">Recreation Yard Runners</strong> — we serve individuals, families, schools, corporate organizations, sports clubs, event organizers and community groups.
      </p>
    </div>

    <div class="space-y-5 sm:space-y-8 pb-6 sm:pb-12 border-b border-neutral-200 dark:border-neutral-800">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start w-full">
        <div class="lg:col-span-5 space-y-4 sm:space-y-6">
          <div class="p-0 sm:p-6 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs space-y-1">
            <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
              Our Vision
            </span>
            <p class="text-sm sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
              To become a recognized destination for outdoor recreation, running, sports merchandise and memorable social experiences in Kenya.
            </p>
          </div>

          <div class="p-0 sm:p-6 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs space-y-1">
            <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
              Brand Motto
            </span>
            <p class="text-xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
              MOVE. PLAY. CONNECT. THRIVE.
            </p>
            <p class="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-semibold">
              Kericho, Kenya
            </p>
          </div>
        </div>

        <div class="lg:col-span-7 p-0 sm:p-6 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs space-y-2 sm:space-y-3">
          <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
            Our Mission
          </span>
          <ul class="space-y-2 sm:space-y-3 text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-medium">
            <li v-for="(m, i) in missions" :key="i" class="flex items-start gap-2">
              <UIcon name="i-tabler-check" class="size-4 text-lime-500 shrink-0 mt-0.5" />
              <span>{{ m }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="space-y-4 sm:space-y-6 pb-6 sm:pb-12 border-b border-neutral-200 dark:border-neutral-800">
      <div class="flex items-center justify-between px-0">
        <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400">
          Our Core Values
        </span>
        <span class="text-xs font-bold text-neutral-400">8 Pillars</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full">
        <div
          v-for="val in values"
          :key="val.name"
          class="p-0 sm:p-4 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs space-y-1 min-w-0"
        >
          <div class="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-neutral-950 dark:text-white">
            <UIcon name="i-tabler-circle-check-filled" class="size-4 text-lime-500 shrink-0" />
            <span>{{ val.name }}</span>
          </div>
          <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium pl-6">
            {{ val.desc }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 pb-6 sm:pb-12 border-b border-neutral-200 dark:border-neutral-800 items-start w-full">
      <div class="lg:col-span-5 p-0 sm:p-6 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs space-y-2 sm:space-y-4">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
            Who We Serve
          </span>
          <h3 class="mt-1 text-lg sm:text-2xl font-black text-neutral-950 dark:text-white">
            Built for different journeys.
          </h3>
        </div>
        <div class="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
          <UBadge
            v-for="audience in audiences"
            :key="audience"
            color="neutral"
            variant="subtle"
            class="rounded-md px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider"
          >
            {{ audience }}
          </UBadge>
        </div>
      </div>

      <div class="lg:col-span-7 p-0 sm:p-6 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs space-y-2 sm:space-y-4">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
            Why Choose Us
          </span>
          <h3 class="mt-1 text-lg sm:text-2xl font-black text-neutral-950 dark:text-white">
            Complementary services, one trusted partner.
          </h3>
        </div>
        <ul class="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">
          <li v-for="reason in reasons" :key="reason" class="flex items-start gap-2">
            <UIcon name="i-tabler-arrow-up-right" class="size-4 text-lime-500 shrink-0 mt-0.5" />
            <span>{{ reason }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-start w-full">
      <div class="p-0 sm:p-6 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs space-y-2 sm:space-y-3">
        <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
          Our Commitment
        </span>
        <h3 class="text-lg sm:text-2xl font-black text-neutral-950 dark:text-white">
          Growing healthier, more connected communities.
        </h3>
        <p class="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium">
          We encourage regular movement, responsible participation, positive social interaction and dependable support for schools, clubs and organisations. We welcome people who want to begin, participate, improve or simply enjoy the journey.
        </p>
      </div>

      <div class="p-0 sm:p-6 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs space-y-3 sm:space-y-4">
        <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
          Partnerships
        </span>
        <h3 class="text-lg sm:text-2xl font-black text-neutral-950 dark:text-white">
          Let’s create more opportunities to participate.
        </h3>
        <p class="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium">
          We welcome collaboration with schools, corporate organisations, running clubs, marathon organisers, sporting suppliers, wellness organisations, community groups and event planners.
        </p>
        <div class="pt-1 sm:pt-2">
          <UButton
            to="/contact?type=group-booking"
            color="primary"
            icon="i-tabler-arrow-right"
            trailing
            class="w-full sm:w-auto font-black uppercase text-xs text-neutral-950 rounded-md px-5 py-3 cursor-pointer justify-center"
          >
            Discuss a partnership
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
