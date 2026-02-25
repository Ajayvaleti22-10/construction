import { useState, useEffect, memo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Phone, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/testimonials", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export const Navigation = memo(function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Optimized scroll handler with passive listener
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <header
      data-testid="navigation-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/98 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-transparent"
      } ${!isScrolled ? "text-white" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo – stacked wordmark when transparent, compact when scrolled */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            data-testid="logo-link"
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-sm transition-colors duration-300 ${
              isScrolled ? "bg-primary" : "bg-white/10 border border-white/20"
            }`}>
              <span className={`font-hero text-xl tracking-tight ${isScrolled ? "text-white" : "text-white"}`}>
                BC
              </span>
            </div>
            <div className="flex flex-col">
              <span className={`font-hero text-xl tracking-widest leading-none ${
                isScrolled ? "text-foreground" : "text-white"
              }`}>
                BUILDCRAFT
              </span>
              <span className={`font-mono text-2xs uppercase tracking-[0.2em] ${
                isScrolled ? "text-muted-foreground" : "text-white/60"
              }`}>
                Construction
              </span>
            </div>
          </Link>

          {/* Desktop Navigation – thin, spaced (Architona style) */}
          <nav className="hidden lg:flex items-center gap-6" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative py-2 font-body text-sm font-light tracking-wide transition-colors duration-200 ${
                  location.pathname === link.href
                    ? isScrolled ? "text-primary" : "text-primary"
                    : isScrolled ? "text-foreground/80 hover:text-foreground" : "text-white/85 hover:text-white"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label.toUpperCase()}
                {location.pathname === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA – pill Contact button (Architona style) */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="tel:+1234567890"
              className={`flex items-center gap-2 transition-colors ${
                isScrolled ? "text-foreground/70 hover:text-primary" : "text-white/80 hover:text-white"
              }`}
              data-testid="phone-link"
            >
              <Phone className="w-4 h-4" />
              <span className="font-body text-sm font-light">(234) 567-890</span>
            </a>
            <Link to="/contact" data-testid="get-quote-btn">
              <span className={`inline-flex items-center justify-center rounded-full border-2 font-body text-sm font-medium tracking-wide transition-all duration-300 ${
                isScrolled
                  ? "h-10 px-6 border-primary bg-primary text-white hover:bg-primary/90"
                  : "h-10 px-6 border-white/40 bg-white/10 text-white hover:bg-white hover:text-secondary hover:border-white"
              }`}>
                CONTACT
              </span>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-secondary"
                data-testid="mobile-menu-trigger"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-full sm:w-80 bg-secondary border-l-0 p-0"
              data-testid="mobile-menu-content"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Nav Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center">
                      <span className="font-heading text-lg font-bold text-white">BC</span>
                    </div>
                    <span className="font-heading text-lg font-bold text-white">BUILDCRAFT</span>
                  </div>
                </div>
                
                {/* Mobile Nav Links */}
                <nav className="flex-1 py-8 px-6">
                  <div className="space-y-1">
                    {navLinks.map((link, index) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={closeMenu}
                        className={`block py-3 px-4 font-heading text-xl uppercase tracking-wide transition-colors ${
                          location.pathname === link.href
                            ? "text-primary bg-white/5"
                            : "text-white/80 hover:text-white hover:bg-white/5"
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>
                
                {/* Mobile Nav Footer */}
                <div className="p-6 border-t border-white/10 space-y-4">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-mono">+1 (234) 567-890</span>
                  </a>
                  <Link to="/contact" onClick={closeMenu} className="block">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-white font-heading uppercase tracking-wider h-12"
                      data-testid="mobile-get-quote-btn"
                    >
                      Get Free Quote
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
});

export default Navigation;
