import InfoPage, { InfoSection } from '../components/ui/InfoPage';
import { useSettings } from '../context/SettingsContext';

const Terms = () => {
  const { settings } = useSettings();
  const { name } = settings.store;
  const email = settings.contact.email;

  return (
    <InfoPage
      title="Terms of Service"
      intro="The rules for using our store."
      notice={
        <>
          <strong>Placeholder text.</strong> This is a generic template, not legal advice. Replace it with terms
          reviewed for your business and jurisdiction before going live.
        </>
      }
    >
      <InfoSection title="Using the store">
        <p>By using the {name} website and placing an order you agree to these terms. Please don't misuse the site or try to interfere with its operation.</p>
      </InfoSection>

      <InfoSection title="Orders and pricing">
        <p>Prices are shown in US dollars and may change without notice. An order is confirmed once we've accepted it, and we may cancel an order if an item is unavailable or a price was shown in error, in which case you'll be refunded in full.</p>
      </InfoSection>

      <InfoSection title="Delivery and returns">
        <p>Delivery times are estimates, not guarantees. Our shipping and returns policies form part of these terms.</p>
      </InfoSection>

      <InfoSection title="Accounts">
        <p>You're responsible for keeping your sign-in details secure and for activity under your account.</p>
      </InfoSection>

      <InfoSection title="Liability">
        <p>To the extent the law allows, {name} isn't liable for indirect or consequential losses arising from your use of the site or products.</p>
      </InfoSection>

      <InfoSection title="Contact">
        <p>Questions about these terms? Email <a href={`mailto:${email}`} className="font-semibold text-accent-text underline underline-offset-2 hover:text-foreground">{email}</a>.</p>
      </InfoSection>
    </InfoPage>
  );
};

export default Terms;