export type Product = {
  id: number
  name: string
  category: string
  price: number
  compareAt?: number
  rating: number
  reviews: number
  image: string
  color: string
  tag?: string
  description: string
}

export type CartLine = { productId: number; quantity: number }
export type Order = { id: string; date: string; total: number; items: CartLine[]; status: string }
export type ShopView = 'shop' | 'wishlist' | 'orders' | 'checkout'
