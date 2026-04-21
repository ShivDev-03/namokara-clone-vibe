import { Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => (
  <footer className="relative bg-[hsl(var(--footer-bg))] text-[hsl(var(--footer-foreground))] overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px gradient-accent" />
    <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl" />

    <div className="container relative py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <img
            src="/pwr-logo.png"
            alt="PWR Power Solution logo"
            className="h-11 w-auto object-contain"
          />
          <div>
            <div className="font-display font-bold">PWR Power Solution</div>
          </div>
        </div>
        <p className="text-sm opacity-70 leading-relaxed">Manufacturer and wholesaler of Solid State Relays since 2021.</p>
      </div>

      <div>
        <h4 className="font-display font-semibold mb-5 text-primary-glow">Products</h4>
        <ul className="space-y-2.5 text-sm opacity-70">
          <li className="hover:opacity-100 hover:text-primary-glow transition-all cursor-pointer">Rotary Encoders</li>
          <li className="hover:opacity-100 hover:text-primary-glow transition-all cursor-pointer">Incremental Encoders</li>
          <li className="hover:opacity-100 hover:text-primary-glow transition-all cursor-pointer">Proximity & Photoelectric Sensors</li>
          <li className="hover:opacity-100 hover:text-primary-glow transition-all cursor-pointer">Meanwell SMPS</li>
          <li className="hover:opacity-100 hover:text-primary-glow transition-all cursor-pointer">Limit Switches</li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold mb-5 text-primary-glow">Company</h4>
        <ul className="space-y-2.5 text-sm opacity-70">
          <li><a href="#about" className="hover:opacity-100 hover:text-primary-glow transition-all">About Us</a></li>
          <li><a href="#products" className="hover:opacity-100 hover:text-primary-glow transition-all">Products</a></li>
          <li><a href="#contact" className="hover:opacity-100 hover:text-primary-glow transition-all">Contact</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold mb-5 text-primary-glow">Reach Us</h4>
        <ul className="space-y-3 text-sm opacity-70">
          <li className="flex gap-2.5"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary-glow" /> Vadodara, Gujarat — India</li>
          <li className="flex gap-2.5"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary-glow" /> +91-8140048117</li>
          <li className="flex gap-2.5"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary-glow" /> pwr.powersolutions@gmail.com</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 relative">
      <div className="container py-5 text-xs flex flex-wrap justify-between gap-2 opacity-60">
        <div>© {new Date().getFullYear()} PWR Power Solution. All rights reserved.</div>
        <div>GST: 07AFDPJ4894B1ZJ · IEC: AFDPJ4894B</div>
      </div>
    </div>
  </footer>
);
