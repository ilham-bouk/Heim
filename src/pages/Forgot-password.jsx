import { useState } from 'react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';
import FormField from '../components/forms/FormField';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/validators';

/**
 * Mock password reset. It always shows the same confirmation, whether or not the
 * email belongs to an account, so it can't be used to discover who has one.
 * No email is sent in this demo.
 */
const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentTo, setSentTo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) return setError('Email is required');
    if (!isValidEmail(trimmed)) return setError('Please enter a valid email address');

    setIsLoading(true);
    try {
      await requestPasswordReset({ email: trimmed });
      setSentTo(trimmed);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      quote="Discover furniture that transforms your house into a home."
      subtext="Premium pieces, delivered to your door."
    >
      <div className="mb-8">
        <h1 className="mb-1.5 text-3xl font-bold text-foreground">Reset your password</h1>
        <p className="text-sm text-muted-foreground">Enter your email and we'll send you reset instructions.</p>
      </div>

      {/* Always mounted so the confirmation is announced when it appears. */}
      <div role="status">
        {sentTo && (
          <p className="mb-6 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success-text">
            If an account exists for <strong>{sentTo}</strong>, we've sent instructions to reset your password.
          </p>
        )}
      </div>

      {!sentTo && (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField label="Email address" required error={error}>
            {(control) => (
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="you@example.com"
                {...control}
              />
            )}
          </FormField>
          <Button type="submit" size="lg" className="w-full justify-center" disabled={isLoading}>
            {isLoading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/signin" className="font-semibold text-foreground underline underline-offset-2 transition-colors hover:text-muted-foreground">
          Back to sign in
        </Link>
      </p>

      <p className="mt-6 text-center text-xs text-muted-foreground">Demo: no email is actually sent.</p>
    </AuthLayout>
  );
};

export default ForgotPassword;