import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Award, 
  Users, 
  Calendar,
  Target,
  Shield,
  Lightbulb,
  CheckCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useScrollReveal } from "../hooks/useAnimations";
import { getTeam, getCompanyStats } from "@/lib/staticData";
import { resolveImageUrl } from "@/lib/cloudinary";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We deliver nothing less than exceptional quality in every project we undertake."
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "Honest communication and transparent practices are the foundation of our business."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We embrace new technologies and methods to build better, smarter structures."
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Working closely with clients ensures their vision becomes our mission."
  }
];

const milestones = [
  { year: 1999, title: "Founded", description: "BuildCraft established with a vision for quality construction" },
  { year: 2005, title: "First Major Project", description: "Completed our first commercial high-rise development" },
  { year: 2012, title: "Regional Expansion", description: "Expanded operations to cover the entire tri-state area" },
  { year: 2018, title: "Green Building Initiative", description: "Launched sustainable construction program" },
  { year: 2024, title: "250+ Projects", description: "Reached milestone of 250 completed projects" },
];

export default function About() {
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, statsData] = await Promise.all([
          getTeam(),
          getCompanyStats(),
        ]);
        setTeam(teamData);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div data-testid="about-page">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-secondary" data-testid="about-hero">
        <div className="absolute inset-0 grid-lines opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="font-mono text-sm text-primary uppercase tracking-widest mb-4">
                About Us
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-foreground uppercase leading-tight mb-6">
                Building Dreams<br />
                <span className="text-primary">Since 1999</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                For over 25 years, BuildCraft has been transforming visions into reality. 
                Our commitment to quality, innovation, and client satisfaction has made us 
                a trusted name in the construction industry.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact">
                  <Button 
                    className="btn-primary rounded-none uppercase tracking-wider font-heading"
                    data-testid="about-contact-btn"
                  >
                    Get In Touch
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button 
                    variant="outline"
                    className="rounded-none uppercase tracking-wider font-heading border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary"
                  >
                    View Our Work
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1489515229412-1f3a8f08dc34?w=800"
                alt="Team reviewing blueprints"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary p-6">
                <div className="font-heading text-5xl font-bold text-primary-foreground">25+</div>
                <div className="font-mono text-sm text-primary-foreground/80 uppercase">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background border-y border-border" data-testid="about-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="text-center h-20 bg-muted animate-pulse" />
              ))
            ) : stats ? (
              <>
                <div className="text-center">
                  <div className="font-heading text-4xl sm:text-5xl font-bold text-primary">{stats.projects_completed}+</div>
                  <div className="font-mono text-sm text-muted-foreground uppercase mt-2">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-4xl sm:text-5xl font-bold text-primary">{stats.years_experience}+</div>
                  <div className="font-mono text-sm text-muted-foreground uppercase mt-2">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-4xl sm:text-5xl font-bold text-primary">{stats.team_members}+</div>
                  <div className="font-mono text-sm text-muted-foreground uppercase mt-2">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-4xl sm:text-5xl font-bold text-primary">{stats.awards_won}</div>
                  <div className="font-mono text-sm text-muted-foreground uppercase mt-2">Awards Won</div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-background" data-testid="about-story">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="font-mono text-sm text-primary uppercase tracking-widest mb-4">
                Our Story
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary mb-6">
                A Legacy of Building Excellence
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  BuildCraft was founded in 1999 by Michael Anderson, a third-generation builder 
                  with a vision to create a construction company that prioritized quality above all else.
                </p>
                <p>
                  What started as a small residential construction firm has grown into a full-service 
                  construction company, handling projects ranging from custom homes to commercial 
                  high-rises and industrial facilities.
                </p>
                <p>
                  Our success is built on a simple principle: treat every project as if we're building 
                  it for ourselves. This philosophy has earned us the trust of hundreds of clients 
                  and numerous industry awards.
                </p>
              </div>
            </div>
            <div>
              <div className="font-mono text-sm text-primary uppercase tracking-widest mb-4">
                Our Mission
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary mb-6">
                Building Tomorrow's Landmarks Today
              </h2>
              <div className="space-y-4 text-muted-foreground mb-8">
                <p>
                  We are committed to delivering exceptional construction services that exceed 
                  expectations while maintaining the highest standards of safety, sustainability, 
                  and craftsmanship.
                </p>
                <p>
                  Our mission is to transform every client's vision into a reality that stands 
                  the test of time, creating structures that inspire and endure for generations.
                </p>
              </div>
              <ul className="space-y-3">
                {['Client-Focused Approach', 'Sustainable Practices', 'Safety First Culture', 'Continuous Innovation'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted" data-testid="about-values">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="font-mono text-sm text-primary uppercase tracking-widest mb-2">
              What We Stand For
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={index}
                  className="p-8 bg-card border border-border hover:border-primary transition-colors"
                  data-testid={`value-card-${index}`}
                >
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl uppercase mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-background" data-testid="about-timeline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="font-mono text-sm text-primary uppercase tracking-widest mb-2">
              Our Journey
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">
              Key Milestones
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-border hidden lg:block" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                  }`}
                  data-testid={`milestone-${milestone.year}`}
                >
                  <div className="flex-1 text-center lg:text-left">
                    <Card className={`p-6 bg-card border border-border inline-block ${
                      index % 2 === 0 ? 'lg:mr-auto' : 'lg:ml-auto'
                    }`}>
                      <div className="font-mono text-sm text-primary uppercase tracking-widest mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="font-heading text-xl uppercase mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground text-sm">{milestone.description}</p>
                    </Card>
                  </div>
                  <div className="w-12 h-12 bg-primary flex items-center justify-center z-10">
                    <Calendar className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-muted" data-testid="about-team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="font-mono text-sm text-primary uppercase tracking-widest mb-2">
              Meet The Team
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">
              Leadership Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="h-96 skeleton" />
              ))
            ) : (
              team.map((member) => (
                <Card 
                  key={member.id}
                  className="group overflow-hidden bg-card border border-border hover:border-primary transition-colors"
                  data-testid={`team-member-${member.id}`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={resolveImageUrl(member.image_url, { w: 400 })} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-lg uppercase">{member.name}</h3>
                    <div className="font-mono text-xs text-primary uppercase tracking-wider mb-3">
                      {member.role}
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-3">{member.bio}</p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary" data-testid="about-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary-foreground uppercase">
                Ready to Build Together?
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl">
                Let's discuss your project and how our team can bring your vision to life.
              </p>
            </div>
            <Link to="/contact">
              <Button 
                size="lg"
                className="btn-primary rounded-none uppercase tracking-wider font-heading h-14 px-10"
                data-testid="about-cta-btn"
              >
                Start a Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
