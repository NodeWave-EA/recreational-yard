import type { EventsCollectionItem } from '@nuxt/content'
import { useContentQuery } from '~/composables/useContentQuery'

export async function useEventsCatalog() {
  const { getCollection } = useContentQuery()

  const searchQuery = ref('')
  const selectedCategory = ref('all')
  const sortBy = ref('default')

  // Query events catalog
  const { data: events, pending: isLoading } = await getCollection('events-catalog', 'events', {
    sort: [{ key: 'order', order: 'ASC' }],
    enableLogging: false,
  })

  // Cover image URL extractor
  function getImageSrc(item: EventsCollectionItem): string {
    if (typeof item.coverImage === 'string')
      return item.coverImage
    if (item.coverImage && typeof item.coverImage === 'object' && 'src' in item.coverImage && typeof item.coverImage.src === 'string')
      return item.coverImage.src
    return ''
  }

  // Extract category options for Nuxt UI SelectMenu
  const categoryOptions = computed(() => {
    const defaultOpt = { id: 'all', label: 'All Categories', icon: 'i-tabler-layout-grid' }
    if (!events.value)
      return [defaultOpt]

    const uniqueCats = Array.from(
      new Set(
        events.value
          .map((e: EventsCollectionItem) => e.category)
          .filter((cat): cat is string => Boolean(cat)),
      ),
    )

    const catOpts = uniqueCats.map(cat => ({
      id: cat,
      label: cat,
      icon: 'i-tabler-calendar-event',
    }))

    return [defaultOpt, ...catOpts]
  })

  const sortOptions = [
    { id: 'default', label: 'Sort: Featured' },
    { id: 'title-asc', label: 'Title: A to Z' },
    { id: 'title-desc', label: 'Title: Z to A' },
  ]

  const selectedCategoryMeta = computed(() => {
    return categoryOptions.value.find(c => c.id === selectedCategory.value) || categoryOptions.value[0]
  })

  // Filtered and sorted events
  const filteredEvents = computed<EventsCollectionItem[]>(() => {
    if (!events.value)
      return []

    let list = [...events.value]

    // Category Filter
    if (selectedCategory.value !== 'all') {
      list = list.filter(e => e.category === selectedCategory.value)
    }

    // Search Query Filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter((e) => {
        const titleStr = (e.title || '').toLowerCase()
        const descStr = (e.description || '').toLowerCase()
        const locStr = (e.location || '').toLowerCase()
        const catStr = (e.category || '').toLowerCase()
        return titleStr.includes(q) || descStr.includes(q) || locStr.includes(q) || catStr.includes(q)
      })
    }

    // Sorting
    if (sortBy.value === 'title-asc') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    } else if (sortBy.value === 'title-desc') {
      list.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
    }

    return list
  })

  function resetFilters() {
    searchQuery.value = ''
    selectedCategory.value = 'all'
    sortBy.value = 'default'
  }

  return {
    events,
    isLoading,
    searchQuery,
    selectedCategory,
    sortBy,
    categoryOptions,
    sortOptions,
    selectedCategoryMeta,
    filteredEvents,
    getImageSrc,
    resetFilters,
  }
}
