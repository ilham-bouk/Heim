const TONES = {
  neutral: 'bg-secondary text-muted-foreground',
  success: 'bg-success/10 text-success-text',
  accent: 'bg-accent/10 text-accent-text',
  danger: 'bg-destructive/10 text-destructive-text',
};

/**
 * Small pill for statuses and labels.
 * @param {'neutral'|'success'|'accent'|'danger'} [tone='neutral']
 */
const StatusBadge = ({ tone = 'neutral', children }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TONES[tone]}`}>
    {children}
  </span>
);

export default StatusBadge;