import { useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router';
import { Eye, MessageSquare, Trash2 } from 'lucide-react';
import ConfirmInline from '../components/ui/ConfirmInline';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/admin/DataTable';
import PageHeader from '../components/admin/PageHeader';
import { useMessages } from '../context/MessageContext';
import { useToast } from '../context/ToastContext';
import {
  MESSAGE_FILTERS,
  getSubjectLabel,
  selectMessagesByStatus,
} from '../services/messageService';
import { formatDate } from '../utils/format';
import { focusAdminPageTitle } from '../utils/admin';

const iconButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground';

// Module-level so DataTable's memoised filtering/sorting stays stable.
const getMessageId = (message) => message.id;
const getSearchText = (message) =>
  `${message.name} ${message.email} ${getSubjectLabel(message.subject)} ${message.message}`;

const COLUMNS = [
  {
    key: 'name',
    header: 'From',
    sortable: true,
    render: (message) => (
      <div className="min-w-44">
        <p className={`text-foreground ${message.read ? 'font-medium' : 'font-bold'}`}>{message.name}</p>
        <p className="text-xs">{message.email}</p>
      </div>
    ),
  },
  {
    key: 'subject',
    header: 'Subject',
    sortable: true,
    sortValue: (message) => getSubjectLabel(message.subject),
    render: (message) => (
      <div className="min-w-56 max-w-sm">
        <p className="text-foreground">{getSubjectLabel(message.subject)}</p>
        <p className="line-clamp-1 text-xs">{message.message}</p>
      </div>
    ),
  },
  {
    key: 'createdAt',
    header: 'Received',
    sortable: true,
    render: (message) => <span className="whitespace-nowrap">{formatDate(message.createdAt)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    sortValue: (message) => Number(message.read), // unread first when ascending
    render: (message) => (
      <StatusBadge tone={message.read ? 'neutral' : 'accent'}>{message.read ? 'Read' : 'Unread'}</StatusBadge>
    ),
  },
];

/**
 * /admin/messages. The status filter lives in the URL (?status=unread) next to
 * DataTable's own q/sort/page, so the detail page's back link restores everything.
 */
const AdminMessages = () => {
  const { messages, unreadCount, deleteMessage } = useMessages();
  const toast = useToast();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [confirmingId, setConfirmingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusParam = searchParams.get('status');
  const status = MESSAGE_FILTERS.some((filter) => filter.value === statusParam) ? statusParam : '';

  const rows = useMemo(() => selectMessagesByStatus(messages, status), [messages, status]);

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set('status', value);
        else next.delete('status');
        next.delete('page'); // a different filter means a different page count
        return next;
      },
      { replace: true }
    );
  };

  const handleDelete = async (message) => {
    setIsDeleting(true);
    try {
      await deleteMessage(message.id);
      toast.success(`The message from “${message.name}” was deleted.`);
      setConfirmingId(null);
      focusAdminPageTitle(); // the row (and the focused button) is gone
    } catch {
      toast.error('Could not delete the message. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const statusFilter = (
    <div>
      <label htmlFor="message-status-filter" className="sr-only">Filter by status</label>
      <select
        id="message-status-filter"
        value={status}
        onChange={handleStatusChange}
        className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All messages ({messages.length})</option>
        <option value="unread">Unread ({unreadCount})</option>
        <option value="read">Read ({messages.length - unreadCount})</option>
      </select>
    </div>
  );

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title="Messages"
        description={`${messages.length} ${messages.length === 1 ? 'message' : 'messages'}, ${unreadCount} unread. Sent from the contact form.`}
      />

      <DataTable
        caption="Contact messages"
        columns={COLUMNS}
        rows={rows}
        getRowId={getMessageId}
        searchText={getSearchText}
        searchLabel="Search messages"
        toolbar={statusFilter}
        initialSort={{ key: 'createdAt', direction: 'desc' }}
        syncToUrl
        rowActions={(message) => (
          <div className="flex items-center justify-end gap-1">
            {/* fromSearch lets the detail page's back link restore this filter/sort/page. */}
            <Link
              to={`/admin/messages/${message.id}`}
              state={{ fromSearch: location.search }}
              aria-label={`Read the message from ${message.name}`}
              className={iconButtonClass}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              aria-label={`Delete the message from ${message.name}`}
              aria-expanded={confirmingId === message.id}
              onClick={() => setConfirmingId(message.id)}
              className={`${iconButtonClass} hover:text-destructive`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
        expandedRowId={confirmingId}
        renderExpandedRow={(message) => (
          <ConfirmInline
            message={`Delete the message from “${message.name}”? This can't be undone.`}
            busy={isDeleting}
            onConfirm={() => handleDelete(message)}
            onCancel={() => setConfirmingId(null)}
          />
        )}
        emptyIcon={MessageSquare}
        emptyTitle={status ? `No ${status} messages` : 'No messages yet'}
        emptyMessage={status ? 'Try another status.' : 'Messages sent from the contact form appear here.'}
      />
    </div>
  );
};

export default AdminMessages;