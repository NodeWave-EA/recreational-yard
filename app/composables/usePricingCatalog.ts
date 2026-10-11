import { useContentQuery } from '~/composables/useContentQuery'

export interface PricingPlan {
  id?: string
  path: string
  title?: string
  description?: string
  price?: number
  currency?: string
  billingCycle?: string
  badge?: string
  isPopular?: boolean
  features?: string[]
  notIncluded?: string[]
  cta?: {
    label?: string
    to?: string
  }
}

export async function usePricingCatalog() {
  const { getCollection } = useContentQuery()

  const searchQuery = ref('')
  const selectedCategory = ref('all')
  const sortBy = ref('default')

  // Query pricing plans from content collection
  const { data: pricingPlans, pending: isLoading } = await getCollection('pricing-page-plans', 'pricing', {
    sort: [{ key: 'order', order: 'ASC' }],
    enableLogging: false,
  })

  // Dynamic pass type options for Nuxt UI SelectMenu
  const categoryOptions = computed(() => {
    const defaultOpt = { id: 'all', label: 'All Pass Types', icon: 'i-tabler-layout-grid' }
    if (!pricingPlans.value)
      return [defaultOpt]

    const uniqueCats = Array.from(
      new Set(
        pricingPlans.value
          .map((p: any) => p.badge || p.category)
          .filter(Boolean),
      ),
    ) as string[]

    const catOpts = uniqueCats.map(cat => ({
      id: cat,
      label: cat,
      icon: 'i-tabler-ticket',
    }))

    return [defaultOpt, ...catOpts]
  })

  const sortOptions = [
    { id: 'default', label: 'Sort: Featured' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'title-asc', label: 'Name: A to Z' },
  ]

  const selectedCategoryMeta = computed(() => {
    return categoryOptions.value.find(c => c.id === selectedCategory.value) || categoryOptions.value[0]
  })

  // Filtered and sorted plans
  const filteredPlans = computed<PricingPlan[]>(() => {
    if (!pricingPlans.value)
      return []

    let list = [...pricingPlans.value]

    // Category Filter
    if (selectedCategory.value !== 'all') {
      list = list.filter(p => (p.badge || p.category) === selectedCategory.value)
    }

    // Search Query Filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter((p) => {
        const titleStr = (p.title || '').toLowerCase()
        const descStr = (p.description || '').toLowerCase()
        const featuresStr = (p.features || []).join(' ').toLowerCase()
        return titleStr.includes(q) || descStr.includes(q) || featuresStr.includes(q)
      })
    }

    // Sorting
    if (sortBy.value === 'price-asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy.value === 'price-desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy.value === 'title-asc') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    }

    return list
  })

  function resetFilters() {
    searchQuery.value = ''
    selectedCategory.value = 'all'
    sortBy.value = 'default'
  }

  return {
    pricingPlans,
    isLoading,
    searchQuery,
    selectedCategory,
    sortBy,
    categoryOptions,
    sortOptions,
    selectedCategoryMeta,
    filteredPlans,
    resetFilters,
  }
}
