import { useEffect, useId, useRef, useState } from 'react';
import Button from './Button';
import { useSubscribers } from '../../context/SubscriberContext';
import { isValidEmail } from '../../utils/validators';

const CONFIRMATION_MS = 3000;

/**
 * Reusable newsletter signup form (Home, Blog, Blog Detail). Saves the email
 * through SubscriberContext and shows a brief "Subscribed!" confirmation.
 * Signing up an email that is already on the list looks identical on purpose.
 * `onSubscribe` is an optional extra hook (e.g. to also call Mailchimp).
 *
 * @param {'row'|'stack'} [layout='row']
 * @param {string} [inputClassName]
 * @param {(email: string) => void} [onSubscribe] - called with the trimmed email after it was saved
 */
const NewsletterForm = ({ layout = 'row', inputClassName = '', onSubscribe }) => {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const { subscribe } = useSubscribers();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);

  // Don't leave the confirmation timer running after the form unmounts.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Email is required');
      return;
    }
    if (!isValidEmail(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribe(trimmed);
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
      return;
    }

    onSubscribe?.(trimmed);
    setIsSubmitting(false);
    setSubscribed(true);
    setEmail('');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSubscribed(false), CONFIRMATION_MS);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={`flex gap-3 ${layout === 'stack' ? 'flex-col' : 'flex-col sm:flex-row'}`}>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          autoComplete="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`flex-1 px-4 py-2.5 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
            error ? 'border-destructive' : 'border-border'
          } ${inputClassName}`}
        />
        <Button type="submit" variant="primary" disabled={isSubmitting} className="disabled:cursor-not-allowed disabled:opacity-50">
          {isSubmitting ? 'Subscribing…' : subscribed ? 'Subscribed!' : 'Subscribe'}
        </Button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-xs text-destructive-text">
          {error}
        </p>
      )}
    </form>
  );
};

export default NewsletterForm;