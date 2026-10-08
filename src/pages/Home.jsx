import Hero from "../components/sections/Hero"
import FeaturesBar from "../components/sections/Features-bar"
import Category from "../components/sections/Category"
import ProductSection from "../components/sections/ProductSection"
import PromoBanner from "../components/sections/Promo-banner"
import BlogSection from "../components/sections/Blog-section"
import Newsletter from "../components/sections/Newsletter"
import { useCatalog } from "../context/CatalogContext"

const Home = () => {
  const { getFeaturedProducts, getNewestProducts } = useCatalog()

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
        title="New Products"
        subtitle="Fresh pieces, just added to the collection."
        products={getNewestProducts(4)}
        viewAllLink="/shop?sort=newest"
      />
      <BlogSection />
      <Newsletter />
    </div>
  )
}

export default Home