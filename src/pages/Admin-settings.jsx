import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';
import ConfirmInline from '../components/ui/ConfirmInline';
import PageHeader from '../components/admin/PageHeader';
import SettingsForm from '../components/forms/SettingsForm';
import { useResetDemoData } from '../context/AppProviders';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

/**
 * Danger zone. Reset clears all demo data and remounts the app's providers
 * (see context/AppProviders.jsx), so this component is replaced right after
 * the click and needs no cleanup of its own.
 */
const ResetDemoDataSection = () => {
  const resetDemoData = useResetDemoData();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    const cleared = resetDemoData();
    if (cleared) toast.success('Demo data was reset to its defaults.');
    else toast.error("Some data couldn't be cleared: browser storage is unavailable.");
  };

  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 lg:p-8">
      <h2 className="mb-1 text-xl font-bold text-destructive">Reset demo data</h2>
      <p className="mb-6 max-w-xl text-sm text-muted-foreground">
        Restores products, categories, blog posts, orders, promos, settings and subscribers to the original sample data, and empties
        carts, wishlists, saved addresses and cards. You stay signed in. Only this browser is affected, and sample
        order dates are counted from the last page load.
      </p>

      {/* The trigger stays mounted so ConfirmInline can return focus to it on cancel. */}
      <Button variant="danger" className="gap-2" aria-expanded={confirming} onClick={() => setConfirming(true)}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Reset demo data
      </Button>
      {confirming && (
        <div className="mt-4">
          <ConfirmInline
            message="Reset everything to the sample data? Your changes can't be recovered."
            confirmLabel="Yes, reset everything"
            onConfirm={handleReset}
            onCancel={() => setConfirming(false)}
          />
        </div>
      )}
    </div>
  );
};

/** /admin/settings. The form owns the fields; this page owns "what saving means". */
const AdminSettings = () => {
  const { settings, updateSettings } = useSettings();
  const toast = useToast();

  const handleSubmit = async (input) => {
    try {
      await updateSettings(input);
      toast.success('Settings saved.');
    } catch {
      toast.error('Something went wrong while saving. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
        <PageHeader
          title="Settings"
          description="Store details, contact info and pricing rules. Changes appear on the storefront straight away."
        />
        <SettingsForm settings={settings} onSubmit={handleSubmit} />
      </div>

      <ResetDemoDataSection />
    </div>
  );
};

export default AdminSettings;