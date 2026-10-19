import { useState } from 'react';
import { Mail, Trash2 } from 'lucide-react';
import ConfirmInline from '../components/ui/ConfirmInline';
import DataTable from '../components/admin/DataTable';
import PageHeader from '../components/admin/PageHeader';
import { useSubscribers } from '../context/SubscriberContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/format';
import { focusAdminPageTitle } from '../utils/admin';

const iconButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground';

// Module-level so DataTable's memoised filtering/sorting stays stable.
const getSubscriberId = (subscriber) => subscriber.email;
const getSearchText = (subscriber) => subscriber.email;

const COLUMNS = [
  {
    key: 'email',
    header: 'Email',
    sortable: true,
    render: (subscriber) => <span className="font-medium text-foreground">{subscriber.email}</span>,
  },
  {
    key: 'subscribedAt',
    header: 'Subscribed',
    sortable: true,
    render: (subscriber) => <span className="whitespace-nowrap">{formatDate(subscriber.subscribedAt)}</span>,
  },
];

/** /admin/subscribers. Newsletter sign-ups, newest first. Read + delete only (no CSV export: deferred). */
const AdminSubscribers = () => {
  const { subscribers, unsubscribe } = useSubscribers();
  const toast = useToast();

  const [confirmingId, setConfirmingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (subscriber) => {
    setIsDeleting(true);
    try {
      await unsubscribe(subscriber.email);
      toast.success(`“${subscriber.email}” was removed.`);
      setConfirmingId(null);
      focusAdminPageTitle(); // the row (and the focused button) is gone
    } catch {
      toast.error('Could not remove the subscriber. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title="Subscribers"
        description={`${subscribers.length} ${subscribers.length === 1 ? 'subscriber' : 'subscribers'} to the newsletter.`}
      />

      <DataTable
        caption="Newsletter subscribers"
        columns={COLUMNS}
        rows={subscribers}
        getRowId={getSubscriberId}
        searchText={getSearchText}
        searchLabel="Search subscribers"
        initialSort={{ key: 'subscribedAt', direction: 'desc' }}
        rowActions={(subscriber) => (
          <div className="flex items-center justify-end">
            <button
              type="button"
              aria-label={`Delete ${subscriber.email}`}
              aria-expanded={confirmingId === subscriber.email}
              onClick={() => setConfirmingId(subscriber.email)}
              className={`${iconButtonClass} hover:text-destructive`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
        expandedRowId={confirmingId}
        renderExpandedRow={(subscriber) => (
          <ConfirmInline
            message={`Delete “${subscriber.email}”? They stop appearing here, and can subscribe again.`}
            busy={isDeleting}
            onConfirm={() => handleDelete(subscriber)}
            onCancel={() => setConfirmingId(null)}
          />
        )}
        emptyIcon={Mail}
        emptyTitle="No subscribers yet"
        emptyMessage="People who sign up with the newsletter form appear here."
      />
    </div>
  );
};

export default AdminSubscribers;