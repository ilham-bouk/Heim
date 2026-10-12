import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import Button from '../ui/Button';
import FormField from './FormField';
import ImageField from './ImageField';
import { PLACEHOLDER_POST_IMAGE, toDateInputValue, toPublishedAt } from '../../services/blogService';

const todayInputValue = () => new Date().toISOString().slice(0, 10);

const toFormValues = (post, defaultAuthor) => ({
  title: post?.title ?? '',
  excerpt: post?.excerpt ?? '',
  content: post?.content ?? '',
  author: post?.author ?? defaultAuthor,
  category: post?.category ?? '',
  tags: post?.tags?.join(', ') ?? '',
  publishedAt: post ? toDateInputValue(post.publishedAt) : todayInputValue(),
  status: post?.status ?? 'draft',
  featured: !!post?.featured,
});

const parseTags = (value) => [...new Set(value.split(',').map((tag) => tag.trim()).filter(Boolean))];

const validate = (values) => {
  const errors = {};

  if (values.title.trim().length < 3) errors.title = 'Title must be at least 3 characters';
  if (!values.excerpt.trim()) errors.excerpt = 'Excerpt is required';
  else if (values.excerpt.trim().length > 220) errors.excerpt = 'Keep the excerpt under 220 characters';
  if (!values.content.trim()) errors.content = 'Content is required';
  if (!values.author.trim()) errors.author = 'Author is required';
  if (!values.category.trim()) errors.category = 'Category is required';
  if (!values.publishedAt || Number.isNaN(Date.parse(values.publishedAt))) errors.publishedAt = 'Choose a valid date';

  return errors;
};

// Form strings -> the typed payload the blog expects (the future API body).
const toInput = (values) => ({
  title: values.title.trim(),
  excerpt: values.excerpt.trim(),
  content: values.content.trim(),
  author: values.author.trim(),
  category: values.category.trim(),
  tags: parseTags(values.tags),
  publishedAt: toPublishedAt(values.publishedAt),
  status: values.status,
  featured: values.featured,
});

/**
 * Add / edit blog post form (the page decides what "submit" means, see
 * pages/Admin-blog-form.jsx). Read time is computed from the content.
 *
 * @param {object|null} [post] - the post being edited; omit to add
 * @param {string[]} categorySuggestions - existing categories offered as suggestions
 * @param {string} [defaultAuthor] - prefilled author for new posts
 * @param {string} [submitLabel='Save post']
 * @param {string} cancelTo - where Cancel goes
 * @param {(input: object) => Promise<void>} onSubmit
 */
const BlogPostForm = ({ post = null, categorySuggestions, defaultAuthor = '', submitLabel = 'Save post', cancelTo, onSubmit }) => {
  const formRef = useRef(null);
  const listId = useId();
  const [values, setValues] = useState(() => toFormValues(post, defaultAuthor));
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // After a failed submit, move focus to the first invalid field.
  useEffect(() => {
    if (submitCount === 0) return;
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [submitCount]);

  const setField = (name) => (e) => {
    const { value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitCount((count) => count + 1);
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(toInput(values));
    } finally {
      setIsSaving(false);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-10">
      <fieldset className="min-w-0 space-y-5">
        <legend className="mb-4 text-lg font-bold text-foreground">Article</legend>
        <FormField label="Title" required error={errors.title}>
          {(control) => (
            <input name="title" type="text" value={values.title} onChange={setField('title')} placeholder="e.g. 5 Ways to Style a Small Hallway" {...control} />
          )}
        </FormField>
        <FormField label="Excerpt" required error={errors.excerpt} hint="Shown on blog cards. Up to 220 characters.">
          {(control) => (
            <textarea name="excerpt" rows={3} value={values.excerpt} onChange={setField('excerpt')} {...control} />
          )}
        </FormField>
        <FormField
          label="Content"
          required
          error={errors.content}
          hint="Separate paragraphs with a blank line. Read time is calculated for you."
        >
          {(control) => (
            <textarea name="content" rows={12} value={values.content} onChange={setField('content')} {...control} />
          )}
        </FormField>
      </fieldset>

      <fieldset className="min-w-0 space-y-5">
        <legend className="mb-4 text-lg font-bold text-foreground">Details</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Author" required error={errors.author}>
            {(control) => (
              <input name="author" type="text" value={values.author} onChange={setField('author')} {...control} />
            )}
          </FormField>
          <FormField label="Category" required error={errors.category} hint="Pick an existing one or type a new one.">
            {(control) => (
              <>
                <input name="category" type="text" list={listId} value={values.category} onChange={setField('category')} {...control} />
                <datalist id={listId}>
                  {categorySuggestions.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </>
            )}
          </FormField>
          <FormField label="Tags" hint="Optional. Separate with commas." className="sm:col-span-2">
            {(control) => (
              <input name="tags" type="text" value={values.tags} onChange={setField('tags')} placeholder="cozy, living room" {...control} />
            )}
          </FormField>
        </div>
      </fieldset>

      <fieldset className="min-w-0 space-y-5">
        <legend className="mb-4 text-lg font-bold text-foreground">Publishing</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Status" hint="Drafts are hidden from the storefront.">
            {(control) => (
              <select name="status" value={values.status} onChange={setField('status')} {...control}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            )}
          </FormField>
          <FormField label="Publish date" required error={errors.publishedAt} hint="Shown on the post. Future dates are not scheduled.">
            {(control) => (
              <input name="publishedAt" type="date" value={values.publishedAt} onChange={setField('publishedAt')} {...control} />
            )}
          </FormField>
        </div>
        <label className="flex w-fit cursor-pointer select-none items-center gap-2.5">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => setValues((prev) => ({ ...prev, featured: e.target.checked }))}
            className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
          />
          <span className="text-sm text-foreground">Featured (home page and blog highlights, first 3 shown)</span>
        </label>
      </fieldset>

      <fieldset className="min-w-0 space-y-5">
        <legend className="mb-4 text-lg font-bold text-foreground">Image</legend>
        <ImageField image={post?.image ?? PLACEHOLDER_POST_IMAGE} />
      </fieldset>

      {hasErrors && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          Please fix the highlighted fields.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={isSaving} className="disabled:cursor-not-allowed disabled:opacity-50">
          {isSaving ? 'Saving…' : submitLabel}
        </Button>
        <Button as={Link} to={cancelTo} variant="ghost">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BlogPostForm;