import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Heart, Share2, ShoppingCart, Minus, Plus, Star, Truck, Shield, RotateCcw, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import NotFound from './NotFound';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCatalog } from '../context/CatalogContext';
import { useSettings } from '../context/SettingsContext';
import { getFinalPrice, getBadgeClass } from '../utils/product';
import Breadcrumb from '../components/ui/Breadcrumb';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { getProductById, getRelatedProducts } = useCatalog();
  const { settings } = useSettings();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = getProductById(id);

  if (!product) {
    return (
      <NotFound
        title="Product Not Found"
        message="The product you're looking for doesn't exist or may have been removed."
        backTo="/shop"
        backLabel="Back to Shop"
      />
    );
  }

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

  const relatedProducts = getRelatedProducts(product, 4);

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb
        items={[
          { label: 'Shop', href: '/shop' },
          { label: product.category, href: `/shop?category=${encodeURIComponent(product.category)}` },
          { label: product.name },
        ]}
      />

      {/* Main product section */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* Images */}
          <div>
            {/* Main image */}
            <div className="relative mb-4 bg-secondary rounded-2xl overflow-hidden aspect-square">
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
                        ? 'border-primary'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">

            {/* Category + title */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">{product.category}</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">{product.name}</h1>
              <p className="text-lg text-foreground/80 leading-relaxed">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-rating text-rating'
                        : 'fill-border text-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-border">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-bold text-foreground">${getFinalPrice(product)}</span>
                {product.discount && (
                  <span className="text-xl text-muted-foreground line-through">${product.price}</span>
                )}
              </div>
            </div>

            {/* Add to cart section */}
            <div className="mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-4 mb-4">

                {/* Quantity */}
                <div className="flex items-center border border-border rounded-lg bg-card">
                  <button
                    onClick={decQuantity}
                    aria-label="Decrease quantity"
                    className="p-2 hover:bg-secondary transition-colors rounded-l-lg cursor-pointer"
                  >
                    <Minus className="w-4 h-4 text-foreground/70" />
                  </button>
                  <span className="w-12 text-center font-semibold text-foreground select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={incQuantity}
                    aria-label="Increase quantity"
                    className="p-2 hover:bg-secondary transition-colors rounded-r-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-foreground/70" />
                  </button>
                </div>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-medium transition-all cursor-pointer ${
                    wishlisted
                      ? 'border-destructive bg-destructive/10 text-destructive-text'
                      : 'border-border text-foreground/80 hover:border-muted-foreground'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-destructive' : ''}`} />
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
                  className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  View Cart · {cartItem.quantity} {cartItem.quantity === 1 ? 'item' : 'items'}
                </Link>
              )}
            </div>

            {/* Trust features */}
            <div className="space-y-4">
              {[
                { Icon: Truck,     title: 'Free Shipping',   sub: `On orders over $${settings.pricing.freeShippingThreshold}` },
                { Icon: Shield,    title: '2-Year Warranty', sub: 'Comprehensive coverage included' },
                { Icon: RotateCcw, title: '30-Day Returns',  sub: 'Easy returns for any reason' },
              ].map(({ Icon, title, sub }) => (
                <div key={title} className="flex items-start gap-4">
                  <Icon className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="mt-auto pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Share this product:</p>
              <div className="flex gap-3">
                <button aria-label="Share" className="p-2.5 border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                  <Share2 className="w-5 h-5 text-foreground/70" />
                </button>
                <button className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors text-sm text-foreground/80 font-medium cursor-pointer">
                  Share on Facebook
                </button>
                <button className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors text-sm text-foreground/80 font-medium cursor-pointer">
                  Share on Twitter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product info tabs */}
        <div className="border-t border-border pt-12 mb-16">
          <div className={`grid grid-cols-1 gap-8 ${product.specs?.length ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Description</h3>
              <p className="text-foreground/80 leading-relaxed">
                {product.description} This premium piece combines modern aesthetics with superior
                craftsmanship. Made from high-quality materials, it's designed to last for years
                while maintaining its elegant appearance.
              </p>
            </div>
            {product.specs?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Specifications</h3>
                <ul className="space-y-3 text-foreground/80">
                  {product.specs.map(({ label, value }) => (
                    <li key={label} className="flex justify-between gap-4">
                      <span>{label}</span>
                      <span className="font-medium text-foreground text-right">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Care Instructions</h3>
              <ul className="space-y-2 text-foreground/80 text-sm">
                {[
                  'Dust regularly with a soft, dry cloth',
                  'Use furniture polish every 3–4 months',
                  'Avoid direct sunlight to prevent fading',
                  'Keep away from heat sources',
                  'Use coasters for hot or cold items',
                ].map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="text-muted-foreground shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Related products ────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-border pt-12">
            <h2 className="text-3xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => {
                const relPrice = getFinalPrice(rel);
                return (
                  <Link key={rel.id} to={`/shop/${rel.id}`}>
                    <div className="group">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary">
                        <img
                          src={rel.image}
                          alt={rel.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {rel.badge && (
                          <span className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold ${getBadgeClass(rel.badge)}`}>
                            {rel.badge}
                          </span>
                        )}
                      </div>
                      <div className="pt-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          {rel.category}
                        </p>
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                          {rel.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-foreground">${relPrice}</span>
                          {rel.discount && (
                            <span className="text-sm text-muted-foreground line-through">${rel.price}</span>
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