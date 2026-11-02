import { ArrowRight } from "lucide-react"
import { useCatalog } from '../../context/CatalogContext'
import { Link } from "react-router";

const Category = () => {
  const { categories } = useCatalog();

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

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative block overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="aspect-4/5 overflow-hidden">
                <img
                  src={category.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-white lg:text-xl">{category.name}</h3>
                <p className="text-sm text-white/70">
                  {category.itemCount} {category.itemCount === 1 ? 'item' : 'items'}
                </p>
                <span className="mt-2 flex items-center gap-2 text-sm font-medium text-white transition-all duration-300 motion-reduce:transition-none lg:-translate-x-2.5 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:gap-4 lg:group-hover:opacity-100 lg:group-focus-visible:translate-x-0 lg:group-focus-visible:opacity-100">
                  Shop Now
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Category;