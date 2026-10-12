// Blog data helpers: PURE functions over arrays. State lives in
// context/BlogContext.jsx (see productService.js for the reasoning).

import { blogPosts } from '../data/mockData';
import placeholderImage from '../assets/product-placeholder.svg';

export const getSeedBlogPosts = () => blogPosts;

export const PLACEHOLDER_POST_IMAGE = placeholderImage;

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
      post.title.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      (post.tags ?? []).some((tag) => tag.toLowerCase().includes(q)); // tag links on Blog Detail search by tag
    return matchesCategory && matchesSearch;
  });
};

const WORDS_PER_MINUTE = 200;

/** "5 min read", at least 1 minute. */
export const estimateReadTime = (content) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read`;
};

// The admin picks a calendar day; stored as noon UTC like the seed data so the
// displayed day doesn't shift with the viewer's timezone.
export const toPublishedAt = (dateString) => `${dateString}T12:00:00.000Z`;
export const toDateInputValue = (iso) => iso.slice(0, 10);

const pickEditableFields = (input) => ({
  title: input.title,
  excerpt: input.excerpt,
  content: input.content,
  author: input.author,
  category: input.category,
  tags: input.tags,
  publishedAt: input.publishedAt,
  status: input.status,
  featured: input.featured,
});

/** Real backend: the server builds the post and returns it. */
export const createPost = (input, id) => ({
  id,
  ...pickEditableFields(input),
  image: PLACEHOLDER_POST_IMAGE,
  readTime: estimateReadTime(input.content),
});

/** Applies admin input; id and image are kept, and read time only changes if the content did. */
export const applyPostInput = (post, input) => ({
  ...post,
  ...pickEditableFields(input),
  readTime: input.content === post.content ? post.readTime : estimateReadTime(input.content),
});