import { useState, useEffect, memo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Home as HomeIcon, 
  Building2, 
  Hammer, 
  Factory,
  Star,
  Award,
  Users,
  Calendar,
  CheckCircle,
  Shield,
  Phone,
  ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useScrollReveal } from "../hooks/useAnimations";
import { getServices, getProjects, getTestimonials } from "@/lib/staticData";
import { resolveImageUrl } from "@/lib/cloudinary";

const iconMap = {
  Home: HomeIcon,
  Building2: Building2,
  Hammer: Hammer,
  Factory: Factory,
};

const stats = [
  { icon: Award, value: "250+", label: "Projects Delivered" },
  { icon: Calendar, value: "25+", label: "Years of Excellence" },
  { icon: Users, value: "50+", label: "Expert Team Members" },
  { icon: Star, value: "98%", label: "Client Satisfaction" },
];

const trustBadges = [
  "Licensed & Insured",
  "OSHA Certified", 
  "BBB A+ Rated",
  "EPA Compliant"
];

// Memoized stat card for performance
const StatCard = memo(function StatCard({ stat, index }) {
  const Icon = stat.icon;
  const [ref, isRevealed] = useScrollReveal({ threshold: 0.2 });
  
  return (
    <div 
      ref={ref}
      className={`reveal-up ${isRevealed ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <div className="font-heading text-4xl sm:text-5xl font-bold text-secondary mb-1">
          {stat.value}
        </div>
        <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {stat.label}
        </div>
      </div>
    </div>
  );
});

// Memoized service card
const ServiceCard = memo(function ServiceCard({ service, index }) {
  const Icon = iconMap[service.icon] || HomeIcon;
  const [ref, isRevealed] = useScrollReveal({ threshold: 0.1 });
  
  return (
    <Link 
      ref={ref}
      to={`/services/${service.slug}`}
      className={`reveal-up ${isRevealed ? 'revealed' : ''} block group`}
      style={{ transitionDelay: `${index * 100}ms` }}
      data-testid={`service-card-${service.slug}`}
    >
      <Card className="h-full bg-white border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden card-lift">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img 
          src={resolveImageUrl(service.image_url, { w: 800 })} 
          alt={service.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-secondary flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-heading text-lg uppercase tracking-wide text-secondary">
              {service.title}
            </h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {service.short_description}
          </p>
          <div className="mt-4 flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Learn More</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </Card>
    </Link>
  );
});

// Memoized project card
const ProjectCard = memo(function ProjectCard({ project, index, featured = false }) {
  const [ref, isRevealed] = useScrollReveal({ threshold: 0.1 });
  
  return (
    <Link 
      ref={ref}
      to={`/projects/${project.slug}`}
      className={`reveal-scale ${isRevealed ? 'revealed' : ''} block group ${
        featured ? 'lg:col-span-2 lg:row-span-2' : ''
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      data-testid={`project-card-${project.slug}`}
    >
      <Card className={`relative overflow-hidden border-0 ${
        featured ? 'h-full min-h-[500px]' : 'h-80'
      }`}>
        <img 
          src={resolveImageUrl(project.images?.[0], { w: 800 })} 
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-primary uppercase tracking-widest bg-primary/20 px-3 py-1 backdrop-blur-sm">
              {project.category}
            </span>
            <span className="font-mono text-xs text-white/60">{project.year}</span>
          </div>
          <h3 className={`font-heading text-white uppercase mb-2 ${
            featured ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'
          }`}>
            {project.title}
          </h3>
          <p className="text-white/70 text-sm line-clamp-2 max-w-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {project.description}
          </p>
          <div className="mt-4 flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
            <span>View Project</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
});

// Memoized testimonial card
const TestimonialCard = memo(function TestimonialCard({ testimonial, index }) {
  const [ref, isRevealed] = useScrollReveal({ threshold: 0.1 });
  
  return (
    <div 
      ref={ref}
      className={`reveal-up ${isRevealed ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card 
        className="h-full p-8 bg-white border border-border/50 relative"
        data-testid={`testimonial-card-${testimonial.id}`}
      >
        {/* Quote mark */}
        <div className="absolute top-6 right-6 font-heading text-6xl text-primary/10 leading-none">
          "
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i < testimonial.rating ? 'text-primary fill-primary' : 'text-border'
                }`} 
              />
            ))}
          </div>
          <p className="text-foreground leading-relaxed mb-6">
            "{testimonial.content}"
          </p>
          <div className="flex items-center gap-4">
            {testimonial.image_url ? (
              <img 
                src={resolveImageUrl(testimonial.image_url, { w: 150 })} 
                alt={testimonial.name}
                loading="lazy"
                className="w-12 h-12 object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                <span className="font-heading text-lg text-primary">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <div className="font-heading text-sm uppercase tracking-wide text-secondary">
                {testimonial.name}
              </div>
              {testimonial.company && (
                <div className="font-mono text-xs text-muted-foreground">
                  {testimonial.role && `${testimonial.role}, `}{testimonial.company}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

export default function Home() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Section refs for scroll reveal
  const [heroRef, heroRevealed] = useScrollReveal({ threshold: 0.1 });
  const [servicesHeaderRef, servicesHeaderRevealed] = useScrollReveal({ threshold: 0.2 });
  const [projectsHeaderRef, projectsHeaderRevealed] = useScrollReveal({ threshold: 0.2 });
  const [testimonialsHeaderRef, testimonialsHeaderRevealed] = useScrollReveal({ threshold: 0.2 });
  const [ctaRef, ctaRevealed] = useScrollReveal({ threshold: 0.2 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, projectsData, testimonialsData] = await Promise.all([
          getServices(),
          getProjects(null, true),
          getTestimonials(),
        ]);
        setServices(servicesData.slice(0, 4));
        setProjects(projectsData.slice(0, 3));
        setTestimonials(testimonialsData.slice(0, 3));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div data-testid="home-page" className="overflow-x-hidden">
      {/* Hero Section – strong contrast so it stays visible when scrolling */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center bg-secondary shadow-2xl" 
        data-testid="hero-section"
      >
        {/* Background Image + strong dark overlay so hero never washes out */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
            alt="Construction site"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/65 to-black/55" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent" />
          {/* Sharp bottom edge so hero reads as a clear block when scrolling */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="max-w-3xl">
            {/* Trust badges – minimal pills */}
            <div className={`flex flex-wrap gap-3 mb-8 reveal-up ${heroRevealed ? 'revealed' : ''}`}>
              {trustBadges.slice(0, 3).map((badge, i) => (
                <span 
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/20 border border-white/20 text-white font-body text-xs font-light tracking-wide backdrop-blur-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  {badge}
                </span>
              ))}
            </div>
            
            {/* Headline – thin, wide, two-line with shadow so it stays visible while scrolling */}
            <h1 
              className={`font-hero text-5xl sm:text-6xl lg:text-8xl text-white uppercase tracking-[0.02em] leading-[0.95] mb-6 reveal-up drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] ${heroRevealed ? 'revealed' : ''}`}
              style={{ transitionDelay: '100ms' }}
            >
              Building<br />
              <span className="text-primary drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">Excellence</span><br />
              Since 1999
            </h1>
            
            <p 
              className={`text-base sm:text-lg text-white/90 max-w-xl mb-10 leading-relaxed font-body font-light drop-shadow-[0_1px_8px_rgba(0,0,0,0.3)] reveal-up ${heroRevealed ? 'revealed' : ''}`}
              style={{ transitionDelay: '200ms' }}
            >
              We build more than just buildings—we build trust. With expert craftsmanship and a focus on quality, we deliver projects on time, every time.
            </p>
            
            {/* CTA – Get Consultation with circle-arrow (Build Dora style) */}
            <div 
              className={`flex flex-wrap items-center gap-6 reveal-up ${heroRevealed ? 'revealed' : ''}`}
              style={{ transitionDelay: '300ms' }}
            >
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-3 group"
                data-testid="hero-get-quote-btn"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <ArrowRight className="w-5 h-5" />
                </span>
                <span className="font-body text-lg font-medium text-white border-b-2 border-white/70 pb-0.5 group-hover:text-primary group-hover:border-primary transition-colors duration-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                  Get Consultation
                </span>
              </Link>
              <Link 
                to="/projects"
                className="font-body text-sm font-light text-white/90 hover:text-white transition-colors underline underline-offset-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
                data-testid="hero-view-projects-btn"
              >
                View Our Work
              </Link>
            </div>
            
            {/* Quick Contact */}
            <div 
              className={`mt-14 flex items-center gap-4 reveal-up ${heroRevealed ? 'revealed' : ''}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/70">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-xs text-white/50 uppercase tracking-wider">
                  Call Us Anytime
                </p>
                <a href="tel:+1234567890" className="text-white font-body font-light hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator – above the fade so it stays visible */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2 text-white/70">
            <span className="font-mono text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/70 to-transparent" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background border-y border-border" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-32 bg-background concrete-texture" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={servicesHeaderRef}
            className={`flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 reveal-up ${servicesHeaderRevealed ? 'revealed' : ''}`}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3 block">
                What We Do
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-secondary">
                Our Services
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl">
                Comprehensive construction solutions tailored to your unique needs, 
                delivered with excellence and attention to detail.
              </p>
            </div>
            <Link to="/services" className="mt-6 lg:mt-0">
              <Button 
                variant="ghost" 
                className="text-secondary hover:text-primary font-mono text-sm uppercase tracking-wider group p-0"
                data-testid="view-all-services-btn"
              >
                View All Services
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="h-80 bg-muted animate-pulse" />
              ))
            ) : (
              services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 lg:py-32 bg-muted" data-testid="projects-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={projectsHeaderRef}
            className={`flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 reveal-up ${projectsHeaderRevealed ? 'revealed' : ''}`}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3 block">
                Our Portfolio
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-secondary">
                Featured Projects
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl">
                Explore our portfolio of completed projects showcasing our commitment 
                to quality craftsmanship and innovative solutions.
              </p>
            </div>
            <Link to="/projects" className="mt-6 lg:mt-0">
              <Button 
                variant="ghost" 
                className="text-secondary hover:text-primary font-mono text-sm uppercase tracking-wider group p-0"
                data-testid="view-all-projects-btn"
              >
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <Card 
                  key={i} 
                  className={`${i === 0 ? 'lg:col-span-2 lg:row-span-2 min-h-[500px]' : 'h-80'} bg-muted animate-pulse`} 
                />
              ))
            ) : (
              projects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                  featured={index === 0}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 lg:py-32 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3 block">
                Why BuildCraft
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6">
                Built on Trust,<br />Delivered with Excellence
              </h2>
              <p className="text-white/70 text-lg mb-8">
                For over 25 years, we've been transforming visions into reality. Our commitment 
                to quality, safety, and client satisfaction sets us apart in the industry.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Experienced Team", desc: "50+ skilled professionals with decades of combined expertise" },
                  { title: "Quality Guaranteed", desc: "Premium materials and craftsmanship on every project" },
                  { title: "On-Time Delivery", desc: "Rigorous project management ensures timely completion" },
                  { title: "Transparent Pricing", desc: "No hidden costs - detailed estimates upfront" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm uppercase tracking-wide text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-white/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link to="/about">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white font-heading uppercase tracking-wider h-12 px-8"
                  >
                    Learn More About Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80"
                alt="Construction team"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary p-6 hidden sm:block">
                <div className="font-heading text-5xl font-bold text-white">25+</div>
                <div className="font-mono text-xs text-white/80 uppercase tracking-wider">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 lg:py-32 bg-background" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={testimonialsHeaderRef}
            className={`text-center mb-16 reveal-up ${testimonialsHeaderRevealed ? 'revealed' : ''}`}
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-3 block">
              Client Testimonials
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-secondary mb-4">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Hear from the clients we've had the 
              privilege of working with over the years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="h-64 bg-muted animate-pulse" />
              ))
            ) : (
              testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={testimonial.id} 
                  testimonial={testimonial} 
                  index={index}
                />
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/testimonials">
              <Button 
                variant="outline"
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-heading uppercase tracking-wider"
                data-testid="view-all-testimonials-btn"
              >
                Read More Reviews
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-24 lg:py-32 bg-primary relative overflow-hidden" 
        data-testid="cta-section"
      >
        <div className="absolute inset-0 steel-texture" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div 
            className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 reveal-up ${ctaRevealed ? 'revealed' : ''}`}
          >
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase">
                Ready to Start<br />Your Project?
              </h2>
              <p className="text-white/80 mt-4 text-lg">
                Get in touch with our team for a free consultation and detailed quote. 
                Let's build something extraordinary together.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-heading uppercase tracking-wider h-14 px-10"
                  data-testid="cta-contact-btn"
                >
                  Get Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="tel:+1234567890">
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-heading uppercase tracking-wider h-14 px-8"
                >
                  <Phone className="mr-2 w-4 h-4" />
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
