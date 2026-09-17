import { Star, ShoppingCart } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router';
import { getFinalPrice, getBadgeClass } from '../../utils/product';

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white">
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold ${getBadgeClass(product.badge)}`}>
            {product.badge}
            {product.discount && product.badge === 'Sale' && ` -${product.discount}%`}
          </span>
        )}

        {/* Add to Cart Button - Visible on Hover (desktop) */}
        <div className="absolute inset-3 bottom-3 flex items-end opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
          <Button
            variant="primary"
            size="sm"
            className="w-full flex justify-center"
          >
            <ShoppingCart className="mr-2 w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-4 space-y-3">
        <p className="text-xs text-slate-500 uppercase tracking-wide">
          {product.category}
        </p>

        <Link to={`/shop/${product.id}`}>
          <h3 className="font-semibold text-slate-900 hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-500 text-yellow-500'
                    : 'fill-slate-200 text-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            ${getFinalPrice(product)}
          </span>
          {product.discount && (
            <span className="text-sm text-slate-500 line-through">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard;