import { useState } from 'react';
import { Trash2, Heart, ShoppingBag, ArrowLeft, ShoppingCart, Star, X } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getFinalPrice, getBadgeClass } from '../utils/product';
import Breadcrumb from '../components/ui/Breadcrumb';

/* Empty state */
const EmptyWishlist = () => (
  <div className="min-h-screen bg-background">
    <Breadcrumb items={[{ label: 'Wishlist' }]} />

    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
            <Heart className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Wishlist is Empty</h1>
        <p className="text-foreground/80 mb-8 max-w-md">
          You haven't saved any items yet. Explore our collection and click the heart icon on any product to save it here.
        </p>
        <Button as={Link} to="/shop" variant="primary" size="lg" className="gap-2">
          <ShoppingBag className="w-5 h-5" />
          Start Shopping
        </Button>
      </div>
    </div>
  </div>
);

/* Wishlist card */
const WishlistCard = ({ item, onRemove, onAddToCart }) => {
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(item);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const removeLabel = `Remove ${item.name} from wishlist`;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow duration-300 group">

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to={`/shop/${item.id}`}>
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badge */}
        {item.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold ${getBadgeClass(item.badge)}`}>
            {item.badge}
            {item.discount && item.badge === 'Sale' && ` -${item.discount}%`}
          </span>
        )}

        {/* Quick remove: appears on hover, and on keyboard focus so it isn't mouse-only */}
        <button
          onClick={() => onRemove(item.id)}
          aria-label={removeLabel}
          className="absolute top-3 right-3 w-8 h-8 bg-card rounded-full shadow flex items-center justify-center text-muted-foreground hover:text-destructive hover:shadow-md transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            {item.category}
          </span>
          {item.rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(item.rating)
                        ? 'fill-rating text-rating'
                        : 'fill-border text-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({item.rating})</span>
            </div>
          )}
        </div>

        <Link to={`/shop/${item.id}`}>
          <h3 className="font-bold text-foreground hover:text-accent-text transition-colors line-clamp-2 mb-3 leading-snug">
            {item.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-foreground">${getFinalPrice(item)}</span>
          {item.discount && (
            <>
              <span className="text-sm text-muted-foreground line-through">${item.price}</span>
              <span className="px-1.5 py-0.5 bg-destructive/10 text-destructive-text text-xs font-semibold rounded">
                -{item.discount}%
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            variant="primary"
            size="md"
            className="w-full flex justify-center items-center gap-2"
            onClick={handleAddToCart}
          >
            {addedFeedback ? (
              'Added to Cart!'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Link 
              to={`/shop/${item.id}`}
              className="flex-1 px-4 py-2 text-center border border-border rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-foreground/80"
            >
              View Details
            </Link>
            <button
              onClick={() => onRemove(item.id)}
              aria-label={removeLabel}
              className="w-9 h-9 flex items-center justify-center border border-border rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-all shrink-0"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Wishlist ────────────────────────────────────────────────────────────── */
const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) return <EmptyWishlist />;

  const handleAddToCart = (item) => {
    addToCart(item, 1);
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => addToCart(item, 1));
    clearWishlist();
  };

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-muted-foreground mt-2">
              {wishlistItems.length} saved {wishlistItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Bulk actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              className="flex items-center gap-2"
              onClick={handleAddAllToCart}
            >
              <ShoppingCart className="w-4 h-4" />
              Add All to Cart
            </Button>
            <button
              onClick={clearWishlist}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-muted-foreground hover:text-destructive-text border border-border hover:border-destructive/30 hover:bg-destructive/10 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(item => (
            <WishlistCard
              key={item.id}
              item={item}
              onRemove={removeFromWishlist}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Continue shopping */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 mt-12 text-accent-text hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;