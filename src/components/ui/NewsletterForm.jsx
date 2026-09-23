import { useState } from 'react';
import Button from './Button';

/**
 * Reusable newsletter signup form (Home, Blog, Blog Detail). Manages its
 * own email input + a brief "Subscribed!" confirmation. Doesn't call any
 * API itself — wire `onSubscribe` up to your real provider (Mailchimp, etc).
 *
 * @param {'row'|'stack'} [layout='row']
 * @param {string} [inputClassName]
 * @param {(email: string) => void} [onSubscribe]
 */
const NewsletterForm = ({ layout = 'row', inputClassName = '', onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    onSubscribe?.(email);

    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex gap-3 ${layout === 'stack' ? 'flex-col' : 'flex-col sm:flex-row'}`}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm ${inputClassName}`}
      />
      <Button type="submit" variant="primary">
        {subscribed ? 'Subscribed!' : 'Subscribe'}
      </Button>
    </form>
  );
};

export default NewsletterForm;