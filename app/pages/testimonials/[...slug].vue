<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { CONTACTS, LOCATION_DETAILS } from '~/utils/site-data'

const route = useRoute()
const { getByPath } = useContentQuery()

const { data: testimonial } = await getByPath(
  `testimonial-${route.path}`,
  'testimonials',
  route.path,
  { enableLogging: false },
)

if (!testimonial.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Testimonial Not Found',
    fatal: true,
  })
}

useSeoMeta({
  title: `${testimonial.value.author}'s Review | Testimonials | ${LOCATION_DETAILS.company}`,
  description: testimonial.value.comment,
  ogTitle: `${testimonial.value.author}'s Review | ${LOCATION_DETAILS.company}`,
  ogDescription: testimonial.value.comment,
})
</script>

<template>
  <div class="py-4 sm:py-12 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen transition-colors duration-300 w-full overflow-x-clip">
    <UContainer v-if="testimonial" class="space-y-6 sm:space-y-8 px-3 sm:px-6 lg:px-8">
      <div>
        <NuxtLink
          to="/testimonials"
          class="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
          <UIcon name="i-tabler-arrow-left" class="size-4" />
          <span>Back to All Testimonials</span>
        </NuxtLink>
      </div>

      <div class="p-0 sm:p-8 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs space-y-4 sm:space-y-6">
        <div class="flex items-center justify-between gap-3 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3 sm:pb-4">
          <UBadge color="primary" variant="soft" class="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-md">
            {{ testimonial.category }}
          </UBadge>

          <div class="flex items-center gap-1 text-lime-500">
            <UIcon
              v-for="star in (testimonial.rating || 5)"
              :key="star"
              name="i-tabler-star-filled"
              class="size-4"
            />
          </div>
        </div>

        <blockquote class="text-sm sm:text-xl font-medium italic text-neutral-900 dark:text-white leading-relaxed">
          “{{ testimonial.comment }}”
        </blockquote>

        <div v-if="testimonial.body" class="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed pt-2">
          <ContentRenderer :value="testimonial" />
        </div>

        <div class="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80">
          <NuxtImg
            v-if="testimonial.avatar"
            :src="testimonial.avatar"
            :alt="testimonial.author"
            width="48"
            height="48"
            class="size-10 sm:size-12 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
          />
          <div v-else class="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-md bg-lime-500/10 font-black text-lime-600 dark:text-lime-400 text-xs sm:text-sm">
            {{ testimonial.author.charAt(0) }}
          </div>

          <div class="min-w-0 flex-1">
            <h1 class="text-xs sm:text-base font-black text-neutral-950 dark:text-white truncate">
              {{ testimonial.author }}
            </h1>
            <p class="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {{ testimonial.role }}
            </p>
          </div>
        </div>
      </div>

      <div class="pt-2 sm:pt-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <UButton
          to="/contact"
          color="primary"
          size="md"
          icon="i-tabler-ticket"
          class="font-black uppercase text-xs text-neutral-950 rounded-md px-5 py-2.5 cursor-pointer"
        >
          Book Your Experience
        </UButton>

        <UButton
          :to="`https://wa.me/${CONTACTS.whatsapp}?text=Hello! I would like to inquire about Recreation Yard experiences.`"
          target="_blank"
          color="neutral"
          variant="outline"
          icon="i-tabler-brand-whatsapp"
          class="font-bold text-xs rounded-md px-5 py-2.5 text-emerald-600 dark:text-emerald-400 cursor-pointer"
        >
          Chat with Us
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
