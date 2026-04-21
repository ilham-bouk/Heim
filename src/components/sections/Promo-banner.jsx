import Button from '../ui/Button';
import { ArrowRight } from "lucide-react"
import PromoImg from '../../assets/heroImg.png';
import { Link } from 'react-router';

const PromoBanner = () => {
  return (
    <section className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Text content */}
            <div className="flex flex-col justify-center p-8 lg:p-16">
              <span className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70">
                Limited Time Offer
              </span>
              <h2 className="mt-4 text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl text-balance">
                New Arrivals Collection
              </h2>
              <p className="mt-4 text-primary-foreground/80 max-w-md leading-relaxed">
                Discover our latest furniture pieces designed to elevate your living space. 
                Enjoy up to 30% off on selected items.
              </p>
              <div className="mt-8">
                <Button 
                  size="md" 
                  variant="secondary"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <Link to="/shop/new-arrivals" className='inline-flex items-center justify-center gap-3'>
                    Shop New Arrivals
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-64 lg:h-auto">
              <img
                src={PromoImg}
                alt="New furniture collection showcase"
                className="h-full w-full object-cover"
              />
              {/* Decorative discount badge */}
              <div className="absolute right-6 top-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <div className="text-center">
                  <span className="block text-2xl font-bold">30%</span>
                  <span className="block text-xs uppercase">Off</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoBanner;