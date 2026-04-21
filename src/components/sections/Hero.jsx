import { ArrowRight } from "lucide-react"
import heroImg from '../../assets/heroImg.png';
import { Link } from "react-router";

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
              {/* asChild  */}
              <Link to="/shop" className="font-medium gap-2 hover:gap-4 rounded-lg transition-all duration-200 inline-flex items-center justify-center px-6 py-2 bg-primary hover:bg-primary/90 bg-slate-900 text-white hover:bg-slate-800">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center px-6 py-2 border-2 border-slate-900 text-slate-900 hover:bg-slate-100">
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