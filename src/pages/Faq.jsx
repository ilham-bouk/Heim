import { Link } from 'react-router';
import { ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import InfoPage from '../components/ui/InfoPage';

// Edit in code: this is marketing/policy copy, not data. Keep it consistent with
// the Shipping and Returns pages.
const FAQ_ITEMS = [
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 5-7 business days within the continental US. Express delivery options are available for an additional fee.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location. Contact us for a quote.',
  },
  {
    question: 'What is your return policy?',
    answer: "We offer a 30-day return policy for all furniture. Items must be in original condition. Shipping costs for returns are the customer's responsibility.",
  },
  {
    question: 'Can I customize my furniture?',
    answer: 'Many of our pieces offer customization options including fabric, color, and dimensions. Please contact us to discuss your specific needs.',
  },
  {
    question: 'Do you offer warranties?',
    answer: "Yes, all our furniture comes with a 2-year manufacturer's warranty covering defects in materials and workmanship.",
  },
  {
    question: 'How do I track my order?',
    answer: "You'll receive a tracking number via email once your order ships. You can also check the status of any order on the Track Order page with your order number and email.",
  },
];

const Faq = () => (
  <InfoPage
    eyebrow="Common Questions"
    title="Frequently Asked Questions"
    intro="Find answers to common questions about our products and services."
  >
    <div className="space-y-4">
      {FAQ_ITEMS.map((item) => (
        <details key={item.question} className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-muted-foreground">
          <summary className="flex cursor-pointer items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{item.question}</h2>
            <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 transition-colors group-open:bg-accent/20">
              <ChevronDown className="h-4 w-4 text-accent transition-transform group-open:rotate-180" aria-hidden="true" />
            </span>
          </summary>
          <p className="mt-4 leading-relaxed text-foreground/80">{item.answer}</p>
        </details>
      ))}
    </div>

    <div className="mt-12 text-center">
      <p className="mb-6 text-foreground/80">Didn't find what you're looking for?</p>
      <Button as={Link} to="/contact" size="lg">Contact us</Button>
    </div>
  </InfoPage>
);

export default Faq;