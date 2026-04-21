import { ArrowRight } from "lucide-react"
import { categories } from '../../data/products'
import { Link } from "react-router";

const Category = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of furniture categories to find the perfect pieces for every room in your home.
          </p>
        </div>

        {/* Category grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {categories.map((category) => (
            <div key={category.id} className="group relative overflow-hidden rounded-xl" >
              {/* Image */}
              <div className="aspect-4/5 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-white lg:text-xl">
                  {category.name}
                </h3>
                <p className="text-sm text-white/70">
                  {category.itemCount} items
                </p>
                <Link to="/shop"
                  className="mt-2 gap-2 hover:gap-4 flex items-center text-sm font-medium text-white opacity-0 -translate-x-2.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Category;