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
  <div class="min-h-screen bg-default text-default pb-20 transition-colors duration-300 w-full overflow-x-clip">
    <!-- Hero Header Banner -->
    <div class="pt-8 sm:pt-12 pb-6 border-b border-default">
      <UContainer>
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="space-y-2.5 max-w-3xl">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] px-3 py-0.5 rounded-full"
            >
              <UIcon name="i-tabler-quote" class="size-3.5 mr-1 text-primary shrink-0" />
              <span>Community Voices</span>
            </UBadge>

            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-highlighted leading-tight">
              What Our Visitors Say
            </h1>

            <p class="text-xs sm:text-base text-muted leading-relaxed">
              Real experiences and authentic feedback from tournament players, weekend visitors, and event hosts at Recreation Yard.
            </p>
          </div>

          <div class="shrink-0 text-xs font-bold text-muted">
            Published Feedback: <span class="text-primary font-extrabold text-sm">{{ filteredTestimonials.length }}</span>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="pt-8">
      <div class="mb-6 flex justify-end" role="group" aria-label="View mode">
        <div class="flex items-center gap-1 p-1 rounded-sm bg-elevated border border-default">
          <UButton size="xs" :color="viewMode === 'grid' ? 'primary' : 'neutral'" :variant="viewMode === 'grid' ? 'solid' : 'ghost'" icon="i-tabler-layout-grid" aria-label="Grid View" :aria-pressed="viewMode === 'grid'" class="rounded-sm" @click="viewMode = 'grid'" />
          <UButton size="xs" :color="viewMode === 'list' ? 'primary' : 'neutral'" :variant="viewMode === 'list' ? 'solid' : 'ghost'" icon="i-tabler-list" aria-label="List View" :aria-pressed="viewMode === 'list'" class="rounded-sm" @click="viewMode = 'list'" />
        </div>
      </div>

      <!-- Grid View -->
      <div
        v-if="viewMode === 'grid' && filteredTestimonials.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <NuxtLink
          v-for="testimonial in filteredTestimonials"
          :key="testimonial.path"
          :to="testimonial.path"
          class="group flex flex-col justify-between py-2 transition-all min-w-0"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1 text-primary">
                <UIcon
                  v-for="star in (testimonial.rating || 5)"
                  :key="star"
                  name="i-tabler-star-filled"
                  class="size-4"
                />
              </div>

              <UBadge v-if="testimonial.category" color="neutral" variant="subtle" class="text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                {{ testimonial.category }}
              </UBadge>
            </div>

            <blockquote class="text-sm sm:text-base font-medium italic text-muted leading-relaxed group-hover:text-primary transition-colors wrap-break-word">
              “{{ testimonial.comment }}”
            </blockquote>
          </div>

          <div class="mt-4 pt-3 border-t border-default flex items-center gap-3">
            <NuxtImg
              v-if="testimonial.avatar"
              :src="testimonial.avatar"
              :alt="testimonial.author"
              width="40"
              height="40"
              class="size-10 rounded-full object-cover shrink-0"
            />
            <div v-else class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-black text-primary text-xs">
              {{ testimonial.author.charAt(0) }}
            </div>

            <div class="min-w-0 flex-1">
              <h3 class="text-xs font-bold text-highlighted truncate">
                {{ testimonial.author }}
              </h3>
              <p class="text-[11px] text-muted truncate">
                {{ testimonial.role }}
              </p>
            </div>

            <UIcon name="i-tabler-arrow-right" class="size-4 text-muted group-hover:translate-x-1 group-hover:text-primary transition-all shrink-0" />
          </div>
        </NuxtLink>
      </div>

      <!-- List View -->
      <div
        v-else-if="viewMode === 'list' && filteredTestimonials.length"
        data-catalog-list class="divide-y divide-default dark:divide-default"
      >
        <article
          v-for="testimonial in filteredTestimonials"
          :key="testimonial.path"
          data-catalog-list-row class="py-6 first:pt-0 group transition-all"
        >
          <NuxtLink :to="testimonial.path" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
            <div class="space-y-2 min-w-0 flex-1">
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1 text-primary">
                  <UIcon
                    v-for="star in (testimonial.rating || 5)"
                    :key="star"
                    name="i-tabler-star-filled"
                    class="size-3.5"
                  />
                </div>
                <UBadge v-if="testimonial.category" color="neutral" variant="subtle" class="text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                  {{ testimonial.category }}
                </UBadge>
              </div>

              <blockquote class="text-sm sm:text-base font-medium italic text-muted leading-relaxed group-hover:text-primary transition-colors wrap-break-word">
                “{{ testimonial.comment }}”
              </blockquote>

              <div class="flex items-center gap-2.5 pt-1">
                <NuxtImg
                  v-if="testimonial.avatar"
                  :src="testimonial.avatar"
                  :alt="testimonial.author"
                  width="32"
                  height="32"
                  class="size-8 rounded-full object-cover shrink-0"
                />
                <div v-else class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                  {{ testimonial.author.charAt(0) }}
                </div>
                <div class="text-xs truncate">
                  <span class="font-bold text-highlighted">{{ testimonial.author }}</span>
                  <span v-if="testimonial.role" class="text-muted ml-1.5">• {{ testimonial.role }}</span>
                </div>
              </div>
            </div>

            <span class="inline-flex items-center gap-1 text-xs font-bold text-muted group-hover:text-primary shrink-0">
              <span>Read Review</span>
              <UIcon name="i-tabler-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </NuxtLink>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="py-20 text-center space-y-4 max-w-md mx-auto">
        <UIcon name="i-tabler-message-off" class="size-10 text-muted mx-auto" />
        <h3 class="text-lg font-bold text-highlighted">
          No Testimonials Found
        </h3>
        <p class="text-xs text-muted">
          No reviews match your filter parameters. Try clearing your search query.
        </p>
        <UButton size="sm" color="neutral" variant="outline" icon="i-tabler-rotate-clockwise" class="rounded-sm font-bold text-xs" @click="resetFilters">
          Reset Filters
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
