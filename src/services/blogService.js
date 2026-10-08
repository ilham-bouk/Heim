// Blog data helpers: PURE functions over arrays. State lives in
// context/BlogContext.jsx (see productService.js for the reasoning).

import { blogPosts } from '../data/mockData';

export const getSeedBlogPosts = () => blogPosts;

export const selectPublishedPosts = (posts) =>
  posts
    .filter((post) => post.status === 'published')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const findPostById = (posts, id) =>
  posts.find((post) => post.id === Number(id)) || null;

export const selectFeaturedPosts = (posts, limit = 3) =>
  posts.filter((post) => post.featured).slice(0, limit);

export const selectRelatedPosts = (posts, post, limit = 3) =>
  posts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, limit);

export const selectAdjacentPosts = (posts, post) => {
  const index = posts.findIndex((p) => p.id === post.id);
  return {
    previous: index > 0 ? posts[index - 1] : null,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
  };
};

// Blog categories are derived from the posts (no separate list to maintain).
export const deriveBlogCategories = (posts) => {
  const counts = new Map();
  posts.forEach((post) => counts.set(post.category, (counts.get(post.category) ?? 0) + 1));
  return [
    { id: 1, name: 'All', count: posts.length },
    ...[...counts].map(([name, count], index) => ({ id: index + 2, name, count })),
  ];
};

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