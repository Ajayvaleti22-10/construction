import { useState, useEffect, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  ArrowRight, 
  Star,
  Send,
  Loader2,
  CheckCircle
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
import { useScrollReveal } from "../hooks/useAnimations";
import { getTestimonials } from "@/lib/staticData";
import { submitWeb3Form, isWeb3FormsConfigured } from "@/lib/web3forms";

const projectTypes = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "renovation", label: "Renovation" },
  { value: "industrial", label: "Industrial" },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
    content: "",
    rating: 5,
    project_type: "",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.content || !formData.rating) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isWeb3FormsConfigured()) {
      toast.error("Review form is not configured yet. Please add your Web3Forms access key.");
      return;
    }

    setSubmitting(true);
    try {
      const message = [
        `Rating: ${formData.rating} / 5`,
        `Name: ${formData.name}`,
        formData.company ? `Company: ${formData.company}` : "",
        formData.role ? `Role: ${formData.role}` : "",
        formData.project_type ? `Project Type: ${formData.project_type}` : "",
        "",
        "Review:",
        formData.content,
      ].filter(Boolean).join("\n");

      const result = await submitWeb3Form({
        subject: `New Testimonial / Review from ${formData.name}`,
        from_name: formData.name,
        email: "", // Web3Forms can work without reply-to if you use your own key
        message,
      });
      
      if (result.success) {
        toast.success("Thank you! Your review has been submitted for approval.");
        setFormData({
          name: "",
          company: "",
          role: "",
          content: "",
          rating: 5,
          project_type: "",
        });
      } else {
        toast.error(result.message || "Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="testimonials-page">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-secondary" data-testid="testimonials-hero">
        <div className="absolute inset-0 grid-lines opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="font-mono text-sm text-primary uppercase tracking-widest mb-4">
              Client Reviews
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-foreground uppercase leading-tight mb-6">
              What Our<br />
              <span className="text-primary">Clients Say</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Don't just take our word for it. Read what our satisfied clients have to say 
              about their experience working with BuildCraft.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24 bg-background" data-testid="testimonials-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-64 skeleton" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="font-heading text-2xl text-muted-foreground">No reviews yet</h2>
              <p className="text-muted-foreground mt-2">Be the first to leave a review!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card 
                  key={testimonial.id}
                  className="testimonial-card p-8 bg-card border border-border relative overflow-hidden hover:border-primary transition-colors"
                  data-testid={`testimonial-${testimonial.id}`}
                >
                  <div className="relative z-10">
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < testimonial.rating 
                              ? 'text-primary fill-primary' 
                              : 'text-muted'
                          }`} 
                        />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-foreground mb-6">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      {testimonial.image_url ? (
                        <img 
                          src={testimonial.image_url} 
                          alt={testimonial.name}
                          className="w-12 h-12 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
                          <span className="font-heading text-lg text-primary">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-heading text-sm uppercase">{testimonial.name}</div>
                        {(testimonial.role || testimonial.company) && (
                          <div className="font-mono text-xs text-muted-foreground">
                            {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                          </div>
                        )}
                        {testimonial.project_type && (
                          <div className="font-mono text-xs text-primary uppercase mt-1">
                            {testimonial.project_type} project
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submit Review Form */}
      <section className="py-24 bg-muted" data-testid="testimonials-form-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form Info */}
            <div>
              <div className="font-mono text-sm text-primary uppercase tracking-widest mb-4">
                Share Your Experience
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary mb-6">
                Write a Review
              </h2>
              <p className="text-muted-foreground mb-8">
                We value your feedback! If you've worked with BuildCraft, we'd love to hear 
                about your experience. Your review helps us improve and helps others make 
                informed decisions.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-foreground text-xs font-bold">1</span>
                  </div>
                  <div>
                    <div className="font-heading text-sm uppercase">Rate Your Experience</div>
                    <div className="text-muted-foreground text-sm">Select 1-5 stars</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-foreground text-xs font-bold">2</span>
                  </div>
                  <div>
                    <div className="font-heading text-sm uppercase">Share Your Story</div>
                    <div className="text-muted-foreground text-sm">Tell us about your project</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-foreground text-xs font-bold">3</span>
                  </div>
                  <div>
                    <div className="font-heading text-sm uppercase">Submit for Review</div>
                    <div className="text-muted-foreground text-sm">We'll publish after approval</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Form */}
            <Card className="p-8 bg-card border border-border">
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="review-form">
                {/* Rating */}
                <div>
                  <Label className="font-mono text-xs uppercase tracking-wider mb-3 block">
                    Your Rating *
                  </Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleRatingChange(rating)}
                        className="focus:outline-none"
                        data-testid={`rating-star-${rating}`}
                      >
                        <Star 
                          className={`w-8 h-8 transition-colors ${
                            rating <= formData.rating 
                              ? 'text-primary fill-primary' 
                              : 'text-muted hover:text-primary/50'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="form-input bg-transparent border-0 border-b-2 border-muted rounded-none px-0 focus:border-primary focus:ring-0"
                    required
                    data-testid="review-name-input"
                  />
                </div>

                {/* Company & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="company" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                      Company (Optional)
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="ABC Corp"
                      className="form-input bg-transparent border-0 border-b-2 border-muted rounded-none px-0 focus:border-primary focus:ring-0"
                      data-testid="review-company-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                      Role (Optional)
                    </Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="CEO"
                      className="form-input bg-transparent border-0 border-b-2 border-muted rounded-none px-0 focus:border-primary focus:ring-0"
                      data-testid="review-role-input"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <Label className="font-mono text-xs uppercase tracking-wider mb-2 block">
                    Project Type (Optional)
                  </Label>
                  <Select
                    value={formData.project_type}
                    onValueChange={(value) => handleSelectChange("project_type", value)}
                  >
                    <SelectTrigger 
                      className="rounded-none border-0 border-b-2 border-muted bg-transparent px-0 focus:border-primary focus:ring-0"
                      data-testid="review-project-type-select"
                    >
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Review Content */}
                <div>
                  <Label htmlFor="content" className="font-mono text-xs uppercase tracking-wider mb-2 block">
                    Your Review *
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Tell us about your experience working with BuildCraft..."
                    rows={5}
                    className="form-input bg-transparent border-2 border-muted rounded-none px-4 py-3 focus:border-primary focus:ring-0 resize-none"
                    required
                    data-testid="review-content-input"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary rounded-none uppercase tracking-wider font-heading h-14"
                  data-testid="submit-review-btn"
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Review
                      <Send className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary" data-testid="testimonials-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary-foreground uppercase">
                Ready to Join Our<br />Happy Clients?
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl">
                Let's discuss your project and create a success story together.
              </p>
            </div>
            <Link to="/contact">
              <Button 
                size="lg"
                className="btn-primary rounded-none uppercase tracking-wider font-heading h-14 px-10"
                data-testid="testimonials-cta-btn"
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
