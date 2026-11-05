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
  <div class="py-6 sm:py-12 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen transition-colors duration-300 w-full overflow-x-clip">
    <UContainer v-if="testimonial" class="max-w-3xl space-y-6 sm:space-y-8 px-4 sm:px-6">
      <div>
        <NuxtLink
          to="/testimonials"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
          <UIcon name="i-tabler-arrow-left" class="size-4" />
          <span>Back to All Testimonials</span>
        </NuxtLink>
      </div>

      <article class="space-y-6 sm:space-y-8">
        <header class="flex items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <UBadge color="primary" variant="soft" class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-xs">
            {{ testimonial.category }}
          </UBadge>

          <div class="flex items-center gap-1 text-lime-500" aria-label="Rating score">
            <UIcon
              v-for="star in (testimonial.rating || 5)"
              :key="star"
              name="i-tabler-star-filled"
              class="size-4 sm:size-5"
            />
          </div>
        </header>

        <blockquote class="text-base sm:text-2xl font-medium italic text-neutral-900 dark:text-white leading-relaxed pl-4 sm:pl-5 border-l-2 border-lime-500 py-1">
          “{{ testimonial.comment }}”
        </blockquote>

        <div v-if="testimonial.body" class="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed pt-2">
          <ContentRenderer :value="testimonial" />
        </div>

        <footer class="flex items-center gap-3.5 sm:gap-4 pt-4 sm:pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <NuxtImg
            v-if="testimonial.avatar"
            :src="testimonial.avatar"
            :alt="testimonial.author"
            width="52"
            height="52"
            class="size-11 sm:size-13 rounded-xs object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
          />
          <div v-else class="flex size-11 sm:size-13 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 font-black text-lime-600 dark:text-lime-400 text-sm border border-neutral-200/50 dark:border-neutral-800/50">
            {{ testimonial.author.charAt(0) }}
          </div>

          <div class="min-w-0 flex-1">
            <h1 class="text-sm sm:text-lg font-black text-neutral-950 dark:text-white truncate">
              {{ testimonial.author }}
            </h1>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {{ testimonial.role }}
            </p>
          </div>
        </footer>
      </article>

      <section class="pt-6 sm:pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <UButton
          to="/contact"
          color="primary"
          size="md"
          icon="i-tabler-ticket"
          class="font-black uppercase text-xs text-neutral-950 rounded-xs px-5 py-2.5 cursor-pointer justify-center"
        >
          Book Your Experience
        </UButton>

        <UButton
          :to="`https://wa.me/${CONTACTS.whatsapp}?text=Hello! I would like to inquire about Recreation Yard experiences.`"
          target="_blank"
          color="neutral"
          variant="outline"
          icon="i-tabler-brand-whatsapp"
          class="font-bold text-xs rounded-xs px-5 py-2.5 text-emerald-600 dark:text-emerald-400 border border-neutral-200/80 dark:border-neutral-800 cursor-pointer justify-center"
        >
          Chat with Us
        </UButton>
      </section>
    </UContainer>
  </div>
</template>
