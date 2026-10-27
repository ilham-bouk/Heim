import { useParams, Link } from 'react-router';
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { formatDate } from '../utils/format';
import Breadcrumb from '../components/ui/Breadcrumb';
import NewsletterForm from '../components/ui/NewsletterForm';
import NotFound from './NotFound';

const BlogDetail = () => {
  const { id } = useParams();
  const { getBlogPostById, getRelatedBlogPosts, getAdjacentBlogPosts } = useBlog();
  const post = getBlogPostById(id);

  if (!post) {
    return (
      <NotFound
        title="Article Not Found"
        message="The article you're looking for doesn't exist or may have been removed."
        backTo="/blog"
        backLabel="Back to Blog"
      />
    );
  }

  // Get related posts (same category, different post)
  const relatedPosts = getRelatedBlogPosts(post, 3);
  const { previous: previousPost, next: nextPost } = getAdjacentBlogPosts(post);

  // Paragraphs are separated by a blank line in post.content.
  const paragraphs = (post.content ?? '').split(/\n{2,}/).filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb
        maxWidthClassName="max-w-4xl"
        items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      />

      {/* Hero Image Section */}
      <section className="relative h-96 md:h-125 lg:h-150 bg-muted overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

        {/* Category Badge */}
        <div className="absolute bottom-6 left-4 lg:left-8">
          <span className="inline-block px-4 py-2 bg-accent-text text-primary-foreground text-sm font-semibold rounded-lg">
            {post.category}
          </span>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author}</p>
                <p className="text-xs text-muted-foreground">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-foreground/80">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">{formatDate(post.publishedAt)}</span>
            </div>

            <div className="flex items-center gap-2 text-foreground/80">
              <Clock className="w-5 h-5" />
              <span className="text-sm">{post.readTime}</span>
            </div>
          </div>

          {/* Article Tags */}
          {post.tags?.length > 0 && (
            <div className="py-8 border-b border-border">
              <div className="flex flex-wrap gap-3">
                <span className="text-sm font-medium text-foreground/80">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/blog?search=${tag}`}>
                      <span className="px-3 py-1 bg-secondary hover:bg-border text-foreground/80 text-sm rounded-full transition-colors cursor-pointer">
                        #{tag}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </section>

      {/* Main Content */}
      <section>
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <article className="prose prose-lg max-w-none">
            {/* Excerpt */}
            <p className="text-lg text-foreground/80 italic mb-8 pb-8 border-b border-border">
              {post.excerpt}
            </p>

            {/* Content Sections */}
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-foreground/80 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}

            {/* Conclusion Note */}
            <div className="bg-secondary p-6 rounded-xl mt-12">
              <p className="text-foreground/80">
                We hope this article has inspired you to create a beautiful and functional space. If you have any questions or would like to explore our collection of furniture, feel free to <Link to="/shop" className="text-accent-text font-semibold hover:underline">visit our shop</Link>.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Previous/Next Navigation */}
      {(previousPost || nextPost) && (
        <section className="py-12 lg:py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 lg:px-8">
            <h3 className="text-2xl font-bold text-foreground mb-8">Read More</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {previousPost && (
                <Link to={`/blog/${previousPost.id}`}>
                  <div className="group cursor-pointer p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowLeft className="w-4 h-4 text-accent-text" />
                      <span className="text-sm text-accent-text font-semibold">Previous Article</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground group-hover:text-accent-text transition-colors line-clamp-2">
                      {previousPost.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2">{formatDate(previousPost.publishedAt)}</p>
                  </div>
                </Link>
              )}

              {nextPost && (
                <Link to={`/blog/${nextPost.id}`}>
                  <div className="group cursor-pointer text-end p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-sm text-accent-text font-semibold">Next Article</span>
                      <ArrowRight className="w-4 h-4 text-accent-text" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground group-hover:text-accent-text transition-colors line-clamp-2">
                      {nextPost.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2">{formatDate(nextPost.publishedAt)}</p>
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
            <h3 className="text-2xl font-bold text-foreground mb-8">Related Articles in {post.category}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relPost) => (
                <Link key={relPost.id} to={`/blog/${relPost.id}`}>
                  <article className="group h-full bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden bg-secondary">
                      <img
                        src={relPost.image}
                        alt={relPost.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-accent/10 text-accent-text text-xs font-semibold rounded-lg">
                          {relPost.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{relPost.readTime}</span>
                      </div>

                      <h4 className="text-lg font-bold text-foreground group-hover:text-accent-text transition-colors mb-2 line-clamp-2">
                        {relPost.title}
                      </h4>

                      <p className="text-sm text-foreground/80 line-clamp-2 mb-4">
                        {relPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">{formatDate(relPost.publishedAt)}</span>
                        <ArrowRight className="w-4 h-4 text-accent-text" aria-hidden="true" />
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
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Don't Miss Our Latest Articles
          </h2>
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest design tips and inspiration delivered to your inbox.
          </p>
          
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogDetail