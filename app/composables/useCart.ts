import type { CartItem, ShopProduct } from '~/types/recreation'
import { useLocalStorage } from '@vueuse/core'

export function useCart() {
  const cart = useLocalStorage<CartItem[]>('recreation-cart', [])
  const isCartOpen = useState<boolean>('recreation-cart-open', () => false)

  const addToCart = (product: ShopProduct) => {
    const existing = cart.value.find(item => item.product.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.value.push({ product, quantity: 1 })
    }
  }

  const removeFromCart = (productId: string) => {
    cart.value = cart.value.filter(item => item.product.id !== productId)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.value.find(i => i.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    cart.value = []
  }

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  const cartTotal = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  })

  const itemCount = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  return {
    cart,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    cartTotal,
    itemCount,
  }
}
