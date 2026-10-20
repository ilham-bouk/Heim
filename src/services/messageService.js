// Message data helpers: PURE functions over arrays. State lives in
// context/MessageContext.jsx; demo seed messages live in data/messageSeed.js.
//
// Real-backend seams:
//   MessageContext `messages`       → GET /admin/messages (admin only)
//   MessageContext.sendMessage      → POST /contact (public). A real API needs spam protection
//                                     (rate limit, captcha) and must validate everything again server-side.
//   MessageContext.setMessageRead   → PATCH /admin/messages/:id { read }
//   MessageContext.deleteMessage    → DELETE /admin/messages/:id

/**
 * Message shape:
 * {
 *   id: number,          // numeric, never reused
 *   name: string,
 *   email: string,
 *   phone?: string,      // removed when empty
 *   subject: string,     // a MESSAGE_SUBJECTS value
 *   message: string,
 *   createdAt: string,   // ISO timestamp
 *   read: boolean
 * }
 */

// The Contact form's subject select and the admin both read this list.
export const MESSAGE_SUBJECTS = [
  { value: 'product-inquiry', label: 'Product Inquiry' },
  { value: 'custom-order', label: 'Custom Order' },
  { value: 'delivery-issue', label: 'Delivery Issue' },
  { value: 'warranty-claim', label: 'Warranty Claim' },
  { value: 'general-question', label: 'General Question' },
  { value: 'partnership', label: 'Partnership Opportunity' },
];

// Admin list filter (the empty value means "all").
export const MESSAGE_FILTERS = [
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
];

export const getSubjectLabel = (value) =>
  MESSAGE_SUBJECTS.find((subject) => subject.value === value)?.label ?? value;

export const findMessageById = (list, id) =>
  list.find((message) => message.id === Number(id)) || null;

export const countUnread = (list) => list.filter((message) => !message.read).length;

export const selectMessagesByStatus = (list, status) => {
  if (status === 'unread') return list.filter((message) => !message.read);
  if (status === 'read') return list.filter((message) => message.read);
  return list;
};

/**
 * Builds a new (unread) message from the contact form.
 * Real backend: the server does this and returns the created message.
 */
export const createMessage = ({ name, email, phone, subject, message }, id, at = new Date()) => {
  const next = {
    id,
    name: name.trim(),
    email: email.trim(),
    subject,
    message: message.trim(),
    createdAt: at.toISOString(),
    read: false,
  };
  if (phone?.trim()) next.phone = phone.trim();
  return next;
};

export const updateMessageRead = (list, id, read) =>
  list.map((message) => (message.id === id ? { ...message, read } : message));

export const removeMessage = (list, id) => list.filter((message) => message.id !== id);

/**
 * mailto: link for replying. The address is percent-encoded (except "@") because the
 * email regex still allows "?" and "&", which would otherwise inject mailto headers.
 */
export const buildReplyHref = (message) => {
  const address = encodeURIComponent(message.email).replace('%40', '@');
  return `mailto:${address}?subject=${encodeURIComponent(`Re: ${getSubjectLabel(message.subject)}`)}`;
};