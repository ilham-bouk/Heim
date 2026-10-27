import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/validators';
import DemoHint from '../components/auth/DemoHint';

const FieldError = ({ message }) =>
  message ? (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive-text">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  ) : null;

const inputClass = (hasError) =>
  `w-full py-2.5 rounded-lg border text-foreground text-sm placeholder:text-muted-foreground
   transition-colors focus:outline-none focus:ring-2 focus:border-transparent
   ${hasError
     ? 'pl-10 pr-4 border-destructive bg-destructive/10 focus:ring-destructive'
     : 'pl-10 pr-4 border-border bg-card hover:border-muted-foreground focus:ring-primary'}`;

/* Password strength. Full class names on purpose (Tailwind only generates classes it can see).
   Three tones for five levels: the label and the number of filled segments carry the meaning. */
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
      <div className="flex gap-1 mb-1">
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
        {label}
      </p>
    </div>
  );
};


const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!validate()) return;

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
      quote="Join thousands of homeowners who trust Heim for their space."
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
      <form onSubmit={handleSubmit} noValidate className="space-y-4">

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-foreground mb-1.5">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
              className={inputClass(!!errors.fullName)}
            />
          </div>
          <FieldError message={errors.fullName} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass(!!errors.email)}
            />
          </div>
          <FieldError message={errors.email} />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={`${inputClass(!!errors.password)} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength bar */}
          {formData.password && !errors.password
            ? <PasswordStrengthBar password={formData.password} />
            : <FieldError message={errors.password} />
          }
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground mb-1.5">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={`${inputClass(!!errors.confirmPassword)} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <FieldError message={errors.confirmPassword} />
        </div>

        {/* Terms */}
        <div>
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
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
          <FieldError message={errors.terms} />
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
          {isLoading ? (
            <span className="flex items-center gap-2">
              Creating account…
            </span>
          ) : (
            'Create Account'
          )}
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

export default SignUp