<script setup lang="ts">
import type { ShopProduct } from '~/types/recreation'
import { useContentQuery } from '~/composables/useContentQuery'
import { LOCATION_DETAILS } from '~/utils/site-data'

const route = useRoute()
const { getByPath } = useContentQuery()
const { cart, addToCart, updateQuantity, removeFromCart } = useCart()

const { data: product } = await getByPath(
  `product-${route.path}`,
  'shop',
  route.path,
  { enableLogging: false },
)

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product Not Found',
    fatal: true,
  })
}

const cartQuantity = computed(() => {
  const item = cart.value.find(i => i.product.id === product.value?.path)
  return item ? item.quantity : 0
})

function handleAddToCart() {
  if (!product.value)
    return

  const prod: ShopProduct = {
    id: product.value.path || route.path,
    name: product.value.title || product.value.name || 'Product',
    price: product.value.price || 0,
    currency: product.value.currency || 'KES',
    image: typeof product.value.image === 'string' ? product.value.image : product.value.image?.src || '',
    inStock: product.value.inStock ?? true,
  }
  addToCart(prod)
}

function getProductImage() {
  const image = product.value?.image
  return typeof image === 'string' ? image : image?.src || ''
}

function decreaseQuantity() {
  if (!product.value)
    return

  if (cartQuantity.value > 1) {
    updateQuantity(product.value.path, cartQuantity.value - 1)
  } else if (cartQuantity.value === 1) {
    removeFromCart(product.value.path)
  }
}

function increaseQuantity() {
  if (!product.value)
    return

  updateQuantity(product.value.path, cartQuantity.value + 1)
}

useSeoMeta({
  title: `${product.value.title || product.value.name} | Shop | ${LOCATION_DETAILS.company}`,
  description: product.value.description,
  ogTitle: `${product.value.title || product.value.name} | Shop | ${LOCATION_DETAILS.company}`,
  ogDescription: product.value.description,
  ogImage: getProductImage() || undefined,
  ogUrl: `${useRuntimeConfig().public.siteUrl}${route.path}`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
const pageUrl = `${siteUrl}${route.path}`
useSchemaOrg([{
  '@type': 'Product',
  '@id': `${pageUrl}#product`,
  'url': pageUrl,
  'name': product.value.title || product.value.name,
  'description': product.value.description,
  'image': getProductImage() || undefined,
  'brand': { '@type': 'Brand', 'name': LOCATION_DETAILS.company },
  'offers': product.value.price
    ? {
        '@type': 'Offer',
        'url': pageUrl,
        'price': product.value.price,
        'priceCurrency': product.value.currency || 'KES',
        'availability': product.value.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      }
    : undefined,
}])
</script>

<template>
  <div class="py-4 sm:py-12 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen transition-colors duration-300 w-full overflow-x-clip">
    <UContainer v-if="product" class="space-y-6 sm:space-y-8 px-3 sm:px-6 lg:px-8">
      <div>
        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
          <UIcon name="i-tabler-arrow-left" class="size-4" />
          <span>Back to Shop</span>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        <div class="lg:col-span-6 relative rounded-none sm:rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-0 sm:border border-neutral-200/80 dark:border-neutral-800/80 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-none sm:shadow-xs">
          <NuxtImg
            v-if="getProductImage()"
            :src="getProductImage()"
            :alt="product.title || product.name"
            width="800"
            height="800"
            sizes="(max-width: 1024px) 100vw, 50vw"
            format="webp"
            quality="80"
            loading="eager"
            class="w-full h-64 sm:h-105 object-cover"
          />
          <UBadge
            v-if="product.badge"
            color="primary"
            class="absolute top-3 left-3 sm:top-4 sm:left-4 font-bold text-xs rounded-md"
          >
            {{ product.badge }}
          </UBadge>
        </div>

        <div class="lg:col-span-6 space-y-5 sm:space-y-6 min-w-0">
          <div>
            <UBadge color="neutral" variant="soft" class="text-[10px] uppercase font-bold tracking-wider mb-2 rounded-md">
              {{ product.category || 'Merchandise' }}
            </UBadge>
            <h1 class="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white leading-tight">
              {{ product.title || product.name }}
            </h1>
            <p class="mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              {{ product.description }}
            </p>
          </div>

          <div class="flex items-baseline gap-2 py-2.5 sm:py-3 border-y border-neutral-200 dark:border-neutral-800">
            <span class="text-xl sm:text-3xl font-black text-neutral-950 dark:text-white">
              {{ product.price ? `${product.currency || 'KES'} ${product.price.toLocaleString()}` : 'Quote on request' }}
            </span>
            <span v-if="product.price && product.inStock !== false" class="ml-auto text-xs font-bold text-lime-600 dark:text-lime-400 flex items-center gap-1">
              <UIcon name="i-tabler-check" class="size-4" /> In Stock
            </span>
          </div>

          <div v-if="product.details?.length" class="space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Product Highlights
            </h3>
            <ul class="space-y-1.5 sm:space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
              <li v-for="(detail, idx) in product.details" :key="idx" class="flex items-center gap-2 font-medium">
                <UIcon name="i-tabler-point" class="size-4 text-lime-500 shrink-0" />
                <span>{{ detail }}</span>
              </li>
            </ul>
          </div>

          <div class="pt-3 sm:pt-4 space-y-2.5 sm:space-y-3">
            <div
              v-if="product.price && cartQuantity > 0"
              class="flex items-center justify-between w-full py-1.5 sm:py-2"
            >
              <span class="text-xs font-black uppercase text-lime-600 dark:text-lime-400 flex items-center gap-1.5">
                <UIcon name="i-tabler-shopping-bag-check" class="size-4" />
                In Shopping Bag
              </span>

              <div class="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <UButton
                  icon="i-tabler-minus"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="px-3 py-2 cursor-pointer"
                  @click="decreaseQuantity"
                />
                <span class="px-4 text-sm font-black text-neutral-950 dark:text-white">
                  {{ cartQuantity }}
                </span>
                <UButton
                  icon="i-tabler-plus"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="px-3 py-2 cursor-pointer"
                  @click="increaseQuantity"
                />
              </div>
            </div>

            <UButton
              v-if="product.price"
              block
              size="lg"
              color="primary"
              icon="i-tabler-shopping-bag-plus"
              class="font-black uppercase text-xs text-neutral-950 rounded-md py-3.5 cursor-pointer justify-center"
              @click="handleAddToCart"
            >
              Add to Shopping Bag
            </UButton>
            <UButton
              v-else
              to="/contact?type=merchandise-quote"
              block
              size="lg"
              color="primary"
              icon="i-tabler-message"
              class="font-black uppercase text-xs text-neutral-950 rounded-md py-3.5 cursor-pointer justify-center"
            >
              Request details & quotation
            </UButton>
          </div>
        </div>
      </div>

      <div
        v-if="product.body"
        class="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-neutral-200 dark:border-neutral-800 prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
      >
        <ContentRenderer :value="product" />
      </div>
    </UContainer>
  </div>
</template>
