import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/**
 * On every route (pathname) change: scrolls to the top and moves focus to
 * <main id="main-content"> so keyboard and screen-reader users start at the
 * new page instead of the old focus position. Skips the first load.
 * Mount once, inside <BrowserRouter>, above <Routes>.
 *
 * Only `pathname` is watched, so hash and query-string changes (shop filters,
 * table search) don't move focus. Admin pages then focus their own <h1>
 * (see components/admin/PageHeader.jsx), which runs after this effect.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
};

export default ScrollToTop;