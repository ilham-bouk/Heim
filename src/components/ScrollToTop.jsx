import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Scrolls the window to the top whenever the route pathname changes.
 * Mount once, inside <BrowserRouter>, above <Routes>.
 *
 * Note: only watches `pathname`, not the full location — so it ignores
 * hash changes (#section) on purpose. If you add in-page anchor links
 * later, you may want to skip the reset when only the hash changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;