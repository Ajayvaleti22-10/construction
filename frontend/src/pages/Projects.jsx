import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useScrollReveal } from "../hooks/useAnimations";
import { getProjects } from "@/lib/staticData";
import { resolveImageUrl } from "@/lib/cloudinary";

const categories = [
  { value: "", label: "All Projects" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "renovation", label: "Renovation" },
  { value: "industrial", label: "Industrial" },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects(activeCategory || null, null);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [activeCategory]);

  return (
    <div data-testid="projects-page">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-secondary" data-testid="projects-hero">
        <div className="absolute inset-0 grid-lines opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="font-mono text-sm text-primary uppercase tracking-widest mb-4">
              Our Portfolio
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-foreground uppercase leading-tight mb-6">
              Projects That<br />
              <span className="text-primary">Define Excellence</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore our portfolio of completed projects, showcasing our commitment to 
              quality craftsmanship and innovative construction solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-background border-b border-border" data-testid="projects-filter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Desktop Filter */}
            <div className="hidden sm:flex items-center gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={activeCategory === cat.value ? "default" : "ghost"}
                  className={`rounded-none uppercase tracking-wider font-mono text-xs ${
                    activeCategory === cat.value 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setActiveCategory(cat.value)}
                  data-testid={`filter-${cat.value || 'all'}`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Mobile Filter */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-none w-full justify-between"
                    data-testid="mobile-filter-trigger"
                  >
                    <span className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      {categories.find(c => c.value === activeCategory)?.label || 'All Projects'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat.value}
                      onClick={() => setActiveCategory(cat.value)}
                      className={activeCategory === cat.value ? "bg-muted" : ""}
                    >
                      {cat.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="font-mono text-sm text-muted-foreground">
              {projects.length} projects
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid - Bento Layout */}
      <section className="py-16 bg-background" data-testid="projects-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className={`${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''} h-80 skeleton`} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="font-heading text-2xl text-muted-foreground">No projects found</h2>
              <p className="text-muted-foreground mt-2">Try selecting a different category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Link 
                  key={project.id} 
                  to={`/projects/${project.slug}`}
                  className={index === 0 && projects.length > 2 ? 'lg:col-span-2 lg:row-span-2' : ''}
                  data-testid={`project-card-${project.slug}`}
                >
                  <Card className={`project-card group relative overflow-hidden border-0 ${
                    index === 0 && projects.length > 2 ? 'h-full min-h-[500px]' : 'h-80'
                  }`}>
                    <img 
                      src={resolveImageUrl(project.images?.[0], { w: 800 })} 
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-xs text-primary uppercase tracking-widest bg-primary/20 px-2 py-1">
                          {project.category}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {project.year}
                        </span>
                      </div>
                      <h3 className={`font-heading text-white uppercase ${
                        index === 0 && projects.length > 2 ? 'text-2xl sm:text-3xl' : 'text-xl'
                      }`}>
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-sm mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground font-mono">
                        <span>{project.location}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary" data-testid="projects-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary-foreground uppercase">
                Have a Project in Mind?
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl">
                Let's discuss how we can bring your vision to life with the same quality 
                and attention to detail you see in our portfolio.
              </p>
            </div>
            <Link to="/contact">
              <Button 
                size="lg"
                className="btn-primary rounded-none uppercase tracking-wider font-heading h-14 px-10"
                data-testid="projects-cta-btn"
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
