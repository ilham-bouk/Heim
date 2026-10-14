/** Formats an ISO date string for display, e.g. "March 15, 2026". */
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

/** Formats an ISO timestamp with the time, e.g. "Mar 15, 2026, 2:30 PM". */
export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

/**
 * Formats a 'YYYY-MM-DD' calendar date (no time zone) for display, e.g. "March 15, 2026".
 * Built from parts on purpose: new Date('2026-03-15') is UTC and can show the previous day.
 */
export const formatLocalDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};