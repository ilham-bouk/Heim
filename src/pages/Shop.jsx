import { useState } from "react"
import { useSearchParams } from "react-router"
import { Search, SlidersHorizontal, X } from "lucide-react"
import ProductCard from "../components/ui/Product-card"
import Button from "../components/ui/Button"
import Breadcrumb from '../components/ui/Breadcrumb';
import { useCatalog } from "../context/CatalogContext"
import { getFinalPrice } from "../utils/product"

const PAGE_SIZE = 12

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
]

const SORTERS = {
  featured: (a, b) => Number(!!b.featured) - Number(!!a.featured), // stable: keeps catalog order within groups
  newest: (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  "price-low": (a, b) => getFinalPrice(a) - getFinalPrice(b),
  "price-high": (a, b) => getFinalPrice(b) - getFinalPrice(a),
  rating: (a, b) => b.rating - a.rating,
}

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"

const matchesQuery = (product, query) =>
  `${product.name} ${product.category} ${product.description ?? ""}`.toLowerCase().includes(query)

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories } = useCatalog()

  // Category, sort and search live in the URL so they're shareable (the promo banner links to ?sort=newest).
  const selectedCategory = searchParams.get("category")
  const sortParam = searchParams.get("sort")
  const sortBy = SORT_OPTIONS.some((option) => option.value === sortParam) ? sortParam : "featured"
  const query = searchParams.get("q") ?? ""

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(null) // null = no upper limit
  const [showFilters, setShowFilters] = useState(false)

  // "Show more" count. It is tied to the current filters, so changing any filter
  // starts again at one page without needing an effect to reset it.
  const filterKey = JSON.stringify([selectedCategory, sortBy, query, minPrice, maxPrice])
  const [shown, setShown] = useState({ key: "", count: PAGE_SIZE })
  const visibleCount = shown.key === filterKey ? shown.count : PAGE_SIZE

  const updateParams = (changes, options) => {    
    const next = new URLSearchParams(searchParams)
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
    setSearchParams(next, options)
  }

  const selectCategory = (name) => updateParams({ category: name })
  const setSortBy = (value) => updateParams({ sort: value === "featured" ? null : value })
  const setQuery = (value) => updateParams({ q: value }, { replace: true }) // typing shouldn't flood history

  // Placeholder for the empty Max field: the most expensive final price, rounded up.
  const priceCeiling = Math.ceil(Math.max(0, ...products.map(getFinalPrice)) / 100) * 100

  const normalizedQuery = query.trim().toLowerCase()

  const filtered = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) return false
    if (normalizedQuery && !matchesQuery(product, normalizedQuery)) return false
    const price = getFinalPrice(product)
    if (price < minPrice) return false
    if (maxPrice !== null && price > maxPrice) return false
    return true
  })

  filtered.sort(SORTERS[sortBy])

  const visibleProducts = filtered.slice(0, visibleCount)
  const hasFilters = selectedCategory || normalizedQuery || minPrice > 0 || maxPrice !== null
  const clearFilters = () => {
    setSearchParams({})
    setMinPrice(0)
    setMaxPrice(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div>
        <Breadcrumb
          items={selectedCategory
              ? [{ label: 'Shop', href: '/shop' }, { label: selectedCategory }]
              : [{ label: 'Shop' }]
          }
        />

        {/* Page Header */}
        <div className="bg-secondary border-b border-border pb-8">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {selectedCategory ? selectedCategory : "All Products"}
            </h1>
            <p role="status" className="mt-2 text-foreground/70">
              {filtered.length} {filtered.length === 1 ? "product" : "products"} found
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                
                {/* Categories Filter */}
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="font-bold text-foreground mb-4">Categories</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => selectCategory(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                          selectedCategory === null
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/80 hover:bg-secondary"
                        }`}
                      >
                        All Products
                      </button>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <button
                          onClick={() => selectCategory(cat.name)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-medium flex justify-between ${
                            selectedCategory === cat.name
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground/80 hover:bg-secondary"
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-xs">({cat.itemCount})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Filter */}
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="font-bold text-foreground mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label htmlFor="price-min" className="text-xs text-muted-foreground block mb-1">Min</label>
                        <input
                          id="price-min"
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(Number(e.target.value))}
                          className={inputClass}
                          min="0"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="price-max" className="text-xs text-muted-foreground block mb-1">Max</label>
                        <input
                          id="price-max"
                          type="number"
                          value={maxPrice ?? ""}
                          placeholder={priceCeiling}
                          onChange={(e) => setMaxPrice(e.target.value === "" ? null : Number(e.target.value))}
                          className={`${inputClass} placeholder:text-muted-foreground`}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasFilters && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              
              {/* Toolbar - Search, Sort and Mobile Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                
                {/* Search */}
                <div className="relative min-w-52 flex-1 sm:max-w-xs">
                  <label htmlFor="shop-search" className="sr-only">Search products</label>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="shop-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products…"
                    className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {hasFilters && (
                    <span className="ml-2 w-5 h-5 rounded-full bg-destructive text-primary-foreground text-xs font-bold flex items-center justify-center">
                      !
                    </span>
                  )}
                </Button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-3 ml-auto">
                  <label htmlFor="shop-sort" className="text-sm text-foreground/80 hidden sm:block">Sort:</label>
                  <select
                    id="shop-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mobile Filters Panel */}
              {showFilters && (
                <div className="lg:hidden mb-6 p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground">Filters</h3>
                    <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                      <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Categories - Mobile */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-foreground mb-3">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => selectCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === null
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground/80"
                        }`}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => selectCategory(cat.name)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === cat.name
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground/80"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range - Mobile */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-foreground mb-3">Price Range</h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        aria-label="Minimum price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className={`flex-1 ${inputClass}`}
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        aria-label="Maximum price"
                        value={maxPrice ?? ""}
                        placeholder={priceCeiling}
                        onChange={(e) => setMaxPrice(e.target.value === "" ? null : Number(e.target.value))}
                        className={`flex-1 ${inputClass} placeholder:text-muted-foreground`}
                      />
                    </div>
                  </div>

                  {hasFilters && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}

              {/* Active Filter Tags */}
              {hasFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm text-foreground/80">Active:</span>
                  {selectedCategory && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm font-medium text-foreground">
                      {selectedCategory}
                      <button
                        onClick={() => selectCategory(null)}
                        aria-label={`Remove ${selectedCategory} filter`}
                        className="ml-1 hover:text-muted-foreground"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                  )}

                  {normalizedQuery && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm font-medium text-foreground">
                      “{query.trim()}”
                      <button
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                        className="ml-1 hover:text-muted-foreground"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                  )}

                  {(minPrice > 0 || maxPrice !== null) && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm font-medium text-foreground">
                      {maxPrice !== null ? `$${minPrice} - $${maxPrice}` : `$${minPrice}+`}
                      <button
                        onClick={() => {
                          setMinPrice(0)
                          setMaxPrice(null)
                        }}
                        aria-label="Remove price filter"
                        className="ml-1 hover:text-muted-foreground"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Product Grid */}
              {filtered.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                    {visibleProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {filtered.length > visibleProducts.length && (
                    <div className="mt-10 text-center">
                      <p className="mb-4 text-sm text-muted-foreground">
                        Showing {visibleProducts.length} of {filtered.length}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setShown({ key: filterKey, count: visibleCount + PAGE_SIZE })}
                      >
                        Show more
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg mb-4">No products found</p>
                  <Button
                    variant="primary"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop