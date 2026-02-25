import { useState, memo, useCallback } from "react";
import { toast } from "sonner";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  CheckCircle,
  ArrowRight,
  Shield,
  Award,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useScrollReveal } from "../hooks/useAnimations";
import { submitWeb3Form, isWeb3FormsConfigured } from "@/lib/web3forms";

const serviceTypes = [
  { value: "residential", label: "Residential Construction" },
  { value: "commercial", label: "Commercial Construction" },
  { value: "renovation", label: "Renovation & Remodeling" },
  { value: "industrial", label: "Industrial Construction" },
  { value: "other", label: "Other" },
];

const budgetRanges = [
  { value: "under-50k", label: "Under $50,000" },
  { value: "50k-100k", label: "$50,000 - $100,000" },
  { value: "100k-250k", label: "$100,000 - $250,000" },
  { value: "250k-500k", label: "$250,000 - $500,000" },
  { value: "500k-1m", label: "$500,000 - $1,000,000" },
  { value: "over-1m", label: "Over $1,000,000" },
];

const timelines = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3months", label: "1-3 months" },
  { value: "3-6months", label: "3-6 months" },
  { value: "6-12months", label: "6-12 months" },
  { value: "flexible", label: "Flexible / Not sure" },
];

const ContactInfoCard = memo(function ContactInfoCard({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-heading text-sm uppercase tracking-wide text-secondary mb-1">
          {title}
        </h3>
        <div className="text-muted-foreground text-sm">{children}</div>
      </div>
    </div>
  );
});

export default function Contact() {
  const [activeTab, setActiveTab] = useState("quote");
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  
  const [heroRef, heroRevealed] = useScrollReveal({ threshold: 0.1 });
  const [formRef, formRevealed] = useScrollReveal({ threshold: 0.1 });
  
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    service_type: "",
    project_description: "",
    budget_range: "",
    timeline: "",
  });

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleQuoteChange = useCallback((e) => {
    const { name, value } = e.target;
    setQuoteForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleQuoteSelectChange = useCallback((name, value) => {
    setQuoteForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleContactChange = useCallback((e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Validation helper
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    
    if (!isWeb3FormsConfigured()) {
      toast.error("Contact form is not configured yet. Please add your Web3Forms access key.");
      return;
    }
    
    if (!quoteForm.name || !quoteForm.email || !quoteForm.phone || !quoteForm.service_type || !quoteForm.project_description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!validateEmail(quoteForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setQuoteSubmitting(true);
    try {
      const message = [
        `Name: ${quoteForm.name}`,
        `Email: ${quoteForm.email}`,
        `Phone: ${quoteForm.phone}`,
        `Service Type: ${quoteForm.service_type}`,
        `Budget Range: ${quoteForm.budget_range || "Not specified"}`,
        `Timeline: ${quoteForm.timeline || "Not specified"}`,
        "",
        "Project Description:",
        quoteForm.project_description,
      ].join("\n");

      const result = await submitWeb3Form({
        subject: `Quote Request from ${quoteForm.name}`,
        from_name: quoteForm.name,
        email: quoteForm.email,
        message,
        "Phone": quoteForm.phone,
        "Service Type": quoteForm.service_type,
        "Budget": quoteForm.budget_range || "-",
        "Timeline": quoteForm.timeline || "-",
      });
      
      if (result.success) {
        setQuoteSuccess(true);
        toast.success("Quote request submitted successfully! We'll contact you within 24 hours.");
        setQuoteForm({
          name: "",
          email: "",
          phone: "",
          service_type: "",
          project_description: "",
          budget_range: "",
          timeline: "",
        });
      } else {
        toast.error(result.message || "Failed to submit quote request. Please try again or call us directly.");
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast.error("Failed to submit quote request. Please try again or call us directly.");
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!isWeb3FormsConfigured()) {
      toast.error("Contact form is not configured yet. Please add your Web3Forms access key.");
      return;
    }
    
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!validateEmail(contactForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setContactSubmitting(true);
    try {
      const result = await submitWeb3Form({
        subject: contactForm.subject,
        from_name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message,
      });
      
      if (result.success) {
        setContactSuccess(true);
        toast.success("Message sent successfully! We'll get back to you soon.");
        setContactForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(result.message || "Failed to send message. Please try again or call us directly.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again or call us directly.");
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-32 pb-20 bg-secondary" 
        data-testid="contact-hero"
      >
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`max-w-3xl reveal-up ${heroRevealed ? 'revealed' : ''}`}>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3 block">
              Get In Touch
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white uppercase leading-tight mb-6">
              Let's Build<br />
              <span className="text-primary">Together</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl">
              Ready to start your project? Get in touch with our team for a free consultation 
              and detailed quote. We're here to turn your vision into reality.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-background border-b border-border" data-testid="contact-info">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-white border border-border/50 hover:border-primary/30 transition-colors">
              <ContactInfoCard icon={MapPin} title="Our Location">
                <address className="not-italic">
                  123 Construction Ave<br />
                  Building District, NY 10001
                </address>
              </ContactInfoCard>
            </Card>

            <Card className="p-6 bg-white border border-border/50 hover:border-primary/30 transition-colors">
              <ContactInfoCard icon={Phone} title="Phone">
                <a href="tel:+1234567890" className="hover:text-primary transition-colors block">
                  +1 (234) 567-890
                </a>
                <span className="text-xs text-muted-foreground">Mon-Fri, 7am-6pm</span>
              </ContactInfoCard>
            </Card>

            <Card className="p-6 bg-white border border-border/50 hover:border-primary/30 transition-colors">
              <ContactInfoCard icon={Mail} title="Email">
                <a href="mailto:info@buildcraft.com" className="hover:text-primary transition-colors block">
                  info@buildcraft.com
                </a>
                <span className="text-xs text-muted-foreground">We reply within 24 hours</span>
              </ContactInfoCard>
            </Card>

            <Card className="p-6 bg-white border border-border/50 hover:border-primary/30 transition-colors">
              <ContactInfoCard icon={Clock} title="Business Hours">
                <p>Mon-Fri: 7am-6pm</p>
                <p>Sat: 8am-4pm</p>
              </ContactInfoCard>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section 
        ref={formRef}
        className="py-24 bg-background" 
        data-testid="contact-forms"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Forms */}
            <div className={`reveal-left ${formRevealed ? 'revealed' : ''}`}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted p-1 mb-8 h-auto">
                  <TabsTrigger 
                    value="quote" 
                    className="font-heading uppercase text-sm py-3 data-[state=active]:bg-secondary data-[state=active]:text-white transition-colors"
                    data-testid="quote-tab"
                  >
                    Request Quote
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contact"
                    className="font-heading uppercase text-sm py-3 data-[state=active]:bg-secondary data-[state=active]:text-white transition-colors"
                    data-testid="contact-tab"
                  >
                    Send Message
                  </TabsTrigger>
                </TabsList>

                {/* Quote Request Form */}
                <TabsContent value="quote">
                  {quoteSuccess ? (
                    <Card className="p-8 bg-white border border-border text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-heading text-xl uppercase mb-2">Quote Request Received!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for your interest. Our team will review your request and 
                        contact you within 24 hours.
                      </p>
                      <Button 
                        onClick={() => setQuoteSuccess(false)}
                        variant="outline"
                        className="font-heading uppercase tracking-wider"
                      >
                        Submit Another Request
                      </Button>
                    </Card>
                  ) : (
                    <Card className="p-8 bg-white border border-border">
                      <form onSubmit={handleQuoteSubmit} className="space-y-6" data-testid="quote-form">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="quote-name" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                              Full Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="quote-name"
                              name="name"
                              value={quoteForm.name}
                              onChange={handleQuoteChange}
                              placeholder="John Doe"
                              className="bg-background border-border focus:border-primary"
                              required
                              data-testid="quote-name-input"
                            />
                          </div>
                          <div>
                            <Label htmlFor="quote-email" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                              Email Address <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="quote-email"
                              name="email"
                              type="email"
                              value={quoteForm.email}
                              onChange={handleQuoteChange}
                              placeholder="john@example.com"
                              className="bg-background border-border focus:border-primary"
                              required
                              data-testid="quote-email-input"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="quote-phone" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                            Phone Number <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="quote-phone"
                            name="phone"
                            type="tel"
                            value={quoteForm.phone}
                            onChange={handleQuoteChange}
                            placeholder="+1 (234) 567-890"
                            className="bg-background border-border focus:border-primary"
                            required
                            data-testid="quote-phone-input"
                          />
                        </div>

                        <div>
                          <Label className="font-mono text-xs uppercase tracking-wider mb-2 block">
                            Service Type <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={quoteForm.service_type}
                            onValueChange={(value) => handleQuoteSelectChange("service_type", value)}
                          >
                            <SelectTrigger 
                              className="bg-background border-border focus:border-primary"
                              data-testid="quote-service-select"
                            >
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <Label className="font-mono text-xs uppercase tracking-wider mb-2 block">
                              Budget Range
                            </Label>
                            <Select
                              value={quoteForm.budget_range}
                              onValueChange={(value) => handleQuoteSelectChange("budget_range", value)}
                            >
                              <SelectTrigger 
                                className="bg-background border-border focus:border-primary"
                                data-testid="quote-budget-select"
                              >
                                <SelectValue placeholder="Select budget" />
                              </SelectTrigger>
                              <SelectContent>
                                {budgetRanges.map((range) => (
                                  <SelectItem key={range.value} value={range.value}>
                                    {range.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="font-mono text-xs uppercase tracking-wider mb-2 block">
                              Project Timeline
                            </Label>
                            <Select
                              value={quoteForm.timeline}
                              onValueChange={(value) => handleQuoteSelectChange("timeline", value)}
                            >
                              <SelectTrigger 
                                className="bg-background border-border focus:border-primary"
                                data-testid="quote-timeline-select"
                              >
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                              <SelectContent>
                                {timelines.map((timeline) => (
                                  <SelectItem key={timeline.value} value={timeline.value}>
                                    {timeline.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="quote-description" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                            Project Description <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="quote-description"
                            name="project_description"
                            value={quoteForm.project_description}
                            onChange={handleQuoteChange}
                            placeholder="Tell us about your project, including size, specific requirements, and any other relevant details..."
                            rows={5}
                            className="bg-background border-border focus:border-primary resize-none"
                            required
                            data-testid="quote-description-input"
                          />
                        </div>

                        <Button 
                          type="submit"
                          disabled={quoteSubmitting}
                          className="w-full bg-primary hover:bg-primary/90 text-white font-heading uppercase tracking-wider h-12"
                          data-testid="submit-quote-btn"
                        >
                          {quoteSubmitting ? (
                            <>
                              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Request Free Quote
                              <Send className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Card>
                  )}
                </TabsContent>

                {/* Contact Form */}
                <TabsContent value="contact">
                  {contactSuccess ? (
                    <Card className="p-8 bg-white border border-border text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-heading text-xl uppercase mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                      <Button 
                        onClick={() => setContactSuccess(false)}
                        variant="outline"
                        className="font-heading uppercase tracking-wider"
                      >
                        Send Another Message
                      </Button>
                    </Card>
                  ) : (
                    <Card className="p-8 bg-white border border-border">
                      <form onSubmit={handleContactSubmit} className="space-y-6" data-testid="contact-form">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="contact-name" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                              Full Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="contact-name"
                              name="name"
                              value={contactForm.name}
                              onChange={handleContactChange}
                              placeholder="John Doe"
                              className="bg-background border-border focus:border-primary"
                              required
                              data-testid="contact-name-input"
                            />
                          </div>
                          <div>
                            <Label htmlFor="contact-email" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                              Email Address <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="contact-email"
                              name="email"
                              type="email"
                              value={contactForm.email}
                              onChange={handleContactChange}
                              placeholder="john@example.com"
                              className="bg-background border-border focus:border-primary"
                              required
                              data-testid="contact-email-input"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="contact-subject" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                            Subject <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="contact-subject"
                            name="subject"
                            value={contactForm.subject}
                            onChange={handleContactChange}
                            placeholder="How can we help?"
                            className="bg-background border-border focus:border-primary"
                            required
                            data-testid="contact-subject-input"
                          />
                        </div>

                        <div>
                          <Label htmlFor="contact-message" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                            Message <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="contact-message"
                            name="message"
                            value={contactForm.message}
                            onChange={handleContactChange}
                            placeholder="Your message..."
                            rows={5}
                            className="bg-background border-border focus:border-primary resize-none"
                            required
                            data-testid="contact-message-input"
                          />
                        </div>

                        <Button 
                          type="submit"
                          disabled={contactSubmitting}
                          className="w-full bg-primary hover:bg-primary/90 text-white font-heading uppercase tracking-wider h-12"
                          data-testid="submit-contact-btn"
                        >
                          {contactSubmitting ? (
                            <>
                              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Map & Info */}
            <div className={`reveal-right ${formRevealed ? 'revealed' : ''}`} style={{ transitionDelay: '200ms' }}>
              <div className="mb-8">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3 block">
                  Visit Our Office
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-secondary mb-4">
                  Find Us Here
                </h2>
                <p className="text-muted-foreground">
                  Stop by our office to discuss your project in person. Our team is available 
                  to meet with you during business hours.
                </p>
              </div>

              {/* Google Maps Embed */}
              <div className="relative mb-8 bg-muted" data-testid="google-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304605!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BuildCraft Location"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* Why Contact Us */}
              <Card className="p-8 bg-secondary text-white">
                <h3 className="font-heading text-lg uppercase mb-6">Why Work With Us</h3>
                <ul className="space-y-4">
                  {[
                    { icon: CheckCircle, text: "Free initial consultation" },
                    { icon: CheckCircle, text: "Detailed project estimates" },
                    { icon: Award, text: "25+ years of experience" },
                    { icon: Shield, text: "Licensed, bonded & insured" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <li key={i} className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-white/80">{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="font-mono text-xs uppercase tracking-wider text-primary mb-2">
                    24/7 Emergency Line
                  </p>
                  <a 
                    href="tel:+1234567899" 
                    className="flex items-center gap-2 text-white text-lg font-medium hover:text-primary transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    +1 (234) 567-899
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
