<script setup lang="ts">
import { useShopCatalog } from '~/composables/useShopCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const {
  products,
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
} = await useShopCatalog()

const { cart, updateQuantity, removeFromCart } = useCart()

// Evaluates whether any products exist overall in the database catalog
const hasAnyProduct = computed(() => (products.value?.length || 0) > 0)

function getCartQuantity(productPath: string): number {
  const item = cart.value.find(i => i.product.id === productPath)
  return item ? item.quantity : 0
}

function handleAdd(product: any) {
  addToCart({
    id: product.path,
    name: getTitle(product),
    price: product.price || 0,
    currency: product.currency || 'KES',
    image: getImageSrc(product),
    inStock: product.inStock ?? true,
  })
}

function handleDecrement(productPath: string) {
  const currentQty = getCartQuantity(productPath)
  if (currentQty > 1) {
    updateQuantity(productPath, currentQty - 1)
  } else if (currentQty === 1) {
    removeFromCart(productPath)
  }
}

useSeoMeta({
  title: `Shop & Merchandise | ${LOCATION_DETAILS.company}`,
  description: 'Shop official Recreation Yard sportswear, fresh Kericho tea produce, and sports gear.',
  ogTitle: `Shop & Merchandise | ${LOCATION_DETAILS.company}`,
  ogDescription: 'Shop official Recreation Yard sportswear, fresh Kericho tea produce, and sports gear.',
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}/shop`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
useSchemaOrg([{
  '@type': 'CollectionPage',
  '@id': `${siteUrl}/shop#webpage`,
  'url': `${siteUrl}/shop`,
  'name': `Shop & Merchandise | ${LOCATION_DETAILS.company}`,
  'description': 'Shop official Recreation Yard sportswear, fresh Kericho tea produce, and sports gear.',
  'isPartOf': { '@id': `${siteUrl}/#website` },
  'about': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-16 transition-colors duration-300">
    <!-- Left-Aligned Mobile Hero Banner -->
    <div class="pt-6 sm:pt-10 pb-2 sm:pb-4 text-left sm:text-center space-y-3 mx-auto px-4">
      <div class="inline-flex">
        <UBadge
          color="primary"
          variant="soft"
          class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-3.5 py-1 sm:py-0.5 rounded-full"
        >
          <UIcon name="i-tabler-shopping-bag" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
          <span>
            Yard Shop
          </span>
        </UBadge>
      </div>

      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
        Shop & Merchandise
      </h1>

      <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-0 sm:mx-auto">
        Browse our curated selection of official Recreation Yard merchandise, fresh Kericho tea produce, and sports gear. Find the perfect items to support your favorite activities and enjoy quality products from our shop.
      </p>
    </div>

    <!-- Sticky Search, Filter & View Toggle Toolbar -->
    <div class="sticky top-(--ui-header-height,4rem) z-30 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md py-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs transition-all">
      <UContainer class="w-full">
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          <!-- Product Search Input -->
          <UInput
            v-model="searchQuery"
            icon="i-tabler-search"
            placeholder="Search merchandise and tea produce..."
            size="md"
            color="primary"
            class="w-full md:w-80 shadow-xs rounded-xl"
            clearable
          />

          <!-- Controls Group: Category, Sorting, Stock & View Mode -->
          <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <!-- Category Dropdown with Search -->
            <USelectMenu
              v-model="selectedCategory"
              :items="categoryOptions"
              :options="categoryOptions"
              value-key="id"
              label-key="label"
              value-attribute="id"
              option-attribute="label"
              searchable
              placeholder="Filter Category..."
              class="w-40 shrink-0"
            >
              <template #leading>
                <UIcon :name="selectedCategoryMeta.icon" class="size-4 text-lime-500 shrink-0" />
              </template>
              <template #item="{ item }">
                <div class="flex items-center gap-2 truncate">
                  <UIcon :name="item?.icon || 'i-tabler-tag'" class="size-4 text-lime-500 shrink-0" />
                  <span class="truncate">{{ item?.label }}</span>
                </div>
              </template>
            </USelectMenu>

            <!-- Sort Dropdown -->
            <USelectMenu
              v-model="sortBy"
              :items="sortOptions"
              :options="sortOptions"
              value-key="id"
              label-key="label"
              value-attribute="id"
              option-attribute="label"
              class="w-36 shrink-0"
            />

            <!-- Availability Toggle -->
            <label class="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 cursor-pointer shrink-0">
              <UCheckbox v-model="inStockOnly" />
              <span class="text-neutral-700 dark:text-neutral-300">In Stock</span>
            </label>

            <!-- View Mode Switcher (Grid vs List) -->
            <div class="flex items-center p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
              <UButton
                size="xs"
                :color="viewMode === 'grid' ? 'primary' : 'neutral'"
                :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
                icon="i-tabler-layout-grid"
                aria-label="Grid View"
                class="rounded-lg font-bold"
                @click="viewMode = 'grid'"
              />
              <UButton
                size="xs"
                :color="viewMode === 'list' ? 'primary' : 'neutral'"
                :variant="viewMode === 'list' ? 'solid' : 'ghost'"
                icon="i-tabler-list"
                aria-label="List View"
                class="rounded-lg font-bold"
                @click="viewMode = 'list'"
              />
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content Container -->
    <UContainer class="w-full pt-6">
      <!-- Active Filter Summary Bar -->
      <div v-if="selectedCategory !== 'all' || searchQuery || inStockOnly" class="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-bold text-neutral-400">Active Filters:</span>
          <UBadge v-if="searchQuery" color="primary" variant="soft" class="rounded-lg font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Query: "{{ searchQuery }}"</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="searchQuery = ''" />
          </UBadge>
          <UBadge v-if="selectedCategory !== 'all'" color="primary" variant="soft" class="rounded-lg font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>Category: {{ selectedCategoryMeta.label }}</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="selectedCategory = 'all'" />
          </UBadge>
          <UBadge v-if="inStockOnly" color="primary" variant="soft" class="rounded-lg font-bold text-[11px] px-2 py-0.5 flex items-center gap-1">
            <span>In Stock Only</span>
            <UIcon name="i-tabler-x" class="size-3.5 cursor-pointer" @click="inStockOnly = false" />
          </UBadge>
          <UButton size="xs" color="neutral" variant="link" class="text-xs font-bold text-neutral-400" @click="resetFilters">
            Clear All
          </UButton>
        </div>
        <span class="font-bold text-neutral-500">
          Showing {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'item' : 'items' }}
        </span>
      </div>

      <!-- Grid View Option -->
      <div
        v-if="viewMode === 'grid' && filteredProducts.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id || product.path"
          class="group flex flex-col justify-between transition-all duration-300"
        >
          <div class="space-y-3">
            <NuxtLink :to="product.path" class="block relative aspect-4/3 sm:aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
              <NuxtImg
                v-if="getImageSrc(product)"
                :src="getImageSrc(product)"
                :alt="getTitle(product)"
                format="webp"
                quality="80"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="flex size-full items-center justify-center bg-lime-500/10 text-lime-600 dark:text-lime-400"
              >
                <UIcon name="i-tabler-shopping-bag" class="size-10" />
              </div>

              <UBadge
                v-if="product.badge"
                color="primary"
                variant="soft"
                class="absolute top-2.5 left-2.5 font-bold rounded-lg px-2.5 py-0.5 text-[10px] uppercase backdrop-blur-md"
              >
                {{ product.badge }}
              </UBadge>
            </NuxtLink>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-[10px] font-bold">
                <UBadge v-if="product.category" color="neutral" variant="subtle" class="rounded px-1.5 py-0.5 uppercase text-[9px]">
                  {{ product.category }}
                </UBadge>
                <span v-if="product.inStock !== false" class="text-lime-600 dark:text-lime-400 flex items-center gap-0.5">
                  <UIcon name="i-tabler-circle-check-filled" class="size-3" /> In Stock
                </span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
                <NuxtLink :to="product.path">
                  {{ getTitle(product) }}
                </NuxtLink>
              </h2>

              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {{ product.description }}
              </p>
            </div>
          </div>

          <!-- Price & Stepper / Add Action -->
          <div class="pt-3 mt-3 flex items-center justify-between gap-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <div>
              <span class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">{{ product.currency || 'KES' }}</span>
              <span class="text-lg font-black text-neutral-950 dark:text-white">
                {{ (product.price || 0).toLocaleString() }}
              </span>
            </div>

            <!-- Quantity Stepper when in Cart -->
            <div
              v-if="getCartQuantity(product.path) > 0"
              class="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900"
            >
              <UButton
                icon="i-tabler-minus"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="handleDecrement(product.path)"
              />
              <span class="px-2.5 text-xs font-bold text-neutral-950 dark:text-white">
                {{ getCartQuantity(product.path) }}
              </span>
              <UButton
                icon="i-tabler-plus"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="handleAdd(product)"
              />
            </div>

            <!-- Standard Add Button when not in Cart -->
            <UButton
              v-else
              color="primary"
              size="sm"
              icon="i-tabler-shopping-bag-plus"
              class="font-bold uppercase text-xs text-neutral-950 rounded-xl px-4 py-2 shrink-0"
              @click="handleAdd(product)"
            >
              Add to Bag
            </UButton>
          </div>
        </div>
      </div>

      <!-- List Row View Option -->
      <div
        v-else-if="viewMode === 'list' && filteredProducts.length"
        class="divide-y divide-neutral-200/70 dark:divide-neutral-800/70"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id || product.path"
          class="group py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
        >
          <!-- Thumbnail & Product Info -->
          <div class="flex items-start gap-4 min-w-0 flex-1">
            <NuxtLink :to="product.path" class="shrink-0">
              <NuxtImg
                v-if="getImageSrc(product)"
                :src="getImageSrc(product)"
                :alt="getTitle(product)"
                format="webp"
                quality="80"
                loading="lazy"
                class="size-16 sm:size-20 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800"
              >
                <UIcon name="i-tabler-shopping-bag" class="size-7" />
              </div>
            </NuxtLink>

            <div class="space-y-1.5 min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 text-[10px]">
                <UBadge v-if="product.category" color="neutral" variant="subtle" class="font-bold rounded px-1.5 py-0.5 text-[9px] uppercase">
                  {{ product.category }}
                </UBadge>
                <UBadge v-if="product.badge" color="primary" variant="soft" class="font-bold rounded px-1.5 py-0.5 text-[9px]">
                  {{ product.badge }}
                </UBadge>
                <span v-if="product.inStock !== false" class="text-lime-600 dark:text-lime-400 font-bold flex items-center gap-0.5">
                  <UIcon name="i-tabler-circle-check-filled" class="size-3" /> In Stock
                </span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                <NuxtLink :to="product.path">
                  {{ getTitle(product) }}
                </NuxtLink>
              </h2>

              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed max-w-2xl">
                {{ product.description }}
              </p>
            </div>
          </div>

          <!-- Price & Stepper / Add Action -->
          <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 shrink-0">
            <div class="text-left sm:text-right">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">{{ product.currency || 'KES' }}</span>
              <span class="text-lg sm:text-xl font-black text-neutral-950 dark:text-white">
                {{ (product.price || 0).toLocaleString() }}
              </span>
            </div>

            <!-- Quantity Stepper when in Cart -->
            <div
              v-if="getCartQuantity(product.path) > 0"
              class="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900"
            >
              <UButton
                icon="i-tabler-minus"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="handleDecrement(product.path)"
              />
              <span class="px-2.5 text-xs font-bold text-neutral-950 dark:text-white">
                {{ getCartQuantity(product.path) }}
              </span>
              <UButton
                icon="i-tabler-plus"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="handleAdd(product)"
              />
            </div>

            <!-- Standard Add Button when not in Cart -->
            <UButton
              v-else
              color="primary"
              size="sm"
              icon="i-tabler-shopping-bag-plus"
              class="font-bold uppercase text-xs text-neutral-950 rounded-xl px-4 py-2 shrink-0"
              @click="handleAdd(product)"
            >
              Add to Bag
            </UButton>
          </div>
        </div>
      </div>

      <!-- Filter Empty State -->
      <div v-else-if="hasAnyProduct" class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-filter-off" class="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
            No Matching Products
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            No items match your current search query or active filter selections. Try clearing your filters or searching for something else.
          </p>
        </div>

        <div class="pt-2">
          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-rotate-clockwise"
            class="rounded-xl font-bold text-xs px-4 py-2 cursor-pointer"
            @click="resetFilters"
          >
            Reset All Filters
          </UButton>
        </div>
      </div>

      <!-- Catalog Empty State -->
      <div v-else class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 mx-auto border border-neutral-200/60 dark:border-neutral-800/60">
          <UIcon name="i-tabler-shopping-bag-x" class="size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-neutral-950 dark:text-white">
            No Products Available
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            There are currently no items or merchandise listed in our shop catalog. Please check back later as we add official apparel and fresh tea produce, or contact us directly.
          </p>
        </div>

        <div class="pt-2 flex items-center justify-center gap-3">
          <UButton
            to="/contact"
            size="sm"
            color="primary"
            icon="i-tabler-mail"
            class="rounded-xl font-bold text-xs px-4 py-2 text-neutral-950 cursor-pointer"
          >
            Contact Us
          </UButton>
          <UButton
            to="/"
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-home"
            class="rounded-xl font-bold text-xs px-4 py-2 cursor-pointer"
          >
            Return Home
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
