<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { LOCATION_DETAILS } from '~/utils/site-data'

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
  </div>
</template>
