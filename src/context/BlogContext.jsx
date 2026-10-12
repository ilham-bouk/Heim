import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
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
  createPost,
  applyPostInput,
} from '../services/blogService';

const BlogContext = createContext();

const MOCK_LATENCY_MS = 400; // simulated network delay — remove when wiring a real API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const [allBlogPosts, setAllBlogPosts] = useSeededCollection(STORAGE_KEYS.blogPosts, getSeedBlogPosts);
  const [idCounters, setIdCounters] = useLocalStorage(STORAGE_KEYS.blogIdCounters, {});

  const value = useMemo(() => {
    const blogPosts = selectPublishedPosts(allBlogPosts);

    // Never-reuse IDs, same reasoning as CatalogContext. Real backend: the server assigns the ID.
    const reservePostId = () => {
      const id = Math.max(0, idCounters.posts ?? 0, ...allBlogPosts.map((p) => p.id)) + 1;
      setIdCounters((prev) => ({ ...prev, posts: id }));
      return id;
    };

    // Real backend: POST /posts, PATCH /posts/:id, DELETE /posts/:id.
    const addPost = async (input) => {
      const post = createPost(input, reservePostId());
      await delay(MOCK_LATENCY_MS);
      setAllBlogPosts((prev) => [...prev, post]);
      return post;
    };

    const updatePost = async (id, input) => {
      await delay(MOCK_LATENCY_MS);
      setAllBlogPosts((prev) => prev.map((p) => (p.id === id ? applyPostInput(p, input) : p)));
    };

    const deletePost = async (id) => {
      await delay(MOCK_LATENCY_MS);
      setAllBlogPosts((prev) => prev.filter((p) => p.id !== id));
    };

    return {
      allBlogPosts,
      blogPosts,
      blogCategories: deriveBlogCategories(blogPosts),
      getBlogPostById: (id) => findPostById(blogPosts, id),
      getBlogPostForAdmin: (id) => findPostById(allBlogPosts, id), // includes drafts
      getFeaturedBlogPosts: (limit) => selectFeaturedPosts(blogPosts, limit),
      getRelatedBlogPosts: (post, limit) => selectRelatedPosts(blogPosts, post, limit),
      getAdjacentBlogPosts: (post) => selectAdjacentPosts(blogPosts, post),
      addPost,
      updatePost,
      deletePost,
    };
  }, [allBlogPosts, idCounters, setAllBlogPosts, setIdCounters]);

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};