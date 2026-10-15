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
    <UContainer v-if="testimonial" class="space-y-8">
      <!-- Back Link -->
      <div>
        <NuxtLink
          to="/testimonials"
          class="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
          <UIcon name="i-tabler-arrow-left" class="size-4" />
          <span>Back to All Testimonials</span>
        </NuxtLink>
      </div>

      <!-- Testimonial Card -->
      <div class="p-6 sm:p-8 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs space-y-6">
        <div class="flex items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
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

        <!-- Quote -->
        <blockquote class="text-base sm:text-xl font-medium italic text-neutral-900 dark:text-white leading-relaxed">
          “{{ testimonial.comment }}”
        </blockquote>

        <div v-if="testimonial.body" class="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed pt-2">
          <ContentRenderer :value="testimonial" />
        </div>

        <!-- Author Profile Footer -->
        <div class="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <NuxtImg
            v-if="testimonial.avatar"
            :src="testimonial.avatar"
            :alt="testimonial.author"
            width="48"
            height="48"
            class="size-12 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
          />
          <div v-else class="flex size-12 shrink-0 items-center justify-center rounded-md bg-lime-500/10 font-black text-lime-600 dark:text-lime-400 text-sm">
            {{ testimonial.author.charAt(0) }}
          </div>

          <div class="min-w-0 flex-1">
            <h1 class="text-sm sm:text-base font-black text-neutral-950 dark:text-white truncate">
              {{ testimonial.author }}
            </h1>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {{ testimonial.role }}
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-4 flex flex-wrap items-center justify-between gap-4">
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
