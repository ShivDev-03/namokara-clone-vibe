import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, Factory, Truck } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(var(--primary-dark))] text-primary-foreground">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "24px 24px"
      }} />
      <div className="container relative py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <BadgeCheck className="h-4 w-4" /> Verified Wholesale Trader · Since 2020
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
            Industrial Encoders, Sensors & Automation Components
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/85 mb-8 max-w-xl">
            Authorized wholesale distributor of Tamagawa, Autonics, Heidenhain, Omron, Kübler, Meanwell and more — serving industries across India.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <a href="#products">Explore Products <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
              <a href="#contact">Get a Quote</a>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            <Stat value="600+" label="SKUs" />
            <Stat value="1.5–5 Cr" label="Turnover" />
            <Stat value="100%" label="Genuine" />
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <Card icon={<Factory className="h-6 w-6" />} title="Trusted Brands" desc="Tamagawa · Autonics · Omron · Heidenhain" />
            <Card icon={<Truck className="h-6 w-6" />} title="Pan-India Shipping" desc="Fast, insured delivery nationwide" />
            <Card icon={<BadgeCheck className="h-6 w-6" />} title="GST Verified" desc="07AFDPJ4894B1ZJ" />
            <Card icon={<ArrowRight className="h-6 w-6" />} title="Quick Quotes" desc="Reply within hours · 85% rate" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div>
    <div className="text-2xl md:text-3xl font-bold">{value}</div>
    <div className="text-xs uppercase tracking-wider text-primary-foreground/70">{label}</div>
  </div>
);

const Card = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5 hover:bg-white/15 transition">
    <div className="h-10 w-10 rounded-lg bg-white/20 grid place-items-center mb-3">{icon}</div>
    <div className="font-semibold mb-1">{title}</div>
    <div className="text-xs text-primary-foreground/80">{desc}</div>
  </div>
);
