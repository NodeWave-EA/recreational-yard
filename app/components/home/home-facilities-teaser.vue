<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'

const { getCollection } = useContentQuery()

const viewMode = ref<'grid' | 'list'>('grid')

const { data: featuredFacilities } = await getCollection('home-facilities', 'facilities', {
  limit: 4,
  sort: [{ key: 'order', order: 'ASC' }],
})

function getImageSrc(item: any) {
  if (typeof item.coverImage === 'string')
    return item.coverImage
  if (item.coverImage?.src)
    return item.coverImage.src
  return ''
}
</script>

<template>
  <section class="space-y-4 sm:space-y-6 w-full">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-3 sm:pb-5 px-0">
      <div>
        <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-1 sm:mb-2 rounded-md">
          Recreation Yard Kericho
        </UBadge>
        <h2 class="text-xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
          A green space for shared experiences
        </h2>
      </div>

      <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full sm:w-auto">
        <div class="flex items-center p-1 rounded-md bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <UButton
            size="xs"
            :color="viewMode === 'grid' ? 'primary' : 'neutral'"
            :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
            icon="i-tabler-layout-grid"
            aria-label="Grid View"
            class="rounded-md font-bold cursor-pointer"
            @click="viewMode = 'grid'"
          />
          <UButton
            size="xs"
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            :variant="viewMode === 'list' ? 'solid' : 'ghost'"
            icon="i-tabler-list"
            aria-label="List View"
            class="rounded-md font-bold cursor-pointer"
            @click="viewMode = 'list'"
          />
        </div>

        <UButton
          to="/facilities"
          color="neutral"
          variant="ghost"
          icon="i-tabler-arrow-right"
          trailing
          class="font-bold uppercase text-xs tracking-wider cursor-pointer"
        >
          Explore services
        </UButton>
      </div>
    </div>

    <div
      v-if="viewMode === 'grid' && featuredFacilities?.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full"
    >
      <NuxtLink
        v-for="facility in featuredFacilities"
        :key="facility.id || facility.path"
        :to="facility.path"
        class="group flex flex-col justify-between p-0 sm:p-4 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0"
      >
        <div class="space-y-2.5 sm:space-y-3">
          <div class="relative aspect-4/3 rounded-md overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-100 dark:bg-neutral-900">
            <NuxtImg
              v-if="getImageSrc(facility)"
              :src="getImageSrc(facility)"
              :alt="facility.title"
              format="webp"
              quality="80"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              v-else
              class="flex size-full items-center justify-center bg-lime-500/10 text-lime-600 dark:text-lime-400"
            >
              <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-10" />
            </div>

            <UBadge
              v-if="facility.badge"
              color="primary"
              variant="soft"
              class="absolute top-2 left-2 font-bold rounded-md px-2 py-0.5 text-[10px] uppercase backdrop-blur-md"
            >
              {{ facility.badge }}
            </UBadge>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between text-[10px] font-bold text-neutral-500">
              <span v-if="facility.capacity" class="flex items-center gap-1">
                <UIcon name="i-tabler-users" class="size-3.5 text-lime-500" /> Cap: {{ facility.capacity }}
              </span>
              <span v-if="facility.pricing?.rate" class="text-neutral-950 dark:text-white font-extrabold text-xs">
                {{ facility.pricing.rate }}
              </span>
            </div>

            <h3 class="text-base font-extrabold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
              {{ facility.title }}
            </h3>

            <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
              {{ facility.description }}
            </p>
          </div>
        </div>

        <div class="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-bold text-lime-600 dark:text-lime-400">
          <span>Explore Service</span>
          <UIcon name="i-tabler-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>
    </div>

    <div
      v-else-if="viewMode === 'list' && featuredFacilities?.length"
      class="space-y-3 w-full"
    >
      <NuxtLink
        v-for="facility in featuredFacilities"
        :key="facility.id || facility.path"
        :to="facility.path"
        class="group block p-0 sm:p-5 rounded-none sm:rounded-md border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 bg-transparent sm:bg-white sm:dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs hover:shadow-md w-full min-w-0"
      >
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div class="flex items-start gap-3 sm:gap-4 min-w-0 flex-1 w-full">
            <div class="shrink-0">
              <NuxtImg
                v-if="getImageSrc(facility)"
                :src="getImageSrc(facility)"
                :alt="facility.title"
                format="webp"
                quality="80"
                loading="lazy"
                class="size-16 sm:size-24 rounded-md object-cover border border-neutral-200 dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="flex size-16 sm:size-24 shrink-0 items-center justify-center rounded-md bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800"
              >
                <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-7 sm:size-8" />
              </div>
            </div>

            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 text-[10px]">
                <UBadge v-if="facility.badge" color="primary" variant="soft" class="font-bold rounded-md px-1.5 py-0.5 text-[9px] uppercase">
                  {{ facility.badge }}
                </UBadge>
                <span v-if="facility.capacity" class="text-neutral-500 font-bold flex items-center gap-1">
                  <UIcon name="i-tabler-users" class="size-3.5 text-lime-500" /> Cap: {{ facility.capacity }}
                </span>
              </div>

              <h3 class="text-sm sm:text-lg font-extrabold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                {{ facility.title }}
              </h3>

              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                {{ facility.description }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 shrink-0">
            <div v-if="facility.pricing" class="text-left sm:text-right">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Rate</span>
              <span class="text-xs sm:text-sm font-extrabold text-neutral-950 dark:text-white">
                {{ facility.pricing.rate }}
                <span v-if="facility.pricing.unit" class="text-[10px] font-normal text-neutral-400">/ {{ facility.pricing.unit }}</span>
              </span>
            </div>

            <span class="inline-flex items-center gap-1 font-black uppercase text-xs text-neutral-950 dark:text-white bg-lime-500 group-hover:bg-lime-400 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md transition-colors">
              <span>Explore</span>
              <UIcon name="i-tabler-arrow-right" class="size-4" />
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
