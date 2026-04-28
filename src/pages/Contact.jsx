import { useState } from 'react';
import { ChevronRight, MapPin, Phone, Mail, Clock, Send, MessageSquare, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    console.log('Form submitted:', formData);
    
    setFormSubmitted(true);
    setFormError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });

    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Showroom",
      details: ["123 Design Street", "New York, NY 10001"],
      link: "https://maps.google.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
      link: "tel:+15551234567"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@heimfurniture.com", "support@heimfurniture.com"],
      link: "mailto:info@heimfurniture.com"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9am - 6pm", "Saturday & Sunday: 10am - 4pm"],
      link: null
    }
  ];

  const faqItems = [
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 5-7 business days within the continental US. Express delivery options are available for an additional fee."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location. Contact us for a quote."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all furniture. Items must be in original condition. Shipping costs for returns are the customer's responsibility."
    },
    {
      question: "Can I customize my furniture?",
      answer: "Many of our pieces offer customization options including fabric, color, and dimensions. Please contact us to discuss your specific needs."
    },
    {
      question: "Do you offer warranties?",
      answer: "Yes, all our furniture comes with a 2-year manufacturer's warranty covering defects in materials and workmanship."
    },
    {
      question: "How do I track my order?",
      answer: "You'll receive a tracking number via email once your order ships. You can use this to monitor your delivery in real-time."
    }
  ];

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
            <span className="text-slate-900 font-medium">Contact Us</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 lg:py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-sm font-medium text-accent uppercase tracking-wider mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance mb-4">
              We'd Love to Hear From You
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about our products or services? Our team is here to help. Reach out to us through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              return (
                <div key={index}>
                  <div className="bg-secondary rounded-xl p-8 border border-slate-200 h-full">
                    <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <info.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{info.title}</h3>
                    <div className="space-y-2">
                      {info.details.map((detail, idx) => (
                        info.link ? (
                          <a 
                            href={info.link} 
                            key={idx} 
                            className="block text-slate-600 text-sm hover:text-accent transition-colors"
                          >
                            {detail}
                          </a>
                        ) : (
                          <p key={idx} className="text-slate-600 text-sm">
                            {detail}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-8 lg:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-8 lg:p-10 border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Send us a Message</h2>
                <p className="text-slate-600 mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder-slate-400"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder-slate-400"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder-slate-400"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
                    >
                      <option value="">Select a subject</option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="custom-order">Custom Order</option>
                      <option value="delivery-issue">Delivery Issue</option>
                      <option value="warranty-claim">Warranty Claim</option>
                      <option value="general-question">General Question</option>
                      <option value="partnership">Partnership Opportunity</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows="6"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder-slate-400 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full flex justify-center gap-2"
                    type="submit"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </Button>
                </form>

                {formSubmitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-green-900">Thank you for your message!</p>
                      <p className="text-sm text-green-700">We've received your inquiry and will get back to you soon.</p>
                    </div>
                  </div>
                )}

                {formError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900">Error</p>
                      <p className="text-sm text-red-700">{formError}</p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-4">
                  * Required fields. We respect your privacy and will never share your information.
                </p>
              </div>
            </div>

            {/* Sidebar Info */}
            <div>
              {/* Quick Contact */}
              <div className="bg-white rounded-xl p-8 border border-slate-200 mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Contact</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Response Time
                    </p>
                    <p className="text-slate-900">
                      We typically respond within <span className="font-semibold">24 hours</span>
                    </p>
                  </div>

                  <div className="h-px bg-slate-200" />

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Preferred Method
                    </p>
                    <p className="text-slate-900">
                      Email us for fastest response
                    </p>
                  </div>

                  <div className="h-px bg-slate-200" />

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Emergency Support
                    </p>
                    <p className="text-slate-900">
                      Call us during business hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-medium text-accent uppercase tracking-wider mb-2">
              Common Questions
            </span>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">
              Find answers to common questions about our products and services
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details key={index} className="group bg-white rounded-lg border border-slate-200 p-6 hover:border-slate-300 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.question}
                  </h3>
                  <div className="shrink-0 ml-4 flex items-center justify-center h-6 w-6 rounded-full bg-accent/10 group-open:bg-accent/20 transition-colors">
                    <ChevronDown className='h-4 w-4 text-accent transform group-open:rotate-180 transition-transform' />
                  </div>
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-6">
              Didn't find what you're looking for?
            </p>
            <Button variant="primary" size="lg" className="flex justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Ask Another Question
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Can't Wait to Get Started?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Explore our collection and start shopping today. New customers get 10% off their first order!
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

export default Contact