import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { AddressProvider } from './context/AddressContext'
import { PaymentMethodProvider } from './context/PaymentMethodContext'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
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
import AccountLayout from './components/account/AccountLayout'
import AccountProfile from './pages/Account-profile'
import AccountOrders from './pages/Account-orders'
import AccountAddresses from './pages/Account-addresses'
import AccountWallet from './pages/Account-wallet'
import AccountSettings from './pages/Account-settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter basename="/Heim">
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AddressProvider>
              <PaymentMethodProvider>
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

                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                <Footer />
              </PaymentMethodProvider>
            </AddressProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App