import { useContentQuery } from '~/composables/useContentQuery'

interface CatalogGalleryPhoto {
  url: string
  caption?: string
  aspect?: 'portrait' | 'landscape' | 'square' | 'tall'
}

export interface GalleryCollection {
  id?: string
  path?: string
  stem?: string
  title: string
  description: string
  category: string
  badge?: string
  date?: string
  coverImage?: string | { src: string, alt?: string }
  photos?: CatalogGalleryPhoto[]
  featured?: boolean
  order?: number
}

export async function useGalleryCatalog() {
  const { getCollection } = useContentQuery()

  const searchQuery = ref('')
  const selectedCategory = ref('all')
  const sortBy = ref('newest')

  // Query gallery collections from content collection
  const { data: rawCollections, pending: isLoading } = await getCollection('gallery-collections', 'gallery', {
    sort: [{ key: 'order', order: 'ASC' }],
    enableLogging: false,
  })

  function getCoverImageSrc(col: GalleryCollection): string {
    if (!col?.coverImage)
      return ''
    if (typeof col.coverImage === 'string')
      return col.coverImage
    return col.coverImage.src || ''
  }

  // Normalized collection list with paths
  const collections = computed<GalleryCollection[]>(() => {
    return (rawCollections.value || []).map((col: any) => ({
      ...col,
      path: col.path || `/gallery/${col.stem?.split('/').pop() || ''}`,
    }))
  })

  // Dynamic category options generated from available content
  const categoryOptions = computed(() => {
    const defaultOpt = { id: 'all', label: 'All Collections', icon: 'i-tabler-photo' }
    if (!rawCollections.value)
      return [defaultOpt]

    const uniqueCats = Array.from(
      new Set(
        rawCollections.value
          .map((c: any) => c.category)
          .filter(Boolean),
      ),
    ) as string[]

    const categoryIcons: Record<string, string> = {
      sports: 'i-tabler-ball-tennis',
      scenery: 'i-tabler-trees',
      events: 'i-tabler-calendar-event',
    }

    const catOpts = uniqueCats.map(cat => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: categoryIcons[cat.toLowerCase()] || 'i-tabler-photo',
    }))

    return [defaultOpt, ...catOpts]
  })

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'photos-desc', label: 'Most Photos' },
  ]

  const selectedCategoryMeta = computed(() => {
    return categoryOptions.value.find(c => c.id === selectedCategory.value) || {
      id: 'all',
      label: 'All Categories',
      icon: 'i-tabler-layout-grid',
    }
  })

  // Filtered and sorted collections list
  const filteredCollections = computed(() => {
    let result = [...collections.value]

    // Category Filter
    if (selectedCategory.value !== 'all') {
      result = result.filter(item => item.category === selectedCategory.value)
    }

    // Search Query Filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      result = result.filter(item =>
        (item.title || '').toLowerCase().includes(q)
        || (item.description || '').toLowerCase().includes(q)
        || (item.category || '').toLowerCase().includes(q),
      )
    }

    // Sorting
    if (sortBy.value === 'newest') {
      result.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    } else if (sortBy.value === 'oldest') {
      result.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    } else if (sortBy.value === 'photos-desc') {
      result.sort((a, b) => (b.photos?.length || 0) - (a.photos?.length || 0))
    }

    return result
  })

  function resetFilters() {
    searchQuery.value = ''
    selectedCategory.value = 'all'
    sortBy.value = 'newest'
  }

  return {
    collections,
    isLoading,
    searchQuery,
    selectedCategory,
    sortBy,
    categoryOptions,
    sortOptions,
    selectedCategoryMeta,
    filteredCollections,
    getCoverImageSrc,
    resetFilters,
  }
}
