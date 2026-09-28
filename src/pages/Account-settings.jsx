import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Mail, Phone, Cake, Lock, Eye, EyeOff, AlertCircle, Check, LogOut, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const fieldClass =
  'w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm ' +
  'placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

const fieldClassWithToggle =
  'w-full pl-10 pr-11 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm ' +
  'placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

/* ─── Profile Information ─────────────────────────────────────────────── */
const ProfileSection = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthday: user?.birthday || '',
  });
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateProfile(formData).then(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
      <h2 className="text-xl font-bold text-foreground mb-1">Profile Information</h2>
      <p className="text-sm text-muted-foreground mb-6">Update your personal details.</p>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-foreground mb-1.5">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={fieldClass} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={fieldClass} />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-1.5">
            Phone number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className={fieldClass} />
          </div>
        </div>

        <div>
          <label htmlFor="birthday" className="block text-sm font-semibold text-foreground mb-1.5">
            Birthday
          </label>
          <div className="relative">
            <Cake className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input id="birthday" name="birthday" type="date" value={formData.birthday} onChange={handleChange} className={fieldClass} />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Changes'}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-success">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

/* ─── Change Password ─────────────────────────────────────────────────── */
const PasswordSection = () => {
  const { updatePassword } = useAuth();

  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsSaving(true);
    updatePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword })
      .then(() => {
        setIsSaving(false);
        setSuccess(true);
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((err) => {
        setIsSaving(false);
        setError(err.message);
      });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
      <h2 className="text-xl font-bold text-foreground mb-1">Change Password</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Update your password to keep your account secure.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-semibold text-foreground mb-1.5">
            Current password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleChange}
              className={fieldClassWithToggle}
              required
            />
            <button type="button" onClick={() => setShowCurrent((v) => !v)} aria-label={showCurrent ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-semibold text-foreground mb-1.5">
            New password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="newPassword"
              name="newPassword"
              type={showNew ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              className={fieldClassWithToggle}
              required
            />
            <button type="button" onClick={() => setShowNew((v) => !v)} aria-label={showNew ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground mb-1.5">
            Confirm new password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showNew ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={fieldClass}
              required
            />
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Updating…' : 'Update Password'}
          </Button>
          {success && (
            <span className="flex items-center gap-1.5 text-sm text-success">
              <Check className="w-4 h-4" /> Password updated
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

/* ─── Sign Out ────────────────────────────────────────────────────────── */
const SignOutSection = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-xl border border-border p-6 lg:p-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Sign Out</h2>
        <p className="text-sm text-muted-foreground">Sign out of Heim on this device.</p>
      </div>
      <Button
        variant="outline"
        className="gap-2 shrink-0"
        onClick={() => { signOut(); navigate('/'); }}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  );
};

/* ─── Delete Account ──────────────────────────────────────────────────── */
const DeleteAccountSection = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  // Mock deletion: there's no backend record to actually delete, so this
  // just signs the user out. A real implementation would call a DELETE
  // /me endpoint (typically behind a stronger confirmation — typed email
  // or password, not just a click)
  
  const handleDelete = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="bg-destructive/5 rounded-xl border border-destructive/30 p-6 lg:p-8">
      <h2 className="text-xl font-bold text-destructive mb-1">Delete Account</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-lg">
        Permanently delete your account. This action cannot be undone.
      </p>

      {!confirming ? (
        <Button variant="danger" className="gap-2" onClick={() => setConfirming(true)}>
          <Trash2 className="w-4 h-4" />
          Delete Account
        </Button>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-foreground">Are you sure? This can't be undone.</p>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Yes, delete my account
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

const AccountSettings = () => {
  return (
    <div className="space-y-6">
      <ProfileSection />
      <PasswordSection />
      <SignOutSection />
      <DeleteAccountSection />
    </div>
  );
};

export default AccountSettings;