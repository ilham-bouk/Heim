import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/ui/Breadcrumb';
import { isValidEmail } from '../utils/validators';
import { useSettings } from '../context/SettingsContext';
import { useMessages } from '../context/MessageContext';
import { MESSAGE_SUBJECTS } from '../services/messageService';

const Contact = () => {
  const { settings } = useSettings();
  const contactInfoConfig = settings.contact;
  const { sendMessage } = useMessages();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const timerRef = useRef(null);

  // Don't leave the banner timer running after the page unmounts.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => (prev[name] ? { ...prev, [name]: '' } : prev));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Full name is required';
    if (!formData.email.trim()) nextErrors.email = 'Email is required';
    else if (!isValidEmail(formData.email.trim())) nextErrors.email = 'Please enter a valid email address';
    if (!formData.subject) nextErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) nextErrors.message = 'Message is required';
    
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitError('');
    setIsSending(true);

    try {
      await sendMessage(formData);
    } catch {
      setSubmitError("Your message couldn't be sent. Please try again.");
      setIsSending(false);
      return;
    }

    setIsSending(false);
    setFormSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFormSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Showroom",
      details: contactInfoConfig.address,
      link: "https://maps.google.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: [contactInfoConfig.phone, contactInfoConfig.phoneAlt].filter(Boolean),
      link: `tel:${contactInfoConfig.phone.replace(/[^\d+]/g, '')}`
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [contactInfoConfig.email, contactInfoConfig.supportEmail].filter(Boolean),
      link: `mailto:${contactInfoConfig.email}`
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: contactInfoConfig.hours,
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      {/* Hero Section */}
      <section className="py-12 lg:py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-sm font-medium text-accent-text uppercase tracking-wider mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance mb-4">
              We'd Love to Hear From You
            </h1>
            <p className="text-lg text-foreground/70">
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
                  <div className="bg-secondary rounded-xl p-8 border border-border h-full">
                    <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <info.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-3">{info.title}</h3>
                    <div className="space-y-2">
                      {info.details.map((detail, idx) => (
                        info.link ? (
                          <a 
                            href={info.link} 
                            key={idx} 
                            className="block text-foreground/80 text-sm hover:text-accent-text transition-colors"
                          >
                            {detail}
                          </a>
                        ) : (
                          <p key={idx} className="text-foreground/80 text-sm">
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
      <section className="py-8 lg:py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl p-8 lg:p-10 border border-border">
                <h2 className="text-3xl font-bold text-foreground mb-2">Send us a Message</h2>
                <p className="text-foreground/80 mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
                <form onSubmit={handleSubmit} noValidate className="space-y-6 mb-8">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={`w-full px-4 py-3 rounded-lg border bg-card focus:outline-none focus:ring-2 text-foreground placeholder:text-muted-foreground ${
                        errors.name ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                      }`}
                     />
                    {errors.name && (
                      <p id="name-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive-text">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`w-full px-4 py-3 rounded-lg border bg-card focus:outline-none focus:ring-2 text-foreground placeholder:text-muted-foreground ${
                        errors.email ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                      }`}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive-text">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-foreground mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      className={`w-full px-4 py-3 rounded-lg border bg-card focus:outline-none focus:ring-2 text-foreground ${
                        errors.subject ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                      }`}
                    >
                      <option value="">Select a subject</option>
                      {MESSAGE_SUBJECTS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p id="subject-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive-text">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows="6"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className={`w-full px-4 py-3 rounded-lg border bg-card focus:outline-none focus:ring-2 text-foreground placeholder:text-muted-foreground ${
                        errors.message ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                      }`}                    
                    />
                    {errors.message && (
                      <p id="message-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive-text">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full flex justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                    disabled={isSending}
                  >
                    <Send className="w-5 h-5" />
                    {isSending ? 'Sending…' : 'Send Message'}
                  </Button>
                </form>

                {formSubmitted && (
                  <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
                     <div>
                      <p className="font-semibold text-success-text">Thank you for your message!</p>
                      <p className="text-sm text-success-text">We've received your inquiry and will get back to you soon.</p>
                     </div>
                  </div>
                )}

                {Object.keys(errors).length > 0 && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                    <p className="font-semibold text-destructive-text">Please fix the highlighted fields</p>
                  </div>
                )}

                {submitError && (
                  <div role="alert" className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                    <p className="font-semibold text-destructive-text">{submitError}</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-4">
                  * Required fields. We respect your privacy and will never share your information.
                </p>
              </div>
            </div>

            {/* Sidebar Info */}
            <div>
              {/* Quick Contact */}
              <div className="bg-card rounded-xl p-8 border border-border mb-8">
                <h3 className="text-xl font-bold text-foreground mb-6">Quick Contact</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Response Time
                    </p>
                    <p className="text-foreground">
                      We typically respond within <span className="font-semibold">24 hours</span>
                    </p>
                  </div>

                  <div className="h-px bg-border" />

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Preferred Method
                    </p>
                    <p className="text-foreground">
                      Email us for fastest response
                    </p>
                  </div>

                  <div className="h-px bg-border" />

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Emergency Support
                    </p>
                    <p className="text-foreground">
                      Call us during business hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick answers */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Looking for a quick answer?</h2>
          <p className="text-lg text-foreground/80 mb-8">
            Delivery, returns, warranties and more are covered in our FAQ.
          </p>
          <Button as={Link} to="/faq" variant="outline" size="lg">
            Read the FAQ
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Can't Wait to Get Started?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Explore our collection and start shopping today. New customers get 10% off their first order!
          </p>
          <Button as={Link} to="/shop" variant="primary" size="lg">
            Start Shopping
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Contact