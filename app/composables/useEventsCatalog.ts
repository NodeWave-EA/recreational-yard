import type { EventsCollectionItem } from '@nuxt/content'
import { useContentQuery } from '~/composables/useContentQuery'

export async function useEventsCatalog() {
  const { getCollection } = useContentQuery()

  const searchQuery = ref('')
  const selectedCategory = ref('all')
  const selectedStatus = ref('all')
  const sortBy = ref('date-asc')

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

  // Status badge style helper
  function getStatusBadge(status?: string) {
    switch (status) {
      case 'registration_open':
        return { label: 'Registration Open', color: 'primary' as const, variant: 'solid' as const, icon: 'i-tabler-ticket' }
      case 'upcoming':
        return { label: 'Upcoming', color: 'info' as const, variant: 'soft' as const, icon: 'i-tabler-calendar' }
      case 'ongoing':
        return { label: 'Happening Now', color: 'warning' as const, variant: 'solid' as const, icon: 'i-tabler-point-filled' }
      case 'sold_out':
        return { label: 'Sold Out', color: 'error' as const, variant: 'soft' as const, icon: 'i-tabler-circle-x' }
      case 'completed':
        return { label: 'Completed', color: 'neutral' as const, variant: 'subtle' as const, icon: 'i-tabler-check' }
      case 'cancelled':
        return { label: 'Cancelled', color: 'error' as const, variant: 'subtle' as const, icon: 'i-tabler-x' }
      default:
        return { label: status || 'Event', color: 'neutral' as const, variant: 'soft' as const, icon: 'i-tabler-calendar-event' }
    }
  }

  // Extract unique category options from events for filter dropdown
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

  // Status options for filter dropdown
  const statusOptions = [
    { id: 'all', label: 'All Statuses' },
    { id: 'registration_open', label: 'Registration Open' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Happening Now' },
    { id: 'completed', label: 'Completed' },
  ]

  // Sorting options
  const sortOptions = [
    { id: 'date-asc', label: 'Date: Soonest First' },
    { id: 'date-desc', label: 'Date: Latest First' },
    { id: 'default', label: 'Featured Order' },
    { id: 'title-asc', label: 'Title: A to Z' },
    { id: 'title-desc', label: 'Title: Z to A' },
  ]

  const selectedCategoryMeta = computed(() => {
    return categoryOptions.value.find(c => c.id === selectedCategory.value) || categoryOptions.value[0]
  })

  // Filtered and sorted events list
  const filteredEvents = computed<EventsCollectionItem[]>(() => {
    if (!events.value)
      return []

    let list = [...events.value]

    // Category Filter
    if (selectedCategory.value !== 'all') {
      list = list.filter(e => e.category === selectedCategory.value)
    }

    // Status Filter
    if (selectedStatus.value !== 'all') {
      list = list.filter(e => e.status === selectedStatus.value)
    }

    // Search Query Filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter((e) => {
        const titleStr = (e.title || '').toLowerCase()
        const descStr = (e.description || '').toLowerCase()
        const locStr = (e.location || '').toLowerCase()
        const catStr = (e.category || '').toLowerCase()
        const tagsStr = (e.tags || []).join(' ').toLowerCase()
        const organizerStr = (e.organizer?.name || '').toLowerCase()
        return (
          titleStr.includes(q)
          || descStr.includes(q)
          || locStr.includes(q)
          || catStr.includes(q)
          || tagsStr.includes(q)
          || organizerStr.includes(q)
        )
      })
    }

    // Sorting
    if (sortBy.value === 'date-asc') {
      list.sort((a, b) => {
        const timeA = a.startDate ? new Date(a.startDate).getTime() : Number.MAX_SAFE_INTEGER
        const timeB = b.startDate ? new Date(b.startDate).getTime() : Number.MAX_SAFE_INTEGER
        return timeA - timeB
      })
    } else if (sortBy.value === 'date-desc') {
      list.sort((a, b) => {
        const timeA = a.startDate ? new Date(a.startDate).getTime() : 0
        const timeB = b.startDate ? new Date(b.startDate).getTime() : 0
        return timeB - timeA
      })
    } else if (sortBy.value === 'title-asc') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    } else if (sortBy.value === 'title-desc') {
      list.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
    }

    return list
  })

  function resetFilters() {
    searchQuery.value = ''
    selectedCategory.value = 'all'
    selectedStatus.value = 'all'
    sortBy.value = 'date-asc'
  }

  return {
    events,
    isLoading,
    searchQuery,
    selectedCategory,
    selectedStatus,
    sortBy,
    categoryOptions,
    statusOptions,
    sortOptions,
    selectedCategoryMeta,
    filteredEvents,
    getImageSrc,
    getStatusBadge,
    resetFilters,
  }
}
