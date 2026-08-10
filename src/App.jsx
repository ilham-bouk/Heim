import { BrowserRouter, Route, Routes } from 'react-router'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
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
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
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

            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Footer />          
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App