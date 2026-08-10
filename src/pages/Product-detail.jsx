import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ChevronRight, Heart, Share2, ShoppingCart, Minus, Plus, Star, Truck, Shield, RotateCcw, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import { useCart }     from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products }    from '../data/mockData';

const getFinalPrice = (item) =>
  item.discount
    ? Math.floor(item.price - (item.price * (item.discount / 100)))
    : item.price;

const getBadgeClass = (badge) => {
  if (badge === 'Sale') return 'bg-red-500 text-white';
  if (badge === 'New')  return 'bg-blue-500 text-white';
  return 'bg-purple-500 text-white';
};

/* ─── ProductDetail ───────────────────────────────────────────────────── */
const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cartItems }          = useCart();
  const { toggleWishlist, isInWishlist }  = useWishlist();

  const [quantity, setQuantity]         = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart]   = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Product Not Found</h1>
        <p className="text-slate-600 mb-8">The product you're looking for doesn't exist.</p>
        <Link to="/shop">
          <Button variant="primary">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const finalPrice  = getFinalPrice(product);
  const savings     = product.discount
    ? Math.floor(product.price * (product.discount / 100))
    : 0;

  const productImages = [product.image];

  const wishlisted = isInWishlist(product.id);

  // Cart state for smart button label
  const cartItem  = cartItems.find(item => item.id === product.id);
  const isInCart  = !!cartItem;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    // Reset the feedback after 2 seconds
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const incQuantity = () => setQuantity(q => q + 1);
  const decQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/"     className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/shop" className="hover:text-slate-900 transition-colors">Shop</Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/shop?category=${product.category}`}
              className="hover:text-slate-900 transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main product section */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* Images */}
          <div>
            {/* Main image */}
            <div className="relative mb-4 bg-slate-50 rounded-2xl overflow-hidden aspect-square">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className={`absolute top-6 left-6 px-4 py-2 rounded-lg text-sm font-semibold ${getBadgeClass(product.badge)}`}>
                  {product.badge}
                  {product.discount && product.badge === 'Sale' && ` -${product.discount}%`}
                </span>
              )}
            </div>

            {/* Thumbnail strip — only rendered when there are multiple images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-slate-900'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">

            {/* Category + title */}
            <div className="mb-6">
              <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">{product.category}</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">{product.name}</h1>
              <p className="text-lg text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-bold text-slate-900">${finalPrice}</span>
                {product.discount && (
                  <span className="text-xl text-slate-400 line-through">${product.price}</span>
                )}
              </div>
            </div>

            {/* Add to cart section */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-4 mb-4">

                {/* Quantity */}
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button
                    onClick={decQuantity}
                    aria-label="Decrease quantity"
                    className="p-2 hover:bg-slate-100 transition-colors rounded-l-lg cursor-pointer"
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="w-12 text-center font-semibold text-slate-900 select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={incQuantity}
                    aria-label="Increase quantity"
                    className="p-2 hover:bg-slate-100 transition-colors rounded-r-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-medium transition-all cursor-pointer ${
                    wishlisted
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-600' : ''}`} />
                  {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Add to cart button — smart label */}
              <Button
                variant="primary"
                size="lg"
                className="w-full flex justify-center gap-2 cursor-pointer"
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {isInCart ? `Add More (${cartItem.quantity} in cart)` : 'Add to Cart'}
                  </>
                )}
              </Button>

              {/* View cart shortcut — only when item already in cart */}
              {isInCart && !addedToCart && (
                <Link
                  to="/cart"
                  className="mt-3 flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-2"
                >
                  View Cart · {cartItem.quantity} {cartItem.quantity === 1 ? 'item' : 'items'}
                </Link>
              )}
            </div>

            {/* Trust features */}
            <div className="space-y-4">
              {[
                { Icon: Truck,     title: 'Free Shipping',   sub: 'On orders over $100' },
                { Icon: Shield,    title: '2-Year Warranty', sub: 'Comprehensive coverage included' },
                { Icon: RotateCcw, title: '30-Day Returns',  sub: 'Easy returns for any reason' },
              ].map(({ Icon, title, sub }) => (
                <div key={title} className="flex items-start gap-4">
                  <Icon className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="text-sm text-slate-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="mt-auto pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">Share this product:</p>
              <div className="flex gap-3">
                <button className="p-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <Share2 className="w-5 h-5 text-slate-600" />
                </button>
                <button className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600 font-medium cursor-pointer">
                  Share on Facebook
                </button>
                <button className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600 font-medium cursor-pointer">
                  Share on Twitter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product info tabs */}
        <div className="border-t border-slate-200 pt-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description} This premium piece combines modern aesthetics with superior
                craftsmanship. Made from high-quality materials, it's designed to last for years
                while maintaining its elegant appearance.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Specifications</h3>
              <ul className="space-y-3 text-slate-600">
                {[
                  ['Dimensions', 'H: 85cm × W: 120cm'],
                  ['Material', 'Premium Oak Wood'],
                  ['Weight', '45 kg'],
                  ['Color', 'Natural'],
                ].map(([label, value]) => (
                  <li key={label} className="flex justify-between">
                    <span>{label}</span>
                    <span className="font-medium text-slate-900">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Care Instructions</h3>
              <ul className="space-y-2 text-slate-600 text-sm">
                {[
                  'Dust regularly with a soft, dry cloth',
                  'Use furniture polish every 3–4 months',
                  'Avoid direct sunlight to prevent fading',
                  'Keep away from heat sources',
                  'Use coasters for hot or cold items',
                ].map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="text-slate-400 shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Related products ────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-200 pt-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => {
                const relPrice = getFinalPrice(rel);
                return (
                  <Link key={rel.id} to={`/shop/${rel.id}`}>
                    <div className="group bg-white">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={rel.image}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {rel.badge && (
                          <span className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold ${getBadgeClass(rel.badge)}`}>
                            {rel.badge}
                          </span>
                        )}
                      </div>
                      <div className="pt-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                          {rel.category}
                        </p>
                        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
                          {rel.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-slate-900">${relPrice}</span>
                          {rel.discount && (
                            <span className="text-sm text-slate-400 line-through">${rel.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;