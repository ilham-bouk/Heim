import { Outlet, useLocation } from 'react-router';
import Breadcrumb from '../ui/Breadcrumb';
import CheckoutStepper from './CheckoutStepper';
import OrderSummary from './OrderSummary';
import { CHECKOUT_STEPS, getStepIndex } from '../../utils/checkoutSteps';

/**
 * Shell for /checkout/*. On the sequential steps it adds the stepper and
 * (per step config) the order-summary sidebar; the account gate and the
 * confirmation page render plain, full-width.
 */
const CheckoutLayout = () => {
  const { pathname } = useLocation();
  const stepIndex = getStepIndex(pathname);
  const isStep = stepIndex !== -1;
  const showSummary = isStep && CHECKOUT_STEPS[stepIndex].showSummary;

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb items={[{ label: 'Checkout' }]} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        {isStep && <CheckoutStepper currentIndex={stepIndex} />}

        <div className={isStep ? 'mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12' : ''}>
          <div className={showSummary ? 'lg:col-span-2' : isStep ? 'lg:col-span-3 max-w-3xl' : ''}>
            <Outlet />
          </div>

          {showSummary && (
            <aside aria-label="Order summary" className="lg:col-span-1">
              <OrderSummary className="lg:sticky lg:top-24" />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutLayout;