import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
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

/* Password strength */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9!@#$%^&*]/.test(pw)) score++;

  const levels = [
    { label: 'Too short', color: 'bg-red-400' },
    { label: 'Weak', color: 'bg-orange-400' },
    { label: 'Fair', color: 'bg-yellow-400' },
    { label: 'Good', color: 'bg-blue-400' },
    { label: 'Strong', color: 'bg-green-500' },
  ];
  
  return { score, ...levels[score] };
};

const PasswordStrengthBar = ({ password }) => {
  const { score, label, color } = getStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? color : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        score <= 1 ? 'text-red-500'
        : score === 2 ? 'text-yellow-600'
        : score === 3 ? 'text-blue-500'
        : 'text-green-600'
      }`}>
        {label}
      </p>
    </div>
  );
};


const SignUp = () => {
  const navigate = useNavigate();

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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
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
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <AuthLayout
      quote="Join thousands of homeowners who trust Heim for their space."
      subtext="Create your account and start exploring."
    >
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1.5">Create account</h1>
        <p className="text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="text-slate-900 font-semibold underline underline-offset-2 hover:text-slate-600 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
          <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength bar — shows instead of generic error while typing */}
          {formData.password && !errors.password
            ? <PasswordStrengthBar password={formData.password} />
            : <FieldError message={errors.password} />
          }
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
              className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-slate-900 cursor-pointer shrink-0"
            />
            <span className="text-sm text-slate-600 leading-snug">
              I agree to the{' '}
              <Link to="/terms" className="text-slate-900 font-semibold underline underline-offset-2 hover:text-slate-600 transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-slate-900 font-semibold underline underline-offset-2 hover:text-slate-600 transition-colors">
                Privacy Policy
              </Link>
            </span>
          </label>
          <FieldError message={errors.terms} />
        </div>

        {/* Submit */}
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
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-slate-400 font-medium uppercase tracking-wide">
            or sign up with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
        >
          Google
        </button>

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
    </AuthLayout>
  );
};

export default SignUp