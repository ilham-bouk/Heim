import { useNavigate, useParams } from 'react-router';
import { Package } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/admin/PageHeader';
import ProductForm from '../components/forms/ProductForm';
import { useCatalog } from '../context/CatalogContext';
import { useToast } from '../context/ToastContext';

const LIST_PATH = '/admin/products';

/**
 * Serves both /admin/products/new (no :id) and /admin/products/:id/edit.
 * The form owns the fields; this page owns "what saving means".
 */
const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { categories, getProductById, addProduct, updateProduct } = useCatalog();

  const isEditing = id !== undefined;
  const product = isEditing ? getProductById(id) : null;

  if (isEditing && !product) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
        <PageHeader title="Product not found" backTo={LIST_PATH} backLabel="Back to products" />
        <EmptyState
          icon={Package}
          title="This product doesn't exist"
          message="It may have been deleted. Go back to the list to pick another one."
        />
      </div>
    );
  }

  const handleSubmit = async (input) => {
    try {
      if (isEditing) {
        await updateProduct(product.id, input);
        toast.success(`“${input.name}” was updated.`);
      } else {
        await addProduct(input);
        toast.success(`“${input.name}” was added to the catalog.`);
      }
      navigate(LIST_PATH);
    } catch {
      toast.error('Something went wrong while saving. Please try again.');
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title={isEditing ? 'Edit product' : 'Add product'}
        description={isEditing ? product.name : 'Changes appear on the storefront straight away.'}
        backTo={LIST_PATH}
        backLabel="Back to products"
      />
      {/* key: resets the form if the route switches between /new and /:id/edit */}
      <ProductForm
        key={product?.id ?? 'new'}
        product={product}
        categories={categories}
        submitLabel={isEditing ? 'Save changes' : 'Add product'}
        cancelTo={LIST_PATH}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AdminProductForm;