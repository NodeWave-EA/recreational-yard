<script setup lang="ts">
import { useShopCatalog } from '~/composables/useShopCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

// Active View Mode State ('grid' | 'list')
const viewMode = ref<'grid' | 'list'>('grid')

const {
  products,
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
  <div class="min-h-screen bg-default text-muted pb-16 transition-colors duration-300">
    <!-- Left-Aligned Mobile Hero Banner -->
    <div class="pt-6 sm:pt-10 pb-2 sm:pb-4 text-left sm:text-center space-y-3 mx-auto px-4">
      <div class="inline-flex">
        <UBadge
          color="primary"
          variant="soft"
          class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-3.5 py-1 sm:py-0.5 rounded-full"
        >
          <UIcon name="i-tabler-shopping-bag" class="size-3.5 mr-1.5 text-primary shrink-0" />
          <span>
            Yard Shop
          </span>
        </UBadge>
      </div>

      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-highlighted leading-tight">
        Shop & Merchandise
      </h1>

      <p class="text-xs sm:text-base text-muted leading-relaxed max-w-2xl mx-0 sm:mx-auto">
        Explore running apparel, complete marathon kits, school games uniforms, corporate sportswear and selected sporting equipment. We confirm specifications, availability, pricing and delivery arrangements before orders are processed.
      </p>
    </div>

    <!-- Main Content Container -->
    <UContainer class="pt-6">
      <div class="mb-6 flex justify-end" role="group" aria-label="View mode">
        <div class="flex items-center gap-1 p-1 rounded-sm bg-elevated border border-default">
          <UButton size="xs" :color="viewMode === 'grid' ? 'primary' : 'neutral'" :variant="viewMode === 'grid' ? 'solid' : 'ghost'" icon="i-tabler-layout-grid" aria-label="Grid View" :aria-pressed="viewMode === 'grid'" class="rounded-sm" @click="viewMode = 'grid'" />
          <UButton size="xs" :color="viewMode === 'list' ? 'primary' : 'neutral'" :variant="viewMode === 'list' ? 'solid' : 'ghost'" icon="i-tabler-list" aria-label="List View" :aria-pressed="viewMode === 'list'" class="rounded-sm" @click="viewMode = 'list'" />
        </div>
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
            <NuxtLink :to="product.path" class="block relative aspect-4/3 sm:aspect-square  overflow-hidden bg-elevated border border-default">
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
                class="flex size-full items-center justify-center bg-primary/10 text-primary"
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
                <span v-if="product.inStock !== false" class="text-primary flex items-center gap-0.5">
                  <UIcon name="i-tabler-circle-check-filled" class="size-3" /> In Stock
                </span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-highlighted group-hover:text-primary transition-colors line-clamp-1">
                <NuxtLink :to="product.path">
                  {{ getTitle(product) }}
                </NuxtLink>
              </h2>

              <p class="text-xs text-muted line-clamp-2 leading-relaxed">
                {{ product.description }}
              </p>
            </div>
          </div>

          <!-- Price & Stepper / Add Action -->
          <div class="pt-3 mt-3 flex items-center justify-between gap-2 border-t border-default">
            <div>
              <span v-if="product.price" class="text-[9px] font-bold uppercase tracking-wider text-muted block">{{ product.currency || 'KES' }}</span>
              <span class="text-lg font-black text-highlighted">
                {{ product.price ? `${product.currency || 'KES'} ${product.price.toLocaleString()}` : 'Quote on request' }}
              </span>
            </div>

            <!-- Quantity Stepper when in Cart -->
            <div
              v-if="product.price && getCartQuantity(product.path) > 0"
              class="flex items-center border border-default rounded-sm overflow-hidden bg-elevated"
            >
              <UButton
                icon="i-tabler-minus"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="handleDecrement(product.path)"
              />
              <span class="px-2.5 text-xs font-bold text-highlighted">
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
              v-if="product.price"
              color="primary"
              size="sm"
              icon="i-tabler-shopping-bag-plus"
              class="font-bold uppercase text-xs text-highlighted rounded-sm px-4 py-2 shrink-0"
              @click="handleAdd(product)"
            >
              Add to Bag
            </UButton>
            <UButton
              v-else
              :to="`/contact?type=group-booking&product=${product.path}`"
              color="primary"
              size="sm"
              icon="i-tabler-message"
              class="font-bold uppercase text-xs text-highlighted rounded-sm px-4 py-2 shrink-0"
            >
              Request details
            </UButton>
          </div>
        </div>
      </div>

      <!-- List Row View Option -->
      <div
        v-else-if="viewMode === 'list' && filteredProducts.length"
        data-catalog-list class="divide-y divide-default dark:divide-default"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id || product.path"
          data-catalog-list-row class="group py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
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
                class="size-16 sm:size-20 rounded-sm object-cover border border-default group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary border border-default"
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
                <span v-if="product.inStock !== false" class="text-primary font-bold flex items-center gap-0.5">
                  <UIcon name="i-tabler-circle-check-filled" class="size-3" /> In Stock
                </span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-highlighted group-hover:text-primary transition-colors truncate">
                <NuxtLink :to="product.path">
                  {{ getTitle(product) }}
                </NuxtLink>
              </h2>

              <p class="text-xs text-muted line-clamp-2 leading-relaxed max-w-2xl">
                {{ product.description }}
              </p>
            </div>
          </div>

          <!-- Price & Stepper / Add Action -->
          <div class="flex items-center justify-between sm:justify-end gap-4 w-full lg:w-auto pt-2 sm:pt-0 shrink-0">
            <div class="text-left sm:text-right">
              <span v-if="product.price" class="text-[10px] font-bold uppercase tracking-wider text-muted block">{{ product.currency || 'KES' }}</span>
              <span class="text-lg sm:text-xl font-black text-highlighted">
                {{ product.price ? `${product.currency || 'KES'} ${product.price.toLocaleString()}` : 'Quote on request' }}
              </span>
            </div>

            <!-- Quantity Stepper when in Cart -->
            <div
              v-if="product.price && getCartQuantity(product.path) > 0"
              class="flex items-center border border-default rounded-sm overflow-hidden bg-elevated"
            >
              <UButton
                icon="i-tabler-minus"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="handleDecrement(product.path)"
              />
              <span class="px-2.5 text-xs font-bold text-highlighted">
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
              v-if="product.price"
              color="primary"
              size="sm"
              icon="i-tabler-shopping-bag-plus"
              class="font-bold uppercase text-xs text-highlighted rounded-sm px-4 py-2 shrink-0"
              @click="handleAdd(product)"
            >
              Add to Bag
            </UButton>
            <UButton
              v-else
              :to="`/contact?type=group-booking&product=${product.path}`"
              color="primary"
              size="sm"
              icon="i-tabler-message"
              class="font-bold uppercase text-xs text-highlighted rounded-sm px-4 py-2 shrink-0"
            >
              Request details
            </UButton>
          </div>
        </div>
      </div>

      <!-- Filter Empty State -->
      <div v-else-if="hasAnyProduct" class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center  bg-elevated mx-auto border border-default">
          <UIcon name="i-tabler-filter-off" class="size-8 text-muted" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-highlighted">
            No Matching Products
          </h3>
          <p class="text-xs text-muted leading-relaxed">
            No items match your current search query or active filter selections. Try clearing your filters or searching for something else.
          </p>
        </div>

        <div class="pt-2">
          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-rotate-clockwise"
            class="rounded-sm font-bold text-xs px-4 py-2 cursor-pointer"
            @click="resetFilters"
          >
            Reset All Filters
          </UButton>
        </div>
      </div>

      <!-- Catalog Empty State -->
      <div v-else class="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div class="flex size-16 items-center justify-center  bg-elevated mx-auto border border-default">
          <UIcon name="i-tabler-shopping-bag-x" class="size-8 text-muted" />
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-bold text-highlighted">
            No Products Available
          </h3>
          <p class="text-xs text-muted leading-relaxed">
            There are currently no items or merchandise listed in our shop catalog. Please check back later as we add official apparel and fresh tea produce, or contact us directly.
          </p>
        </div>

        <div class="pt-2 flex items-center justify-center gap-3">
          <UButton
            to="/contact"
            size="sm"
            color="primary"
            icon="i-tabler-mail"
            class="rounded-sm font-bold text-xs px-4 py-2 text-highlighted cursor-pointer"
          >
            Contact Us
          </UButton>
          <UButton
            to="/"
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-tabler-home"
            class="rounded-sm font-bold text-xs px-4 py-2 cursor-pointer"
          >
            Return Home
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
