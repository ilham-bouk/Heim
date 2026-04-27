import Button from '../ui/Button';
import { ArrowRight } from "lucide-react"
import ProductCard from "../ui/Product-card";
import { products } from '../../data/mockData'
import { Link } from 'react-router';

const TreandingNow = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Trending Now
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl">
              See what everyone is loving this season.
            </p>
          </div>
          <Button variant="ghost">
            <Link to="/shop" className="inline-flex items-center justify-center gap-3">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        {/* Product grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TreandingNow;