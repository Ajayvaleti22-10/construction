import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Home as HomeIcon, 
  Building2, 
  Hammer, 
  Factory,
  CheckCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useScrollReveal } from "../hooks/useAnimations";
import { getServices } from "@/lib/staticData";
import { resolveImageUrl } from "@/lib/cloudinary";

const iconMap = {
  Home: HomeIcon,
  Building2: Building2,
  Hammer: Hammer,
  Factory: Factory,
};

const processSteps = [
  {
    step: "01",
    title: "Consultation",
    description: "We begin with a detailed discussion to understand your vision, requirements, and budget."
  },
  {
    step: "02",
    title: "Planning & Design",
    description: "Our team creates comprehensive plans and designs tailored to your specific needs."
  },
  {
    step: "03",
    title: "Construction",
    description: "Expert craftsmen bring your project to life with precision and attention to detail."
  },
  {
    step: "04",
    title: "Delivery",
    description: "Final walkthrough and handover, ensuring every aspect meets our quality standards."
  }
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div data-testid="services-page">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-secondary" data-testid="services-hero">
        <div className="absolute inset-0 grid-lines opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="font-mono text-sm text-primary uppercase tracking-widest mb-4">
              Our Services
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-foreground uppercase leading-tight mb-6">
              Comprehensive<br />
              <span className="text-primary">Construction Solutions</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              From residential homes to commercial complexes, we offer a full range of 
              construction services designed to meet your unique needs with precision and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-background" data-testid="services-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="h-96 skeleton" />
              ))
            ) : (
              services.map((service, index) => {
                const Icon = iconMap[service.icon] || HomeIcon;
                return (
                  <Card 
                    key={service.id}
                    className="group overflow-hidden bg-card border border-border hover:border-primary transition-colors"
                    data-testid={`service-detail-${service.slug}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="aspect-square md:aspect-auto overflow-hidden">
                        <img 
                          src={resolveImageUrl(service.image_url, { w: 800 })} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="font-heading text-2xl uppercase mb-4">{service.title}</h2>
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                          {service.short_description}
                        </p>
                        <ul className="space-y-2 mb-6">
                          {service.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Link to={`/services/${service.slug}`}>
                          <Button 
                            variant="outline"
                            className="rounded-none uppercase tracking-wider font-mono text-sm w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            Learn More
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-muted" data-testid="services-process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="font-mono text-sm text-primary uppercase tracking-widest mb-2">
              How We Work
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">
              Our Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div 
                key={index}
                className="relative"
                data-testid={`process-step-${step.step}`}
              >
                <div className="font-heading text-6xl font-bold text-primary/20 absolute -top-4 -left-2">
                  {step.step}
                </div>
                <div className="relative z-10 pt-8">
                  <h3 className="font-heading text-xl uppercase mb-4">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background" data-testid="services-why-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="font-mono text-sm text-primary uppercase tracking-widest mb-4">
                Why Choose Us
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary mb-8">
                Building Excellence<br />in Every Project
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Experienced Team", desc: "Over 50 skilled professionals with decades of combined experience" },
                  { title: "Quality Materials", desc: "We source only the finest materials from trusted suppliers" },
                  { title: "On-Time Delivery", desc: "Our rigorous project management ensures timely completion" },
                  { title: "Transparent Pricing", desc: "No hidden costs – what we quote is what you pay" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg uppercase mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src={resolveImageUrl("https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800")} 
                alt="Construction site"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 border-2 border-primary -translate-x-4 -translate-y-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary" data-testid="services-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary-foreground uppercase">
                Need a Custom Solution?
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl">
                Contact us to discuss your unique project requirements and get a personalized quote.
              </p>
            </div>
            <Link to="/contact">
              <Button 
                size="lg"
                className="btn-primary rounded-none uppercase tracking-wider font-heading h-14 px-10"
                data-testid="services-cta-btn"
              >
                Get Free Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
