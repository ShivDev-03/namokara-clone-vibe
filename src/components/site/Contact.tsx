import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Contact = () => {
  const [loading, setLoading] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Thank you! Your enquiry has been received.", {
        description: "We will get back shortly for better understanding of your requirement.",
      });
    }, 800);
  };

  return (
    <section id="contact" className="relative py-20 md:py-32 overflow-hidden bg-secondary/30">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-glow/5 rounded-full blur-3xl" />
      <div className="container relative grid lg:grid-cols-2 gap-12">
        <div className="animate-fade-in-up">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-primary-glow mb-4">— Contact Us</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-2 mb-6 leading-tight">
            Share your <span className="text-gradient">requirement</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Tell us what you need — our team will respond with pricing and availability shortly.
          </p>

          <div className="space-y-3">
            <Info icon={<MapPin className="h-5 w-5" />} title="Address" value="Vadodara, Gujarat — India" />
            <Info icon={<Phone className="h-5 w-5" />} title="Call Us" value="+91-8140048117" href="tel:+91-8140048117" />
            <Info icon={<Mail className="h-5 w-5" />} title="Email" value="pwr.powersolutions@gmail.com" href="mailto:pwr.powersolutions@gmail.com" />
          </div>

          <div className="mt-8 p-6 bg-card border border-border rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 gradient-accent opacity-5" />
            <div className="relative">
              <div className="text-2xl font-display font-bold text-gradient mb-1">100%</div>
              <div className="text-sm font-semibold mb-1">Response Rate</div>
              <div className="text-xs text-muted-foreground">Fast replies during business hours.</div>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-elegant space-y-4 animate-slide-in-right">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <select id="title" className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary-glow focus:outline-none transition-all">
                <option>Mr.</option><option>Ms.</option><option>Mrs.</option><option>Dr.</option>
              </select>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" required placeholder="Your full name" className="mt-1.5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@example.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Mobile Number</Label>
              <Input id="phone" type="tel" required placeholder="+91 ..." className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Company name (optional)" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="msg">Description</Label>
            <Textarea id="msg" required placeholder="Please describe your requirement..." className="mt-1.5 min-h-32" />
          </div>
          <Button type="submit" size="lg" className="w-full group shadow-elegant hover:shadow-glow transition-all duration-500" disabled={loading}>
            {loading ? "Sending..." : <>Send Enquiry <Send className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By submitting you agree to be contacted regarding your enquiry.
          </p>
        </form>
      </div>
    </section>
  );
};

const Info = ({ icon, title, value, href }: { icon: React.ReactNode; title: string; value: string; href?: string }) => {
  const Wrap: any = href ? "a" : "div";
  return (
    <Wrap href={href} className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary-glow/50 hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="h-11 w-11 rounded-xl bg-primary/5 text-primary grid place-items-center shrink-0 group-hover:gradient-accent group-hover:text-primary-foreground transition-all duration-500">
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">{title}</div>
        <div className="font-medium mt-0.5">{value}</div>
      </div>
    </Wrap>
  );
};
