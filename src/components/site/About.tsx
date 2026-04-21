import { Briefcase, Users, Calendar, Scale, TrendingUp, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
  <section id="about" className="relative py-20 md:py-32 overflow-hidden">
    <div className="absolute top-1/2 left-0 w-96 h-96 -translate-y-1/2 bg-primary-glow/5 rounded-full blur-3xl" />
    <div className="container relative">
      <div className="max-w-3xl mb-16 animate-fade-in-up">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-primary-glow mb-4">— About Us</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mt-2 mb-6 leading-tight">
          Your trusted partner in <span className="text-gradient">industrial automation</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Established in <strong className="text-foreground">2020</strong>, Namokar Enterprises & Automation is a leading
          <strong className="text-foreground"> wholesale trader</strong> of Rotary Encoders, Incremental Encoders, Electric MCBs,
          SMPS, Sensors and other automation components. We deliver authentic products from globally recognised brands across India.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {facts.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className="group relative bg-card border border-border rounded-2xl p-6 hover-lift overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "backwards" }}
          >
            <div className="absolute inset-0 gradient-accent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <div className="relative">
              <div className="h-11 w-11 rounded-xl bg-primary/5 grid place-items-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-2">{label}</div>
              <div className="font-semibold text-sm">{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center animate-fade-in-up">
        <Button asChild size="lg" className="group shadow-elegant hover:shadow-glow transition-all duration-500">
          <a href="#contact">Contact Us <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" /></a>
        </Button>
      </div>
    </div>
  </section>
);
