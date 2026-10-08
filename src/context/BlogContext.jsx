import { createContext, useContext, useMemo } from 'react';
import { useSeededCollection } from '../hooks/useSeededCollection';
import { STORAGE_KEYS } from '../utils/storageKeys';
import {
  getSeedBlogPosts,
  selectPublishedPosts,
  findPostById,
  selectFeaturedPosts,
  selectRelatedPosts,
  selectAdjacentPosts,
  deriveBlogCategories,
} from '../services/blogService';

const BlogContext = createContext();

/**
 * Blog posts. `allBlogPosts` includes drafts (for the admin); everything else
 * exposed here is the PUBLISHED, newest-first view the storefront uses.
 *
 * Post shape:
 * { id, title, excerpt, content (paragraphs separated by a blank line), author,
 *   publishedAt (ISO), readTime, category, tags: string[], image, featured,
 *   status: 'published' | 'draft' }
 */
export const BlogProvider = ({ children }) => {
  const [allBlogPosts] = useSeededCollection(STORAGE_KEYS.blogPosts, getSeedBlogPosts);

  const value = useMemo(() => {
    const blogPosts = selectPublishedPosts(allBlogPosts);
    return {
      allBlogPosts,
      blogPosts,
      blogCategories: deriveBlogCategories(blogPosts),
      getBlogPostById: (id) => findPostById(blogPosts, id),
      getFeaturedBlogPosts: (limit) => selectFeaturedPosts(blogPosts, limit),
      getRelatedBlogPosts: (post, limit) => selectRelatedPosts(blogPosts, post, limit),
      getAdjacentBlogPosts: (post) => selectAdjacentPosts(blogPosts, post),
    };
  }, [allBlogPosts]);

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};