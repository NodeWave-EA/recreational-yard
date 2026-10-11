import type { PageCollections } from '@nuxt/content'
import type { NormalizedSearchResult } from '~/utils/search-registry'
import Fuse from 'fuse.js'
import {
  cleanPath,
  getMatchingSnippet,
  normalizeContentItem,
  sanitizeBodyText,
  SEARCH_COLLECTION_CONFIGS,
} from '~/utils/search-registry'

export interface ExtendedSearchResult extends NormalizedSearchResult {
  bodyContent: string
  rawPrice?: number
  inStock?: boolean
  snippet?: string
}

export function useAdvancedSearch() {
  const route = useRoute()
  const router = useRouter()
  const { getCollection, getSearchSections } = useContentQuery()

  // Reactive state synced with URL query parameters
  const searchQuery = ref<string>(typeof route.query.q === 'string' ? route.query.q : '')
  const selectedCollection = ref<string>(typeof route.query.type === 'string' ? route.query.type : 'all')
  const sortBy = ref<'relevance' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc'>(
    (route.query.sort as any) || 'relevance',
  )
  const minPrice = ref<string>(typeof route.query.minPrice === 'string' ? route.query.minPrice : '')
  const maxPrice = ref<string>(typeof route.query.maxPrice === 'string' ? route.query.maxPrice : '')
  const inStockOnly = ref<boolean>(route.query.inStock === 'true')

  const isMobileFiltersOpen = ref(false)
  const openSections = ref<Record<string, boolean>>({})
  const collectionData = ref<Record<string, ExtendedSearchResult[]>>({})
  const isLoading = ref(true)

  // Fuse.js configuration for fuzzy search across title, description, badges, and Markdown body
  const fuseOptions: Fuse.IFuseOptions<ExtendedSearchResult> = {
    keys: [
      { name: 'title', weight: 0.35 },
      { name: 'description', weight: 0.25 },
      { name: 'badge', weight: 0.15 },
      { name: 'meta', weight: 0.1 },
      { name: 'bodyContent', weight: 0.15 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  }

  // Nuxt UI Compatible Options
  const categoryOptions = computed(() => [
    { id: 'all', label: 'All Categories', icon: 'i-tabler-layout-grid' },
    ...SEARCH_COLLECTION_CONFIGS.map(c => ({
      id: c.key,
      label: c.label,
      icon: c.icon,
    })),
  ])

  const sortOptions = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'title-asc', label: 'Name: A to Z' },
    { id: 'title-desc', label: 'Name: Z to A' },
  ]

  const selectedCategoryMeta = computed(() => {
    return categoryOptions.value.find(c => c.id === selectedCollection.value) || categoryOptions.value[0]
  })

  // Sync state changes to URL query string
  watch(
    [searchQuery, selectedCollection, sortBy, minPrice, maxPrice, inStockOnly],
    () => {
      const query: Record<string, string | undefined> = {
        q: searchQuery.value.trim() || undefined,
        type: selectedCollection.value !== 'all' ? selectedCollection.value : undefined,
        sort: sortBy.value !== 'relevance' ? sortBy.value : undefined,
        minPrice: minPrice.value.trim() || undefined,
        maxPrice: maxPrice.value.trim() || undefined,
        inStock: inStockOnly.value ? 'true' : undefined,
      }
      router.replace({ query })
    },
    { deep: true },
  )

  watch(
    () => route.query,
    (newQuery) => {
      if (typeof newQuery.q === 'string' && newQuery.q !== searchQuery.value) {
        searchQuery.value = newQuery.q
      } else if (!newQuery.q && searchQuery.value) {
        searchQuery.value = ''
      }
      if (typeof newQuery.type === 'string' && newQuery.type !== selectedCollection.value) {
        selectedCollection.value = newQuery.type
      }
    },
    { deep: true },
  )

  // Fetch all collections and Markdown section ASTs
  async function fetchFullTextCatalog() {
    isLoading.value = true
    try {
      const promises = SEARCH_COLLECTION_CONFIGS.map(async (config) => {
        const collectionKey = config.key as keyof PageCollections

        const [{ data: rawDocs }, { data: rawSections }] = await Promise.all([
          getCollection(`adv-search-doc-${config.key}`, collectionKey, { enableLogging: false }),
          getSearchSections(`adv-search-sec-${config.key}`, collectionKey, { enableLogging: false }),
        ])

        const docs = (rawDocs.value ?? []) as Array<Record<string, unknown>>
        const sections = (rawSections.value ?? []) as Array<Record<string, unknown>>

        const sectionBodyMap = new Map<string, string[]>()
        sections.forEach((sec) => {
          const rawId = typeof sec.id === 'string' ? sec.id : typeof sec.path === 'string' ? sec.path : ''
          const docPath = cleanPath(rawId)
          const rawContent = typeof sec.content === 'string' ? sec.content : typeof sec.description === 'string' ? sec.description : ''
          const cleanContent = sanitizeBodyText(rawContent)

          if (docPath && cleanContent) {
            const existing = sectionBodyMap.get(docPath) || []
            existing.push(cleanContent)
            sectionBodyMap.set(docPath, existing)
          }
        })

        const normalizedList: ExtendedSearchResult[] = docs.map((doc) => {
          const base = normalizeContentItem(doc, config.key)
          const docPath = base.path
          const extraBodyParts = sectionBodyMap.get(docPath) || []
          const fullBodyText = sanitizeBodyText(`${base.description} ${extraBodyParts.join(' ')}`)

          return {
            ...base,
            bodyContent: fullBodyText,
            rawPrice: typeof doc.price === 'number' ? doc.price : undefined,
            inStock: typeof doc.inStock === 'boolean' ? doc.inStock : true,
          }
        })

        return { key: config.key, items: normalizedList }
      })

      const results = await Promise.all(promises)
      const map: Record<string, ExtendedSearchResult[]> = {}

      results.forEach((res) => {
        map[res.key] = res.items
        openSections.value[res.key] = true
      })

      collectionData.value = map
    } finally {
      isLoading.value = false
    }
  }

  // Fuse.js powered search and filtering logic
  const processedResults = computed(() => {
    const q = searchQuery.value.trim()
    const minP = Number.parseFloat(minPrice.value) || 0
    const maxP = Number.parseFloat(maxPrice.value) || Infinity

    const grouped: Array<{
      config: typeof SEARCH_COLLECTION_CONFIGS[number]
      items: ExtendedSearchResult[]
    }> = []

    SEARCH_COLLECTION_CONFIGS.forEach((config) => {
      if (selectedCollection.value !== 'all' && selectedCollection.value !== config.key) {
        return
      }

      const rawItems = collectionData.value[config.key] || []
      let matchedItems: ExtendedSearchResult[] = []

      if (q) {
        const fuse = new Fuse(rawItems, fuseOptions)
        matchedItems = fuse.search(q).map(res => res.item)
      } else {
        matchedItems = [...rawItems]
      }

      const filtered: ExtendedSearchResult[] = []

      matchedItems.forEach((item) => {
        if (minPrice.value.trim() || maxPrice.value.trim()) {
          if (item.rawPrice !== undefined) {
            if (item.rawPrice < minP || item.rawPrice > maxP)
              return
          }
        }

        if (inStockOnly.value && item.inStock === false) {
          return
        }

        const snippet = q ? getMatchingSnippet(item.bodyContent, q) : undefined

        filtered.push({
          ...item,
          snippet: snippet || undefined,
        })
      })

      if (sortBy.value !== 'relevance') {
        filtered.sort((a, b) => {
          if (sortBy.value === 'price-asc')
            return (a.rawPrice ?? 0) - (b.rawPrice ?? 0)
          if (sortBy.value === 'price-desc')
            return (b.rawPrice ?? 0) - (a.rawPrice ?? 0)
          if (sortBy.value === 'title-asc')
            return a.title.localeCompare(b.title)
          if (sortBy.value === 'title-desc')
            return b.title.localeCompare(a.title)
          return 0
        })
      }

      if (filtered.length > 0) {
        grouped.push({ config, items: filtered })
      }
    })

    return grouped
  })

  const grandTotalCount = computed(() =>
    processedResults.value.reduce((acc, g) => acc + g.items.length, 0),
  )

  const activeFilterCount = computed(() => {
    let count = 0
    if (selectedCollection.value !== 'all')
      count++
    if (minPrice.value.trim())
      count++
    if (maxPrice.value.trim())
      count++
    if (inStockOnly.value)
      count++
    if (sortBy.value !== 'relevance')
      count++
    return count
  })

  function resetFilters() {
    searchQuery.value = ''
    selectedCollection.value = 'all'
    sortBy.value = 'relevance'
    minPrice.value = ''
    maxPrice.value = ''
    inStockOnly.value = false
  }

  function toggleSection(key: string) {
    openSections.value[key] = !openSections.value[key]
  }

  return {
    searchQuery,
    selectedCollection,
    sortBy,
    minPrice,
    maxPrice,
    inStockOnly,
    isMobileFiltersOpen,
    openSections,
    isLoading,
    categoryOptions,
    sortOptions,
    selectedCategoryMeta,
    fetchFullTextCatalog,
    processedResults,
    grandTotalCount,
    activeFilterCount,
    resetFilters,
    toggleSection,
  }
}
