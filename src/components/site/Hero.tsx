import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, Factory, Truck, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden gradient-hero text-white">
      {/* Animated glow orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary-glow/20 blur-3xl animate-float" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
      }} />

      <div className="container relative py-20 md:py-28 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          {/* <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium mb-6 animate-scale-in">
            <Sparkles className="h-3.5 w-3.5 text-primary-glow" /> Verified Wholesale Trader · Since 2020
          </span> */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Industrial <span className="text-gradient">SSR</span>, For Automation
          </h1>
          <p className="text-base md:text-lg text-white/70 mb-10 max-w-xl leading-relaxed">
            Authorized manufacturer and wholesaler of (PWR Power Solution) SSRs - serving industries across India.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-primary-glow hover:bg-primary-glow/90 text-primary-foreground shadow-glow hover:scale-105 transition-all duration-300">
              <a href="#products">Explore Products <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/5 backdrop-blur border-white/30 text-white hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-300">
              <a href="#contact">Get a Quote</a>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
            {/*<Stat value="600+" label="SKUs" delay="0.2s" />*/}
            {/*<Stat value="1.5–5 Cr" label="Turnover" delay="0.35s" />*/}
            <Stat value="100%" label="Genuine" delay="0.5s" />
          </div>
        </div>

        <div className="relative animate-slide-in-right">
          <div className="absolute inset-0 gradient-glow blur-2xl" />
          {/*<div className="relative grid grid-cols-2 gap-4">*/}
            {/*<Card icon={<Factory className="h-6 w-6" />} title="Trusted Brands" desc="Tamagawa · Autonics · Omron" delay="0.1s" />*/}
            {/*<Card icon={<Truck className="h-6 w-6" />} title="Pan-India Shipping" desc="Fast, insured delivery" delay="0.25s" />*/}
            {/*<Card icon={<BadgeCheck className="h-6 w-6" />} title="GST Verified" desc="07AFDPJ4894B1ZJ" delay="0.4s" />*/}
            {/*<Card icon={<ArrowRight className="h-6 w-6" />} title="Quick Quotes" desc="Reply within hours" delay="0.55s" />*/}
          {/*</div>*/}
        </div>
      </div>
    </section>
  );
};

const Stat = ({ value, label, delay }: { value: string; label: string; delay: string }) => (
  <div className="animate-fade-in-up" style={{ animationDelay: delay, animationFillMode: "backwards" }}>
    <div className="font-display text-3xl md:text-4xl font-bold text-gradient">{value}</div>
    <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">{label}</div>
  </div>
);

const Card = ({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: string }) => (
  <div
    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-primary-glow/50 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
    style={{ animationDelay: delay, animationFillMode: "backwards" }}
  >
    <div className="h-11 w-11 rounded-xl gradient-accent grid place-items-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 text-primary-foreground">
      {icon}
    </div>
    <div className="font-semibold mb-1 text-white">{title}</div>
    <div className="text-xs text-white/60">{desc}</div>
  </div>
);
