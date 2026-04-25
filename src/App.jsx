import { BrowserRouter, Route, Routes } from 'react-router'
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import ProductDetail from './pages/Product-detail'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>
      
      <Footer />
    </BrowserRouter>
  )
}

export default App