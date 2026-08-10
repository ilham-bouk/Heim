import { useState } from 'react';
import { ChevronRight, Trash2, Heart, ShoppingBag, ArrowLeft, ShoppingCart, Star, X } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const getFinalPrice = (item) =>
  item.discount
    ? Math.floor(item.price - (item.price * (item.discount / 100)))
    : item.price;

const getBadgeClass = (badge) => {
  if (badge === 'Sale') return 'bg-red-500 text-white';
  if (badge === 'New')  return 'bg-blue-500 text-white';
  return 'bg-purple-500 text-white';
};

/* Breadcrumb */
const Breadcrumb = () => (
  <div className="bg-slate-50 border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-medium">Wishlist</span>
      </nav>
    </div>
  </div>
);

/* Empty state */
const EmptyWishlist = () => (
  <div className="min-h-screen bg-white">
    <Breadcrumb />
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
            <Heart className="w-12 h-12 text-slate-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h1>
        <p className="text-slate-600 mb-8 max-w-md">
          You haven't saved any items yet. Explore our collection and click the heart icon on any product to save it here.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="lg" className="flex justify-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

/* Wishlist card */
const WishlistCard = ({ item, onRemove, onAddToCart }) => {
  const finalPrice = getFinalPrice(item);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(item);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 group">

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link to={`/product/${item.id}`}>
          <img
            src={item.image}
            alt={item.name}
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

        {/* Single remove button — appears on hover */}
        <button
          onClick={() => onRemove(item.id)}
          aria-label="Remove from wishlist"
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-slate-400 hover:text-red-500 hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">
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
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">({item.rating})</span>
            </div>
          )}
        </div>

        <Link to={`/product/${item.id}`}>
          <h3 className="font-bold text-slate-900 hover:text-accent transition-colors line-clamp-2 mb-3 leading-snug">
            {item.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-slate-900">${finalPrice}</span>
          {item.discount && (
            <>
              <span className="text-sm text-slate-400 line-through">${item.price}</span>
              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
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
            <Link to={`/product/${item.id}`} className="flex-1">
              <button className="w-full px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                View Details
              </button>
            </Link>
            <button
              onClick={() => onRemove(item.id)}
              aria-label="Remove from wishlist"
              className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shrink-0"
            >
              <Trash2 className="w-4 h-4" />
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
    <div className="min-h-screen bg-white">
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">My Wishlist</h1>
            <p className="text-slate-500 mt-2">
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
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all"
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
          className="inline-flex items-center gap-2 mt-12 text-accent hover:text-accent/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;