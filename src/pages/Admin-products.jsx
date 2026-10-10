import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ExternalLink, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import ConfirmInline from '../components/ui/ConfirmInline';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/admin/DataTable';
import PageHeader from '../components/admin/PageHeader';
import { useCatalog } from '../context/CatalogContext';
import { useToast } from '../context/ToastContext';
import { getFinalPrice } from '../utils/product';
import { formatDate } from '../utils/format';
import { focusAdminPageTitle } from '../utils/admin';

const BADGE_TONE = { Sale: 'danger', New: 'accent', Bestseller: 'success' };

const iconButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground';

// Defined at module level so DataTable's memoised filtering/sorting stays stable.
const getProductId = (product) => product.id;
const getSearchText = (product) =>
  `${product.name} ${product.category} ${product.badge ?? ''} ${product.id}`;

const COLUMNS = [
  {
    key: 'name',
    header: 'Product',
    sortable: true,
    render: (product) => (
      <div className="flex min-w-48 items-center gap-3">
        <img src={product.image} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover" />
        <div className="min-w-0">
          <p className="line-clamp-1 font-medium text-foreground">{product.name}</p>
          <p className="text-xs text-muted-foreground">ID {product.id}</p>
        </div>
      </div>
    ),
  },
  { key: 'category', header: 'Category', sortable: true },
  {
    key: 'price',
    header: 'Price',
    sortable: true,
    align: 'right',
    sortValue: getFinalPrice,
    render: (product) => (
      <span className="whitespace-nowrap">
        <span className="font-medium text-foreground">${getFinalPrice(product)}</span>
        {product.discount > 0 && (
          <span className="ml-2 text-xs line-through">${product.price}</span>
        )}
      </span>
    ),
  },
  {
    key: 'badge',
    header: 'Badge',
    sortable: true,
    sortValue: (product) => product.badge ?? '',
    render: (product) =>
      product.badge ? <StatusBadge tone={BADGE_TONE[product.badge]}>{product.badge}</StatusBadge> : '—',
  },
  {
    key: 'featured',
    header: 'Featured',
    sortable: true,
    sortValue: (product) => Number(!!product.featured),
    render: (product) => (product.featured ? 'Yes' : '—'),
  },
  {
    key: 'createdAt',
    header: 'Added',
    sortable: true,
    render: (product) => <span className="whitespace-nowrap">{formatDate(product.createdAt)}</span>,
  },
];

const AdminProducts = () => {
  const { products, categories, deleteProduct } = useCatalog();
  const toast = useToast();

  const [category, setCategory] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const rows = useMemo(
    () => (category ? products.filter((product) => product.category === category) : products),
    [products, category]
  );

  const handleDelete = async (product) => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      toast.success(`“${product.name}” was deleted.`);
      setConfirmingId(null);
      focusAdminPageTitle(); // the row (and the focused button) is gone
    } catch {
      toast.error('Could not delete the product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const categoryFilter = (
    <div>
      <label htmlFor="product-category-filter" className="sr-only">Filter by category</label>
      <select
        id="product-category-filter"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>{c.name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title="Products"
        description={`${products.length} products in the catalog.`}
        actions={
          <Button as={Link} to="/admin/products/new" className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add product
          </Button>
        }
      />

      <DataTable
        caption="Products"
        columns={COLUMNS}
        rows={rows}
        getRowId={getProductId}
        searchText={getSearchText}
        searchLabel="Search products"
        toolbar={categoryFilter}
        initialSort={{ key: 'createdAt', direction: 'desc' }}
        rowActions={(product) => (
          <div className="flex items-center justify-end gap-1">
            <Link to={`/shop/${product.id}`} aria-label={`View ${product.name} in the store`} className={iconButtonClass}>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to={`/admin/products/${product.id}/edit`} aria-label={`Edit ${product.name}`} className={iconButtonClass}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              aria-label={`Delete ${product.name}`}
              aria-expanded={confirmingId === product.id}
              onClick={() => setConfirmingId(product.id)}
              className={`${iconButtonClass} hover:text-destructive`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
        expandedRowId={confirmingId}
        renderExpandedRow={(product) => (
          <ConfirmInline
            message={`Delete “${product.name}”? It disappears from the store, carts and wishlists. Existing orders keep their copy.`}
            busy={isDeleting}
            onConfirm={() => handleDelete(product)}
            onCancel={() => setConfirmingId(null)}
          />
        )}
        emptyIcon={Package}
        emptyTitle={category ? `No products in ${category}` : 'No products yet'}
        emptyMessage={category ? 'Try another category.' : 'Add your first product to see it here and in the store.'}
        emptyAction={
          category ? undefined : (
            <Button as={Link} to="/admin/products/new">Add product</Button>
          )
        }
      />
    </div>
  );
};

export default AdminProducts;