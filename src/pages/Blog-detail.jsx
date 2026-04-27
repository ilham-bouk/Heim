import { useParams, Link } from 'react-router';
import { ChevronRight, Calendar, User, Clock, ArrowLeft, ArrowRight, Share2, MessageCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { blogPosts } from '../data/mockData';

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
        <p className="text-slate-600 mb-8">The article you're looking for doesn't exist.</p>
        <Link to="/blog">
          <Button variant="primary">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  // Get related posts (same category, different post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  // Get previous and next posts
  const currentIndex = blogPosts.findIndex(p => p.id === post.id);
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  // Expand content with sample sections
  const contentSections = [
    {
      heading: "Introduction",
      text: post.content
    },
    {
      heading: "Key Points to Consider",
      text: "When implementing these strategies, it's important to consider your space, budget, and personal preferences. Each home is unique, and what works for one person may not work for another. Take time to experiment and find what resonates with your style."
    },
    {
      heading: "Practical Tips",
      list: [
        "Start small and build gradually",
        "Invest in quality over quantity",
        "Consider lighting and placement carefully",
        "Don't be afraid to mix styles",
        "Trust your instincts and have fun"
      ]
    },
    {
      heading: "Conclusion",
      text: "Creating a beautiful and functional space is a journey, not a destination. Take your time, enjoy the process, and remember that the best design is one that makes you happy. Whether you're working with a professional designer or doing it yourself, these principles will help guide your decisions and create a space you truly love."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-slate-900 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image Section */}
      <section className="relative h-96 md:h-125 lg:h-150 bg-slate-200 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

        {/* Category Badge */}
        <div className="absolute bottom-6 left-4 lg:left-8">
          <span className="inline-block px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg">
            {post.category}
          </span>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 lg:py-16 border-slate-200">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{post.author}</p>
                <p className="text-xs text-slate-500">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">{post.date}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-5 h-5" />
              <span className="text-sm">{post.readTime}</span>
            </div>
          </div>

          {/* Article Tags */}
          <div className="py-8 border-b border-slate-200">
            <div className="flex flex-wrap gap-3">
              <span className="text-sm font-medium text-slate-600">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {['design', 'interior', 'furniture', 'style'].map((tag) => (
                  <Link key={tag} to={`/blog?search=${tag}`}>
                    <span className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-full transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Main Content */}
      <section>
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <article className="prose prose-lg max-w-none">
            {/* Excerpt */}
            <p className="text-lg text-slate-600 italic mb-8 pb-8 border-b border-slate-200">
              {post.excerpt}
            </p>

            {/* Content Sections */}
            {contentSections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  {section.heading}
                </h2>
                
                {section.text && (
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {section.text}
                  </p>
                )}

                {section.list && (
                  <ul className="space-y-3 mb-4">
                    {section.list.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-600">
                        <span className="text-accent font-bold mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Conclusion Note */}
            <div className="bg-secondary p-6 rounded-xl mt-12">
              <p className="text-slate-600">
                We hope this article has inspired you to create a beautiful and functional space. If you have any questions or would like to explore our collection of furniture, feel free to <Link to="/shop" className="text-accent font-semibold hover:underline">visit our shop</Link>.
              </p>
            </div>
          </article>

          {/* Share Buttons */}
          {/* <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Share:</span>
            <div className="flex gap-3">
              <button className="p-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors">
                <Facebook className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors">
                <Twitter className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors">
                <MessageCircle className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div> */}
        </div>
      </section>

      {/* Previous/Next Navigation */}
      {(previousPost || nextPost) && (
        <section className="py-12 lg:py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 lg:px-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Read More</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {previousPost && (
                <Link to={`/blog/${previousPost.id}`}>
                  <div className="group cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowLeft className="w-4 h-4 text-accent" />
                      <span className="text-sm text-accent font-semibold">Previous Article</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-accent transition-colors line-clamp-2">
                      {previousPost.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-2">{previousPost.date}</p>
                  </div>
                </Link>
              )}

              {nextPost && (
                <Link to={`/blog/${nextPost.id}`}>
                  <div className="group cursor-pointer text-end">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-sm text-accent font-semibold">Next Article</span>
                      <ArrowRight className="w-4 h-4 text-accent" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-accent transition-colors line-clamp-2">
                      {nextPost.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-2">{nextPost.date}</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-12 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 lg:px-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Related Articles in {post.category}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relPost) => (
                <Link key={relPost.id} to={`/blog/${relPost.id}`}>
                  <article className="group h-full bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={relPost.image}
                        alt={relPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-lg">
                          {relPost.category}
                        </span>
                        <span className="text-xs text-slate-500">{relPost.readTime}</span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-accent transition-colors mb-2 line-clamp-2">
                        {relPost.title}
                      </h4>

                      <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                        {relPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <span className="text-xs text-slate-500">{relPost.date}</span>
                        <ArrowRight className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-12 lg:py-20 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Don't Miss Our Latest Articles
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest design tips and inspiration delivered to your inbox.
          </p>
          
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <Button variant="primary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogDetail