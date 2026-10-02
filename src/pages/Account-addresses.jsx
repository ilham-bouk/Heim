import { useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import AddressForm from '../components/forms/AddressForm';
import { useAddresses } from '../context/AddressContext';

/**
 * Addresses tab. Lives on AddressContext (not local state) because
 * Checkout will need the same list for "choose a shipping address" later —
 * no rework needed when that's built.
 */
const AccountAddresses = () => {
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAddresses();

  const [editingId, setEditingId] = useState(null); // null = closed, 'new' = adding, else = editing that id
  const editingAddress = addresses.find((a) => a.id === editingId);

  const startAdd = () => setEditingId('new');
  const startEdit = (address) => setEditingId(address.id);
  const cancelForm = () => setEditingId(null);

  const handleSubmit = (values) => {
    if (editingId === 'new') {
      addAddress(values);
    } else {
      updateAddress(editingId, values);
    }
    cancelForm();
  };

  const isFormOpen = editingId !== null;

  return (
    <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Addresses</h1>
          <p className="text-sm text-muted-foreground">Manage the addresses you ship to.</p>
        </div>
        {!isFormOpen && (
          <Button variant="primary" size="sm" onClick={startAdd} className="shrink-0 gap-2">
            <Plus className="w-4 h-4" />
            Add Address
          </Button>
        )}
      </div>

      {/* Add/Edit form — `key` resets the form's state when switching edit targets */}
      {isFormOpen && (
        <AddressForm
          key={editingId}
          initialValues={editingAddress}
          submitLabel={editingId === 'new' ? 'Add Address' : 'Save Changes'}
          onSubmit={handleSubmit}
          onCancel={cancelForm}
          className="mb-8"
        />
      )}

      {/* List */}
      {addresses.length === 0 && !isFormOpen ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground">You haven't saved any addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="relative border border-border rounded-lg p-5">
              {address.isDefault && (
                <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-success">
                  <Check className="w-3.5 h-3.5" /> Default
                </span>
              )}
              <p className="font-semibold text-foreground mb-1">{address.label}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {address.fullName}<br />
                {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
                {address.city}, {address.state} {address.zip}<br />
                {address.country}
              </p>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => startEdit(address)}
                  className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => removeAddress(address.id)}
                  className="inline-flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(address.id)}
                    className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors ml-auto"
                  >
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountAddresses;