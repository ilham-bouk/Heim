import PageHeader from '../components/admin/PageHeader';
import SettingsForm from '../components/forms/SettingsForm';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

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
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title="Settings"
        description="Store details, contact info and pricing rules. Changes appear on the storefront straight away."
      />
      <SettingsForm settings={settings} onSubmit={handleSubmit} />
    </div>
  );
};

export default AdminSettings;