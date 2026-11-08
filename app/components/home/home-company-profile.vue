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
  <section class="w-full text-neutral-900 dark:text-white">
    <div class="-mx-4 sm:mx-0 border-y sm:border border-neutral-200 dark:border-neutral-800 rounded-none sm:rounded-sm overflow-hidden bg-transparent divide-y divide-neutral-200 dark:divide-neutral-800 w-auto">
      <div class="p-5 sm:p-10 space-y-4 hover:bg-neutral-100/30 dark:hover:bg-neutral-800/20 transition-colors">
        <UBadge color="primary" variant="soft" class="font-bold text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-xs">
          <UIcon name="i-tabler-building-community" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
          <span>Who We Are • Recreation Yard Limited</span>
        </UBadge>
        <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight max-w-4xl">
          Your space for recreation, active living, sports and shared experiences.
        </h2>
        <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium max-w-5xl">
          We are a recreation, sports, wellness, events and sports merchandise business committed to making active living and outdoor experiences more accessible and enjoyable. Operating two distinct brands — <strong class="text-neutral-950 dark:text-white font-bold">Recreation Yard Kericho</strong> and <strong class="text-neutral-950 dark:text-white font-bold">Recreation Yard Runners</strong> — we serve individuals, families, schools, corporate organizations, sports clubs, event organizers and community groups.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 dark:divide-neutral-800">
        <div class="lg:col-span-5 p-5 sm:p-8 flex flex-col justify-between space-y-6 hover:bg-neutral-100/30 dark:hover:bg-neutral-800/20 transition-colors">
          <div class="space-y-2">
            <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400">
              Our Vision
            </span>
            <p class="text-base sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
              To become a recognized destination for outdoor recreation, running, sports merchandise and memorable social experiences in Kenya.
            </p>
          </div>

          <div class="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
            <span class="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block">
              Brand Motto
            </span>
            <p class="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 dark:text-white">
              MOVE. PLAY. CONNECT. THRIVE.
            </p>
            <span class="text-xs text-neutral-500 dark:text-neutral-400 font-semibold block">
              Kericho, Kenya
            </span>
          </div>
        </div>

        <div class="lg:col-span-7 p-5 sm:p-8 space-y-4 hover:bg-neutral-100/30 dark:hover:bg-neutral-800/20 transition-colors">
          <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
            Our Mission
          </span>
          <ul class="space-y-3 text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-medium">
            <li v-for="(m, i) in missions" :key="i" class="flex items-start gap-3">
              <UIcon name="i-tabler-check" class="size-4 text-lime-500 shrink-0 mt-0.5" />
              <span>{{ m }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="px-5 py-4 sm:px-8 flex items-center justify-between bg-neutral-100/30 dark:bg-neutral-900/30 border-b border-neutral-200 dark:border-neutral-800">
        <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400">
          Our Core Values
        </span>
        <span class="text-xs font-mono font-bold text-neutral-400">8 Pillars</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <div
          v-for="(val, idx) in values"
          :key="val.name"
          class="p-5 space-y-1.5 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors border-neutral-200 dark:border-neutral-800"
          :class="[
            idx < values.length - 1 ? 'border-b' : 'border-b-0',
            idx < 6 ? 'sm:border-b' : 'sm:border-b-0',
            idx < 4 ? 'lg:border-b' : 'lg:border-b-0',
            (idx + 1) % 2 !== 0 ? 'sm:border-r' : 'sm:border-r-0',
            (idx + 1) % 4 !== 0 ? 'lg:border-r' : 'lg:border-r-0',
          ]"
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

      <div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 dark:divide-neutral-800">
        <div class="lg:col-span-5 flex flex-col justify-between hover:bg-neutral-100/30 dark:hover:bg-neutral-800/20 transition-colors">
          <div class="p-5 sm:p-8 space-y-2">
            <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
              Who We Serve
            </span>
            <h3 class="text-lg sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
              Built for different journeys.
            </h3>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 border-t border-neutral-200 dark:border-neutral-800 w-full mt-auto">
            <div
              v-for="(audience, idx) in audiences"
              :key="audience"
              class="p-3.5 text-center flex items-center justify-center hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50 transition-colors border-neutral-200 dark:border-neutral-800 cursor-default"
              :class="[
                idx < audiences.length - 1 ? 'border-b' : 'border-b-0',
                idx < 6 ? 'sm:border-b' : 'sm:border-b-0',
                (idx + 1) % 2 !== 0 ? 'max-sm:border-r' : '',
                (idx + 1) % 3 !== 0 ? 'sm:border-r' : 'sm:border-r-0',
              ]"
            >
              <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                {{ audience }}
              </span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 p-5 sm:p-8 space-y-4 hover:bg-neutral-100/30 dark:hover:bg-neutral-800/20 transition-colors">
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
              Why Choose Us
            </span>
            <h3 class="mt-1 text-lg sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
              Complementary services, one trusted partner.
            </h3>
          </div>
          <ul class="space-y-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">
            <li v-for="reason in reasons" :key="reason" class="flex items-start gap-2.5">
              <UIcon name="i-tabler-arrow-up-right" class="size-4 text-lime-500 shrink-0 mt-0.5" />
              <span>{{ reason }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 dark:divide-neutral-800">
        <div class="p-5 sm:p-8 space-y-3 hover:bg-neutral-100/30 dark:hover:bg-neutral-800/20 transition-colors">
          <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
            Our Commitment
          </span>
          <h3 class="text-lg sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
            Growing healthier, more connected communities.
          </h3>
          <p class="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium">
            We encourage regular movement, responsible participation, positive social interaction and dependable support for schools, clubs and organisations. We welcome people who want to begin, participate, improve or simply enjoy the journey.
          </p>
        </div>

        <div class="p-5 sm:p-8 flex flex-col justify-between space-y-4 hover:bg-neutral-100/30 dark:hover:bg-neutral-800/20 transition-colors">
          <div class="space-y-3">
            <span class="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 block">
              Partnerships
            </span>
            <h3 class="text-lg sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
              Let’s create more opportunities to participate.
            </h3>
            <p class="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium">
              We welcome collaboration with schools, corporate organisations, running clubs, marathon organisers, sporting suppliers, wellness organisations, community groups and event planners.
            </p>
          </div>
          <div class="pt-2">
            <UButton
              to="/contact?type=group-booking"
              color="primary"
              icon="i-tabler-arrow-right"
              trailing
              class="w-full sm:w-auto font-black uppercase text-xs text-neutral-950 rounded-xs px-6 py-3 justify-center"
            >
              Discuss a partnership
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
