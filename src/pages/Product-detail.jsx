import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ChevronRight, Heart, Share2, ShoppingCart, Minus, Plus, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';
import { products } from '../data/mockData';

const ProductDetail = () => {
  const { id } = useParams();
  // const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const finalPrice = product.discount
    ? Math.floor(product.price - (product.price * (product.discount / 100)))
    : product.price;

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };

  const incQuantity = () => setQuantity(q => q + 1);
  const decQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  // Related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/shop" className="hover:text-slate-900 transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/shop?category=${product.category}`} className="hover:text-slate-900 transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Product Images */}
          <div className="relative mb-6 bg-slate-50 rounded-2xl overflow-hidden aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span
                className={`absolute top-6 left-6 px-4 py-2 rounded-lg text-sm font-semibold ${
                  product.badge === 'Sale'
                    ? 'bg-red-500 text-white'
                    : product.badge === 'New'
                    ? 'bg-blue-500 text-white'
                    : 'bg-purple-500 text-white'
                }`}
              >
                {product.badge}
                {product.discount && product.badge === 'Sale' && ` -${product.discount}%`}
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Category and Title */}
            <div className="mb-6">
              <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-4">
                {product.name}
              </h1>
              <p className="text-md text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
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

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-slate-900">
                  ${finalPrice}
                </span>
                {product.discount && (
                  <span className="text-xl text-slate-400 line-through">
                    ${product.price}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button
                    onClick={decQuantity}
                    className="p-2 hover:bg-slate-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="w-12 text-center font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={incQuantity}
                    className="p-2 hover:bg-slate-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                    isWishlisted
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full flex justify-center gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
            </div>

            {/* Product Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Truck className="w-5 h-5 text-slate-900 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">Free Shipping</p>
                  <p className="text-sm text-slate-500">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield className="w-5 h-5 text-slate-900 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">2-Year Warranty</p>
                  <p className="text-sm text-slate-500">Comprehensive coverage included</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <RotateCcw className="w-5 h-5 text-slate-900 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">30-Day Returns</p>
                  <p className="text-sm text-slate-500">Easy returns for any reason</p>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-auto pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">Share this product:</p>
              <div className="flex gap-3">
                <button className="p-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <Share2 className="w-5 h-5 text-slate-600" />
                </button>
                <button className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600 font-medium">
                  Share on Facebook
                </button>
                <button className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600 font-medium">
                  Share on Twitter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs Section */}
        <div className="border-t border-slate-200 pt-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description} This premium piece combines modern aesthetics with superior craftsmanship. 
                Made from high-quality materials, it's designed to last for years while maintaining its elegant appearance.
              </p>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Specifications</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex justify-between">
                  <span>Dimensions:</span>
                  <span className="font-medium text-slate-900">H: 85cm x W: 120cm</span>
                </li>
                <li className="flex justify-between">
                  <span>Material:</span>
                  <span className="font-medium text-slate-900">Premium Oak Wood</span>
                </li>
                <li className="flex justify-between">
                  <span>Weight:</span>
                  <span className="font-medium text-slate-900">45 kg</span>
                </li>
                <li className="flex justify-between">
                  <span>Color:</span>
                  <span className="font-medium text-slate-900">Natural</span>
                </li>
              </ul>
            </div>

            {/* Care Instructions */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Care Instructions</h3>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>- Dust regularly with a soft, dry cloth</li>
                <li>- Use furniture polish every 3-4 months</li>
                <li>- Avoid direct sunlight to prevent fading</li>
                <li>- Keep away from heat sources</li>
                <li>- Use coasters for hot or cold items</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-200 pt-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => {
                const relFinalPrice = relProduct.discount
                  ? Math.floor(relProduct.price - (relProduct.price * (relProduct.discount / 100)))
                  : relProduct.price;
                return (
                  <Link key={relProduct.id} to={`/product/${relProduct.id}`}>
                    <div className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={relProduct.image}
                          alt={relProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {relProduct.badge && (
                          <span
                            className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold ${
                              relProduct.badge === 'Sale'
                                ? 'bg-red-500 text-white'
                                : relProduct.badge === 'New'
                                ? 'bg-blue-500 text-white'
                                : 'bg-purple-500 text-white'
                            }`}
                          >
                            {relProduct.badge}
                          </span>
                        )}
                      </div>
                      <div className="pt-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                          {relProduct.category}
                        </p>
                        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
                          {relProduct.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-slate-900">
                            ${relFinalPrice}
                          </span>
                          {relProduct.discount && (
                            <span className="text-sm text-slate-500 line-through">
                              ${relProduct.price}
                            </span>
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
  )
}

export default ProductDetail