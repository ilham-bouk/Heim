import { ArrowRight } from "lucide-react"
import BlogCard from "../ui/Blog-card";
import { useBlog } from "../../context/BlogContext"
import Button from '../ui/Button';
import { Link } from "react-router";

const BlogSection = () => {
  const { getFeaturedBlogPosts } = useBlog();
  
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              From Our Blog
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Discover the latest trends, tips, and inspiration for your home.
            </p>
          </div>
          <Button as={Link} to="/blog" variant="ghost" className="gap-3 self-start sm:self-auto">
            View All Posts
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Blog grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {getFeaturedBlogPosts(3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogSection;