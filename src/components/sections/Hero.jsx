import { ArrowRight } from "lucide-react"
import heroImg from '../../assets/heroImg.png';
import { Link } from "react-router";
import Button from '../ui/Button';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 py-12 lg:grid-cols-2 lg:py-24">
          {/* Text content */}
          <div className="max-w-xl">
            <span className="inline-block text-sm font-medium text-accent uppercase tracking-wider mb-4">
              New Collection 2026
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Beautifully Crafted Modern Furniture
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Transform your living space with our curated collection of contemporary furniture. 
              Designed for comfort, built for longevity.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button as={Link} to="/shop" size="lg" className="gap-2 hover:gap-4">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Button>
              {/* Plain link: the outline Button variant hovers to `secondary`, which is this section's background. */}
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 text-lg font-medium text-primary transition-all duration-200 hover:bg-card"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="aspect-4/3 overflow-hidden rounded-2xl bg-muted">
              <img
                src={heroImg}
                alt="Modern living room with contemporary furniture"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 hidden lg:block">
              <div className="rounded-xl bg-card p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <span className="h-8 w-8 rounded-full bg-accent/30 ring-2 ring-card" />
                    <span className="h-8 w-8 rounded-full bg-accent/50 ring-2 ring-card" />
                    <span className="h-8 w-8 rounded-full bg-accent/70 ring-2 ring-card" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">2,500+</p>
                    <p className="text-xs text-muted-foreground">Happy Customers</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;