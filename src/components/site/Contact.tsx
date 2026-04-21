import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin } from "lucide-react";
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
    <section id="contact" className="py-16 md:py-24 bg-secondary/40">
      <div className="container grid lg:grid-cols-2 gap-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Contact Us</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Share your requirement</h2>
          <p className="text-muted-foreground mb-8">
            Tell us what you need — our team will respond with pricing and availability shortly.
          </p>

          <div className="space-y-4">
            <Info icon={<MapPin className="h-5 w-5" />} title="Address" value="Shakarpur, New Delhi, Delhi — India" />
            <Info icon={<Phone className="h-5 w-5" />} title="Call Us" value="+91-79428 35440" href="tel:+917942835440" />
            <Info icon={<Mail className="h-5 w-5" />} title="Email" value="enquiry@namokarenterprises.co.in" href="mailto:enquiry@namokarenterprises.co.in" />
          </div>

          <div className="mt-8 p-5 bg-card border border-border rounded-xl">
            <div className="text-sm font-semibold mb-1">85% Response Rate</div>
            <div className="text-xs text-muted-foreground">Fast replies to all enquiries received during business hours.</div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <select id="title" className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option>Mr.</option><option>Ms.</option><option>Mrs.</option><option>Dr.</option>
              </select>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" required placeholder="Your full name" className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Mobile Number</Label>
              <Input id="phone" type="tel" required placeholder="+91 ..." className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Company name (optional)" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="msg">Description</Label>
            <Textarea id="msg" required placeholder="Please describe your requirement..." className="mt-1 min-h-32" />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Enquiry"}
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
    <Wrap href={href} className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/40 transition">
      <div className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{title}</div>
        <div className="font-medium">{value}</div>
      </div>
    </Wrap>
  );
};
