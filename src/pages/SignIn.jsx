import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import AuthLayout from '../components/auth/AuthLayout';

const FieldError = ({ message }) =>
  message ? (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  ) : null;

const inputClass = (hasError) =>
  `w-full py-2.5 rounded-lg border text-slate-900 text-sm placeholder:text-slate-400
   transition-colors focus:outline-none focus:ring-2 focus:border-transparent
   ${hasError
     ? 'pl-10 pr-4 border-red-400 bg-red-50 focus:ring-red-400'
     : 'pl-10 pr-4 border-slate-300 bg-white hover:border-slate-400 focus:ring-slate-900'}`;


const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.email)
      e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
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
    // console.log(e.target);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <AuthLayout
      quote="Discover furniture that transforms your house into a home."
      subtext="Premium pieces, delivered to your door."
    >
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1.5">Welcome back</h1>
        <p className="text-sm text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-slate-900 font-semibold underline underline-offset-2 hover:text-slate-600 transition-colors"
          >
            Sign up free
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-800">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`${inputClass(!!errors.password)} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <FieldError message={errors.password} />
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
          />
          <span className="text-sm text-slate-600">Remember me for 30 days</span>
        </label>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Signing in…
            </span>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-slate-400 font-medium uppercase tracking-wide">
            or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Google */}
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
        >
          Google
        </button>

        {/* Facebook */}
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
        >
          Facebook
        </button>
      </div>

      {/* Demo hint */}
      <p className="mt-6 text-xs text-slate-400 text-center leading-relaxed">
        Demo: any valid email + password of 8+ characters will work.
      </p>

      {/* Footer links */}
      <p className="mt-4 text-xs text-slate-400 text-center">
        By signing in you agree to our{' '}
        <Link to="/terms" className="underline underline-offset-2 hover:text-slate-600 transition-colors">Terms</Link>
        {' '}and{' '}
        <Link to="/privacy" className="underline underline-offset-2 hover:text-slate-600 transition-colors">Privacy Policy</Link>.
      </p>

    </AuthLayout>
  );
};

export default SignIn;