import { Link } from 'react-router';
import { ArrowDown, ArrowUp } from 'lucide-react';

const DeltaText = ({ delta, label }) => {
  if (!delta) return null;

  if (delta.kind === 'new') {
    return (
      <span className="font-semibold text-foreground">
        New<span className="sr-only"> {label}</span>
      </span>
    );
  }

  const { percent, direction } = delta;
  const Icon = direction === 'up' ? ArrowUp : direction === 'down' ? ArrowDown : null;
  const spoken = direction === 'flat' ? 'No change' : `${direction === 'up' ? 'Up' : 'Down'} ${Math.abs(percent)}%`;

  return (
    <span className="inline-flex items-center gap-0.5 font-semibold text-foreground">
      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
      <span aria-hidden="true">{direction === 'flat' ? '0%' : `${Math.abs(percent)}%`}</span>
      <span className="sr-only">{spoken} {label}</span>
    </span>
  );
};

/**
 * One dashboard figure. The whole card is a link to where the number comes from.
 *
 * @param {string} label
 * @param {string|number} value - already formatted
 * @param {React.ElementType} icon - a lucide icon component
 * @param {string} to - destination route
 * @param {string} [hint] - small line under the value
 * @param {{kind: 'new'} | {kind: 'change', percent: number, direction: string} | null} [delta]
 * @param {string} [deltaLabel] - what the delta compares against, e.g. "compared with the previous 30 days"
 */
const StatCard = ({ label, value, icon: Icon, to, hint, delta = null, deltaLabel = '' }) => (
  <Link
    to={to}
    className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
  >
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-4 w-4 text-foreground" aria-hidden="true" />
      </span>
    </div>
    <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
    {(hint || delta) && (
      <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
        <DeltaText delta={delta} label={deltaLabel} />
        {hint && <span>{hint}</span>}
      </p>
    )}
  </Link>
);

export default StatCard;