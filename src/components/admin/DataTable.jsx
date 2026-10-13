import { Fragment, useId, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Search } from 'lucide-react';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';

// ── Table state (search / sort / page) ──────────────────────────────────────
// Local by default. With `syncToUrl` it lives in ?q=…&sort=key:dir&page=N so
// the state survives opening a row and coming back. Defaults are omitted from
// the URL to keep it clean, and other params (e.g. a page's own ?status=) are
// preserved. Updates use `replace`, so typing doesn't flood browser history.
const parseSort = (value, fallback) => {
  const [key, direction] = (value ?? '').split(':');
  return key && (direction === 'asc' || direction === 'desc') ? { key, direction } : fallback;
};

const isSameSort = (a, b) => !!a && !!b && a.key === b.key && a.direction === b.direction;

const setOrDelete = (params, key, value) => {
  if (value) params.set(key, value);
  else params.delete(key);
};

const useTableState = (syncToUrl, initialSort) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localState, setLocalState] = useState({ query: '', sort: initialSort, page: 1 });

  // Primitives in the deps keep `sort` referentially stable between renders.
  const sortParam = searchParams.get('sort');
  const defaultKey = initialSort?.key;
  const defaultDirection = initialSort?.direction;
  const defaultSort = useMemo(
    () => (defaultKey ? { key: defaultKey, direction: defaultDirection } : null),
    [defaultKey, defaultDirection]
  );
  const urlSort = useMemo(() => parseSort(sortParam, defaultSort), [sortParam, defaultSort]);

  if (!syncToUrl) {
    return [localState, (changes) => setLocalState((prev) => ({ ...prev, ...changes }))];
  }

  const state = {
    query: searchParams.get('q') ?? '',
    sort: urlSort,
    page: Math.max(1, parseInt(searchParams.get('page'), 10) || 1),
  };

  const update = (changes) => {
    const next = { ...state, ...changes };
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        setOrDelete(params, 'q', next.query);
        setOrDelete(params, 'sort', next.sort && !isSameSort(next.sort, defaultSort) ? `${next.sort.key}:${next.sort.direction}` : '');
        setOrDelete(params, 'page', next.page > 1 ? String(next.page) : '');
        return params;
      },
      { replace: true }
    );
  };

  return [state, update];
};

/**
 * Generic admin table: search, sort, pagination, empty states, row actions and
 * one expandable row (used for inline delete confirmation).
 *
 * Column shape (TanStack-like, so it is easy to swap for a table library):
 *   { key, header, sortable?, sortValue?(row), align?: 'right', render?(row) }
 * Without `render`, the cell shows row[key].
 *
 * Search/sort/page are local state. Real backend: move them to query params and
 * fetch each page server-side; the props below stay the same.
 *
 * @param {string} caption - accessible table name (visually hidden)
 * @param {Array} columns
 * @param {Array} rows - already filtered by any extra filters in `toolbar`
 * @param {(row) => string|number} getRowId
 * @param {(row) => string} [searchText] - enables the search box; return the searchable text
 * @param {string} [searchLabel='Search']
 * @param {React.ReactNode} [toolbar] - extra controls next to the search box
 * @param {{key: string, direction: 'asc'|'desc'}} [initialSort]
 * @param {boolean} [syncToUrl=false] - keep search/sort/page in the URL (?q, ?sort, ?page)
 * @param {number} [pageSize=10]
 * @param {(row) => React.ReactNode} [rowActions]
 * @param {string|number|null} [expandedRowId] - row that shows `renderExpandedRow` underneath
 * @param {(row) => React.ReactNode} [renderExpandedRow]
 * @param {React.ElementType} [emptyIcon]
 * @param {string} [emptyTitle]
 * @param {string} [emptyMessage]
 * @param {React.ReactNode} [emptyAction]
 */
const DataTable = ({
  caption,
  columns,
  rows,
  getRowId,
  searchText,
  searchLabel = 'Search',
  toolbar,
  initialSort = null,
  syncToUrl = false,
  pageSize = 10,
  rowActions,
  expandedRowId = null,
  renderExpandedRow,
  emptyIcon,
  emptyTitle = 'Nothing here yet',
  emptyMessage,
  emptyAction,
}) => {
  const searchId = useId();
  const [{ query, sort, page }, updateTable] = useTableState(syncToUrl, initialSort);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchText) return rows;
    return rows.filter((row) => searchText(row).toLowerCase().includes(q));
  }, [rows, query, searchText]);

  const sorted = useMemo(() => {
    const column = sort && columns.find((c) => c.key === sort.key);
    if (!column) return filtered;
    const getValue = column.sortValue ?? ((row) => row[column.key]);
    const direction = sort.direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const first = getValue(a);
      const second = getValue(b);
      if (typeof first === 'number' && typeof second === 'number') return (first - second) * direction;
      return String(first ?? '').localeCompare(String(second ?? '')) * direction;
    });
  }, [filtered, sort, columns]);

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount); // stays valid when rows shrink
  const visibleRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);
  const colSpan = columns.length + (rowActions ? 1 : 0);

  const toggleSort = (key) => {
    updateTable({
      sort:
        sort?.key === key
          ? { key, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
          : { key, direction: 'asc' },
      page: 1,
    });
  };

  const getAriaSort = (column) => {
    if (!column.sortable) return undefined;
    if (sort?.key !== column.key) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div>
      {(searchText || toolbar) && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {searchText && (
            <div className="relative min-w-52 flex-1 sm:max-w-xs">
              <label htmlFor={searchId} className="sr-only">{searchLabel}</label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => {
                  updateTable({ query: e.target.value, page: 1 });
                }}
                placeholder={`${searchLabel}…`}
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
          {toolbar}
        </div>
      )}

      {/* Announces the result count when search or filters change. */}
      <p role="status" className="sr-only">
        {total} {total === 1 ? 'result' : 'results'}
      </p>

      {total === 0 ? (
        query.trim() ? (
          <EmptyState
            icon={Search}
            title="No results"
            message={`Nothing matches “${query.trim()}”.`}
            action={<Button variant="outline" size="sm" onClick={() => updateTable({ query: '', page: 1 })}>Clear search</Button>}
            />
        ) : (
          <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} action={emptyAction} />
        )
      ) : (
        <>
          <div
            role="region"
            aria-label={caption}
            tabIndex={0}
            className="overflow-x-auto rounded-xl border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <table className="w-full text-sm">
              <caption className="sr-only">{caption}</caption>
              <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  {columns.map((column) => {
                    const isSorted = sort?.key === column.key;
                    const SortIcon = !isSorted ? ChevronsUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown;
                    return (
                      <th
                        key={column.key}
                        scope="col"
                        aria-sort={getAriaSort(column)}
                        className={`px-4 py-3 font-semibold ${column.align === 'right' ? 'text-right' : ''}`}
                      >
                        {column.sortable ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(column.key)}
                            className="inline-flex items-center gap-1.5 uppercase tracking-wide transition-colors hover:text-foreground"
                          >
                            {column.header}
                            <SortIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        ) : (
                          column.header
                        )}
                      </th>
                    );
                  })}
                  {rowActions && (
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleRows.map((row) => {
                  const id = getRowId(row);
                  return (
                    <Fragment key={id}>
                      <tr className="hover:bg-secondary/40">
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className={`px-4 py-3 align-middle text-muted-foreground ${column.align === 'right' ? 'text-right' : ''}`}
                          >
                            {column.render ? column.render(row) : row[column.key]}
                          </td>
                        ))}
                        {rowActions && <td className="px-4 py-3 align-middle">{rowActions(row)}</td>}
                      </tr>
                      {expandedRowId === id && renderExpandedRow && (
                        <tr>
                          <td colSpan={colSpan} className="bg-secondary/40 px-4 py-4">
                            {renderExpandedRow(row)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              Showing {from}–{to} of {total}
            </p>
            {pageCount > 1 && (
              <nav aria-label="Pagination" className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => updateTable({ page: currentPage - 1 })}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Previous
                </Button>
                <span aria-current="page">Page {currentPage} of {pageCount}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === pageCount}
                  onClick={() => updateTable({ page: currentPage + 1 })}
                >
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </nav>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DataTable;