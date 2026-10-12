import { Heart, Plus, Star } from 'lucide-react'
import type { Product } from '../types/shop'
import { money } from '../utils/money'

type ProductCardProps = {
  product: Product
  isWishlisted: boolean
  onAddToCart: (product: Product) => void
  onToggleWishlist: (product: Product) => void
  onViewDetails: (product: Product) => void
}

export function ProductCard({
  product,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <button
          className="product-image-button"
          onClick={() => onViewDetails(product)}
          aria-label={`View ${product.name}`}
        >
          <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
        </button>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button
          className={`heart-button ${isWishlisted ? 'is-saved' : ''}`}
          onClick={() => onToggleWishlist(product)}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <button className="quick-add" onClick={() => onAddToCart(product)}>
          <Plus size={16} /> Quick add
        </button>
      </div>
      <div className="product-info">
        <div className="product-meta">
          <span>{product.category}</span>
          <span className="rating"><Star size={13} fill="currentColor" /> {product.rating}</span>
        </div>
        <button className="product-name" onClick={() => onViewDetails(product)}>{product.name}</button>
        <div className="product-price">
          <span>{money(product.price)}</span>
          {product.compareAt && <del>{money(product.compareAt)}</del>}
        </div>
      </div>
    </article>
  )
}
