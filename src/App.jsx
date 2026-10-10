import { BrowserRouter, Route, Routes, Navigate } from 'react-router'

import { ToastProvider } from './context/ToastContext'
import AppProviders from './context/AppProviders'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CheckoutLayout from './components/checkout/CheckoutLayout'
import CheckoutGuard from './components/checkout/CheckoutGuard'
import { ROLES } from './utils/constants'

import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import AccountLayout from './components/account/AccountLayout'
import AdminLayout from './components/admin/AdminLayout'

import Home from "./pages/Home"
import Shop from "./pages/Shop"
import ProductDetail from './pages/Product-detail'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogDetail from './pages/Blog-detail'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AccountProfile from './pages/Account-profile'
import AccountOrders from './pages/Account-orders'
import AccountAddresses from './pages/Account-addresses'
import AccountWallet from './pages/Account-wallet'
import AccountSettings from './pages/Account-settings'
import CheckoutAccount from './pages/Checkout-account'
import CheckoutShipping from './pages/Checkout-shipping'
import CheckoutPayment from './pages/Checkout-payment'
import CheckoutReview from './pages/Checkout-review'
import CheckoutConfirmation from './pages/Checkout-confirmation'
import AdminDashboard from './pages/Admin-dashboard'
import AdminProducts from './pages/Admin-products'
import AdminProductForm from './pages/Admin-product-form'

import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter basename="/Heim">
      <ScrollToTop />
      <ToastProvider>
        <AppProviders>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            <Route path="/checkout" element={<CheckoutLayout />}>
              <Route path="account" element={<CheckoutAccount />} />
              <Route element={<CheckoutGuard />}>
                <Route index element={<Navigate to="/checkout/shipping" replace />} />
                <Route path="shipping" element={<CheckoutShipping />} />
                <Route path="payment" element={<CheckoutPayment />} />
                <Route path="review" element={<CheckoutReview />} />
              </Route>
              <Route path="confirmation/:orderId" element={<CheckoutConfirmation />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<AccountLayout />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<AccountProfile />} />
                <Route path="orders" element={<AccountOrders />} />
                <Route path="addresses" element={<AccountAddresses />} />
                <Route path="wallet" element={<AccountWallet />} />
                <Route path="settings" element={<AccountSettings />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole={ROLES.ADMIN} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:id/edit" element={<AdminProductForm />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Footer />
        </AppProviders>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App