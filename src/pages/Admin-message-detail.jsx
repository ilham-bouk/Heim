import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Mail, MailOpen, MessageSquare, Reply, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import ConfirmInline from '../components/ui/ConfirmInline';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/ui/StatusBadge';
import PageHeader from '../components/admin/PageHeader';
import { useMessages } from '../context/MessageContext';
import { useToast } from '../context/ToastContext';
import { buildReplyHref, getSubjectLabel } from '../services/messageService';
import { formatDateTime } from '../utils/format';

const LIST_PATH = '/admin/messages';

const InfoBlock = ({ title, children }) => (
  <div className="rounded-lg border border-border p-5">
    <h2 className="mb-2 font-semibold text-foreground">{title}</h2>
    <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
  </div>
);

/**
 * /admin/messages/:id. Opening an unread message marks it read (once per
 * message, so "Mark as unread" isn't undone straight away).
 */
const AdminMessageDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { getMessageById, setMessageRead, deleteMessage } = useMessages();

  const [isToggling, setIsToggling] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const autoReadId = useRef(null);

  const message = getMessageById(id);
  // Returns to the list with the filter/sort/page the admin came from.
  const listPath = `${LIST_PATH}${location.state?.fromSearch ?? ''}`;

  useEffect(() => {
    if (!message || message.read || autoReadId.current === message.id) return;
    autoReadId.current = message.id;
    // Best effort: if it fails the message simply stays unread.
    setMessageRead(message.id, true).catch(() => {});
  }, [message, setMessageRead]);

  if (!message) {
    // While our own delete is in flight the message disappears before we navigate away.
    if (isDeleting) return null;
    return (
      <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
        <PageHeader title="Message not found" backTo={listPath} backLabel="Back to messages" />
        <EmptyState
          icon={MessageSquare}
          title="This message doesn't exist"
          message="It may have been deleted. Go back to the list to pick another one."
        />
      </div>
    );
  }

  const handleToggleRead = async () => {
    const nextRead = !message.read;
    setIsToggling(true);
    try {
      await setMessageRead(message.id, nextRead);
      toast.success(nextRead ? 'Marked as read.' : 'Marked as unread.');
    } catch {
      toast.error('Could not update the message. Please try again.');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMessage(message.id);
      toast.success(`The message from “${message.name}” was deleted.`);
      navigate(listPath, { replace: true });
    } catch {
      toast.error('Could not delete the message. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
      <PageHeader
        title={`Message from ${message.name}`}
        description={`Received ${formatDateTime(message.createdAt)}`}
        backTo={listPath}
        backLabel="Back to messages"
      />

      <div className="space-y-6">
        <section aria-labelledby="message-status-heading" className="rounded-lg border border-border p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 id="message-status-heading" className="font-semibold text-foreground">Status</h2>
              <StatusBadge tone={message.read ? 'neutral' : 'accent'}>{message.read ? 'Read' : 'Unread'}</StatusBadge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button as="a" href={buildReplyHref(message)} size="sm" className="gap-2">
                <Reply className="h-4 w-4" aria-hidden="true" />
                Reply by email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isToggling}
                onClick={handleToggleRead}
              >
                {message.read ? (
                  <Mail className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <MailOpen className="h-4 w-4" aria-hidden="true" />
                )}
                {message.read ? 'Mark as unread' : 'Mark as read'}
              </Button>
              {/* The trigger stays mounted so ConfirmInline can return focus to it on cancel. */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                aria-expanded={confirmingDelete}
                onClick={() => setConfirmingDelete(true)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </Button>
            </div>
          </div>

          {confirmingDelete && (
            <div className="mt-4 border-t border-border pt-4">
              <ConfirmInline
                message={`Delete the message from “${message.name}”? This can't be undone.`}
                busy={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setConfirmingDelete(false)}
              />
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoBlock title="From">
            {message.name}
            <br />
            <a
              href={buildReplyHref(message)}
              className="text-foreground underline underline-offset-2 transition-colors hover:text-muted-foreground"
            >
              {message.email}
            </a>
          </InfoBlock>
          <InfoBlock title="Phone">{message.phone || 'Not provided'}</InfoBlock>
          <InfoBlock title="Subject">{getSubjectLabel(message.subject)}</InfoBlock>
        </div>

        <section aria-labelledby="message-body-heading" className="rounded-lg border border-border p-5">
          <h2 id="message-body-heading" className="mb-3 font-semibold text-foreground">Message</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{message.message}</p>
        </section>
      </div>
    </div>
  );
};

export default AdminMessageDetail;