// Blog data service — see productService.js for the reasoning.
// Components should import from here, never from `data/mockData.js` directly.

import { blogPosts, blogCategories } from '../data/mockData';

export const getBlogPosts = () => blogPosts;

export const getBlogPostById = (id) =>
  blogPosts.find((post) => post.id === Number(id)) || null;

export const getFeaturedBlogPosts = (limit = 3) =>
  blogPosts.filter((post) => post.featured).slice(0, limit);

export const getRelatedBlogPosts = (post, limit = 3) =>
  blogPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, limit);

export const getAdjacentBlogPosts = (post) => {
  const index = blogPosts.findIndex((p) => p.id === post.id);
  return {
    previous: index > 0 ? blogPosts[index - 1] : null,
    next: index < blogPosts.length - 1 ? blogPosts[index + 1] : null,
  };
};

export const getBlogCategories = () => blogCategories;

// Shared filter logic so Blog.jsx doesn't duplicate this inline.
export const searchBlogPosts = (posts, query = '', category = 'All') => {
  const q = query.toLowerCase();
  return posts.filter((post) => {
    const matchesCategory = category === 'All' || post.category === category;
    const matchesSearch =
      post.title.toLowerCase().includes(q) || post.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
};