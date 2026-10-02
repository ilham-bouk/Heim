// Checkout step config — the ONE place that defines the flow.
// The stepper UI, the route guard and the "Continue"/"Back" navigation all read it.
//
// To add a step (e.g. "Delivery method"): add an entry here, create the page,
// and add one <Route> in App.jsx. Nothing else needs to change.
//
// `isComplete(draft)` receives the checkout draft (see CheckoutContext).
// `showSummary` toggles the order-summary sidebar for that step.

export const CHECKOUT_BASE_PATH = '/checkout';

export const CHECKOUT_STEPS = [
  {
    id: 'shipping',
    label: 'Shipping',
    path: 'shipping',
    showSummary: true,
    isComplete: (draft) => !!draft.shippingAddress && !!draft.email,
  },
  {
    id: 'payment',
    label: 'Payment',
    path: 'payment',
    showSummary: true,
    isComplete: (draft) => !!draft.payment,
  },
  {
    id: 'review',
    label: 'Review',
    path: 'review',
    showSummary: false,
    isComplete: () => true,
  },
];

const lastSegment = (pathname) => pathname.split('/').filter(Boolean).pop();

/** Index of the step matching the URL, or -1 (account gate, confirmation, etc.). */
export const getStepIndex = (pathname) =>
  CHECKOUT_STEPS.findIndex((step) => step.path === lastSegment(pathname));

export const getStepHref = (stepId) => {
  const step = CHECKOUT_STEPS.find((s) => s.id === stepId);
  return `${CHECKOUT_BASE_PATH}/${step.path}`;
};

export const getNextStepHref = (stepId) => {
  const index = CHECKOUT_STEPS.findIndex((s) => s.id === stepId);
  const next = CHECKOUT_STEPS[index + 1];
  return next ? getStepHref(next.id) : null;
};

export const getPreviousStepHref = (stepId) => {
  const index = CHECKOUT_STEPS.findIndex((s) => s.id === stepId);
  const previous = CHECKOUT_STEPS[index - 1];
  return previous ? getStepHref(previous.id) : null;
};

/**
 * If the requested step is ahead of the first incomplete one, returns where to
 * send the user instead; otherwise null.
 */
export const getStepRedirect = (pathname, draft) => {
  const requested = getStepIndex(pathname);
  if (requested === -1) return null;

  const firstIncomplete = CHECKOUT_STEPS.findIndex((step) => !step.isComplete(draft));
  if (firstIncomplete !== -1 && firstIncomplete < requested) {
    return getStepHref(CHECKOUT_STEPS[firstIncomplete].id);
  }
  return null;
};