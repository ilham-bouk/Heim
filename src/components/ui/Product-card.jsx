import { Star, ShoppingCart, Heart } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router';
import { getFinalPrice, getBadgeClass } from '../../utils/product';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group bg-white">
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary">
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

        {/* Wishlist toggle */}
        <button
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className={`absolute top-3 right-3 flex transition-all cursor-pointer ${
            wishlisted ? 'text-destructive' : 'text-gray-400 hover:text-foreground'
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-destructive' : 'fill-card'}`} />
        </button>

        {/* Add to Cart Button */}
        <div className="absolute inset-x-3 bottom-3 flex items-end opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
          <Button
            variant="primary"
            size="sm"
            className="w-full flex justify-center cursor-pointer"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-4 space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {product.category}
        </p>

        <Link to={`/shop/${product.id}`}>
          <h3 className="font-semibold text-foreground hover:text-accent transition-colors line-clamp-2">
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
                    : 'fill-border text-border'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">
            ${getFinalPrice(product)}
          </span>
          {product.discount && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard;