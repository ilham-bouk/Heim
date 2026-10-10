const TONES = {
  neutral: 'bg-secondary text-muted-foreground',
  success: 'bg-success/10 text-success',
  accent: 'bg-accent/10 text-accent',
  danger: 'bg-destructive/10 text-destructive',
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