<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedCategory = ref('all')

const { getCollection } = useContentQuery()

const { data: testimonials } = await getCollection('testimonials-index', 'testimonials', {
  enableLogging: false,
})

// Category filter options
const categoryOptions = computed(() => {
  const set = new Set<string>()
  testimonials.value?.forEach((t: any) => {
    if (t.category)
      set.add(t.category)
  })
  return [
    { id: 'all', label: 'All Reviews' },
    ...Array.from(set).map(cat => ({ id: cat, label: cat })),
  ]
})

// Filtered Testimonials
const filteredTestimonials = computed(() => {
  let list = testimonials.value || []

  if (selectedCategory.value !== 'all') {
    list = list.filter((item: any) => item.category === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter((item: any) =>
      item.comment?.toLowerCase().includes(q)
      || item.author?.toLowerCase().includes(q)
      || item.role?.toLowerCase().includes(q),
    )
  }

  return list
})

function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'all'
}

useSeoMeta({
  title: `Visitor Testimonials | ${LOCATION_DETAILS.company}`,
  description: 'Read what families, members, and event hosts say about their time at Recreation Yard Kericho.',
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-20 transition-colors duration-300 w-full overflow-x-clip">
    <!-- Hero Header Banner -->
    <div class="pt-8 sm:pt-12 pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <UContainer>
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="space-y-2.5">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] px-3 py-0.5 rounded-md"
            >
              <UIcon name="i-tabler-quote" class="size-3.5 mr-1 text-lime-500 shrink-0" />
              <span>Community Voices</span>
            </UBadge>

            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
              What Our Visitors Say
            </h1>

            <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Real experiences and authentic feedback from runners, corporate teams, school coordinators, and family visitors at Recreation Yard.
            </p>
          </div>

          <div class="shrink-0 text-xs font-bold text-neutral-400">
            Published Feedback: <span class="text-lime-600 dark:text-lime-400 font-extrabold text-sm">{{ filteredTestimonials.length }}</span>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Sticky Toolbar Controls -->
    <div class="sticky top-[var(--ui-header-height,4rem)] z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs transition-all">
      <UContainer>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="w-full sm:w-80 shrink-0">
            <UInput
              v-model="searchQuery"
              icon="i-tabler-search"
              placeholder="Search reviews or authors..."
              size="md"
              color="primary"
              class="w-full rounded-md"
              clearable
            />
          </div>

          <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0">
            <USelectMenu
              v-model="selectedCategory"
              :items="categoryOptions"
              value-key="id"
              label-key="label"
              placeholder="Category..."
              class="w-44 shrink-0 rounded-md"
            />

            <!-- View Mode Switcher -->
            <div class="flex items-center p-1 rounded-md bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
              <UButton
                size="xs"
                :color="viewMode === 'grid' ? 'primary' : 'neutral'"
                :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
                icon="i-tabler-layout-grid"
                aria-label="Grid View"
                class="rounded-md font-bold"
                @click="viewMode = 'grid'"
              />
              <UButton
                size="xs"
                :color="viewMode === 'list' ? 'primary' : 'neutral'"
                :variant="viewMode === 'list' ? 'solid' : 'ghost'"
                icon="i-tabler-list"
                aria-label="List View"
                class="rounded-md font-bold"
                @click="viewMode = 'list'"
              />
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content Container -->
    <UContainer class="pt-8">
      <!-- Active Filter Pills -->
      <div v-if="selectedCategory !== 'all' || searchQuery" class="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-bold text-neutral-400">Active Filters:</span>
          <UBadge v-if="searchQuery" color="primary" variant="soft" class="rounded-md font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Query: "{{ searchQuery }}"</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="searchQuery = ''" />
          </UBadge>
          <UBadge v-if="selectedCategory !== 'all'" color="primary" variant="soft" class="rounded-md font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Category: {{ selectedCategory }}</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="selectedCategory = 'all'" />
          </UBadge>
          <UButton size="xs" color="neutral" variant="link" class="text-xs font-bold text-neutral-400" @click="resetFilters">
            Clear All
          </UButton>
        </div>
      </div>

      <!-- 1. Grid View Option (Clickable Cards with 4-Side Hover Borders) -->
      <div
        v-if="viewMode === 'grid' && filteredTestimonials.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <NuxtLink
          v-for="testimonial in filteredTestimonials"
          :key="testimonial.path"
          :to="testimonial.path"
          class="group flex flex-col justify-between p-5 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs hover:shadow-md min-w-0"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1 text-lime-500">
                <UIcon
                  v-for="star in (testimonial.rating || 5)"
                  :key="star"
                  name="i-tabler-star-filled"
                  class="size-3.5"
                />
              </div>

              <UBadge v-if="testimonial.category" color="neutral" variant="subtle" class="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md">
                {{ testimonial.category }}
              </UBadge>
            </div>

            <blockquote class="text-xs sm:text-sm font-medium italic text-neutral-800 dark:text-neutral-200 leading-relaxed group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-4">
              “{{ testimonial.comment }}”
            </blockquote>
          </div>

          <div class="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <NuxtImg
                v-if="testimonial.avatar"
                :src="testimonial.avatar"
                :alt="testimonial.author"
                width="40"
                height="40"
                class="size-9 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
              />
              <div v-else class="flex size-9 shrink-0 items-center justify-center rounded-md bg-lime-500/10 font-bold text-lime-600 dark:text-lime-400 text-xs">
                {{ testimonial.author.charAt(0) }}
              </div>

              <div class="min-w-0 flex-1">
                <h3 class="text-xs font-bold text-neutral-950 dark:text-white truncate">
                  {{ testimonial.author }}
                </h3>
                <p class="text-[10px] text-neutral-500 dark:text-neutral-400 truncate font-medium">
                  {{ testimonial.role }}
                </p>
              </div>
            </div>

            <UIcon name="i-tabler-arrow-right" class="size-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-lime-500 transition-all shrink-0" />
          </div>
        </NuxtLink>
      </div>

      <!-- 2. Flat List Row View Option (Clickable Cards) -->
      <div
        v-else-if="viewMode === 'list' && filteredTestimonials.length"
        class="space-y-4"
      >
        <NuxtLink
          v-for="testimonial in filteredTestimonials"
          :key="testimonial.path"
          :to="testimonial.path"
          class="group block p-4 sm:p-5 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs hover:shadow-md min-w-0"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
            <div class="space-y-2 min-w-0 flex-1">
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1 text-lime-500">
                  <UIcon
                    v-for="star in (testimonial.rating || 5)"
                    :key="star"
                    name="i-tabler-star-filled"
                    class="size-3.5"
                  />
                </div>
                <UBadge v-if="testimonial.category" color="neutral" variant="subtle" class="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md">
                  {{ testimonial.category }}
                </UBadge>
              </div>

              <blockquote class="text-xs sm:text-sm font-medium italic text-neutral-800 dark:text-neutral-200 leading-relaxed group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                “{{ testimonial.comment }}”
              </blockquote>

              <div class="flex items-center gap-2.5 pt-1">
                <NuxtImg
                  v-if="testimonial.avatar"
                  :src="testimonial.avatar"
                  :alt="testimonial.author"
                  width="32"
                  height="32"
                  class="size-8 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
                />
                <div v-else class="flex size-8 shrink-0 items-center justify-center rounded-md bg-lime-500/10 font-bold text-lime-600 dark:text-lime-400 text-xs">
                  {{ testimonial.author.charAt(0) }}
                </div>
                <div class="text-xs truncate">
                  <span class="font-bold text-neutral-950 dark:text-white">{{ testimonial.author }}</span>
                  <span v-if="testimonial.role" class="text-neutral-400 ml-1.5">• {{ testimonial.role }}</span>
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

      <!-- Empty State -->
      <div v-else class="py-20 text-center space-y-4 max-w-md mx-auto">
        <div class="flex size-16 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-message-off" class="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>
        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
            No Testimonials Found
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            No reviews match your filter parameters. Try clearing your search query or resetting filters.
          </p>
        </div>
        <div class="pt-2">
          <UButton size="sm" color="neutral" variant="outline" icon="i-tabler-rotate-clockwise" class="rounded-md font-bold text-xs px-4 py-2 cursor-pointer" @click="resetFilters">
            Reset All Filters
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
