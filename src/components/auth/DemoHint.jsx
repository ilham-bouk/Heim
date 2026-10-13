import { DEMO_ADMIN, DEMO_CUSTOMER } from '../../config/demo';

/** Demo-credentials hint shown under the Sign In / Sign Up forms. Delete before going live. */
const DemoHint = () => (
  <div className="mt-6 space-y-1 text-center text-xs leading-relaxed text-muted-foreground">
    <p>Demo: any valid email + password of 8+ characters will work.</p>
    <p>
      To see a customer account with order history, use{' '}
      <code className="font-semibold text-foreground">{DEMO_CUSTOMER.email}</code> with any 8+ character password.
    </p>
    <p>
      To enter as admin, sign in with email: <code className="font-semibold text-foreground">{DEMO_ADMIN.email}</code>{' '}
      password: <code className="font-semibold text-foreground">{DEMO_ADMIN.password}</code>
    </p>
  </div>
);

export default DemoHint;