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
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-border/50" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            data-testid="logo-link"
          >
            <div className="w-11 h-11 bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
              <span className="font-heading text-lg font-bold text-white">
                BC
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold tracking-wide text-secondary leading-none">
                BUILDCRAFT
              </span>
              <span className="font-mono text-2xs uppercase tracking-[0.15em] text-muted-foreground">
                Construction Co.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 font-mono text-sm uppercase tracking-wider transition-colors duration-200 ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-secondary/80 hover:text-secondary"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
                {location.pathname === link.href && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Section - Desktop */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="tel:+1234567890"
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
              data-testid="phone-link"
            >
              <Phone className="w-4 h-4" />
              <span className="font-mono text-sm">(234) 567-890</span>
            </a>
            <Link to="/contact">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white font-heading uppercase tracking-wider h-11 px-6"
                data-testid="get-quote-btn"
              >
                Get Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
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
