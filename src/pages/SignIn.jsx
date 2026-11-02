import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField from '../components/auth/AuthField';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/validators';
import { ROLES } from '../utils/constants';
import DemoHint from '../components/auth/DemoHint';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const formRef = useRef(null);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // After a failed submit, move focus to the first invalid field.
  useEffect(() => {
    if (submitCount === 0) return;
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [submitCount]);

  const validate = () => {
    const e = {};
    if (!formData.email)
      e.email = 'Email is required';
    else if (!isValidEmail(formData.email))
      e.email = 'Please enter a valid email address';

    if (!formData.password)
      e.password = 'Password is required';
    else if (formData.password.length < 8)
      e.password = 'Password must be at least 8 characters';

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

    signIn({ email: formData.email, password: formData.password })
      .then((user) => {
        navigate(user.role === ROLES.ADMIN ? '/admin' : location.state?.from?.pathname || '/account');
      })
      .catch((err) => {
        setIsLoading(false);
        setErrors({ form: err.message });
      });
  };

  return (
    <AuthLayout
      quote="Discover furniture that transforms your house into a home."
      subtext="Premium pieces, delivered to your door."
    >
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1.5">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            to="/signup"
            state={location.state}
            className="text-foreground font-semibold underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Sign up free
          </Link>
        </p>
      </div>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
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
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          error={errors.password}
          labelAction={
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Forgot password?
            </Link>
          }
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
            </button>
          }
        />

        {/* Remember me */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
          />
          <span className="text-sm text-foreground/80">Remember me for 30 days</span>
        </label>

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
          className="w-full justify-center"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-background text-muted-foreground font-medium uppercase tracking-wide">
            or continue with
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

      {/* Footer links */}
      <p className="mt-4 text-xs text-muted-foreground text-center">
        By signing in you agree to our{' '}
        <Link to="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">Terms</Link>
        {' '}and{' '}
        <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">Privacy Policy</Link>.
      </p>

    </AuthLayout>
  );
};

export default SignIn;