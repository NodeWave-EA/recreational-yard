<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'

const { getCollection } = useContentQuery()

// Query ONLY General category testimonials for the Homepage
const { data: generalTestimonials } = await getCollection('home-general-testimonials', 'testimonials', {
  where: { category: 'General', featured: true },
  limit: 3,
  enableLogging: false,
})
</script>

<template>
  <section v-if="generalTestimonials?.length" class="space-y-8 py-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-default pb-5">
      <div>
        <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-xs mb-2">
          Community Voices
        </UBadge>
        <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-highlighted">
          What Our Visitors Say
        </h2>
      </div>

      <p class="text-xs sm:text-sm text-muted max-w-md leading-relaxed">
        Authentic feedback from families, members, and weekend visitors at Kericho Recreation Yard.
      </p>
    </div>

    <!-- Testimonials -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-default dark:divide-default">
      <div
        v-for="(item, idx) in generalTestimonials"
        :key="idx"
        class="space-y-4 pt-6 md:pt-0"
        :class="{ 'md:pl-8': idx > 0 }"
      >
        <div class="flex items-center gap-1 text-primary">
          <UIcon
            v-for="star in (item.rating || 5)"
            :key="star"
            name="i-tabler-star-filled"
            class="size-4"
          />
        </div>

        <p class="text-sm sm:text-base font-medium text-muted leading-relaxed italic">
          "{{ item.comment }}"
        </p>

        <div class="flex items-center gap-3 pt-2">
          <NuxtImg
            v-if="item.avatar"
            :src="item.avatar"
            :alt="item.author"
            format="webp"
            quality="80"
            class="size-10 rounded-full object-cover border border-default shrink-0"
          />
          <div
            v-else
            class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm"
          >
            {{ item.author.charAt(0) }}
          </div>

          <div class="space-y-0.5">
            <h3 class="text-xs font-bold text-highlighted">
              {{ item.author }}
            </h3>
            <p class="text-[11px] text-muted font-medium">
              {{ item.role }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
