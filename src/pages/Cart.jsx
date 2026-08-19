import { ChevronRight, Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Percent, Truck } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, shipping, tax, total, itemCount } = useCart();

  if (cartItems.length === 0) {
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
              <span className="text-slate-900 font-medium">Shopping Cart</span>
            </nav>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-slate-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Cart is Empty</h1>
            <p className="text-slate-600 mb-8 max-w-md">
              Looks like you haven't added any items to your cart yet. Explore our collection and find something you love!
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
  }

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
            <span className="text-slate-900 font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">Shopping Cart</h1>
          <p className="text-slate-600 mt-2">{itemCount} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const finalPrice = item.discount
                  ? Math.floor(item.price - (item.price * (item.discount / 100)))
                  : item.price;

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="shrink-0">
                        <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Link to={`/shop/${item.id}`}>
                              <h3 className="text-lg font-bold text-slate-900 hover:text-accent transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-slate-500 mt-1">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            aria-label="Remove from cart"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Price and Discount */}
                        <div className="mb-4 flex items-center gap-3">
                          <span className="text-2xl font-bold text-slate-900">
                            ${finalPrice}
                          </span>
                          {item.discount && (
                            <>
                              <span className="text-lg text-slate-400 line-through">
                                ${item.price}
                              </span>
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                -{item.discount}%
                              </span>
                            </>
                          )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-slate-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-slate-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 text-slate-600" />
                            </button>
                            <span className="w-12 text-center font-semibold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-slate-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4 text-slate-600" />
                            </button>
                          </div>

                          {/* Subtotal for item */}
                          <div className="ml-auto text-right">
                            <p className="text-sm text-slate-500 mb-1">Subtotal</p>
                            <p className="text-2xl font-bold text-slate-900">
                              ${(finalPrice * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping */}
            <Link to="/shop" className="inline-flex items-center gap-2 mt-8 text-accent hover:text-accent/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Continue Shopping</span>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {/* Summary Card */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

              {/* Subtotal */}
              <div className="flex justify-between mb-4 pb-4 border-b border-slate-200">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toLocaleString()}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600">Shipping</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? 'FREE' : `$${shipping}`}
                </span>
              </div>

              {/* Tax */}
              <div className="flex justify-between mb-6 pb-6 border-b border-slate-200">
                <span className="text-slate-600">Tax (10%)</span>
                <span className="font-semibold text-slate-900">${tax}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-accent">${total.toLocaleString()}</span>
              </div>

              {/* Checkout Button */}
              <Button variant="primary" className="w-full mb-4">
                Proceed to Checkout
              </Button>

              {/* Promo Code */}
              <div className="space-y-2">
                <label htmlFor="promo" className="text-sm font-medium text-slate-600">
                  Have a promo code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="promo"
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  />
                  <button className="px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                    Apply
                  </button>
                </div>
              </div>

              {/* Free Shipping Info */}
              {subtotal < 100 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <span className="font-semibold">Free shipping</span> on orders over $100. You're ${(100 - subtotal).toFixed(2)} away!
                  </p>
                </div>
              )}

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  ✓ Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16 pt-16 border-t border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder cards for related products */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
                <div className="w-full aspect-square bg-slate-200 rounded-lg mb-4" />
                <h3 className="font-semibold text-slate-900 text-sm mb-2">Related Product {i}</h3>
                <p className="text-accent font-bold">$XXX</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Cart