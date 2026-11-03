// Updates <title> and the <meta> tags in <head>. Plain DOM code on purpose: index.html already has a
// static <title>, and this keeps working with it (React 19's built-in <title> would add a second one).

const MAX_DESCRIPTION_LENGTH = 160;

const upsertMeta = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const removeMeta = (attribute, key) => document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();

const truncate = (text) =>
  text.length > MAX_DESCRIPTION_LENGTH ? `${text.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd()}…` : text;

/** "Shop | Heim", or just the site name when there is no page title. */
export const formatTitle = (title, siteName) => (title ? `${title} | ${siteName}` : siteName);

/**
 * @param {{title: string, description: string, image?: string, type?: string, noindex?: boolean}} meta
 *   `title` is the final document title. `image` may be a relative URL (it is made absolute).
 */
export const applyPageMeta = ({ title, description, image, type = 'website', noindex = false }) => {
  const summary = truncate(description);

  document.title = title;
  upsertMeta('name', 'description', summary);
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', summary);
  upsertMeta('property', 'og:url', window.location.href);

  if (image) upsertMeta('property', 'og:image', new URL(image, document.baseURI).href);
  else removeMeta('property', 'og:image');
};