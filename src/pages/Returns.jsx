import { Link } from 'react-router';
import InfoPage, { InfoSection } from '../components/ui/InfoPage';
import { useSettings } from '../context/SettingsContext';

// Edit in code: policy copy. Keep it consistent with the FAQ and the product page ("30-Day Returns").
const Returns = () => {
  const { settings } = useSettings();
  const email = settings.contact.supportEmail || settings.contact.email;

  return (
    <InfoPage eyebrow="Peace of mind" title="Returns" intro="Changed your mind? Here's how returns work.">
      <InfoSection title="30-day returns">
        <p>You can return any item within 30 days of delivery. Items must be in their original condition and packaging.</p>
      </InfoSection>

      <InfoSection title="How to start a return">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Email <a href={`mailto:${email}`} className="font-semibold text-accent-text underline underline-offset-2 hover:text-foreground">{email}</a> with your order number.</li>
          <li>We'll reply with return instructions and a pickup or drop-off option.</li>
          <li>Once we receive the item, we'll inspect it and confirm your refund.</li>
        </ol>
      </InfoSection>

      <InfoSection title="Refunds and costs">
        <p>Refunds go back to your original payment method within 5-10 business days of us receiving the item. Shipping costs for returns are the customer's responsibility, unless the item arrived damaged or faulty.</p>
      </InfoSection>

      <InfoSection title="Damaged or faulty items">
        <p>If something arrives damaged, <Link to="/contact" className="font-semibold text-accent-text underline underline-offset-2 hover:text-foreground">contact us</Link> with photos and we'll arrange a replacement or refund. All furniture is covered by a 2-year warranty.</p>
      </InfoSection>
    </InfoPage>
  );
};

export default Returns;