import { Mail, Phone, MapPin, Menu, X, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Contact Us", href: "#contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-background border-b border-border transition-shadow duration-300 ${scrolled ? "shadow-card" : ""}`}>
      {/* Top bar */}
      <div className="gradient-hero text-white text-xs">
        <div className="container flex flex-wrap items-center justify-between gap-2 py-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary-glow" /> Vadodara, Gujarat — India</span>
            {/* <span className="hidden sm:flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary-glow" /> GST: 07AFDPJ4894B1ZJ</span> */}
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+917942835440" className="flex items-center gap-1.5 hover:text-primary-glow transition-colors"><Phone className="h-3.5 w-3.5" /> +91-8140048117</a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container flex items-center justify-between py-4">
        <a href="#home" className="flex items-center gap-3 group">
          <img
            src="/pwr-logo.png"
            alt="PWR Power Solution logo"
            className="h-12 w-auto object-contain"
          />
          <div className="leading-tight">
            <div className="font-display text-lg sm:text-xl font-bold text-foreground">PWR Power Solution</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="story-link text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="tel:+917942835440"><Phone className="h-4 w-4 mr-1" /> Call</a>
          </Button>
          <Button asChild size="sm" className="shadow-elegant hover:shadow-glow transition-all duration-300">
            <a href="#contact"><Mail className="h-4 w-4 mr-1" /> Send Email</a>
          </Button>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                {l.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="flex-1"><a href="tel:+917942835440">Call</a></Button>
              <Button asChild size="sm" className="flex-1"><a href="#contact">Email</a></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
