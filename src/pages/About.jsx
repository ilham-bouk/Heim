import { ChevronRight, Users, Lightbulb, Target, Award, Heart, Zap, Check } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';
import heroImg from '../assets/heroImg.png';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">About Us</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-secondary py-12 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Text Content */}
            <div>
              <span className="inline-block text-sm font-medium text-accent uppercase tracking-wider mb-4">
                Our Story
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance mb-6">
                Crafted for Modern Living
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Since 2015, Heim has been dedicated to bringing exceptional furniture design into homes worldwide. We believe that your living space should reflect your personality while providing ultimate comfort and durability.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission is to create timeless pieces that combine stunning aesthetics with sustainable practices, ensuring that every purchase contributes to a better tomorrow.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/shop">
                  <Button variant="primary" size="lg">
                    Explore Collection
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-4/3 overflow-hidden rounded-2xl bg-muted">
                <img
                  src={heroImg}
                  alt="Heim Furniture Showroom"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Decorative Card */}
              <div className="absolute -bottom-6 -right-6 hidden lg:block">
                <div className="rounded-xl bg-card p-6 shadow-lg max-w-xs">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-accent text-3xl font-bold">10+</div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Years of Excellence</p>
                  <p className="text-xs text-muted-foreground mt-1">Trusted by designers worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold text-accent mb-3">
                50K+
              </div>
              <p className="text-slate-600 font-semibold">Happy Customers</p>
              <p className="text-sm text-slate-500 mt-1">Across 25 countries</p>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold text-accent mb-3">
                1000+
              </div>
              <p className="text-slate-600 font-semibold">Products</p>
              <p className="text-sm text-slate-500 mt-1">Unique designs</p>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold text-accent mb-3">
                10+
              </div>
              <p className="text-slate-600 font-semibold">Awards</p>
              <p className="text-sm text-slate-500 mt-1">Industry recognition</p>
            </div>

            {/* Stat 4 */}
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-bold text-accent mb-3">
                98%
              </div>
              <p className="text-slate-600 font-semibold">Satisfaction Rate</p>
              <p className="text-sm text-slate-500 mt-1">Customer approved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-medium text-accent uppercase tracking-wider mb-2">
              Our Values
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              What Drives Us
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our core values guide every decision we make, from design to delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1: Quality */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Premium Quality</h3>
              <p className="text-slate-600 leading-relaxed">
                We only use the finest materials and work with master craftspeople to ensure every piece meets our exacting standards.
              </p>
            </div>

            {/* Value 2: Sustainability */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <Lightbulb className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sustainability</h3>
              <p className="text-slate-600 leading-relaxed">
                Environmental responsibility is at the heart of our business. We use sustainable materials and eco-friendly practices.
              </p>
            </div>

            {/* Value 3: Innovation */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Innovation</h3>
              <p className="text-slate-600 leading-relaxed">
                We constantly explore new designs and technologies to bring fresh, forward-thinking furniture to the market.
              </p>
            </div>

            {/* Value 4: Customer Focus */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Customer First</h3>
              <p className="text-slate-600 leading-relaxed">
                Your satisfaction is our priority. We offer exceptional service and support throughout your journey with us.
              </p>
            </div>

            {/* Value 5: Design Excellence */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Design Excellence</h3>
              <p className="text-slate-600 leading-relaxed">
                We collaborate with renowned designers to create pieces that are both beautiful and functional.
              </p>
            </div>

            {/* Value 6: Community */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community Building</h3>
              <p className="text-slate-600 leading-relaxed">
                We're more than a brand. We're a community of design enthusiasts creating beautiful spaces together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-medium text-accent uppercase tracking-wider mb-2">
              Our Team
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Meet the People Behind Heim
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A passionate team of designers, craftspeople, and visionaries
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="mb-6 overflow-hidden rounded-xl bg-slate-200 aspect-square">
                <img
                  src={heroImg}
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-1">Sarah Johnson</h3>
              <p className="text-accent font-medium mb-2">Founder & Creative Director</p>
              <p className="text-sm text-slate-600">
                Visionary designer with 15+ years in furniture design and brand development.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="mb-6 overflow-hidden rounded-xl bg-slate-200 aspect-square">
                <img
                  src={heroImg}
                  alt="Michael Chen"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-1">Michael Chen</h3>
              <p className="text-accent font-medium mb-2">Head of Operations</p>
              <p className="text-sm text-slate-600">
                Logistics expert ensuring quality products reach you perfectly and on time.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="mb-6 overflow-hidden rounded-xl bg-slate-200 aspect-square">
                <img
                  src={heroImg}
                  alt="Emma Rodriguez"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-1">Emma Rodriguez</h3>
              <p className="text-accent font-medium mb-2">Chief Sustainability Officer</p>
              <p className="text-sm text-slate-600">
                Eco-conscious leader driving our sustainable manufacturing initiatives.
              </p>
            </div>

            {/* Team Member 4 */}
            <div className="text-center">
              <div className="mb-6 overflow-hidden rounded-xl bg-slate-200 aspect-square">
                <img
                  src={heroImg}
                  alt="David Park"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-1">David Park</h3>
              <p className="text-accent font-medium mb-2">Customer Experience Lead</p>
              <p className="text-sm text-slate-600">
                Dedicated to ensuring every customer interaction exceeds expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-medium text-accent uppercase tracking-wider mb-2">
              Our Journey
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              A Brief History
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Timeline Item 1 */}
            <div className="flex gap-8 mb-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <div className="w-1 h-24 bg-accent/20"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">2015 - The Beginning</h3>
                <p className="text-slate-600">
                  Heim was founded with a simple mission: to make beautifully designed furniture accessible to everyone. We started with a small workshop and a big dream.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex gap-8 mb-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <div className="w-1 h-24 bg-accent/20"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">2017 - First Store Opens</h3>
                <p className="text-slate-600">
                  Our first flagship store opened in the heart of the city, showcasing our growing collection and attracting design enthusiasts from around the world.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex gap-8 mb-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <div className="w-1 h-24 bg-accent/20"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">2019 - Going Global</h3>
                <p className="text-slate-600">
                  We expanded internationally, launching our e-commerce platform and establishing partnerships with retailers across Europe, Asia, and North America.
                </p>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="flex gap-8 mb-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg mb-4">
                  4
                </div>
                <div className="w-1 h-24 bg-accent/20"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">2022 - Sustainability First</h3>
                <p className="text-slate-600">
                  We committed to 100% sustainable manufacturing, partnering with certified eco-friendly suppliers and carbon-neutral shipping methods.
                </p>
              </div>
            </div>

            {/* Timeline Item 5 */}
            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
                  5
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">2024 & Beyond - The Future</h3>
                <p className="text-slate-600">
                  Continuing to innovate with smart furniture solutions, expanding our design collaborations, and building a community of conscious consumers worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <span className="inline-block text-sm font-medium text-accent uppercase tracking-wider mb-2">
                Why Choose Heim
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Superior Quality Meets Exceptional Design
              </h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10 text-accent">
                      <Check className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Handpicked Materials</h3>
                    <p className="text-slate-600">Each piece is crafted using premium, sustainably sourced materials</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10 text-accent">
                      <Check className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Expert Craftspeople</h3>
                    <p className="text-slate-600">Skilled artisans with decades of combined experience</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10 text-accent">
                      <Check className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Lifetime Support</h3>
                    <p className="text-slate-600">We stand behind our products with comprehensive warranties</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10 text-accent">
                      <Check className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Eco-Conscious</h3>
                    <p className="text-slate-600">100% sustainable practices throughout our supply chain</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/shop">
                  <Button variant="primary" size="lg">
                    Shop Our Collection
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div>
              <div className="rounded-2xl overflow-hidden bg-slate-200 aspect-4/3">
                <img
                  src={heroImg}
                  alt="Our Commitment to Quality"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Explore our curated collection and discover furniture that speaks to your style and values.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About