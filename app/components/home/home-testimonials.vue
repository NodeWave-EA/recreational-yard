<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'

const { getCollection } = useContentQuery()
const viewMode = ref<'grid' | 'list'>('grid')

const { data: generalTestimonials } = await getCollection('home-general-testimonials', 'testimonials', {
  where: { category: 'General', featured: true },
  limit: 3,
  enableLogging: false,
})
</script>

<template>
  <section v-if="generalTestimonials?.length" class="space-y-4 sm:space-y-6 py-2 sm:py-6 w-full">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-3 sm:pb-5 px-0">
      <div>
        <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-1.5 sm:mb-2 rounded-xs">
          Community Voices
        </UBadge>
        <h2 class="text-xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
          What Our Visitors Say
        </h2>
      </div>

      <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full sm:w-auto">
        <div class="flex items-center p-1 rounded-xs bg-transparent border border-neutral-200 dark:border-neutral-800">
          <UButton
            size="xs"
            :color="viewMode === 'grid' ? 'primary' : 'neutral'"
            :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
            icon="i-tabler-layout-grid"
            aria-label="Grid View"
            class="rounded-xs font-bold cursor-pointer"
            @click="viewMode = 'grid'"
          />
          <UButton
            size="xs"
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            :variant="viewMode === 'list' ? 'solid' : 'ghost'"
            icon="i-tabler-list"
            aria-label="List View"
            class="rounded-xs font-bold cursor-pointer"
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
          All Reviews
        </UButton>
      </div>
    </div>

    <div
      v-if="viewMode === 'grid'"
      class="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-transparent grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 w-full"
    >
      <NuxtLink
        v-for="item in generalTestimonials"
        :key="item.path"
        :to="item.path || '/testimonials'"
        class="group flex flex-col justify-between p-5 sm:p-6 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200 w-full min-w-0"
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
              class="size-8 sm:size-9 rounded-xs object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
            />
            <div
              v-else
              class="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs border border-neutral-200/50 dark:border-neutral-800/50"
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

    <div
      v-else-if="viewMode === 'list'"
      class="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-transparent divide-y divide-neutral-200 dark:divide-neutral-800 w-full"
    >
      <NuxtLink
        v-for="item in generalTestimonials"
        :key="item.path"
        :to="item.path || '/testimonials'"
        class="group block p-5 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200 w-full min-w-0"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
          <div class="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
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

            <div class="flex items-center gap-2 pt-1">
              <NuxtImg
                v-if="item.avatar"
                :src="item.avatar"
                :alt="item.author"
                format="webp"
                quality="80"
                class="size-7 sm:size-8 rounded-xs object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
              />
              <div v-else class="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 font-bold text-lime-600 dark:text-lime-400 text-xs border border-neutral-200/50 dark:border-neutral-800/50">
                {{ item.author.charAt(0) }}
              </div>
              <div class="text-xs truncate">
                <span class="font-bold text-neutral-950 dark:text-white">{{ item.author }}</span>
                <span v-if="item.role" class="text-neutral-400 ml-1.5">• {{ item.role }}</span>
              </div>
            </div>
          </div>

          <span class="inline-flex items-center gap-1 text-xs font-bold text-lime-600 dark:text-lime-400 shrink-0 pt-2 sm:pt-0">
            <span>Read Review</span>
            <UIcon name="i-tabler-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
