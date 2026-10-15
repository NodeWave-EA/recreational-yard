<script setup lang="ts">
export interface HeroSlide {
  id: string
  title: string
  tagline: string
  image: string
  icon: string
  path: string
}

// Slide switch interval for punchy auto-looping (6 seconds)
const AUTO_SWITCH_INTERVAL_MS = 6000

const slides: HeroSlide[] = [
  {
    id: 'recreation-yard-kericho',
    title: 'Recreation Yard Kericho',
    tagline: 'Green Space for Lawn Games & Recreation',
    image: '/images/archery.jpg',
    icon: 'i-tabler-trees',
    path: '/facilities',
  },
  {
    id: 'recreation-yard-runners',
    title: 'Recreation Yard Runners',
    tagline: 'Run. Jog. Walk. Enjoy the Journey',
    image: '/images/tennis.jpg',
    icon: 'i-tabler-run',
    path: '/events',
  },
  {
    id: 'sports-merchandise',
    title: 'Sports Kits & Merchandise',
    tagline: 'Running Apparel, Team Uniforms & Gear',
    image: '/images/kericho-landscape.jpg',
    icon: 'i-tabler-shirt-sport',
    path: '/shop',
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
  <section class="relative min-h-[calc(100vh-var(--ui-header-height,4rem))] w-full flex flex-col justify-between bg-neutral-950 text-white overflow-hidden transition-colors duration-300">
    <!-- Clean Background Image (Zero Overlay Gradients) -->
    <div class="absolute inset-0 h-full w-full overflow-hidden pointer-events-none z-0">
      <Transition name="fade" mode="out-in">
        <NuxtImg
          :key="activeSlide?.image"
          :src="activeSlide?.image"
          :alt="activeSlide?.title"
          width="1920"
          height="1080"
          sizes="100vw"
          format="avif,webp"
          quality="90"
          loading="eager"
          preload
          fetchpriority="high"
          class="absolute inset-0 h-full w-full object-cover object-center"
        />
      </Transition>
    </div>

    <!-- Main Hero Content Stage -->
    <div class="relative z-10 flex-1 flex items-center py-8 sm:py-12 lg:py-16">
      <UContainer class="w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <!-- Left Main Hero Text Column -->
          <div class="lg:col-span-6 space-y-4 text-left">
            <div class="inline-flex max-w-full">
              <UBadge
                color="primary"
                variant="soft"
                class="font-bold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-md border border-lime-500/40 backdrop-blur-md"
              >
                <UIcon name="i-tabler-map-pin" class="size-3.5 sm:size-4 mr-1.5 text-lime-400 shrink-0" />
                <span class="truncate">
                  MOVE. PLAY. CONNECT. THRIVE.
                </span>
              </UBadge>
            </div>

            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase leading-tight sm:leading-[1.1] drop-shadow-lg">
              Recreation, sport and shared experiences.
              <span class="block text-lime-400">
                Built for active living
              </span>
            </h1>

            <p class="max-w-xl text-xs sm:text-sm text-white leading-relaxed font-semibold drop-shadow-md">
              Recreation Yard Limited brings together outdoor recreation, running and walking, sports merchandise, and group experiences at Kooma along the Kericho–Kisumu Highway. Come to move, play, connect, relax and thrive.
            </p>

            <!-- CTA Action Buttons -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 pt-2">
              <UButton
                size="md"
                color="primary"
                to="/pricing"
                icon="i-tabler-ticket"
                class="w-full sm:w-auto font-black uppercase text-xs text-neutral-950 px-6 py-3 rounded-md shadow-md cursor-pointer transition-all justify-center"
              >
                Plan Your Visit
              </UButton>

              <UButton
                size="md"
                color="neutral"
                variant="outline"
                to="/facilities"
                icon="i-tabler-trees"
                class="w-full sm:w-auto font-black uppercase text-xs rounded-md px-6 py-3 backdrop-blur-md cursor-pointer justify-center border-white/60 text-white hover:border-lime-500"
              >
                Explore Recreation
              </UButton>
            </div>

            <!-- Mobile-Only Auto-Loop Progress Indicators (< 1024px) -->
            <div class="flex lg:hidden items-center gap-2 pt-4">
              <button
                v-for="(_, idx) in slides"
                :key="idx"
                class="h-1.5 flex-1 rounded-md transition-all duration-300 cursor-pointer"
                :class="[activeIndex === idx ? 'bg-lime-400' : 'bg-white/50']"
                :aria-label="`Switch to slide ${idx + 1}`"
                @click="selectSlide(idx)"
              />
            </div>
          </div>

          <!-- Right Column: Interactive Image Cards (DESKTOP ONLY - hidden lg:block) -->
          <div class="hidden lg:block lg:col-span-6 relative">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 h-82.5 sm:h-90 items-center">
              <!-- Slide 1 Card -->
              <NuxtLink
                :to="slides[0].path"
                class="sm:col-span-6 h-full relative group/card cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-300 shadow-xl bg-neutral-900"
                :class="[
                  activeIndex === 0
                    ? 'border-lime-500 ring-2 ring-lime-500/40 scale-[1.02] z-20'
                    : 'border-white/30 hover:border-lime-500 opacity-90 hover:opacity-100 z-10',
                ]"
                @mouseenter="selectSlide(0)"
              >
                <NuxtImg
                  :src="slides[0]?.image"
                  :alt="slides[0]?.title"
                  width="768"
                  height="1024"
                  sizes="384px"
                  format="avif,webp"
                  quality="85"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                />

                <div class="absolute bottom-3 left-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-950/90 text-white text-[11px] font-bold backdrop-blur-md border border-neutral-800 w-fit">
                  <div class="flex size-5 items-center justify-center rounded-md bg-lime-500/20 text-lime-400">
                    <UIcon :name="slides[0]?.icon" class="size-3.5" />
                  </div>
                  <span class="truncate">{{ slides[0]?.tagline }}</span>
                </div>
              </NuxtLink>

              <!-- Column for Slide 2 and 3 Cards -->
              <div class="sm:col-span-6 flex flex-col gap-4 h-full">
                <NuxtLink
                  :to="slides[1].path"
                  class="relative flex-1 group/card cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-300 shadow-xl bg-neutral-900"
                  :class="[
                    activeIndex === 1
                      ? 'border-lime-500 ring-2 ring-lime-500/40 scale-[1.02] z-20'
                      : 'border-white/30 hover:border-lime-500 opacity-90 hover:opacity-100 z-10',
                  ]"
                  @mouseenter="selectSlide(1)"
                >
                  <NuxtImg
                    :src="slides[1]?.image"
                    :alt="slides[1]?.title"
                    width="1024"
                    height="768"
                    sizes="384px"
                    format="avif,webp"
                    quality="85"
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                  />

                  <div class="absolute bottom-2.5 left-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-950/90 text-white text-[11px] font-bold backdrop-blur-md border border-neutral-800 w-fit">
                    <div class="flex size-5 items-center justify-center rounded-md bg-lime-500/20 text-lime-400">
                      <UIcon :name="slides[1]?.icon" class="size-3.5" />
                    </div>
                    <span class="truncate">{{ slides[1]?.tagline }}</span>
                  </div>
                </NuxtLink>

                <NuxtLink
                  :to="slides[2].path"
                  class="relative flex-1 group/card cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-300 shadow-xl bg-neutral-900"
                  :class="[
                    activeIndex === 2
                      ? 'border-lime-500 ring-2 ring-lime-500/40 scale-[1.02] z-20'
                      : 'border-white/30 hover:border-lime-500 opacity-90 hover:opacity-100 z-10',
                  ]"
                  @mouseenter="selectSlide(2)"
                >
                  <NuxtImg
                    :src="slides[2]?.image"
                    :alt="slides[2]?.title"
                    width="1024"
                    height="768"
                    sizes="384px"
                    format="avif,webp"
                    quality="85"
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                  />

                  <div class="absolute bottom-2.5 left-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-950/90 text-white text-[11px] font-bold backdrop-blur-md border border-neutral-800 w-fit">
                    <div class="flex size-5 items-center justify-center rounded-md bg-lime-500/20 text-lime-400">
                      <UIcon :name="slides[2]?.icon" class="size-3.5" />
                    </div>
                    <span class="truncate">{{ slides[2]?.tagline }}</span>
                  </div>
                </NuxtLink>
              </div>
            </div>

            <!-- Desktop Slide Switch Progress Dots -->
            <div class="flex items-center justify-end gap-2 pt-4">
              <button
                v-for="(_, idx) in slides"
                :key="idx"
                class="h-1.5 rounded-md transition-all duration-300 cursor-pointer"
                :class="[activeIndex === idx ? 'w-8 bg-lime-400' : 'w-2 bg-white/50 hover:bg-white/80']"
                :aria-label="`Switch to slide ${idx + 1}`"
                @click="selectSlide(idx)"
              />
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Highlights Bar Cards -->
    <div class="relative z-10 border-t border-b border-white/10 bg-neutral-950/80 backdrop-blur-md py-6">
      <UContainer class="w-full">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Outdoor Zones -->
          <NuxtLink
            to="/facilities"
            class="group p-4 rounded-md border border-white/10 bg-neutral-900/80 hover:border-lime-500 transition-all duration-300 shadow-xs flex items-start gap-4"
          >
            <div class="flex size-11 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-400 group-hover:bg-lime-500 group-hover:text-neutral-950 transition-colors">
              <UIcon name="i-tabler-trees" class="size-6" />
            </div>
            <div>
              <h3 class="text-sm font-black text-white uppercase tracking-wide group-hover:text-lime-400 transition-colors">
                Recreation and shared experiences
              </h3>
              <p class="text-xs text-neutral-300 mt-1 leading-relaxed font-medium">
                Lawn games, picnics, social activities and group recreation in a welcoming outdoor setting.
              </p>
            </div>
          </NuxtLink>

          <!-- Opening Hours -->
          <NuxtLink
            to="/pricing"
            class="group p-4 rounded-md border border-white/10 bg-neutral-900/80 hover:border-lime-500 transition-all duration-300 shadow-xs flex items-start gap-4"
          >
            <div class="flex size-11 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-400 group-hover:bg-lime-500 group-hover:text-neutral-950 transition-colors">
              <UIcon name="i-tabler-clock" class="size-6" />
            </div>
            <div>
              <h3 class="text-sm font-black text-white uppercase tracking-wide group-hover:text-lime-400 transition-colors">
                Plan before you visit
              </h3>
              <p class="text-xs text-neutral-300 mt-1 leading-relaxed font-medium">
                Prior booking helps us confirm availability, activities and group arrangements.
              </p>
            </div>
          </NuxtLink>

          <!-- Running & Active Living -->
          <NuxtLink
            to="/events"
            class="group p-4 rounded-md border border-white/10 bg-neutral-900/80 hover:border-lime-500 transition-all duration-300 shadow-xs flex items-start gap-4"
          >
            <div class="flex size-11 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-400 group-hover:bg-lime-500 group-hover:text-neutral-950 transition-colors">
              <UIcon name="i-tabler-plant" class="size-6" />
            </div>
            <div>
              <h3 class="text-sm font-black text-white uppercase tracking-wide group-hover:text-lime-400 transition-colors">
                Running and active living
              </h3>
              <p class="text-xs text-neutral-300 mt-1 leading-relaxed font-medium">
                Physical and virtual running, jogging and walking through Recreation Yard Runners.
              </p>
            </div>
          </NuxtLink>
        </div>
      </UContainer>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
