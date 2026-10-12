import { useStoredState } from './useStoredState'
import { products } from '../data/products'
import type { CartLine, Product } from '../types/shop'

export function useCart(onAdd: (message: string) => void) {
  const [cart, setCart, error] = useStoredState<CartLine[]>('aakaar-objects-inr-cart', [])

  const count = cart.reduce((total, line) => total + line.quantity, 0)
  const subtotal = cart.reduce((total, line) => {
    const product = products.find((item) => item.id === line.productId)
    return total + (product?.price ?? 0) * line.quantity
  }, 0)
  const items = cart
    .map((line) => ({ ...line, product: products.find((item) => item.id === line.productId) }))
    .filter((line): line is CartLine & { product: Product } => Boolean(line.product))

  const add = (product: Product) => {
    setCart((current) => {
      const existing = current.find((line) => line.productId === product.id)
      return existing
        ? current.map((line) =>
            line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line,
          )
        : [...current, { productId: product.id, quantity: 1 }]
    })
    onAdd(`${product.name} added to your bag`)
  }

  const changeQuantity = (productId: number, amount: number) => {
    setCart((current) =>
      current
        .map((line) =>
          line.productId === productId ? { ...line, quantity: line.quantity + amount } : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }

  const clear = () => setCart([])

  return { cart, count, subtotal, items, error, add, changeQuantity, clear }
}
