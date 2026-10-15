<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'

const { getCollection } = useContentQuery()
const viewMode = ref<'grid' | 'list'>('grid')

// Query ONLY General category testimonials for the Homepage
const { data: generalTestimonials } = await getCollection('home-general-testimonials', 'testimonials', {
  where: { category: 'General', featured: true },
  limit: 3,
  enableLogging: false,
})
</script>

<template>
  <section v-if="generalTestimonials?.length" class="space-y-6 py-6">
    <!-- Header with Grid / List Switcher -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
      <div>
        <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-xs mb-2 rounded-md">
          Community Voices
        </UBadge>
        <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
          What Our Visitors Say
        </h2>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <!-- View Toggle Control Group -->
        <div class="flex items-center p-1 rounded-md bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <UButton
            size="xs"
            :color="viewMode === 'grid' ? 'primary' : 'neutral'"
            :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
            icon="i-tabler-layout-grid"
            aria-label="Grid View"
            class="rounded-md font-bold cursor-pointer"
            @click="viewMode = 'grid'"
          />
          <UButton
            size="xs"
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            :variant="viewMode === 'list' ? 'solid' : 'ghost'"
            icon="i-tabler-list"
            aria-label="List View"
            class="rounded-md font-bold cursor-pointer"
            @click="viewMode = 'list'"
          />
        </div>

        <UButton
          to="/testimonials"
          color="neutral"
          variant="ghost"
          icon="i-tabler-arrow-right"
          trailing
          class="font-bold uppercase text-xs tracking-wider cursor-pointer"
        >
          View All Reviews
        </UButton>
      </div>
    </div>

    <!-- 1. Grid View Option (Clickable Cards with 4-Side Hover Borders) -->
    <div
      v-if="viewMode === 'grid'"
      class="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <NuxtLink
        v-for="item in generalTestimonials"
        :key="item.path"
        :to="item.path || '/testimonials'"
        class="group flex flex-col justify-between p-5 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs hover:shadow-md min-w-0"
      >
        <div class="space-y-3">
          <div class="flex items-center gap-1 text-lime-500">
            <UIcon
              v-for="star in (item.rating || 5)"
              :key="star"
              name="i-tabler-star-filled"
              class="size-3.5"
            />
          </div>

          <p class="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed italic group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-4">
            “{{ item.comment }}”
          </p>
        </div>

        <div class="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
          <div class="flex items-center gap-3 min-w-0">
            <NuxtImg
              v-if="item.avatar"
              :src="item.avatar"
              :alt="item.author"
              format="webp"
              quality="80"
              class="size-9 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
            />
            <div
              v-else
              class="flex size-9 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs"
            >
              {{ item.author.charAt(0) }}
            </div>

            <div class="min-w-0 flex-1">
              <h3 class="text-xs font-bold text-neutral-950 dark:text-white truncate">
                {{ item.author }}
              </h3>
              <p class="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
                {{ item.role }}
              </p>
            </div>
          </div>

          <UIcon name="i-tabler-arrow-right" class="size-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-lime-500 transition-all shrink-0" />
        </div>
      </NuxtLink>
    </div>

    <!-- 2. Flat List Row View Option (Clickable Cards) -->
    <div
      v-else-if="viewMode === 'list'"
      class="space-y-3"
    >
      <NuxtLink
        v-for="item in generalTestimonials"
        :key="item.path"
        :to="item.path || '/testimonials'"
        class="group block p-4 sm:p-5 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs hover:shadow-md min-w-0"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
          <div class="space-y-2 min-w-0 flex-1">
            <div class="flex items-center gap-1 text-lime-500">
              <UIcon
                v-for="star in (item.rating || 5)"
                :key="star"
                name="i-tabler-star-filled"
                class="size-3.5"
              />
            </div>

            <p class="text-xs sm:text-sm font-medium italic text-neutral-800 dark:text-neutral-200 leading-relaxed group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
              “{{ item.comment }}”
            </p>

            <div class="flex items-center gap-2.5 pt-1">
              <NuxtImg
                v-if="item.avatar"
                :src="item.avatar"
                :alt="item.author"
                format="webp"
                quality="80"
                class="size-8 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
              />
              <div v-else class="flex size-8 shrink-0 items-center justify-center rounded-md bg-lime-500/10 font-bold text-lime-600 dark:text-lime-400 text-xs">
                {{ item.author.charAt(0) }}
              </div>
              <div class="text-xs truncate">
                <span class="font-bold text-neutral-950 dark:text-white">{{ item.author }}</span>
                <span v-if="item.role" class="text-neutral-400 ml-1.5">• {{ item.role }}</span>
              </div>
            </div>
          </div>

          <span class="inline-flex items-center gap-1 text-xs font-bold text-lime-600 dark:text-lime-400 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
            <span>Read Review</span>
            <UIcon name="i-tabler-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
