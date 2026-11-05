<script setup lang="ts">
import { useShopCatalog } from '~/composables/useShopCatalog'
import { LOCATION_DETAILS } from '~/utils/site-data'

const viewMode = ref<'grid' | 'list'>('grid')

const {
  products,
  getTitle,
  getImageSrc,
  addToCart,
} = await useShopCatalog()

const { cart, updateQuantity, removeFromCart } = useCart()

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
  title: `Sports Merchandise & Kits | ${LOCATION_DETAILS.company}`,
  description: 'Running apparel, complete marathon kits, school games uniforms, corporate sportswear, and selected sporting equipment from Recreation Yard Limited.',
  ogTitle: `Sports Merchandise & Kits | ${LOCATION_DETAILS.company}`,
  ogDescription: 'Running apparel, complete marathon kits, school games uniforms, corporate sportswear, and selected sporting equipment from Recreation Yard Limited.',
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}/shop`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
useSchemaOrg([{
  '@type': 'CollectionPage',
  '@id': `${siteUrl}/shop#webpage`,
  'url': `${siteUrl}/shop`,
  'name': `Sports Merchandise & Kits | ${LOCATION_DETAILS.company}`,
  'description': 'Running apparel, complete marathon kits, school games uniforms, corporate sportswear, and selected sporting equipment from Recreation Yard Limited.',
  'isPartOf': { '@id': `${siteUrl}/#website` },
  'about': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-12 sm:pb-16 transition-colors duration-300 w-full overflow-x-clip">
    <div class="pt-4 sm:pt-10 pb-4 sm:pb-6 border-b border-neutral-200 dark:border-neutral-800">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="space-y-2 sm:space-y-3 text-left sm:text-center">
          <div class="inline-flex">
            <UBadge
              color="primary"
              variant="soft"
              class="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-0.5 rounded-xs"
            >
              <UIcon name="i-tabler-shopping-bag" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
              <span>Yard Shop</span>
            </UBadge>
          </div>

          <h1 class="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
            Shop & Merchandise
          </h1>

          <p class="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-4xl mx-auto font-medium">
            Explore running apparel, complete marathon kits, school games uniforms, corporate sportswear and selected sporting equipment. We confirm specifications, availability, pricing and delivery arrangements before orders are processed.
          </p>
        </div>
      </UContainer>
    </div>

    <div class="sticky top-[var(--ui-header-height,4rem)] z-30 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md py-2.5 sm:py-3 border-b border-neutral-200 dark:border-neutral-800 transition-all">
      <UContainer class="px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-3 sm:gap-4">
          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            Available Products: <span class="text-lime-600 dark:text-lime-400 font-extrabold font-mono text-sm">{{ products?.length || 0 }}</span>
          </span>

          <div class="flex items-center p-1 rounded-xs bg-transparent border border-neutral-200 dark:border-neutral-800 shrink-0">
            <UButton
              size="xs"
              :color="viewMode === 'grid' ? 'primary' : 'neutral'"
              :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
              icon="i-tabler-layout-grid"
              aria-label="Grid View"
              class="rounded-xs font-bold cursor-pointer"
              @click="viewMode = 'grid'"
            />
            <UButton
              size="xs"
              :color="viewMode === 'list' ? 'primary' : 'neutral'"
              :variant="viewMode === 'list' ? 'solid' : 'ghost'"
              icon="i-tabler-list"
              aria-label="List View"
              class="rounded-xs font-bold cursor-pointer"
              @click="viewMode = 'list'"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="pt-4 sm:pt-8 px-3 sm:px-6 lg:px-8">
      <div
        v-if="viewMode === 'grid' && hasAnyProduct"
        class="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-transparent grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 lg:divide-x divide-neutral-200 dark:divide-neutral-800 w-full"
      >
        <NuxtLink
          v-for="product in products"
          :key="product.id || product.path"
          :to="product.path"
          class="group flex flex-col justify-between p-5 sm:p-6 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200 min-w-0 border-b last:border-b-0"
        >
          <div class="space-y-3">
            <div class="relative aspect-4/3 sm:aspect-square rounded-xs overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80">
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
                class="absolute top-2 left-2 font-bold rounded-xs px-2 py-0.5 text-[10px] uppercase backdrop-blur-md"
              >
                {{ product.badge }}
              </UBadge>
            </div>

            <div class="space-y-1.5 min-w-0">
              <div class="flex items-center justify-between text-[10px] font-bold">
                <UBadge v-if="product.category" color="neutral" variant="subtle" class="rounded-xs px-1.5 py-0.5 uppercase text-[9px] border border-neutral-200/60 dark:border-neutral-800/60">
                  {{ product.category }}
                </UBadge>
                <span v-if="product.inStock !== false" class="text-lime-600 dark:text-lime-400 flex items-center gap-0.5">
                  <UIcon name="i-tabler-circle-check-filled" class="size-3" /> In Stock
                </span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
                {{ getTitle(product) }}
              </h2>

              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                {{ product.description }}
              </p>
            </div>
          </div>

          <div class="pt-3 mt-4 flex items-center justify-between gap-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <div>
              <span v-if="product.price" class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">{{ product.currency || 'KES' }}</span>
              <span class="text-base sm:text-lg font-black text-neutral-950 dark:text-white">
                {{ product.price ? `${product.currency || 'KES'} ${product.price.toLocaleString()}` : 'Quote on request' }}
              </span>
            </div>

            <div
              v-if="product.price && getCartQuantity(product.path) > 0"
              class="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xs overflow-hidden bg-transparent"
              @click.stop.prevent
            >
              <UButton
                icon="i-tabler-minus"
                color="neutral"
                variant="ghost"
                size="xs"
                class="rounded-none cursor-pointer"
                @click.stop.prevent="handleDecrement(product.path)"
              />
              <span class="px-2.5 text-xs font-bold font-mono text-neutral-950 dark:text-white">
                {{ getCartQuantity(product.path) }}
              </span>
              <UButton
                icon="i-tabler-plus"
                color="neutral"
                variant="ghost"
                size="xs"
                class="rounded-none cursor-pointer"
                @click.stop.prevent="handleAdd(product)"
              />
            </div>

            <UButton
              v-if="product.price && getCartQuantity(product.path) === 0"
              color="primary"
              size="sm"
              icon="i-tabler-shopping-bag-plus"
              class="font-bold uppercase text-xs text-neutral-950 rounded-xs px-3 sm:px-4 py-1.5 shrink-0 cursor-pointer"
              @click.stop.prevent="handleAdd(product)"
            >
              Add to Bag
            </UButton>
            <UButton
              v-else-if="!product.price"
              :to="`/contact?type=group-booking&product=${product.path}`"
              color="primary"
              size="sm"
              icon="i-tabler-message"
              class="font-bold uppercase text-xs text-neutral-950 rounded-xs px-3 sm:px-4 py-1.5 shrink-0 cursor-pointer"
            >
              Request details
            </UButton>
          </div>
        </NuxtLink>
      </div>

      <div
        v-else-if="viewMode === 'list' && hasAnyProduct"
        class="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden bg-transparent divide-y divide-neutral-200 dark:divide-neutral-800 w-full"
      >
        <NuxtLink
          v-for="product in products"
          :key="product.id || product.path"
          :to="product.path"
          class="group block p-5 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/30 transition-colors duration-200 w-full min-w-0"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div class="flex items-start gap-4 min-w-0 flex-1 w-full sm:w-auto">
              <div class="shrink-0 relative">
                <NuxtImg
                  v-if="getImageSrc(product)"
                  :src="getImageSrc(product)"
                  :alt="getTitle(product)"
                  format="webp"
                  quality="80"
                  loading="lazy"
                  class="size-16 sm:size-20 rounded-xs object-cover border border-neutral-200 dark:border-neutral-800 group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  v-else
                  class="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-xs bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800"
                >
                  <UIcon name="i-tabler-shopping-bag" class="size-7 sm:size-8" />
                </div>
              </div>

              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-[10px]">
                  <UBadge v-if="product.category" color="neutral" variant="subtle" class="font-bold rounded-xs px-1.5 py-0.5 text-[9px] uppercase border border-neutral-200/60 dark:border-neutral-800/60">
                    {{ product.category }}
                  </UBadge>
                  <UBadge v-if="product.badge" color="primary" variant="soft" class="font-bold rounded-xs px-1.5 py-0.5 text-[9px]">
                    {{ product.badge }}
                  </UBadge>
                  <span v-if="product.inStock !== false" class="text-lime-600 dark:text-lime-400 font-bold flex items-center gap-0.5">
                    <UIcon name="i-tabler-circle-check-filled" class="size-3" /> In Stock
                  </span>
                </div>

                <h2 class="text-sm sm:text-lg font-bold text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                  {{ getTitle(product) }}
                </h2>

                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-medium">
                  {{ product.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 shrink-0">
              <div class="text-left sm:text-right">
                <span v-if="product.price" class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">{{ product.currency || 'KES' }}</span>
                <span class="text-sm sm:text-lg font-black text-neutral-950 dark:text-white">
                  {{ product.price ? `${product.currency || 'KES'} ${product.price.toLocaleString()}` : 'Quote on request' }}
                </span>
              </div>

              <div
                v-if="product.price && getCartQuantity(product.path) > 0"
                class="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xs overflow-hidden bg-transparent"
                @click.stop.prevent
              >
                <UButton
                  icon="i-tabler-minus"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="rounded-none cursor-pointer"
                  @click.stop.prevent="handleDecrement(product.path)"
                />
                <span class="px-2.5 text-xs font-bold font-mono text-neutral-950 dark:text-white">
                  {{ getCartQuantity(product.path) }}
                </span>
                <UButton
                  icon="i-tabler-plus"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="rounded-none cursor-pointer"
                  @click.stop.prevent="handleAdd(product)"
                />
              </div>

              <UButton
                v-if="product.price && getCartQuantity(product.path) === 0"
                color="primary"
                size="sm"
                icon="i-tabler-shopping-bag-plus"
                class="font-bold uppercase text-xs text-neutral-950 rounded-xs px-3.5 py-2 shrink-0 cursor-pointer"
                @click.stop.prevent="handleAdd(product)"
              >
                Add to Bag
              </UButton>
              <UButton
                v-else-if="!product.price"
                :to="`/contact?type=group-booking&product=${product.path}`"
                color="primary"
                size="sm"
                icon="i-tabler-message"
                class="font-bold uppercase text-xs text-neutral-950 rounded-xs px-3.5 py-2 shrink-0 cursor-pointer"
              >
                Request details
              </UButton>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="py-12 sm:py-20 text-center space-y-4 max-w-md mx-auto">
        <div class="flex size-14 sm:size-16 items-center justify-center rounded-xs bg-transparent border border-neutral-200 dark:border-neutral-800 mx-auto">
          <UIcon name="i-tabler-shopping-bag-x" class="size-7 sm:size-8 text-neutral-400 dark:text-neutral-500" />
        </div>

        <div class="space-y-1">
          <h3 class="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
            No Products Available
          </h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            There are currently no products available in our shop. Please check back later or contact us for more information.
          </p>
        </div>
      </div>
    </ucontainer>
  </div>
</template>
