const defaultFormat = (value) => value.toLocaleString();

/**
 * Horizontal bars with the label and value always visible (nothing is colour-only).
 * The visual is role="img"; the data is in a sibling sr-only table.
 *
 * `barClass` must be a full Tailwind class written out in source (e.g. 'bg-success'),
 * never built from parts, or Tailwind won't generate it.
 *
 * @param {Array<{key: string, label: string, value: number, display?: string, secondary?: string, barClass?: string}>} items
 * @param {string} ariaLabel - short summary of what the chart shows
 * @param {string} caption - sr-only table caption
 * @param {string} labelHeader
 * @param {string} valueHeader
 * @param {string} [secondaryHeader] - adds a third sr-only column for `secondary`
 * @param {(value: number) => string} [formatValue] - used when an item has no `display`
 */
const BarList = ({ items, ariaLabel, caption, labelHeader, valueHeader, secondaryHeader, formatValue = defaultFormat }) => {
  const max = Math.max(0, ...items.map((item) => item.value));

  return (
    <div>
      <div role="img" aria-label={ariaLabel} className="space-y-4">
        {items.map((item) => {
          const width = max > 0 && item.value > 0 ? Math.max(2, (item.value / max) * 100) : 0;

          return (
            <div key={item.key}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium text-foreground">{item.label}</span>
                <span className="shrink-0 font-semibold text-foreground">{item.display ?? formatValue(item.value)}</span>
              </div>
              {item.secondary && <p className="text-xs text-muted-foreground">{item.secondary}</p>}
              <div className="mt-1.5 h-2 rounded-full bg-secondary">
                <div
                  className={`h-2 rounded-full ${item.barClass ?? 'bg-primary'}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{labelHeader}</th>
            <th scope="col">{valueHeader}</th>
            {secondaryHeader && <th scope="col">{secondaryHeader}</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key}>
              <th scope="row">{item.label}</th>
              <td>{item.display ?? formatValue(item.value)}</td>
              {secondaryHeader && <td>{item.secondary}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BarList;