import InfoPage, { InfoSection } from '../components/ui/InfoPage';
import { useSettings } from '../context/SettingsContext';

const Privacy = () => {
  const { settings } = useSettings();
  const { name } = settings.store;
  const email = settings.contact.email;

  return (
    <InfoPage
      title="Privacy Policy"
      intro="How we handle your information."
      notice={
        <>
          <strong>Placeholder text.</strong> This is a generic template, not legal advice. Replace it with a
          policy reviewed for your business and jurisdiction before going live.
        </>
      }
    >
      <InfoSection title="Information we collect">
        <p>When you place an order, create an account, subscribe to our newsletter or contact us, {name} collects the details you give us, such as your name, email address, shipping address and message.</p>
      </InfoSection>

      <InfoSection title="How we use it">
        <p>We use your information to process and deliver orders, respond to your questions, and, if you subscribe, send you updates about new products and offers. You can unsubscribe at any time.</p>
      </InfoSection>

      <InfoSection title="Payments">
        <p>Card details are handled by our payment provider. We only keep the card brand and last four digits so you can recognise a saved card.</p>
      </InfoSection>

      <InfoSection title="Sharing">
        <p>We share information only with partners needed to run the store, such as delivery and payment providers. We don't sell your personal information.</p>
      </InfoSection>

      <InfoSection title="Your choices">
        <p>You can ask us to access, correct or delete your personal information at any time.</p>
      </InfoSection>

      <InfoSection title="Contact">
        <p>Questions about this policy? Email <a href={`mailto:${email}`} className="font-semibold text-accent-text underline underline-offset-2 hover:text-foreground">{email}</a>.</p>
      </InfoSection>
    </InfoPage>
  );
};

export default Privacy;