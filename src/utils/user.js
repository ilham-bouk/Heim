export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('') || 'U';

/** Canonical form for comparing emails (orders are matched to users by email). */
export const normalizeEmail = (email = '') => email.trim().toLowerCase();