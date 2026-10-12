import { useEffect, useRef, useState } from 'react';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import ConfirmInline from '../components/ui/ConfirmInline';
import DataTable from '../components/admin/DataTable';
import PageHeader from '../components/admin/PageHeader';
import CategoryForm from '../components/forms/CategoryForm';
import { useCatalog } from '../context/CatalogContext';
import { useToast } from '../context/ToastContext';
import { focusAdminPageTitle } from '../utils/admin';

const iconButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground';

const getCategoryId = (category) => category.id;

const COLUMNS = [
  {
    key: 'name',
    header: 'Category',
    sortable: true,
    render: (category) => (
      <div className="flex min-w-40 items-center gap-3">
        <img src={category.image} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover" />
        <span className="font-medium text-foreground">{category.name}</span>
      </div>
    ),
  },
  { key: 'itemCount', header: 'Products', sortable: true, align: 'right' },
];

/** Shown instead of the delete confirmation when the category still has products. */
const BlockedNotice = ({ message, onClose }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div
      role="group"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <p className="text-sm font-medium text-foreground">{message}</p>
      <Button ref={closeRef} type="button" variant="outline" size="sm" onClick={onClose}>
        Got it
      </Button>
    </div>
  );
};

/**
 * Categories: inline add/edit panel (same pattern as Account → Addresses).
 * `editingId` is null (closed) | 'new' | a category id.
 */
const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCatalog();
  const toast = useToast();

  const [editingId, setEditingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const triggerRef = useRef(null);

  const editingCategory = categories.find((c) => c.id === editingId) ?? null;
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

  const handleSubmit = async ({ name }) => {
    try {
      if (editingId === 'new') {
        await addCategory({ name });
        toast.success(`“${name}” was added.`);
      } else {
        await updateCategory(editingId, { name });
        toast.success(`“${name}” was updated.`);
      }
      closePanel();
    } catch (error) {
      toast.error(error.message || 'Could not save the category. Please try again.');
    }
  };

  const handleDelete = async (category) => {
    setIsDeleting(true);
    try {
      await deleteCategory(category.id);
      toast.success(`“${category.name}” was deleted.`);
      setConfirmingId(null);
      focusAdminPageTitle(); // the row (and the focused button) is gone
    } catch (error) {
      toast.error(error.message || 'Could not delete the category. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title="Categories"
        description={`${categories.length} categories. Renaming one updates every product in it.`}
        actions={
          <Button className="gap-2" aria-expanded={editingId === 'new'} onClick={() => openPanel('new')}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add category
          </Button>
        }
      />

      {isPanelOpen && (
        <CategoryForm
          key={editingId}
          category={editingCategory}
          existingNames={categories.filter((c) => c.id !== editingCategory?.id).map((c) => c.name)}
          submitLabel={editingId === 'new' ? 'Add category' : 'Save changes'}
          onSubmit={handleSubmit}
          onCancel={closePanel}
          className="mb-8"
        />
      )}

      <DataTable
        caption="Categories"
        columns={COLUMNS}
        rows={categories}
        getRowId={getCategoryId}
        initialSort={{ key: 'name', direction: 'asc' }}
        rowActions={(category) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              aria-label={`Edit ${category.name}`}
              onClick={() => openPanel(category.id)}
              className={iconButtonClass}
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={`Delete ${category.name}`}
              aria-expanded={confirmingId === category.id}
              onClick={() => setConfirmingId(category.id)}
              className={`${iconButtonClass} hover:text-destructive`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
        expandedRowId={confirmingId}
        renderExpandedRow={(category) =>
          category.itemCount > 0 ? (
            <BlockedNotice
              message={`“${category.name}” still has ${category.itemCount} ${category.itemCount === 1 ? 'product' : 'products'}. Move or delete them before deleting the category.`}
              onClose={() => setConfirmingId(null)}
            />
          ) : (
            <ConfirmInline
              message={`Delete “${category.name}”? It disappears from the store.`}
              busy={isDeleting}
              onConfirm={() => handleDelete(category)}
              onCancel={() => setConfirmingId(null)}
            />
          )
        }
        emptyIcon={Tags}
        emptyTitle="No categories yet"
        emptyMessage="Add a category to start organising products."
      />
    </div>
  );
};

export default AdminCategories;