import { Link } from 'react-router';
import { Check } from 'lucide-react';
import { CHECKOUT_STEPS, getStepHref } from '../../utils/checkoutSteps';

/**
 * Progress indicator. Completed steps are links (go back and edit);
 * upcoming steps are plain text so users can't skip ahead.
 */
const CheckoutStepper = ({ currentIndex }) => (
  <nav aria-label="Checkout progress">
    <ol className="flex items-center justify-center gap-2 sm:gap-4">
      {CHECKOUT_STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        const circleClass = isDone
          ? 'bg-success text-success-foreground'
          : isCurrent
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-muted-foreground';

        const content = (
          <>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${circleClass}`}>
              {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </span>
            <span className={`sr-only sm:not-sr-only text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.label}
              {isDone && <span className="sr-only"> (completed)</span>}
            </span>
          </>
        );

        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-4">
            {isDone ? (
              <Link to={getStepHref(step.id)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {content}
              </Link>
            ) : (
              <span aria-current={isCurrent ? 'step' : undefined} className="flex items-center gap-2">
                {content}
              </span>
            )}
            {index < CHECKOUT_STEPS.length - 1 && (
              <span aria-hidden="true" className="h-px w-6 sm:w-12 bg-border" />
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default CheckoutStepper;