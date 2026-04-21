import { Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => (
  <footer className="bg-[hsl(var(--footer-bg))] text-[hsl(var(--footer-foreground))]">
    <div className="container py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-md bg-primary grid place-items-center font-black">NE</div>
          <div>
            <div className="font-bold">Namokar Enterprises</div>
            <div className="text-xs opacity-70">& Automation</div>
          </div>
        </div>
        <p className="text-sm opacity-80">Wholesale trader of industrial encoders, sensors, SMPS and automation components since 2020.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Products</h4>
        <ul className="space-y-2 text-sm opacity-80">
          <li>Rotary Encoders</li>
          <li>Incremental Encoders</li>
          <li>Proximity & Photoelectric Sensors</li>
          <li>Meanwell SMPS</li>
          <li>Limit Switches</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Company</h4>
        <ul className="space-y-2 text-sm opacity-80">
          <li><a href="#about" className="hover:text-primary-foreground">About Us</a></li>
          <li><a href="#products" className="hover:text-primary-foreground">Products</a></li>
          <li><a href="#contact" className="hover:text-primary-foreground">Contact</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-4">Reach Us</h4>
        <ul className="space-y-3 text-sm opacity-80">
          <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> Shakarpur, New Delhi, Delhi</li>
          <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /> +91-79428 35440</li>
          <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /> enquiry@namokarenterprises.co.in</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="container py-5 text-xs flex flex-wrap justify-between gap-2 opacity-70">
        <div>© {new Date().getFullYear()} Namokar Enterprises & Automation. All rights reserved.</div>
        <div>GST: 07AFDPJ4894B1ZJ · IEC: AFDPJ4894B</div>
      </div>
    </div>
  </footer>
);
