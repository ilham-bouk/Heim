/** Formats an ISO date string for display, e.g. "March 15, 2026". */
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });