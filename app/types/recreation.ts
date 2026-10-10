export interface RecreationPillar {
  id: string
  title: string
  description: string
  icon: string
  badge?: string
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  unit: string
  features: string[]
  isPopular?: boolean
}

export interface ShopProduct {
  id: string
  name: string
  price: number
  currency: 'KES'
  image: string
  inStock: boolean
}

export interface RecreationEvent {
  id: string
  title: string
  date: string
  description: string
  location: string
  badge?: string
}

export interface CartItem {
  product: ShopProduct
  quantity: number
}
