import { BrowserRouter, Route, Routes } from 'react-router'
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Shop from "./pages/Shop"

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
      
      <Footer />
    </BrowserRouter>
  )
}

export default App