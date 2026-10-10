<script setup lang="ts">
const { cart, isCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
</script>

<template>
  <USlideover
    v-model:open="isCartOpen"
    title="Your Shopping Cart"
    description="Review selected passes and products before checkout"
  >
    <template #content>
      <div class="flex h-full flex-col justify-between p-4">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
          <h3 class="text-base font-bold text-neutral-900 dark:text-white uppercase">
            Your Cart ({{ cart.length }})
          </h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-tabler-x"
            aria-label="Close Cart"
            @click="isCartOpen = false"
          />
        </div>

        <!-- Cart Items List -->
        <div v-if="cart.length > 0" class="my-4 flex-1 overflow-y-auto space-y-3">
          <div
            v-for="item in cart"
            :key="item.product.id"
            class="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
          >
            <div class="space-y-1">
              <h4 class="text-xs font-bold text-neutral-900 dark:text-white">
                {{ item.product.name }}
              </h4>
              <p class="text-xs font-semibold text-lime-600 dark:text-lime-400">
                KES {{ item.product.price }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <UButton
                size="xs"
                color="neutral"
                variant="soft"
                icon="i-tabler-minus"
                aria-label="Decrease quantity"
                @click="updateQuantity(item.product.id, item.quantity - 1)"
              />
              <span class="text-xs font-bold">{{ item.quantity }}</span>
              <UButton
                size="xs"
                color="neutral"
                variant="soft"
                icon="i-tabler-plus"
                aria-label="Increase quantity"
                @click="updateQuantity(item.product.id, item.quantity + 1)"
              />
              <UButton
                size="xs"
                color="error"
                variant="ghost"
                icon="i-tabler-trash"
                aria-label="Remove item"
                @click="removeFromCart(item.product.id)"
              />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="my-auto text-center py-12">
          <UIcon name="i-tabler-shopping-cart-off" class="mx-auto size-12 text-neutral-400" />
          <p class="mt-2 text-sm text-neutral-500">
            Your cart is currently empty.
          </p>
        </div>

        <!-- Cart Footer / Total -->
        <div v-if="cart.length > 0" class="border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div class="flex justify-between text-base font-extrabold">
            <span>Total Amount:</span>
            <span class="text-lime-600 dark:text-lime-400">KES {{ cartTotal }}</span>
          </div>

          <div class="mt-4 space-y-2">
            <UButton block color="primary" size="lg" class="font-bold">
              PROCEED TO M-PESA CHECKOUT
            </UButton>
            <UButton block color="neutral" variant="ghost" size="xs" @click="clearCart">
              Clear Cart
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
