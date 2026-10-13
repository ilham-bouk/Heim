/** Formats an ISO date string for display, e.g. "March 15, 2026". */
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

/** Formats an ISO timestamp with the time, e.g. "Mar 15, 2026, 2:30 PM". */
export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });