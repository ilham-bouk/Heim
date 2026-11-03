import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useSettings } from '../context/SettingsContext';
import { HOME_TITLE_SUFFIX, getRouteMeta } from '../config/routeMeta';
import { applyPageMeta, formatTitle } from '../utils/pageMeta';

/**
 * Sets the document title and meta tags for the current route from config/routeMeta.js.
 * Mount once inside <AppProviders>, BEFORE <Routes>: pages that call usePageMeta (product,
 * article) then run after it and override the generic entry.
 */
const RouteMeta = () => {
  const { pathname } = useLocation();
  const { name, tagline } = useSettings().settings.store;

  useEffect(() => {
    const route = getRouteMeta(pathname);
    const title = route.home ? `${name} | ${HOME_TITLE_SUFFIX}` : formatTitle(route.title, name);
    const description = (route.description ?? tagline).replaceAll('{name}', name);

    applyPageMeta({ title, description, noindex: route.noindex });
  }, [pathname, name, tagline]);

  return null;
};

export default RouteMeta;