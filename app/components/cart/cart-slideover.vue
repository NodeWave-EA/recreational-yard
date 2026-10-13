<script setup lang="ts">
const { cart, isCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart, itemCount } = useCart()

function closeCart() {
  isCartOpen.value = false
}
</script>

<template>
  <USlideover
    v-model:open="isCartOpen"
    title="Shopping Bag"
    description="Review selected passes and merchandise"
  >
    <template #content>
      <div class="flex h-full flex-col justify-between p-4 sm:p-6 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-tabler-shopping-bag" class="size-5 text-lime-500" />
            <h3 class="text-base font-black uppercase tracking-wider text-neutral-950 dark:text-white">
              Shopping Bag
            </h3>
            <UBadge color="primary" variant="soft" class="font-bold text-xs rounded-full px-2 py-0.5">
              {{ itemCount }}
            </UBadge>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-tabler-x"
            aria-label="Close Cart"
            class="rounded-xl"
            @click="closeCart"
          />
        </div>

        <!-- Cart Items List -->
        <div v-if="cart.length > 0" class="my-4 flex-1 overflow-y-auto divide-y divide-neutral-200/70 dark:divide-neutral-800/70 pr-1">
          <div
            v-for="item in cart"
            :key="item.product.id"
            class="group py-3.5 flex items-center gap-3.5 transition-colors"
          >
            <!-- Product Thumbnail -->
            <NuxtLink :to="item.product.id" class="shrink-0" @click="closeCart">
              <NuxtImg
                v-if="item.product.image"
                :src="item.product.image"
                :alt="item.product.name"
                width="56"
                height="56"
                sizes="56px"
                loading="lazy"
                class="size-14 rounded-xl object-cover border border-neutral-200/80 dark:border-neutral-800/80"
              />
              <div
                v-else
                class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-neutral-200 dark:border-neutral-800"
              >
                <UIcon name="i-tabler-shopping-bag" class="size-6" />
              </div>
            </NuxtLink>

            <!-- Title & Price Info -->
            <div class="flex-1 min-w-0 space-y-0.5">
              <h4 class="text-xs font-bold text-neutral-950 dark:text-white truncate">
                <NuxtLink :to="item.product.id" class="hover:text-lime-600 dark:hover:text-lime-400 transition-colors" @click="closeCart">
                  {{ item.product.name }}
                </NuxtLink>
              </h4>
              <p class="text-xs font-black text-neutral-900 dark:text-white">
                <span class="text-[10px] text-neutral-400 font-bold mr-0.5">{{ item.product.currency || 'KES' }}</span>
                {{ (item.product.price * item.quantity).toLocaleString() }}
                <span v-if="item.quantity > 1" class="text-[10px] font-normal text-neutral-400">
                  ({{ item.product.price.toLocaleString() }} ea)
                </span>
              </p>
            </div>

            <!-- Stepper + Delete Controls -->
            <div class="flex items-center gap-1.5 shrink-0">
              <div class="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-tabler-minus"
                  aria-label="Decrease quantity"
                  class="min-h-11 min-w-11 justify-center text-neutral-400 hover:text-lime-600 dark:hover:text-lime-400"
                  @click="updateQuantity(item.product.id, item.quantity - 1)"
                />
                <span class="px-2 text-xs font-black text-neutral-950 dark:text-white">{{ item.quantity }}</span>
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-tabler-plus"
                  aria-label="Increase quantity"
                  class="min-h-11 min-w-11 justify-center text-neutral-400 hover:text-lime-600 dark:hover:text-lime-400"
                  @click="updateQuantity(item.product.id, item.quantity + 1)"
                />
              </div>

              <UButton
                size="xs"
                color="error"
                variant="ghost"
                icon="i-tabler-trash"
                aria-label="Remove item"
                class="min-h-11 min-w-11 rounded-lg justify-center text-neutral-400 hover:text-red-500 dark:hover:text-red-400"
                @click="removeFromCart(item.product.id)"
              />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="my-auto text-center py-12 space-y-3">
          <div class="flex size-16 mx-auto items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400">
            <UIcon name="i-tabler-shopping-cart-off" class="size-8" />
          </div>
          <div class="space-y-1">
            <h4 class="text-base font-bold text-neutral-950 dark:text-white">
              Your bag is empty
            </h4>
            <p class="text-xs text-neutral-500 max-w-xs mx-auto">
              Explore our shop catalog for fresh Kericho tea produce, sportswear, and passes.
            </p>
          </div>
          <UButton
            to="/shop"
            color="primary"
            size="sm"
            icon="i-tabler-arrow-right"
            trailing
            class="font-extrabold uppercase text-xs text-neutral-950 rounded-xl px-5 py-2 mt-2"
            @click="closeCart"
          >
            Explore Shop
          </UButton>
        </div>

        <!-- Cart Footer / Total -->
        <div v-if="cart.length > 0" class="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-4">
          <div class="space-y-1.5">
            <div class="flex justify-between items-center text-xs text-neutral-500">
              <span>Items Subtotal ({{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }})</span>
              <span class="font-bold text-neutral-900 dark:text-white">KES {{ cartTotal.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-sm sm:text-base font-black">
              <span>Total Amount:</span>
              <span class="text-lime-600 dark:text-lime-400">KES {{ cartTotal.toLocaleString() }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <UButton
              block
              color="primary"
              size="lg"
              icon="i-tabler-device-mobile-charging"
              class="font-black uppercase text-xs text-neutral-950 rounded-xl py-3.5 justify-center"
            >
              PROCEED TO M-PESA CHECKOUT
            </UButton>

            <div class="flex items-center justify-between text-xs pt-1">
              <UButton
                color="neutral"
                variant="link"
                size="xs"
                icon="i-tabler-trash"
                class="text-xs font-bold text-neutral-400 hover:text-red-500 p-0"
                @click="clearCart"
              >
                Clear Bag
              </UButton>

              <NuxtLink
                to="/shop"
                class="font-bold text-neutral-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
                @click="closeCart"
              >
                Continue Shopping &rarr;
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
