import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField, { FieldError } from '../components/auth/AuthField';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { isValidEmail } from '../utils/validators';
import DemoHint from '../components/auth/DemoHint';

const STRENGTH_LEVELS = [
  { label: 'Too short', bar: 'bg-destructive', text: 'text-destructive-text' },
  { label: 'Weak', bar: 'bg-destructive', text: 'text-destructive-text' },
  { label: 'Fair', bar: 'bg-accent', text: 'text-accent-text' },
  { label: 'Good', bar: 'bg-success', text: 'text-success-text' },
  { label: 'Strong', bar: 'bg-success', text: 'text-success-text' },
];

const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', bar: '', text: '' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9!@#$%^&*]/.test(pw)) score++;

  return { score, ...STRENGTH_LEVELS[score] };
};

const PasswordStrengthBar = ({ password }) => {
  const { score, label, bar, text } = getStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? bar : 'bg-border'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${text}`}>
        Password strength: {label}
      </p>
    </div>
  );
};

const PasswordToggle = ({ shown, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={shown ? 'Hide password' : 'Show password'}
    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
  >
    {shown ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
  </button>
);

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();
  const { settings } = useSettings();
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // After a failed submit, move focus to the first invalid field.
  useEffect(() => {
    if (submitCount === 0) return;
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [submitCount]);

  const validate = () => {
    const e = {};

    if (!formData.fullName)
      e.fullName = 'Full name is required';
    else if (formData.fullName.trim().length <= 2)
      e.fullName = 'Full name must be at least 2 characters';

    if (!formData.email)
      e.email = 'Email is required';
    else if (!isValidEmail(formData.email))
      e.email = 'Please enter a valid email address';

    if (!formData.password)
      e.password = 'Password is required';
    else if (formData.password.length < 8)
      e.password = 'Password must be at least 8 characters';

    if (!formData.confirmPassword)
      e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match';

    if (!agreedToTerms)
      e.terms = 'You must agree to the terms and conditions';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setSubmitCount((count) => count + 1);
      return;
    }

    setIsLoading(true);

    signUp({ fullName: formData.fullName, email: formData.email })
      .then(() => navigate(location.state?.from?.pathname || '/'))
      .catch((err) => {
        setIsLoading(false);
        setErrors({ form: err.message });
      });
  };

  return (
    <AuthLayout
      quote={`Join thousands of homeowners who trust ${settings.store.name} for their space.`}
      subtext="Create your account and start exploring."
    >
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1.5">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/signin"
            state={location.state}
            className="text-foreground font-semibold underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthField
          label="Full name"
          icon={User}
          name="fullName"
          type="text"
          autoComplete="name"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Jane Doe"
          error={errors.fullName}
        />

        <AuthField
          label="Email address"
          icon={Mail}
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
        />

        <AuthField
          label="Password"
          icon={Lock}
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a strong password"
          error={errors.password}
          trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword(v => !v)} />}
          footer={formData.password && !errors.password ? <PasswordStrengthBar password={formData.password} /> : null}
        />

        <AuthField
          label="Confirm password"
          icon={Lock}
          name="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
          trailing={<PasswordToggle shown={showConfirm} onToggle={() => setShowConfirm(v => !v)} />}
        />

        {/* Terms */}
        <div>
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              aria-invalid={!!errors.terms}
              aria-describedby={errors.terms ? 'terms-error' : undefined}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
              }}
              className="w-4 h-4 mt-0.5 rounded border-border accent-primary cursor-pointer shrink-0"
            />
            <span className="text-sm text-foreground/80 leading-snug">
              I agree to the{' '}
              <Link to="/terms" className="text-foreground font-semibold underline underline-offset-2 hover:text-muted-foreground transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-foreground font-semibold underline underline-offset-2 hover:text-muted-foreground transition-colors">
                Privacy Policy
              </Link>
            </span>
          </label>
          <FieldError id="terms-error" message={errors.terms} />
        </div>

        {/* Submit */}
        {errors.form && (
          <p role="alert" className="flex items-center gap-1.5 text-sm text-destructive-text">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" /> {errors.form}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full justify-center mt-6"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-background text-muted-foreground font-medium uppercase tracking-wide">
            or sign up with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-border rounded-lg hover:bg-secondary active:bg-muted transition-colors text-sm font-medium text-foreground/80"
        >
          Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-border rounded-lg hover:bg-secondary active:bg-muted transition-colors text-sm font-medium text-foreground/80"
        >
          Facebook
        </button>
      </div>

      <DemoHint />

    </AuthLayout>
  );
};

export default SignUp;