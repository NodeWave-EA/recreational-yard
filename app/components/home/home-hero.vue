<script setup lang="ts">
import { NAVIGATION_LINKS } from '~/utils/site-data'

export interface HeroSlide {
  id: string
  title: string
  tagline: string
  image: string
  icon: string
  shapeClass: string
  transformClass: string
}

// slide switch interval (30 seconds)
const AUTO_SWITCH_INTERVAL_MS = 30000

const slides: HeroSlide[] = [
  {
    id: 'archery',
    title: 'Target Archery',
    tagline: 'Take your best shot',
    image: '/images/archery.jpg',
    icon: 'i-tabler-target-arrow',
    shapeClass: 'rounded-t-[3.5rem] rounded-b-2xl',
    transformClass: '-rotate-1 hover:rotate-0 translate-y-1',
  },
  {
    id: 'tennis',
    title: 'Lawn Tennis',
    tagline: 'Play on the lawn',
    image: '/images/tennis.jpg',
    icon: 'i-tabler-ball-tennis',
    shapeClass: 'rounded-br-[3.5rem] rounded-tl-[2.5rem] rounded-tr-2xl rounded-bl-xl',
    transformClass: 'rotate-2 hover:rotate-0 -translate-y-1',
  },
  {
    id: 'landscape',
    title: 'Tea Estate Trail',
    tagline: 'Breathe in Kericho',
    image: '/images/kericho-landscape.jpg',
    icon: 'i-tabler-trees',
    shapeClass: 'rounded-tr-[3.5rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-2xl',
    transformClass: '-rotate-2 hover:rotate-0 translate-y-2',
  },
]

const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const activeSlide = computed(() => slides[activeIndex.value] || slides[0])

function selectSlide(index: number) {
  activeIndex.value = index
  resetTimer()
}

function nextSlide() {
  activeIndex.value = (activeIndex.value + 1) % slides.length
}

function startTimer() {
  if (import.meta.client) {
    timer = setInterval(nextSlide, AUTO_SWITCH_INTERVAL_MS)
  }
}

function resetTimer() {
  if (timer) {
    clearInterval(timer)
    startTimer()
  }
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timer)
    clearInterval(timer)
})
</script>

<template>
  <section class="relative min-h-[calc(100vh-var(--ui-header-height,4rem))] w-full flex flex-col justify-between bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white overflow-hidden transition-colors duration-300">
    <!-- Full-Width & Full-Height Background Image Layer -->
    <div class="absolute inset-0 h-full w-full overflow-hidden pointer-events-none z-0">
      <Transition name="fade">
        <NuxtImg
          :key="activeSlide.image"
          :src="activeSlide.image"
          :alt="activeSlide.title"
          format="webp"
          quality="85"
          loading="eager"
          class="absolute inset-0 h-full w-full object-cover object-center opacity-65 dark:opacity-75 scale-105 transition-all duration-700"
        />
      </Transition>

      <!-- Directional Gradient Overlay Mask for High Contrast Text Legibility -->
      <div class="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-40% to-white/10 dark:from-neutral-950 dark:via-neutral-950/80 dark:via-40% dark:to-neutral-950/15" />
      <div class="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/30 dark:from-neutral-950/90 dark:via-transparent dark:to-neutral-950/30" />
    </div>

    <!-- Main Hero Split Content -->
    <div class="relative z-10 flex-1 flex items-center py-6 sm:py-8 lg:py-10">
      <UContainer class="w-full max-w-7xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <!-- Left Column -->
          <div class="lg:col-span-6 space-y-3 sm:space-y-4 text-left">
            <!-- Badge -->
            <div class="inline-flex max-w-full">
              <UBadge
                color="primary"
                variant="soft"
                class="font-bold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-full border border-lime-500/30 backdrop-blur-md"
              >
                <UIcon name="i-tabler-map-pin" class="size-3.5 sm:size-4 mr-1.5 text-lime-600 dark:text-lime-400 shrink-0" />
                <span class="truncate">
                  Escape the routine. Step into the fresh air.
                </span>
              </UBadge>
            </div>

            <!-- Headline -->
            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-tight sm:leading-[1.1]">
              Good Games. Fresh Air. Great Company.
              <span class="block bg-gradient-to-r from-lime-500 to-emerald-600 dark:from-lime-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Fun for All Ages
              </span>
            </h1>

            <!-- Description -->
            <p class="max-w-xl text-xs sm:text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed font-medium">
              Whether you are here to challenge your friends to a game on the grass tennis courts, find your focus at the archery range, or fire up the BBQ under a shaded gazebo, we have got a spot on the lawn waiting for you.
            </p>

            <!-- CTA Action Buttons -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2.5 sm:gap-3.5 pt-1">
              <UButton
                size="md"
                color="primary"
                :to="NAVIGATION_LINKS.pricing?.to"
                icon="i-tabler-ticket"
                class="w-full sm:w-auto font-black uppercase text-xs text-neutral-950 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-md hover:shadow-lime-500/25 transition-all justify-center"
              >
                Get Your Pass
              </UButton>

              <UButton
                size="md"
                color="neutral"
                variant="outline"
                :to="NAVIGATION_LINKS.facilities?.to"
                icon="i-tabler-trees"
                class="w-full sm:w-auto font-black uppercase text-xs rounded-xl px-5 py-2.5 sm:px-6 sm:py-3 backdrop-blur-md justify-center"
              >
                Explore Facilities
              </UButton>
            </div>
          </div>

          <!-- Right Column -->
          <div class="lg:col-span-6 relative">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 h-[330px] sm:h-[360px] items-center">
              <!-- Card 1 -->
              <div
                class="sm:col-span-6 h-full relative group/card cursor-pointer overflow-hidden transition-all duration-500 border-2 shadow-2xl backdrop-blur-xs"
                :class="[
                  slides[0].shapeClass,
                  slides[0].transformClass,
                  activeIndex === 0
                    ? 'border-lime-500 dark:border-lime-400 ring-4 ring-lime-500/40 dark:ring-lime-400/40 scale-[1.03] z-20'
                    : 'border-white/40 dark:border-white/20 hover:border-lime-500/60 opacity-85 hover:opacity-100 z-10',
                ]"
                @click="selectSlide(0)"
              >
                <NuxtImg
                  :src="slides[0].image"
                  :alt="slides[0].title"
                  format="webp"
                  quality="80"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />

                <!-- Recreation Pill Caption -->
                <div class="absolute bottom-3 left-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 text-white text-[11px] font-bold backdrop-blur-md shadow-lg border border-white/15 w-fit">
                  <div class="flex size-5 items-center justify-center rounded-full bg-lime-500/20 text-lime-400">
                    <UIcon :name="slides[0].icon" class="size-3.5" />
                  </div>
                  <span class="truncate">{{ slides[0].tagline }}</span>
                </div>
              </div>

              <!-- Right Column -->
              <div class="sm:col-span-6 flex flex-col gap-4 h-full">
                <!-- Card 2 -->
                <div
                  class="relative flex-1 group/card cursor-pointer overflow-hidden transition-all duration-500 border-2 shadow-2xl backdrop-blur-xs"
                  :class="[
                    slides[1].shapeClass,
                    slides[1].transformClass,
                    activeIndex === 1
                      ? 'border-lime-500 dark:border-lime-400 ring-4 ring-lime-500/40 dark:ring-lime-400/40 scale-[1.03] z-20'
                      : 'border-white/40 dark:border-white/20 hover:border-lime-500/60 opacity-85 hover:opacity-100 z-10',
                  ]"
                  @click="selectSlide(1)"
                >
                  <NuxtImg
                    :src="slides[1].image"
                    :alt="slides[1].title"
                    format="webp"
                    quality="80"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />

                  <!-- Recreation Pill Caption -->
                  <div class="absolute bottom-2.5 left-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 text-white text-[11px] font-bold backdrop-blur-md shadow-lg border border-white/15 w-fit">
                    <div class="flex size-5 items-center justify-center rounded-full bg-lime-500/20 text-lime-400">
                      <UIcon :name="slides[1].icon" class="size-3.5" />
                    </div>
                    <span class="truncate">{{ slides[1].tagline }}</span>
                  </div>
                </div>

                <!-- Card 3 -->
                <div
                  class="relative flex-1 group/card cursor-pointer overflow-hidden transition-all duration-500 border-2 shadow-2xl backdrop-blur-xs"
                  :class="[
                    slides[2].shapeClass,
                    slides[2].transformClass,
                    activeIndex === 2
                      ? 'border-lime-500 dark:border-lime-400 ring-4 ring-lime-500/40 dark:ring-lime-400/40 scale-[1.03] z-20'
                      : 'border-white/40 dark:border-white/20 hover:border-lime-500/60 opacity-85 hover:opacity-100 z-10',
                  ]"
                  @click="selectSlide(2)"
                >
                  <NuxtImg
                    :src="slides[2].image"
                    :alt="slides[2].title"
                    format="webp"
                    quality="80"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />

                  <!-- Recreation Pill Caption -->
                  <div class="absolute bottom-2.5 left-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 text-white text-[11px] font-bold backdrop-blur-md shadow-lg border border-white/15 w-fit">
                    <div class="flex size-5 items-center justify-center rounded-full bg-lime-500/20 text-lime-400">
                      <UIcon :name="slides[2].icon" class="size-3.5" />
                    </div>
                    <span class="truncate">{{ slides[2].tagline }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide Switch Progress Dots -->
            <div class="flex items-center justify-center lg:justify-end gap-2 pt-4">
              <button
                v-for="(_, idx) in slides"
                :key="idx"
                class="h-1.5 rounded-full transition-all duration-300"
                :class="[activeIndex === idx ? 'w-6 bg-lime-500 dark:bg-lime-400' : 'w-1.5 bg-neutral-400/50 dark:bg-white/30 hover:bg-neutral-600 dark:hover:bg-white/60']"
                :aria-label="`Switch to slide ${idx + 1}`"
                @click="selectSlide(idx)"
              />
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Highlights Bar -->
    <div class="relative z-10 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md py-5 sm:py-6">
      <UContainer class="max-w-5xl">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <!-- Outdoor Zones -->
          <div class="flex items-start gap-4">
            <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400">
              <UIcon name="i-tabler-trees" class="size-6" />
            </div>
            <div>
              <h3 class="text-sm font-black text-neutral-950 dark:text-white uppercase tracking-wide">
                8+ Outdoor Zones
              </h3>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Grass lawn tennis, target archery, jogging trails, and private BBQ gazebos.
              </p>
            </div>
          </div>

          <!-- Opening Hours -->
          <div class="flex items-start gap-4 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 pt-5 md:pt-0 md:pl-8">
            <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400">
              <UIcon name="i-tabler-clock" class="size-6" />
            </div>
            <div>
              <h3 class="text-sm font-black text-neutral-950 dark:text-white uppercase tracking-wide">
                Open Daily 7:30 AM - 6:00 PM
              </h3>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Casual walk-ins welcome daily alongside instant online court reservations.
              </p>
            </div>
          </div>

          <!-- Highland Views -->
          <div class="flex items-start gap-4 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 pt-5 md:pt-0 md:pl-8">
            <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400">
              <UIcon name="i-tabler-plant" class="size-6" />
            </div>
            <div>
              <h3 class="text-sm font-black text-neutral-950 dark:text-white uppercase tracking-wide">
                Highland Views
              </h3>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Relax with fresh air and scenic views across surrounding Kericho tea gardens.
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
