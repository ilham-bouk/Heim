import { Mail } from 'lucide-react';
import NewsletterForm from '../ui/NewsletterForm';

const Newsletter = () => {  
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-secondary px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5" />
          </div>

          <div className="relative text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Subscribe to Our Newsletter
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Get the latest updates on new arrivals, exclusive offers, and interior design tips delivered straight to your inbox.
            </p>

            <div className="mx-auto mt-8 max-w-md">
              <NewsletterForm inputClassName="bg-card" />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter;