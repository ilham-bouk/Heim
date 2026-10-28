import { Link } from 'react-router';
import InfoPage, { InfoSection } from '../components/ui/InfoPage';
import { useSettings } from '../context/SettingsContext';

// Prices come from the admin-editable pricing settings, so this page can't
// disagree with the cart. The rest of the copy is "edit in code".
const Shipping = () => {
  const { settings } = useSettings();
  const { freeShippingThreshold, standardShippingCost } = settings.pricing;

  return (
    <InfoPage eyebrow="Delivery" title="Shipping" intro="How and when your order reaches you.">
      <InfoSection title="Delivery times">
        <p>Standard delivery takes 5-7 business days within the continental US. Orders are prepared within 1-2 business days.</p>
        <p>Large pieces are delivered by a freight partner, who will contact you to arrange a delivery window.</p>
      </InfoSection>

      <InfoSection title="Shipping costs">
        <p>
          Orders with a subtotal of ${freeShippingThreshold} or more ship free.
          {' '}Below that, standard shipping is ${standardShippingCost}.
        </p>
        <p>Taxes are calculated at checkout.</p>
      </InfoSection>

      <InfoSection title="International shipping">
        <p>We ship to over 50 countries. Costs and delivery times vary by destination, so please <Link to="/contact" className="font-semibold text-accent-text underline underline-offset-2 hover:text-foreground">contact us</Link> for a quote.</p>
      </InfoSection>

      <InfoSection title="Tracking your order">
        <p>You'll receive a confirmation once your order ships. You can check its status at any time on the <Link to="/track-order" className="font-semibold text-accent-text underline underline-offset-2 hover:text-foreground">Track Order</Link> page.</p>
      </InfoSection>
    </InfoPage>
  );
};

export default Shipping;