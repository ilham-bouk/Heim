import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'

import { ToastProvider } from './context/ToastContext'
import AppProviders from './context/AppProviders'
import ScrollToTop from './components/ScrollToTop'
import RouteMeta from './components/RouteMeta'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { ROLES } from './utils/constants'

import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

import Home from "./pages/Home"
import NotFound from './pages/NotFound'

const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/Product-detail'))
const About = lazy(() => import('./pages/About'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogDetail = lazy(() => import('./pages/Blog-detail'))
const Contact = lazy(() => import('./pages/Contact'))
const Cart = lazy(() => import('./pages/Cart'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const SignIn = lazy(() => import('./pages/SignIn'))
const SignUp = lazy(() => import('./pages/SignUp'))
const ForgotPassword = lazy(() => import('./pages/Forgot-password'))
const Faq = lazy(() => import('./pages/Faq'))
const Shipping = lazy(() => import('./pages/Shipping'))
const Returns = lazy(() => import('./pages/Returns'))
const TrackOrder = lazy(() => import('./pages/Track-order'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))

const CheckoutLayout = lazy(() => import('./components/checkout/CheckoutLayout'))
const CheckoutGuard = lazy(() => import('./components/checkout/CheckoutGuard'))
const CheckoutAccount = lazy(() => import('./pages/Checkout-account'))
const CheckoutShipping = lazy(() => import('./pages/Checkout-shipping'))
const CheckoutPayment = lazy(() => import('./pages/Checkout-payment'))
const CheckoutReview = lazy(() => import('./pages/Checkout-review'))
const CheckoutConfirmation = lazy(() => import('./pages/Checkout-confirmation'))

const AccountLayout = lazy(() => import('./components/account/AccountLayout'))
const AccountProfile = lazy(() => import('./pages/Account-profile'))
const AccountOrders = lazy(() => import('./pages/Account-orders'))
const AccountOrderDetail = lazy(() => import('./pages/Account-order-detail'))
const AccountAddresses = lazy(() => import('./pages/Account-addresses'))
const AccountWallet = lazy(() => import('./pages/Account-wallet'))
const AccountSettings = lazy(() => import('./pages/Account-settings'))

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/Admin-dashboard'))
const AdminProducts = lazy(() => import('./pages/Admin-products'))
const AdminProductForm = lazy(() => import('./pages/Admin-product-form'))
const AdminCategories = lazy(() => import('./pages/Admin-categories'))
const AdminBlog = lazy(() => import('./pages/Admin-blog'))
const AdminBlogForm = lazy(() => import('./pages/Admin-blog-form'))
const AdminMessages = lazy(() => import('./pages/Admin-messages'))
const AdminMessageDetail = lazy(() => import('./pages/Admin-message-detail'))
const AdminOrders = lazy(() => import('./pages/Admin-orders'))
const AdminOrderDetail = lazy(() => import('./pages/Admin-order-detail'))
const AdminCustomers = lazy(() => import('./pages/Admin-customers'))
const AdminPromos = lazy(() => import('./pages/Admin-promos'))
const AdminSubscribers = lazy(() => import('./pages/Admin-subscribers'))
const AdminSettings = lazy(() => import('./pages/Admin-settings'))

const PageFallback = () => (
  <div role="status" className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
    Loading…
  </div>
)

function App() {
  return (
    <BrowserRouter basename="/Heim">
      <ScrollToTop />
      <ToastProvider>
        <AppProviders>
          <RouteMeta />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to main content
          </a>

          <Header />

          <main id="main-content" tabIndex={-1} className="focus:outline-none">
          <Suspense fallback={<PageFallback />}>
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

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
                <Route path="orders/:id" element={<AccountOrderDetail />} />
                <Route path="addresses" element={<AccountAddresses />} />
                <Route path="wallet" element={<AccountWallet />} />
                <Route path="settings" element={<AccountSettings />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole={ROLES.ADMIN} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="promos" element={<AdminPromos />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:id/edit" element={<AdminProductForm />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="blog/new" element={<AdminBlogForm />} />
                <Route path="blog/:id/edit" element={<AdminBlogForm />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="messages/:id" element={<AdminMessageDetail />} />
                <Route path="subscribers" element={<AdminSubscribers />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </main>

          <Footer />
        </AppProviders>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App