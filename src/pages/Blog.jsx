import { useState } from 'react';
import { ChevronRight, Search, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';
import { blogPosts, blogCategories } from '../data/mockData';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts based on category and search
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">Blog</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 lg:py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-sm font-medium text-accent uppercase tracking-wider mb-4">
              Insights & Ideas
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance mb-4">
              Design Inspiration & Expert Tips
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover curated articles, design trends, and expert advice to help you create your perfect space.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-12">Featured Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <article 
                key={post.id} 
                className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-semibold rounded-lg">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <Link to={`/blog/${post.id}`}>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{post.author}</span>
                    </div>
                    <Link to={`/blog/${post.id}`}>
                      <button className="text-accent hover:text-accent/80 transition-colors cursor-pointer">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-8 lg:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="mb-12">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Articles Grid */}
              {filteredPosts.length > 0 ? (
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
                    <article 
                      key={post.id}
                      className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row"
                    >
                      {/* Image */}
                      <div className="sm:w-48 shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 sm:h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-lg">
                              {post.category}
                            </span>
                            <span className="text-xs text-slate-500">{post.readTime}</span>
                          </div>
                          <Link to={`/blog/${post.id}`}>
                            <h3 className="text-xl font-bold text-slate-900 hover:text-accent transition-colors mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-slate-600 mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {post.author}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {post.date}
                            </div>
                          </div>
                          <Link to={`/blog/${post.id}`}>
                            <button className="text-accent hover:text-accent/80 transition-colors cursor-pointer">
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-slate-600 text-lg mb-4">No articles found matching your search.</p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 shrink-0">
              {/* Categories Widget */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8 top-24">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Categories</h3>
                <div className="space-y-3">
                  {blogCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category.name
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <span className="text-xs font-semibold">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Posts Widget */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Articles</h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 5).map((post) => (
                    <Link key={post.id} to={`/blog/${post.id}`}>
                      <div className="pb-4 border-b border-slate-200 last:border-0 hover:text-accent transition-colors">
                        <h4 className="font-semibold text-slate-900 line-clamp-2 mb-2 hover:text-accent">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-500">{post.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Widget */}
              <div className="bg-secondary rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Stay Updated</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Subscribe to get the latest design articles and inspiration delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  />
                  <Button variant="primary" className="w-full">
                    Subscribe
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Ready to Redesign Your Space?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Explore our collection and bring your design inspiration to life with Heim's curated furniture selection.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="lg">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Blog