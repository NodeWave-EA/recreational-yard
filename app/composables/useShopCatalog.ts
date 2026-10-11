import { useContentQuery } from '~/composables/useContentQuery'

export interface ShopProduct {
  id?: string
  path: string
  title?: string
  name?: string
  description?: string
  price?: number
  currency?: string
  badge?: string
  category?: string
  inStock?: boolean
  image?: string | { src?: string, alt?: string }
  order?: number
  details?: string[]
}

export async function useShopCatalog() {
  const { getCollection } = useContentQuery()
  const { addToCart } = useCart()

  const searchQuery = ref('')
  const selectedCategory = ref('all')
  const sortBy = ref('default')
  const inStockOnly = ref(false)

  // Fetch shop product catalog
  const { data: products, pending: isLoading } = await getCollection('shop-catalog', 'shop', {
    sort: [{ key: 'order', order: 'ASC' }],
    enableLogging: false,
  })

  // Normalize product properties
  const getTitle = (item: any) => item?.title || item?.name || 'Untitled Product'

  const getImageSrc = (item: any) => {
    if (typeof item?.image === 'string')
      return item.image
    if (item?.image?.src)
      return item.image.src
    return ''
  }

  // Extract dynamic category options for Nuxt UI SelectMenu
  const categoryOptions = computed(() => {
    const defaultOpt = { id: 'all', label: 'All Categories', icon: 'i-tabler-layout-grid' }
    if (!products.value)
      return [defaultOpt]

    const uniqueCats = Array.from(
      new Set(products.value.map(p => p.category).filter(Boolean)),
    ) as string[]

    const catOpts = uniqueCats.map(cat => ({
      id: cat,
      label: cat,
      icon: 'i-tabler-tag',
    }))

    return [defaultOpt, ...catOpts]
  })

  const sortOptions = [
    { id: 'default', label: 'Sort: Featured' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'title-asc', label: 'Name: A to Z' },
    { id: 'title-desc', label: 'Name: Z to A' },
  ]

  const selectedCategoryMeta = computed(() => {
    return categoryOptions.value.find(c => c.id === selectedCategory.value) || categoryOptions.value[0]
  })

  // Reactive product filtering & sorting
  const filteredProducts = computed(() => {
    if (!products.value)
      return []

    let list = [...products.value]

    // Category Filter
    if (selectedCategory.value !== 'all') {
      list = list.filter(p => p.category === selectedCategory.value)
    }

    // Stock Filter
    if (inStockOnly.value) {
      list = list.filter(p => p.inStock !== false)
    }

    // Search Query Filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter((p) => {
        const titleStr = getTitle(p).toLowerCase()
        const descStr = (p.description || '').toLowerCase()
        const catStr = (p.category || '').toLowerCase()
        return titleStr.includes(q) || descStr.includes(q) || catStr.includes(q)
      })
    }

    // Sorting
    if (sortBy.value === 'price-low') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy.value === 'price-high') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy.value === 'title-asc') {
      list.sort((a, b) => getTitle(a).localeCompare(getTitle(b)))
    } else if (sortBy.value === 'title-desc') {
      list.sort((a, b) => getTitle(b).localeCompare(getTitle(a)))
    }

    return list
  })

  function resetFilters() {
    searchQuery.value = ''
    selectedCategory.value = 'all'
    sortBy.value = 'default'
    inStockOnly.value = false
  }

  return {
    products,
    isLoading,
    searchQuery,
    selectedCategory,
    sortBy,
    inStockOnly,
    categoryOptions,
    sortOptions,
    selectedCategoryMeta,
    filteredProducts,
    getTitle,
    getImageSrc,
    addToCart,
    resetFilters,
  }
}
