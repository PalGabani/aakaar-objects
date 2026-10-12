import { useMemo } from 'react'
import { products } from '../data/products'
import type { Product, ShopView } from '../types/shop'

type CatalogOptions = {
  appliedSearch: string
  category: string
  page: number
  pageSize: number
  priceLimit: number
  ratingOnly: boolean
  sort: string
  view: ShopView
  wishlist: number[]
}

export function useProductCatalog({
  appliedSearch,
  category,
  page,
  pageSize,
  priceLimit,
  ratingOnly,
  sort,
  view,
  wishlist,
}: CatalogOptions) {
  const filteredProducts = useMemo(() => {
    const query = appliedSearch.trim().toLowerCase()
    const filtered = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesSearch =
        !query ||
        `${product.name} ${product.category} ${product.color} ${product.description}`.toLowerCase().includes(query)
      const matchesPrice = product.price <= priceLimit
      const matchesRating = !ratingOnly || product.rating >= 4.8
      const matchesWishlist = view !== 'wishlist' || wishlist.includes(product.id)
      return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesWishlist
    })

    if (sort === 'Price: low to high') return filtered.sort((a, b) => a.price - b.price)
    if (sort === 'Price: high to low') return filtered.sort((a, b) => b.price - a.price)
    if (sort === 'Top rated') return filtered.sort((a, b) => b.rating - a.rating)
    return filtered
  }, [appliedSearch, category, priceLimit, ratingOnly, sort, view, wishlist])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const shownProducts: Product[] = filteredProducts.slice((page - 1) * pageSize, page * pageSize)

  return { filteredProducts, shownProducts, pageCount }
}
