import { useState } from "react"
import { useSearchParams } from "react-router"
import { SlidersHorizontal, X } from "lucide-react"
import ProductCard from "../components/ui/Product-card"
import Button from "../components/ui/Button"
import Breadcrumb from '../components/ui/Breadcrumb';
import { useCatalog } from "../context/CatalogContext"
import { getFinalPrice } from "../utils/product"

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

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories } = useCatalog()

  // Category and sort live in the URL so they're shareable (the promo banner links to ?sort=newest).
  const selectedCategory = searchParams.get("category")
  const sortParam = searchParams.get("sort")
  const sortBy = SORT_OPTIONS.some((option) => option.value === sortParam) ? sortParam : "featured"

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(null) // null = no upper limit
  const [showFilters, setShowFilters] = useState(false)

  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
    setSearchParams(next)
  }

  const selectCategory = (name) => updateParams({ category: name })
  const setSortBy = (value) => updateParams({ sort: value === "featured" ? null : value })

  // Placeholder for the empty Max field: the most expensive final price, rounded up.
  const priceCeiling = Math.ceil(Math.max(0, ...products.map(getFinalPrice)) / 100) * 100

  const filtered = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) return false
    const price = getFinalPrice(product)
    if (price < minPrice) return false
    if (maxPrice !== null && price > maxPrice) return false
    return true
  })

  filtered.sort(SORTERS[sortBy])

  const hasFilters = selectedCategory || minPrice > 0 || maxPrice !== null

  const clearFilters = () => {
    setSearchParams({})
    setMinPrice(0)
    setMaxPrice(null)
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        <Breadcrumb
          items={selectedCategory
              ? [{ label: 'Shop', href: '/shop' }, { label: selectedCategory }]
              : [{ label: 'Shop' }]
          }
        />

        {/* Page Header */}
        <div className="bg-slate-50 border-b border-slate-200 pb-8">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              {selectedCategory ? selectedCategory : "All Products"}
            </h1>
            <p className="mt-2 text-slate-600">
              {filtered.length} products found
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                
                {/* Categories Filter */}
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4">Categories</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => selectCategory(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                          selectedCategory === null
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-100"
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
                              ? "bg-slate-900 text-white"
                              : "text-slate-600 hover:bg-slate-100"
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
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-slate-500 block mb-1">Min</label>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          min="0"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-slate-500 block mb-1">Max</label>
                        <input
                          type="number"
                          value={maxPrice ?? ""}
                          placeholder={priceCeiling}
                          onChange={(e) => setMaxPrice(e.target.value === "" ? null : Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
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
              
              {/* Toolbar - Sort and Mobile Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {hasFilters && (
                    <span className="ml-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                      !
                    </span>
                  )}
                </Button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-3 ml-auto">
                  <label className="text-sm text-slate-600 hidden sm:block">Sort:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mobile Filters Panel */}
              {showFilters && (
                <div className="lg:hidden mb-6 p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Filters</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Categories - Mobile */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => selectCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === null
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600"
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
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range - Mobile */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Price Range</h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={maxPrice ?? ""}
                        placeholder={priceCeiling}
                        onChange={(e) => setMaxPrice(e.target.value === "" ? null : Number(e.target.value))}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm"
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
                  <span className="text-sm text-slate-600">Active:</span>
                  {selectedCategory && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium">
                      {selectedCategory}
                      <button 
                        onClick={() => selectCategory(null)}
                        className="ml-1 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {(minPrice > 0 || maxPrice !== null) && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium">
                      {maxPrice !== null ? `$${minPrice} - $${maxPrice}` : `$${minPrice}+`}
                      <button 
                        onClick={() => {
                          setMinPrice(0)
                          setMaxPrice(null)
                        }}
                        className="ml-1 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Product Grid */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-slate-600 text-lg mb-4">No products found</p>
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
      </main>
    </div>
  )
}

export default Shop