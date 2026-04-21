import { Truck, Shield, Headphones, RefreshCw } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders over $500"
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% protected"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support"
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30 day return policy"
  }
]

const FeaturesBar = () => {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                <feature.icon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesBar;