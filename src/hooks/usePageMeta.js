import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { applyPageMeta, formatTitle } from '../utils/pageMeta';

/**
 * Page-specific title and meta (a product, an article). Overrides what <RouteMeta /> set for the route.
 * Does nothing while `title` is empty, so it is safe to call before the data is found.
 *
 * @param {{title?: string, description?: string, image?: string, type?: 'website'|'article'|'product'}} meta
 */
export const usePageMeta = ({ title, description, image, type = 'website' }) => {
  const { name, tagline } = useSettings().settings.store;

  useEffect(() => {
    if (!title) return;
    applyPageMeta({ title: formatTitle(title, name), description: description || tagline, image, type });
  }, [title, description, image, type, name, tagline]);
};