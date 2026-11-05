<script setup lang="ts">
import type { PageCollections } from '@nuxt/content'
import type { NormalizedSearchResult } from '~/utils/search-registry'
import { useContentQuery } from '~/composables/useContentQuery'
import {
  normalizeContentItem,
  SEARCH_COLLECTION_CONFIGS,
} from '~/utils/search-registry'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const router = useRouter()
const { getCollection } = useContentQuery()

const viewMode = ref<'grid' | 'list'>('list')
const searchQuery = ref('')
const openSections = ref<Record<string, boolean>>({})

const isOpen = computed({
  get: () => props.open,
  set: val => emit('update:open', val),
})

const collectionResults = ref<Record<string, NormalizedSearchResult[]>>({})

async function loadAllCollections() {
  const promises = SEARCH_COLLECTION_CONFIGS.map(async (config) => {
    const { data } = await getCollection(
      `search-modal-${config.key}`,
      config.key as keyof PageCollections,
      { enableLogging: false },
    )

    const rawItems = (data.value ?? []).map(item => Object.assign({}, item) as unknown as Record<string, unknown>)
    const normalized = rawItems.map(item => normalizeContentItem(item, config.key))

    return { key: config.key, items: normalized }
  })

  const results = await Promise.all(promises)
  const map: Record<string, NormalizedSearchResult[]> = {}

  results.forEach((res) => {
    map[res.key] = res.items
    openSections.value[res.key] = true
  })

  collectionResults.value = map
}

onMounted(() => {
  loadAllCollections()
})

const groupedFilteredResults = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  const grouped: Array<{
    config: typeof SEARCH_COLLECTION_CONFIGS[number]
    items: NormalizedSearchResult[]
  }> = []

  SEARCH_COLLECTION_CONFIGS.forEach((config) => {
    const items = collectionResults.value[config.key] || []
    const filtered = q
      ? items.filter((item) => {
          const titleMatch = item.title.toLowerCase().includes(q)
          const descMatch = item.description.toLowerCase().includes(q)
          const badgeMatch = item.badge.toLowerCase().includes(q)
          const metaMatch = item.meta ? item.meta.toLowerCase().includes(q) : false
          return titleMatch || descMatch || badgeMatch || metaMatch
        })
      : items

    if (filtered.length > 0) {
      grouped.push({ config, items: filtered })
    }
  })

  return grouped
})

const totalMatchCount = computed(() =>
  groupedFilteredResults.value.reduce((acc, g) => acc + g.items.length, 0),
)

function toggleSection(key: string) {
  openSections.value[key] = !openSections.value[key]
}

function handleSelect(path: string) {
  isOpen.value = false
  router.push(path)
}

function navigateToFullSearch() {
  const q = searchQuery.value.trim()
  isOpen.value = false
  router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{
      content: 'sm:max-w-3xl w-[95vw] p-0 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 shadow-none rounded-sm overflow-hidden',
      overlay: 'bg-black/80 backdrop-blur-sm',
    }"
  >
    <template #content>
      <div class="p-4 sm:p-6 space-y-4 text-neutral-900 dark:text-white w-full">
        <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-tabler-search" class="size-5 text-lime-500 shrink-0" />
            <h3 class="font-black text-sm sm:text-base tracking-tight">
              Search Catalog
            </h3>
          </div>

          <div class="flex items-center gap-2 sm:gap-3">
            <div class="flex items-center p-0.5 rounded-xs bg-transparent border border-neutral-200 dark:border-neutral-800 shrink-0">
              <UButton
                size="xs"
                :color="viewMode === 'grid' ? 'primary' : 'neutral'"
                :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
                icon="i-tabler-layout-grid"
                aria-label="Grid View"
                class="rounded-xs font-bold cursor-pointer"
                @click="viewMode = 'grid'"
              />
              <UButton
                size="xs"
                :color="viewMode === 'list' ? 'primary' : 'neutral'"
                :variant="viewMode === 'list' ? 'solid' : 'ghost'"
                icon="i-tabler-list"
                aria-label="List View"
                class="rounded-xs font-bold cursor-pointer"
                @click="viewMode = 'list'"
              />
            </div>

            <span class="hidden sm:inline-flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
              <UKbd class="px-1.5 py-0.5 rounded-xs bg-neutral-200/50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-[10px] font-mono">ESC</UKbd>
            </span>

            <UButton
              color="neutral"
              variant="outline"
              icon="i-tabler-x"
              size="xs"
              class="rounded-xs font-bold text-xs cursor-pointer"
              aria-label="Close search modal"
              @click="isOpen = false"
            >
              Close
            </UButton>
          </div>
        </div>

        <UInput
          v-model="searchQuery"
          icon="i-tabler-search"
          placeholder="Search recreation, running, sports merchandise, events..."
          size="lg"
          color="primary"
          class="w-full rounded-xs"
          autofocus
          clearable
        />

        <div class="max-h-96 overflow-y-auto space-y-4 pr-1">
          <template v-if="groupedFilteredResults.length">
            <div
              v-for="group in groupedFilteredResults"
              :key="group.config.key"
              class="space-y-2.5"
            >
              <button
                type="button"
                class="w-full py-1.5 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
                @click="toggleSection(group.config.key)"
              >
                <div class="flex items-center gap-2">
                  <UIcon :name="group.config.icon" class="size-4 text-lime-500 shrink-0" />
                  <span class="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                    {{ group.config.label }}
                  </span>
                  <UBadge color="primary" variant="soft" size="sm" class="rounded-xs font-bold font-mono text-[10px] px-1.5">
                    {{ group.items.length }}
                  </UBadge>
                </div>

                <UIcon
                  name="i-tabler-chevron-down"
                  class="size-4 text-neutral-400 transition-transform duration-200"
                  :class="{ 'rotate-180 text-lime-500': openSections[group.config.key] }"
                />
              </button>

              <div
                v-if="viewMode === 'grid' && openSections[group.config.key]"
                class="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-transparent grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-neutral-200 dark:divide-neutral-800 w-full"
              >
                <div
                  v-for="item in group.items"
                  :key="item.id"
                  class="group p-3.5 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200 cursor-pointer flex flex-col justify-between w-full min-w-0 border-b last:border-b-0"
                  @click="handleSelect(item.path)"
                >
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-[10px] min-w-0">
                      <UBadge color="neutral" variant="subtle" class="font-bold rounded-xs px-1.5 py-0.5 text-[9px] uppercase border border-neutral-200/60 dark:border-neutral-800/60">
                        {{ item.badge }}
                      </UBadge>
                      <span v-if="item.meta" class="text-neutral-400 font-medium truncate">{{ item.meta }}</span>
                    </div>

                    <h4 class="font-bold text-xs sm:text-sm text-neutral-950 dark:text-white truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                      {{ item.title }}
                    </h4>

                    <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                      {{ item.description }}
                    </p>
                  </div>

                  <div class="pt-2 mt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-bold text-lime-600 dark:text-lime-400">
                    <span>View Details</span>
                    <UIcon name="i-tabler-arrow-right" class="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              <div
                v-else-if="viewMode === 'list' && openSections[group.config.key]"
                class="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-transparent divide-y divide-neutral-200 dark:divide-neutral-800 w-full"
              >
                <div
                  v-for="item in group.items"
                  :key="item.id"
                  class="group p-3 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200 cursor-pointer flex items-center justify-between gap-3 min-w-0"
                  @click="handleSelect(item.path)"
                >
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <NuxtImg
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.title"
                      format="webp"
                      quality="80"
                      loading="lazy"
                      class="size-10 shrink-0 rounded-xs object-cover border border-neutral-200 dark:border-neutral-800"
                    />
                    <div
                      v-else
                      class="flex size-10 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800"
                    >
                      <UIcon :name="item.icon" class="size-5" />
                    </div>

                    <div class="min-w-0 space-y-0.5 flex-1">
                      <div class="flex items-center gap-2 text-[10px]">
                        <UBadge color="neutral" variant="subtle" class="font-bold rounded-xs px-1.5 py-0.5 text-[9px] uppercase border border-neutral-200/60 dark:border-neutral-800/60">
                          {{ item.badge }}
                        </UBadge>
                        <span v-if="item.meta" class="text-neutral-400 font-medium truncate">• {{ item.meta }}</span>
                      </div>

                      <h4 class="font-bold text-xs sm:text-sm text-neutral-950 dark:text-white truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                        {{ item.title }}
                      </h4>

                      <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1 leading-snug font-medium">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>

                  <UIcon name="i-tabler-chevron-right" class="size-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </div>
            </div>
          </template>

          <div v-else class="py-8 sm:py-12 text-center space-y-2">
            <UIcon name="i-tabler-search-off" class="size-8 text-neutral-400 dark:text-neutral-500 mx-auto" />
            <p class="text-xs font-bold text-neutral-500 dark:text-neutral-400">
              No results found matching "<span class="text-neutral-900 dark:text-white">{{ searchQuery }}</span>"
            </p>
          </div>
        </div>

        <div class="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
          <span class="text-neutral-500 dark:text-neutral-400 font-medium text-xs">
            Total Matches: <span class="font-extrabold font-mono text-lime-600 dark:text-lime-400">{{ totalMatchCount }}</span>
          </span>
          <button
            type="button"
            class="font-black text-xs uppercase tracking-wider text-lime-600 dark:text-lime-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            @click="navigateToFullSearch"
          >
            <span>Try Advanced Search</span>
            <UIcon name="i-tabler-arrow-right" class="size-3.5" />
          </button>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
div.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(163, 163, 163, 0.3) transparent;
}

div.overflow-y-auto::-webkit-scrollbar {
  width: 5px;
}

div.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

div.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(163, 163, 163, 0.3);
  border-radius: 9999px;
}

div.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(132, 204, 22, 0.6);
}
</style>
