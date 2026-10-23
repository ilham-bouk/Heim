const BAR_AREA_PX = 160; // height reserved for the tallest bar plus its value label
const LABEL_PX = 20;

const defaultFormat = (value) => value.toLocaleString();

/**
 * Vertical bar chart without a library. The visual is role="img" (its children
 * are hidden from assistive tech), so the real data is in a sibling sr-only table.
 *
 * @param {Array<{key: string, label: string, fullLabel?: string, value: number, current?: boolean}>} data
 * @param {string} ariaLabel - short summary of what the chart shows
 * @param {string} caption - sr-only table caption
 * @param {string} labelHeader - sr-only header of the first column
 * @param {string} valueHeader - sr-only header of the second column
 * @param {(value: number) => string} [formatValue]
 */
const ColumnChart = ({ data, ariaLabel, caption, labelHeader, valueHeader, formatValue = defaultFormat }) => {
  const max = Math.max(0, ...data.map((item) => item.value));

  return (
    <div>
      <div role="img" aria-label={ariaLabel} className="flex items-stretch gap-1 sm:gap-2">
        {data.map((item) => {
          const barPx =
            max > 0 && item.value > 0
              ? Math.max(2, Math.round((item.value / max) * (BAR_AREA_PX - LABEL_PX)))
              : 0;

          return (
            <div key={item.key} className="flex min-w-0 flex-1 flex-col items-center">
              <div
                className="flex w-full flex-col items-center justify-end border-b border-border"
                style={{ height: BAR_AREA_PX }}
              >
                <span className="mb-1 text-xs font-medium text-foreground">{formatValue(item.value)}</span>
                <div
                  className={`w-full rounded-t-md ${item.current ? 'bg-primary/60' : 'bg-primary'}`}
                  style={{ height: barPx }}
                />
              </div>
              <span className="mt-2 text-xs text-muted-foreground">{item.label}</span>
              {item.current && <span className="text-[11px] text-muted-foreground">so far</span>}
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
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.key}>
              <th scope="row">{item.fullLabel ?? item.label}{item.current ? ' (so far)' : ''}</th>
              <td>{formatValue(item.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ColumnChart;