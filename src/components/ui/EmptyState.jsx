import { Inbox } from 'lucide-react';

/**
 * Centered "nothing here" block.
 * @param {React.ElementType} [icon=Inbox] - a lucide icon component
 * @param {string} title
 * @param {string} [message]
 * @param {React.ReactNode} [action] - e.g. a <Button>
 */
const EmptyState = ({ icon: Icon = Inbox, title, message, action }) => (
  <div className="py-16 text-center">
    <div className="mb-4 flex justify-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
    </div>
    <h2 className="mb-2 text-lg font-bold text-foreground">{title}</h2>
    {message && <p className="mx-auto max-w-sm text-sm text-muted-foreground">{message}</p>}
    {action && <div className="mt-6 flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;