<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'

const { getCollection } = useContentQuery()

// View mode state ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

// Fetch featured facilities from Nuxt Content
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
  <section class="space-y-6">
    <!-- Section Header with View Mode Controls -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-default pb-5">
      <div>
        <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-xs mb-2">
          Recreation Yard Kericho
        </UBadge>
        <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-highlighted">
          A green space for shared experiences
        </h2>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <!-- View Toggle Control Group -->
        <div class="flex items-center p-1 rounded-sm bg-elevated border border-default" role="group" aria-label="View mode">
          <UButton
            size="xs"
            :color="viewMode === 'grid' ? 'primary' : 'neutral'"
            :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
            icon="i-tabler-layout-grid"
            aria-label="Grid View"
            :aria-pressed="viewMode === 'grid'"
            class="min-h-11 min-w-11 cursor-pointer justify-center rounded-lg font-bold"
            @click="viewMode = 'grid'"
          />
          <UButton
            size="xs"
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            :variant="viewMode === 'list' ? 'solid' : 'ghost'"
            icon="i-tabler-list"
            aria-label="List View"
            :aria-pressed="viewMode === 'list'"
            class="min-h-11 min-w-11 cursor-pointer justify-center rounded-lg font-bold"
            @click="viewMode = 'list'"
          />
        </div>

        <UButton
          to="/facilities"
          color="neutral"
          variant="ghost"
          icon="i-tabler-arrow-right"
          trailing
          class="font-bold uppercase text-xs tracking-wider"
        >
          Explore our services
        </UButton>
      </div>
    </div>

    <!-- Grid View Option -->
    <div
      v-if="viewMode === 'grid' && featuredFacilities?.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8"
    >
      <NuxtLink
        v-for="facility in featuredFacilities"
        :key="facility.id || facility.path"
        :to="facility.path"
        class="group flex flex-col justify-between transition-all duration-300"
      >
        <div class="space-y-3">
          <div class="relative aspect-4/3  overflow-hidden border border-default bg-elevated">
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
              class="flex size-full items-center justify-center bg-primary/10 text-primary"
            >
              <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-10" />
            </div>

            <UBadge
              v-if="facility.badge"
              color="primary"
              variant="soft"
              class="absolute top-2.5 left-2.5 font-bold rounded-lg px-2 py-0.5 text-[10px] uppercase backdrop-blur-md"
            >
              {{ facility.badge }}
            </UBadge>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between text-[10px] font-bold text-muted">
              <span v-if="facility.capacity" class="flex items-center gap-1">
                <UIcon name="i-tabler-users" class="size-3.5 text-primary" /> Cap: {{ facility.capacity }}
              </span>
              <span v-if="facility.pricing?.rate" class="text-highlighted font-extrabold text-xs">
                {{ facility.pricing.rate }}
              </span>
            </div>

            <h3 class="text-base font-extrabold text-highlighted group-hover:text-primary transition-colors line-clamp-1">
              {{ facility.title }}
            </h3>

            <p class="text-xs text-muted line-clamp-2 leading-relaxed">
              {{ facility.description }}
            </p>
          </div>
        </div>

        <div class="pt-3 mt-3 border-t border-default flex items-center justify-between">
          <span class="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Learn more
          </span>
          <UIcon name="i-tabler-arrow-right" class="size-4 text-muted group-hover:text-primary transition-colors" />
        </div>
      </NuxtLink>
    </div>

    <!-- Flat List Row View Option -->
    <div
      v-else-if="viewMode === 'list' && featuredFacilities?.length"
      class="divide-y divide-default dark:divide-default"
    >
      <NuxtLink
        v-for="facility in featuredFacilities"
        :key="facility.id || facility.path"
        :to="facility.path"
        class="group py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-colors"
      >
        <!-- Image & Description -->
        <div class="flex items-start gap-4 min-w-0 flex-1">
          <div class="shrink-0">
            <NuxtImg
              v-if="getImageSrc(facility)"
              :src="getImageSrc(facility)"
              :alt="facility.title"
              format="webp"
              quality="80"
              loading="lazy"
              class="size-20 sm:size-24 rounded-sm object-cover border border-default group-hover:scale-105 transition-transform duration-300"
            />
            <div
              v-else
              class="flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary border border-default"
            >
              <UIcon :name="facility.icon || 'i-tabler-trees'" class="size-8" />
            </div>
          </div>

          <div class="space-y-1.5 min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2 text-[10px]">
              <UBadge v-if="facility.badge" color="primary" variant="soft" class="font-bold rounded px-1.5 py-0.5 text-[9px] uppercase">
                {{ facility.badge }}
              </UBadge>
              <span v-if="facility.capacity" class="text-muted font-bold flex items-center gap-1">
                <UIcon name="i-tabler-users" class="size-3.5 text-primary" /> Cap: {{ facility.capacity }}
              </span>
            </div>

            <h3 class="text-base sm:text-lg font-extrabold text-highlighted group-hover:text-primary transition-colors truncate">
              {{ facility.title }}
            </h3>

            <p class="text-xs text-muted line-clamp-2 leading-relaxed max-w-2xl">
              {{ facility.description }}
            </p>
          </div>
        </div>

        <!-- Rate & Link Arrow -->
        <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 shrink-0">
          <div v-if="facility.pricing" class="text-left sm:text-right">
            <span class="text-[10px] font-bold uppercase tracking-wider text-muted block">Rate</span>
            <span class="text-sm font-extrabold text-highlighted">
              {{ facility.pricing.rate }}
              <span v-if="facility.pricing.unit" class="text-[10px] font-normal text-muted">/ {{ facility.pricing.unit }}</span>
            </span>
          </div>

          <UButton
            :to="facility.path"
            color="primary"
            size="sm"
            icon="i-tabler-arrow-right"
            trailing
            class="font-black uppercase text-xs text-highlighted rounded-sm px-4 py-2"
          >
            Explore
          </UButton>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
