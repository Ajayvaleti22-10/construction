import { useState, useEffect, memo } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowLeft,
  Home as HomeIcon, 
  Building2, 
  Hammer, 
  Factory,
  CheckCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useScrollReveal } from "../hooks/useAnimations";
import { getServiceBySlug, getProjects } from "@/lib/staticData";
import { resolveImageUrl } from "@/lib/cloudinary";

const iconMap = {
  Home: HomeIcon,
  Building2: Building2,
  Hammer: Hammer,
  Factory: Factory,
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceData, projectsData] = await Promise.all([
          getServiceBySlug(slug),
          getProjects(slug, null),
        ]);
        setService(serviceData);
        setRelatedProjects((projectsData || []).filter((p) => p.slug !== slug).slice(0, 3));
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96 skeleton" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen pt-32 bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl mb-4">Service Not Found</h1>
          <Link to="/services">
            <Button variant="outline" className="rounded-none">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || HomeIcon;

  return (
    <div data-testid="service-detail-page">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-secondary" data-testid="service-detail-hero">
        <div className="absolute inset-0 grid-lines opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            to="/services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 bg-primary/20 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-foreground uppercase leading-tight mb-6">
                {service.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                {service.short_description}
              </p>
              <Link to="/contact">
                <Button 
                  className="btn-primary rounded-none uppercase tracking-wider font-heading"
                  data-testid="service-detail-quote-btn"
                >
                  Request Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src={resolveImageUrl(service.image_url, { w: 800 })}
                alt={service.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-24 bg-background" data-testid="service-detail-description">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="font-mono text-sm text-primary uppercase tracking-widest mb-4">
                About This Service
              </div>
              <h2 className="font-heading text-3xl font-bold text-secondary mb-6">
                Service Overview
              </h2>
              <div className="prose prose-lg text-muted-foreground">
                <p>{service.description}</p>
              </div>
            </div>
            
            <div>
              <Card className="p-8 bg-muted border border-border">
                <h3 className="font-heading text-xl uppercase mb-6">Key Features</h3>
                <ul className="space-y-4">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-24 bg-muted" data-testid="service-detail-projects">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
              <div>
                <div className="font-mono text-sm text-primary uppercase tracking-widest mb-2">
                  Our Work
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary">
                  Related Projects
                </h2>
              </div>
              <Link to="/projects" className="mt-4 lg:mt-0">
                <Button 
                  variant="ghost" 
                  className="rounded-none uppercase tracking-wider font-mono text-sm group"
                >
                  View All Projects
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((project) => (
                <Link 
                  key={project.id} 
                  to={`/projects/${project.slug}`}
                  data-testid={`related-project-${project.slug}`}
                >
                  <Card className="project-card group h-80 relative overflow-hidden border-0">
                    <img 
                      src={resolveImageUrl(project.images?.[0], { w: 800 })} 
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <div className="font-mono text-xs text-primary uppercase tracking-widest mb-2">
                        {project.category}
                      </div>
                      <h3 className="font-heading text-xl text-white uppercase">
                        {project.title}
                      </h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-secondary" data-testid="service-detail-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary-foreground uppercase">
                Interested in {service.title}?
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl">
                Let's discuss your project and create something exceptional together.
              </p>
            </div>
            <Link to="/contact">
              <Button 
                size="lg"
                className="btn-primary rounded-none uppercase tracking-wider font-heading h-14 px-10"
                data-testid="service-detail-cta-btn"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
