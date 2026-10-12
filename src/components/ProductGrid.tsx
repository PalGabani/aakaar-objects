import { Search } from 'lucide-react'
import type { Product } from '../types/shop'
import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: Product[]
  loading: boolean
  wishlist: number[]
  onAddToCart: (product: Product) => void
  onToggleWishlist: (product: Product) => void
  onViewDetails: (product: Product) => void
  onClearFilters: () => void
}

export function ProductGrid({
  products,
  loading,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
  onClearFilters,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="product-grid" aria-label="Loading products">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton-image" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="empty-state compact">
        <Search size={30} />
        <h2>Nothing here just yet</h2>
        <p>Try a different search or clear a filter to find something to love.</p>
        <button className="button button-outline" onClick={onClearFilters}>Clear filters</button>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlist.includes(product.id)}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}
