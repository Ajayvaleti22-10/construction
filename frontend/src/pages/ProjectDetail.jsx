import { useState, useEffect, memo } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useScrollReveal } from "../hooks/useAnimations";
import { getProjectBySlug, getProjects } from "@/lib/staticData";
import { resolveImageUrl } from "@/lib/cloudinary";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getProjectBySlug(slug);
        setProject(projectData);
        if (projectData?.category) {
          const related = await getProjects(projectData.category, null);
          setRelatedProjects(related.filter((p) => p.slug !== slug).slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const nextImage = () => {
    if (project && project.images.length > 1) {
      setCurrentImage((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project && project.images.length > 1) {
      setCurrentImage((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96 skeleton" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-32 bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl mb-4">Project Not Found</h1>
          <Link to="/projects">
            <Button variant="outline" className="rounded-none">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="project-detail-page">
      {/* Hero Section with Image Gallery */}
      <section className="relative pt-20" data-testid="project-detail-hero">
        <div className="relative h-[70vh] overflow-hidden bg-secondary">
          <img 
            src={resolveImageUrl(project.images?.[currentImage], { w: 1200 })} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/30 to-transparent" />
          
          {/* Image Navigation */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="prev-image-btn"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="next-image-btn"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
              
              {/* Image indicators */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
                {project.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 transition-colors ${
                      index === currentImage ? 'bg-primary' : 'bg-white/50'
                    }`}
                    data-testid={`image-indicator-${index}`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Project Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <Link 
                to="/projects"
                className="inline-flex items-center gap-2 text-white/70 hover:text-primary transition-colors mb-6 font-mono text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Link>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs text-primary uppercase tracking-widest bg-primary/20 px-3 py-1">
                  {project.category}
                </span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white uppercase">
                {project.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-background" data-testid="project-detail-info">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="font-mono text-sm text-primary uppercase tracking-widest mb-4">
                Project Overview
              </div>
              <h2 className="font-heading text-3xl font-bold text-secondary mb-6">
                About This Project
              </h2>
              <div className="prose prose-lg text-muted-foreground">
                <p>{project.description}</p>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <Card className="p-8 bg-muted border border-border">
                <h3 className="font-heading text-xl uppercase mb-6">Project Details</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-mono text-xs text-muted-foreground uppercase">Client</div>
                      <div className="font-medium">{project.client}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-mono text-xs text-muted-foreground uppercase">Location</div>
                      <div className="font-medium">{project.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-mono text-xs text-muted-foreground uppercase">Year Completed</div>
                      <div className="font-medium">{project.year}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-border">
                  <Link to="/contact">
                    <Button 
                      className="w-full btn-primary rounded-none uppercase tracking-wider font-heading"
                      data-testid="project-detail-quote-btn"
                    >
                      Start Similar Project
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Image Thumbnails */}
      {project.images.length > 1 && (
        <section className="py-8 bg-muted border-y border-border" data-testid="project-detail-gallery">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {project.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`flex-shrink-0 w-32 h-24 overflow-hidden border-2 transition-colors ${
                    index === currentImage ? 'border-primary' : 'border-transparent'
                  }`}
                  data-testid={`thumbnail-${index}`}
                >
                  <img 
                    src={resolveImageUrl(image, { w: 200 })} 
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-24 bg-background" data-testid="project-detail-related">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
              <div>
                <div className="font-mono text-sm text-primary uppercase tracking-widest mb-2">
                  More Projects
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
              {relatedProjects.map((relatedProject) => (
                <Link 
                  key={relatedProject.id} 
                  to={`/projects/${relatedProject.slug}`}
                  data-testid={`related-project-${relatedProject.slug}`}
                >
                  <Card className="project-card group h-80 relative overflow-hidden border-0">
                    <img 
                      src={resolveImageUrl(relatedProject.images?.[0], { w: 800 })} 
                      alt={relatedProject.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <div className="font-mono text-xs text-primary uppercase tracking-widest mb-2">
                        {relatedProject.category}
                      </div>
                      <h3 className="font-heading text-xl text-white uppercase">
                        {relatedProject.title}
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
      <section className="py-24 bg-secondary" data-testid="project-detail-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary-foreground uppercase">
                Inspired by This Project?
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl">
                Contact us to discuss how we can create something similar for your needs.
              </p>
            </div>
            <Link to="/contact">
              <Button 
                size="lg"
                className="btn-primary rounded-none uppercase tracking-wider font-heading h-14 px-10"
                data-testid="project-detail-cta-btn"
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
