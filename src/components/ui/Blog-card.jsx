import { ArrowRight } from "lucide-react"
import { Link } from "react-router";

/**
+ * Blog post preview card for grid listings (e.g. Home's blog section).
+ * The Blog listing page itself uses its own inline row layout, not this component.
+ * @param {object} post - post object from blogService
+ */
const BlogCard = ({ post }) => {
  return (
    <article className="group">
      {/* Image */}
      <div className="block overflow-hidden rounded-xl">
        <div className="aspect-16/10 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-accent">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>
        
        <Link to={`/blog/${post.id}`}>
          <h3 className="font-semibold text-foreground hover:text-accent transition-colors line-clamp-2 text-lg">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
        
        <Link 
          to={`/blog/${post.id}`}
          className="inline-flex items-center text-sm font-medium text-foreground hover:text-accent transition-colors pt-1"
        >
          Read More
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

export default BlogCard;