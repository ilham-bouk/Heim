import Hero from "../components/sections/Hero"
import FeaturesBar from "../components/sections/Features-bar"
import Category from "../components/sections/Category"
import ProductGrid from "../components/sections/ProductGrid"
import PromoBanner from "../components/sections/Promo-banner"
import TreandingNow from "../components/sections/Treanding-now"
import BlogSection from "../components/sections/blog-section"
import Newsletter from "../components/sections/Newsletter"

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturesBar />
      <Category />
      <ProductGrid />
      <PromoBanner />
      <TreandingNow />
      <BlogSection />
      <Newsletter />
    </div>
  )
}

export default Home