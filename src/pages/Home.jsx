import Hero from "../components/sections/Hero"
import FeaturesBar from "../components/sections/Features-bar"
import Category from "../components/sections/Category"
import ProductSection from "../components/sections/ProductSection"
import PromoBanner from "../components/sections/Promo-banner"
import BlogSection from "../components/sections/Blog-section"
import Newsletter from "../components/sections/Newsletter"
import { getFeaturedProducts, getProducts } from "../services/productService"

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturesBar />
      <Category />
      <ProductSection
        title="Featured Products"
        subtitle="Discover our handpicked selection of premium furniture pieces."
        products={getFeaturedProducts(4)}
      />
      <PromoBanner />
      <ProductSection
        title="Trending Now"
        subtitle="See what everyone is loving this season."
        products={getProducts().slice(4, 8)}
      />
      <BlogSection />
      <Newsletter />
    </div>
  )
}

export default Home