import { memo } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  ArrowUpRight,
  Shield,
  Award,
  CheckCircle
} from "lucide-react";

const footerLinks = {
  services: [
    { href: "/services/residential", label: "Residential" },
    { href: "/services/commercial", label: "Commercial" },
    { href: "/services/renovation", label: "Renovation" },
    { href: "/services/industrial", label: "Industrial" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/projects", label: "Our Projects" },
    { href: "/testimonials", label: "Client Reviews" },
    { href: "/contact", label: "Contact" },
  ],
};

const certifications = [
  { icon: Shield, label: "Licensed & Insured" },
  { icon: Award, label: "OSHA Certified" },
  { icon: CheckCircle, label: "BBB Accredited" },
];

export const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-secondary text-white"
      data-testid="footer"
    >
      {/* Certifications Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-white/70">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="font-mono text-xs uppercase tracking-wider">
                    {cert.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-11 h-11 bg-primary flex items-center justify-center">
                <span className="font-heading text-lg font-bold text-white">
                  BC
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg font-bold tracking-wide leading-none">
                  BUILDCRAFT
                </span>
                <span className="font-mono text-2xs uppercase tracking-[0.15em] text-white/50">
                  Construction Co.
                </span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Building excellence since 1999. We transform visions into reality 
              with precision, quality, and innovation that stands the test of time.
            </p>
            <div className="space-y-3">
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-white/60 hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Construction Ave<br />Building District, NY 10001</span>
              </a>
              <a 
                href="tel:+1234567890"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (234) 567-890</span>
              </a>
              <a 
                href="mailto:info@buildcraft.com"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@buildcraft.com</span>
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider mb-6 text-white">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider mb-6 text-white">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours Column */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider mb-6 text-white">
              Business Hours
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-white">Monday - Friday</p>
                    <p className="text-white/60">7:00 AM - 6:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-white">Saturday</p>
                    <p className="text-white/60">8:00 AM - 4:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-white">Sunday</p>
                    <p className="text-white/60">Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="mt-6 p-4 bg-white/5 border border-white/10">
              <p className="font-mono text-xs uppercase tracking-wider text-primary mb-1">
                24/7 Emergency
              </p>
              <a href="tel:+1234567899" className="text-white font-medium hover:text-primary transition-colors">
                +1 (234) 567-899
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40 font-mono">
              © {currentYear} BuildCraft Construction. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-white/40">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
