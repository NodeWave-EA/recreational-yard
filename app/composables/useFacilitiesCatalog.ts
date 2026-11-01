import { useContentQuery } from '~/composables/useContentQuery'

export interface FacilityItem {
  id?: string
  path: string
  title?: string
  description?: string
  badge?: string
  category?: string
  capacity?: string
  icon?: string
  coverImage?: string | { src?: string, alt?: string }
  pricing?: {
    rate?: string
    unit?: string
  }
  features?: string[]
}

export async function useFacilitiesCatalog() {
  const { getCollection } = useContentQuery()

  const searchQuery = ref('')
  const selectedCategory = ref('all')
  const sortBy = ref('default')

  const { data: facilities, pending: isLoading } = await getCollection('facilities-list', 'facilities', {
    sort: [{ key: 'order', order: 'ASC' }],
    enableLogging: false,
  })

  function getImageSrc(facility: FacilityItem): string {
    if (typeof facility?.coverImage === 'string')
      return facility.coverImage
    if (facility?.coverImage?.src)
      return facility.coverImage.src
    return ''
  }

  const categoryOptions = computed(() => {
    const defaultOpt = { id: 'all', label: 'All Grounds & Venues', icon: 'i-tabler-layout-grid' }
    if (!facilities.value)
      return [defaultOpt]

    const uniqueCats = Array.from(
      new Set(
        facilities.value
          .map((f: any) => f.badge || f.category)
          .filter(Boolean),
      ),
    ) as string[]

    const catOpts = uniqueCats.map(cat => ({
      id: cat,
      label: cat,
      icon: 'i-tabler-trees',
    }))

    return [defaultOpt, ...catOpts]
  })

  const sortOptions = [
    { id: 'default', label: 'Sort: Featured' },
    { id: 'title-asc', label: 'Name: A to Z' },
    { id: 'title-desc', label: 'Name: Z to A' },
  ]

  const selectedCategoryMeta = computed(() => {
    return categoryOptions.value.find(c => c.id === selectedCategory.value) || {
      id: 'all',
      label: 'All Venues',
      icon: 'i-tabler-layout-grid',
    }
  })

  const filteredFacilities = computed<FacilityItem[]>(() => {
    if (!facilities.value)
      return []

    let list = [...facilities.value]

    if (selectedCategory.value !== 'all') {
      list = list.filter(f => (f.badge || f.category) === selectedCategory.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter((f) => {
        const titleStr = (f.title || '').toLowerCase()
        const descStr = (f.description || '').toLowerCase()
        const featsStr = (f.features || []).join(' ').toLowerCase()
        return titleStr.includes(q) || descStr.includes(q) || featsStr.includes(q)
      })
    }

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
    facilities,
    isLoading,
    searchQuery,
    selectedCategory,
    sortBy,
    categoryOptions,
    sortOptions,
    selectedCategoryMeta,
    filteredFacilities,
    getImageSrc,
    resetFilters,
  }
}
