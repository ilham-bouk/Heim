import { useState } from "react"
import { ChevronRight, SlidersHorizontal, X } from "lucide-react"
import ProductCard from "../components/ui/Product-card"
import Button from "../components/ui/Button"
import { products, categories } from "../data/mockData"
import { Link } from "react-router"

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sortBy, setSortBy] = useState("featured")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(2000)
  const [showFilters, setShowFilters] = useState(false)

  // Filter products by category
  let filtered = products.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) {
      return false
    }
    if (product.price < minPrice || product.price > maxPrice) {
      return false
    }
    return true
  })

  // Sort products
  if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price)
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === "newest") {
    filtered.reverse()
  }

  // Check if any filters are active
  const hasFilters = selectedCategory || minPrice > 0 || maxPrice < 2000

  const clearFilters = () => {
    setSelectedCategory(null)
    setMinPrice(0)
    setMaxPrice(2000)
    setSortBy("featured")
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Breadcrumb */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <Link to="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 font-medium">Shop</span>
              {selectedCategory && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-slate-900 font-medium">{selectedCategory}</span>
                </>
              )}
            </nav>
          </div>
        </div>

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
                        onClick={() => setSelectedCategory(null)}
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
                          onClick={() => setSelectedCategory(cat.name)}
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
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
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
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
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
                        onClick={() => setSelectedCategory(null)}
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
                          onClick={() => setSelectedCategory(cat.name)}
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
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm"
                        placeholder="Max"
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
                        onClick={() => setSelectedCategory(null)}
                        className="ml-1 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {(minPrice > 0 || maxPrice < 2000) && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium">
                      ${minPrice} - ${maxPrice}
                      <button 
                        onClick={() => {
                          setMinPrice(0)
                          setMaxPrice(2000)
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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