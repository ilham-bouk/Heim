// Admin pages focus their <h1> when they open (route changes are otherwise
// silent for screen-reader and keyboard users). Pages can also call
// focusAdminPageTitle() after an action removes the focused element.

export const ADMIN_PAGE_TITLE_ID = 'admin-page-title';

export const focusAdminPageTitle = () =>
  document.getElementById(ADMIN_PAGE_TITLE_ID)?.focus({ preventScroll: true });