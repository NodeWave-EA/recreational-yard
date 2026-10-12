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

const searchQuery = ref('')
const openSections = ref<Record<string, boolean>>({})

// Sync props.open with local state
const isOpen = computed({
  get: () => props.open,
  set: val => emit('update:open', val),
})

// Fetch all collections dynamically based on SEARCH_COLLECTION_CONFIGS
const collectionResults = ref<Record<string, NormalizedSearchResult[]>>({})

async function loadAllCollections() {
  const promises = SEARCH_COLLECTION_CONFIGS.map(async (config) => {
    const { data } = await getCollection(
      `search-modal-${config.key}`,
      config.key as keyof PageCollections,
      { enableLogging: false },
    )

    const rawItems = (data.value ?? []) as Array<Record<string, unknown>>
    const normalized = rawItems.map(item => normalizeContentItem(item, config.key))

    return { key: config.key, items: normalized }
  })

  const results = await Promise.all(promises)
  const map: Record<string, NormalizedSearchResult[]> = {}

  results.forEach((res) => {
    map[res.key] = res.items
    // Default all sections to collapsed initially
    openSections.value[res.key] = false
  })

  collectionResults.value = map
}

onMounted(() => {
  loadAllCollections()
})

// Filter items per collection
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
  <UModal v-model:open="isOpen" :ui="{ content: 'max-w-2xl' }">
    <template #content>
      <div class="p-5 sm:p-6 space-y-4 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl text-neutral-900 dark:text-white">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-tabler-search" class="size-5 text-lime-500" />
            <h3 class="font-extrabold text-base">
              Search Catalog
            </h3>
          </div>

          <div class="flex items-center gap-2">
            <span class="hidden sm:inline-flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
              Press <UKbd class="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border text-[10px] font-mono">ESC</UKbd> to exit
            </span>
            <UButton
              color="neutral"
              variant="soft"
              icon="i-tabler-x"
              size="sm"
              class="rounded-xl font-bold text-xs"
              aria-label="Close search modal"
              @click="isOpen = false"
            >
              Close
            </UButton>
          </div>
        </div>

        <!-- Search Input -->
        <UInput
          v-model="searchQuery"
          icon="i-tabler-search"
          placeholder="Search facilities, pricing, shop, events..."
          size="lg"
          color="primary"
          class="w-full"
          autofocus
          clearable
        />

        <!-- Collapsible Collection Results -->
        <div class="max-h-96 overflow-y-auto space-y-4 pr-2">
          <template v-if="groupedFilteredResults.length">
            <div
              v-for="group in groupedFilteredResults"
              :key="group.config.key"
              class="space-y-1"
            >
              <!-- Section Header Divider -->
              <button
                type="button"
                class="w-full py-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
                @click="toggleSection(group.config.key)"
              >
                <div class="flex items-center gap-2.5">
                  <UIcon :name="group.config.icon" class="size-4 text-lime-500 shrink-0" />
                  <span class="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                    {{ group.config.label }}
                  </span>
                  <UBadge color="primary" variant="soft" size="sm" class="rounded-full font-bold text-[10px] px-2">
                    {{ group.items.length }}
                  </UBadge>
                </div>

                <UIcon
                  name="i-tabler-chevron-down"
                  class="size-4 text-neutral-400 transition-transform duration-200"
                  :class="{ 'rotate-180': openSections[group.config.key] }"
                />
              </button>

              <!-- Group Content Flat Rows -->
              <div
                v-show="openSections[group.config.key]"
                class="divide-y divide-neutral-200/60 dark:divide-neutral-800/60"
              >
                <div
                  v-for="item in group.items"
                  :key="item.id"
                  class="group py-2.5 px-2 flex items-center justify-between gap-3 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 rounded-xl cursor-pointer transition-colors"
                  @click="handleSelect(item.path)"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <NuxtImg
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.title"
                      format="webp"
                      quality="80"
                      loading="lazy"
                      class="size-9 shrink-0 rounded-lg object-cover border border-neutral-200 dark:border-neutral-800"
                    />
                    <div
                      v-else
                      class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 group-hover:bg-lime-500 group-hover:text-neutral-950 transition-colors"
                    >
                      <UIcon :name="item.icon" class="size-4" />
                    </div>

                    <div class="min-w-0 space-y-0.5">
                      <div class="flex items-center gap-2 text-[10px]">
                        <UBadge color="neutral" variant="subtle" class="font-bold rounded px-1.5 py-0.5 text-[9px] uppercase">
                          {{ item.badge }}
                        </UBadge>
                        <span v-if="item.meta" class="text-neutral-400 font-medium truncate">• {{ item.meta }}</span>
                      </div>

                      <h4 class="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                        {{ item.title }}
                      </h4>

                      <p class="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-tight">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>

                  <UIcon name="i-tabler-chevron-right" class="size-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </div>
            </div>
          </template>

          <!-- Empty State -->
          <div v-else class="py-12 text-center space-y-2">
            <UIcon name="i-tabler-search-off" class="size-10 text-neutral-400 mx-auto" />
            <p class="text-xs font-bold text-neutral-500">
              No results found matching "{{ searchQuery }}"
            </p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
          <span class="text-neutral-400 text-[11px]">
            Found {{ totalMatchCount }} {{ totalMatchCount === 1 ? 'match' : 'matches' }}
          </span>
          <button
            type="button"
            class="font-bold text-lime-600 dark:text-lime-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            @click="navigateToFullSearch"
          >
            <span>
              Try Advanced Search
            </span>
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
