import { Briefcase, Users, Calendar, Scale, TrendingUp, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const facts = [
  { icon: Briefcase, label: "Nature of Business", value: "Trader - Wholesaler/Distributor" },
  { icon: Users, label: "Employees", value: "Up to 10 People" },
  { icon: Calendar, label: "GST Registration", value: "09-12-2022" },
  { icon: Scale, label: "Legal Status", value: "Proprietorship" },
  { icon: TrendingUp, label: "Annual Turnover", value: "₹ 1.5 - 5 Cr" },
  { icon: Globe, label: "Import Export Code", value: "AFDPJ4894B" },
  { icon: FileText, label: "GST No.", value: "07AFDPJ4894B1ZJ" },
];

export const About = () => (
  <section id="about" className="py-16 md:py-24 bg-secondary/40">
    <div className="container">
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">About Us</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Your trusted partner in industrial automation</h2>
        <p className="text-muted-foreground leading-relaxed">
          Established in <strong className="text-foreground">2020</strong>, Namokar Enterprises & Automation is a leading
          <strong className="text-foreground"> wholesale trader</strong> of Rotary Encoders, Incremental Encoders, Electric MCBs,
          SMPS, Sensors and other automation components. We deliver authentic products from globally recognised brands to clients across India.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/40 transition">
            <Icon className="h-6 w-6 text-primary mb-3" />
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
            <div className="font-semibold text-sm">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button asChild size="lg"><a href="#contact">Contact Us →</a></Button>
      </div>
    </div>
  </section>
);
