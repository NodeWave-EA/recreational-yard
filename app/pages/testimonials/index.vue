<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { LOCATION_DETAILS } from '~/utils/site-data'

const viewMode = ref<'grid' | 'list'>('grid')

const { getCollection } = useContentQuery()

const { data: testimonials } = await getCollection('testimonials-index', 'testimonials', {
  enableLogging: false,
})

const hasAnyTestimonial = computed(() => (testimonials.value?.length || 0) > 0)

useSeoMeta({
  title: `Visitor Testimonials | ${LOCATION_DETAILS.company}`,
  description: 'Read what families, members, and event hosts say about their time at Recreation Yard Kericho.',
  ogTitle: `Visitor Testimonials | ${LOCATION_DETAILS.company}`,
  ogDescription: 'Read what families, members, and event hosts say about their time at Recreation Yard Kericho.',
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}/testimonials`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
useSchemaOrg([{
  '@type': 'CollectionPage',
  '@id': `${siteUrl}/testimonials#webpage`,
  'url': `${siteUrl}/testimonials`,
  'name': `Visitor Testimonials | ${LOCATION_DETAILS.company}`,
  'description': 'Read what families, members, and event hosts say about their time at Recreation Yard Kericho.',
  'isPartOf': { '@id': `${siteUrl}/#website` },
  'about': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-12 sm:pb-20 transition-colors duration-300 w-full overflow-x-clip">
    <div class="pt-4 sm:pt-12 pb-4 sm:pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
          <div class="space-y-2 sm:space-y-2.5">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] px-2.5 sm:px-3 py-0.5 rounded-md"
            >
              <UIcon name="i-tabler-quote" class="size-3.5 mr-1 text-lime-500 shrink-0" />
              <span>Community Voices</span>
            </UBadge>

            <h1 class="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
              What Our Visitors Say
            </h1>

            <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Real experiences and authentic feedback from runners, corporate teams, school coordinators, and family visitors at Recreation Yard.
            </p>
          </div>
        </div>
      </UContainer>
    </div>

    <div class="sticky top-[var(--ui-header-height,4rem)] z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-none sm:shadow-xs transition-all">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-3 sm:gap-4">
          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            Published Feedback: <span class="text-lime-600 dark:text-lime-400 font-extrabold text-sm">{{ testimonials?.length || 0 }}</span>
          </span>

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
      </UContainer>
    </div>

    <UContainer class="pt-4 sm:pt-8 px-3 sm:px-6 lg:px-8">
      <div
        v-if="viewMode === 'grid' && hasAnyTestimonial"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
      >
        <NuxtLink
          v-for="testimonial in testimonials"
          :key="testimonial.path"
          :to="testimonial.path"
          class="group flex flex-col justify-between p-0 sm:p-5 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-4 sm:pb-0"
        >
          <div class="space-y-2.5 sm:space-y-3">
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

          <div class="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-3">
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

      <div
        v-else-if="viewMode === 'list' && hasAnyTestimonial"
        class="space-y-3 sm:space-y-4 w-full"
      >
        <NuxtLink
          v-for="testimonial in testimonials"
          :key="testimonial.path"
          :to="testimonial.path"
          class="group block p-0 sm:p-5 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0 border-b border-neutral-200/60 dark:border-neutral-800/60 sm:border-b-0 pb-4 sm:pb-0"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
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

      <div v-else class="py-12 sm:py-20 text-center space-y-4 max-w-md mx-auto">
        <div class="flex size-14 sm:size-16 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-message-off" class="size-7 sm:size-8 text-neutral-400 dark:text-neutral-500" />
        </div>
        <div class="space-y-1">
          <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
            No Testimonials Found
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            There are currently no visitor reviews or testimonials listed. Check back later or contact us to share your experience.
          </p>
        </div>
        <div class="pt-2 flex items-center justify-center gap-3">
          <UButton
            to="/contact"
            size="sm"
            color="primary"
            icon="i-tabler-mail"
            class="rounded-md font-bold text-xs px-4 py-2 text-neutral-950 cursor-pointer"
          >
            Contact Us
          </UButton>
          <UButton
            to="/"
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-home"
            class="rounded-md font-bold text-xs px-4 py-2 cursor-pointer"
          >
            Return Home
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
