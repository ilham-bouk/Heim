import { useEffect, useRef, useState } from 'react';
import { Pencil, Plus, Ticket, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import ConfirmInline from '../components/ui/ConfirmInline';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/admin/DataTable';
import PageHeader from '../components/admin/PageHeader';
import PromoForm from '../components/forms/PromoForm';
import { usePromos } from '../context/PromoContext';
import { useToast } from '../context/ToastContext';
import { describePromo, getPromoStatus } from '../services/promoService';
import { formatLocalDate } from '../utils/format';
import { focusAdminPageTitle } from '../utils/admin';

const STATUS_TONE = { Active: 'success', Inactive: 'neutral', Expired: 'danger' };

const iconButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground';

// Module-level so DataTable's memoised filtering/sorting stays stable.
const getPromoCode = (promo) => promo.code;
const getSearchText = (promo) => `${promo.code} ${describePromo(promo)} ${getPromoStatus(promo)}`;

const COLUMNS = [
  {
    key: 'code',
    header: 'Code',
    sortable: true,
    render: (promo) => <span className="font-mono font-medium text-foreground">{promo.code}</span>,
  },
  { key: 'discount', header: 'Discount', render: describePromo },
  {
    key: 'expiresAt',
    header: 'Expires',
    sortable: true,
    sortValue: (promo) => promo.expiresAt ?? '9999-12-31', // "never" sorts last when ascending
    render: (promo) =>
      promo.expiresAt ? <span className="whitespace-nowrap">{formatLocalDate(promo.expiresAt)}</span> : 'Never',
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    sortValue: getPromoStatus,
    render: (promo) => {
      const status = getPromoStatus(promo);
      return <StatusBadge tone={STATUS_TONE[status]}>{status}</StatusBadge>;
    },
  },
];

/**
 * Promos: inline add/edit panel (same pattern as Categories).
 * `editingId` is null (closed) | 'new' | a promo code. Codes are always
 * uppercase, so they can never collide with the lowercase 'new'.
 */
const AdminPromos = () => {
  const { promos, addPromo, updatePromo, deletePromo } = usePromos();
  const toast = useToast();

  const [editingId, setEditingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const triggerRef = useRef(null);

  const editingPromo = promos.find((promo) => promo.code === editingId) ?? null;
  const isPanelOpen = editingId !== null;

  // When the panel closes, put focus back on whatever opened it.
  useEffect(() => {
    if (editingId !== null) return;
    const trigger = triggerRef.current;
    triggerRef.current = null;
    if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
  }, [editingId]);

  const openPanel = (id) => {
    triggerRef.current = document.activeElement;
    setConfirmingId(null);
    setEditingId(id);
  };
  const closePanel = () => setEditingId(null);

  const handleSubmit = async (input) => {
    try {
      if (editingId === 'new') {
        await addPromo(input);
        toast.success(`“${input.code}” was added.`);
      } else {
        await updatePromo(editingId, input);
        toast.success(`“${editingId}” was updated.`);
      }
      closePanel();
    } catch (error) {
      toast.error(error.message || 'Could not save the promo. Please try again.');
    }
  };

  const handleDelete = async (promo) => {
    setIsDeleting(true);
    try {
      await deletePromo(promo.code);
      toast.success(`“${promo.code}” was deleted.`);
      setConfirmingId(null);
      focusAdminPageTitle(); // the row (and the focused button) is gone
    } catch (error) {
      toast.error(error.message || 'Could not delete the promo. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = promos.filter((promo) => getPromoStatus(promo) === 'Active').length;

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title="Promo codes"
        description={`${promos.length} promo codes, ${activeCount} active. Customers apply them in the cart.`}
        actions={
          <Button className="gap-2" aria-expanded={editingId === 'new'} onClick={() => openPanel('new')}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add promo
          </Button>
        }
      />

      {isPanelOpen && (
        <PromoForm
          key={editingId}
          promo={editingPromo}
          existingCodes={promos.filter((promo) => promo.code !== editingPromo?.code).map((promo) => promo.code)}
          submitLabel={editingId === 'new' ? 'Add promo' : 'Save changes'}
          onSubmit={handleSubmit}
          onCancel={closePanel}
          className="mb-8"
        />
      )}

      <DataTable
        caption="Promo codes"
        columns={COLUMNS}
        rows={promos}
        getRowId={getPromoCode}
        searchText={getSearchText}
        searchLabel="Search promos"
        initialSort={{ key: 'code', direction: 'asc' }}
        rowActions={(promo) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              aria-label={`Edit ${promo.code}`}
              onClick={() => openPanel(promo.code)}
              className={iconButtonClass}
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={`Delete ${promo.code}`}
              aria-expanded={confirmingId === promo.code}
              onClick={() => setConfirmingId(promo.code)}
              className={`${iconButtonClass} hover:text-destructive`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
        expandedRowId={confirmingId}
        renderExpandedRow={(promo) => (
          <ConfirmInline
            message={`Delete “${promo.code}”? Carts using it lose the discount. Existing orders keep theirs.`}
            busy={isDeleting}
            onConfirm={() => handleDelete(promo)}
            onCancel={() => setConfirmingId(null)}
          />
        )}
        emptyIcon={Ticket}
        emptyTitle="No promo codes yet"
        emptyMessage="Add a promo code and customers can apply it in the cart."
      />
    </div>
  );
};

export default AdminPromos;