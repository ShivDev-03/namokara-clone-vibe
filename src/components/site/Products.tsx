import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const products = [
  {
    name: "Rotary Encoders",
    count: 222,
    img: "https://5.imimg.com/data5/SELLER/Default/2024/3/400511608/GP/DA/VC/192484860/ts2640n321e64-tamagawa-brushless-resolver-500x500.jpeg",
    items: ["TS2640N321E64 Tamagawa Brushless Resolver", "Autonics Rotary Encoders", "TS2640N671E110 Tamagawa Resolver"],
  },
  {
    name: "Incremental Encoder",
    count: 123,
    img: "https://5.imimg.com/data5/SELLER/Default/2023/7/329403108/JL/TJ/MT/192484860/ab-500x500.jpg",
    items: ["ERN1387 2048 62S14 70 Heidenhain", "8.KIS50.832A.2500.0050 Kübler", "8.KIS50.832A.1024.0050 Kübler"],
  },
  {
    name: "Meanwell SMPS",
    count: 87,
    img: "https://5.imimg.com/data5/SELLER/Default/2023/8/335767892/HR/PS/EQ/192484860/rs-15-24-500x500.jpg",
    items: ["LRS-350-5 Meanwell SMPS", "LRS-200-12 Meanwell SMPS", "SE-450-12 Meanwell SMPS"],
  },
  {
    name: "Encoder",
    count: 75,
    img: "https://5.imimg.com/data5/SELLER/Default/2024/3/399501275/WC/QN/NN/192484860/e6cp-ag5c-c-256p-r-omron-encoder-500x500.jpeg",
    items: ["E6CP-AG5C-C-256P/R Omron", "E50S8-2500-3-T-1 Autonics", "FNC 100H 30430V1024-R7K4P Fenac"],
  },
  {
    name: "Proximity Sensor",
    count: 73,
    img: "https://5.imimg.com/data5/SELLER/Default/2024/1/380118524/AL/II/BQ/192484860/cr30-15dn-autonics-sensor-500x500.jpg",
    items: ["CR30-15DN Autonics Sensor", "NBN15 30GM50 E2 Pepperl+Fuchs", "PR18-5DN Autonics Sensor"],
  },
  {
    name: "Sensors",
    count: 61,
    img: "https://5.imimg.com/data5/SELLER/Default/2024/2/390857517/ZZ/XP/IR/192484860/e50s8-1024-3-t-24-autonics-rotary-encoder-500x500.jpeg",
    items: ["E50S8-1024-3-T-24 Autonics", "E40S6-400-3-T-24 Autonics", "E40S6-1000-3-T-24 Autonics"],
  },
  {
    name: "Limit Switch",
    count: 55,
    img: "https://5.imimg.com/data5/SELLER/Default/2024/6/426638983/QV/QH/QZ/192484860/e6b2-cwz5b-1000ppr-omron-absolute-encoder-500x500.jpg",
    items: ["E6B2-CWZ5B-1000PPR Omron", "E6B2-CWZ6C 2000 PPR-2M Omron", "E6B2-CWZ5B 360PPR-0.5M Omron"],
  },
  {
    name: "Photoelectric Sensor",
    count: 42,
    img: "https://5.imimg.com/data5/SELLER/Default/2024/10/461001991/WR/LI/DL/192484860/nemicon-encoder-hes-01-2mht.webp",
    items: ["Nemicon Rotary Encoder HES-01-2MHT", "Rotary Encoder 0EW2-01-2MHT", "E6B2-CWZ6C-200 PPR-2M Omron"],
  },
];

export const Products = () => (
  <section id="products" className="relative py-20 md:py-32 bg-secondary/30 overflow-hidden">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
    <div className="container relative">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-14 animate-fade-in-up">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-primary-glow mb-4">— Our Products</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-2 leading-tight">
            Browse our <span className="text-gradient">product range</span>
          </h2>
        </div>
        <Button variant="outline" asChild className="group hover:border-primary-glow hover:text-primary-glow transition-all">
          <a href="#contact">View Complete Range <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" /></a>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p, i) => (
          <article
            key={p.name}
            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover-lift animate-fade-in-up"
            style={{ animationDelay: `${i * 0.06}s`, animationFillMode: "backwards" }}
          >
            <div className="relative aspect-square bg-secondary overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <span className="absolute top-3 left-3 z-20 gradient-accent text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {p.count}+ items
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display font-bold text-lg mb-3 group-hover:text-primary-glow transition-colors">{p.name}</h3>
              <ul className="space-y-1.5 mb-5">
                {p.items.map((i) => (
                  <li key={i} className="text-xs text-muted-foreground line-clamp-1 flex items-start gap-1.5">
                    <span className="text-primary-glow mt-0.5">›</span>{i}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 group/btn" asChild>
                  <a href="#contact">Get Quote <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" /></a>
                </Button>
                <Button size="sm" variant="outline" asChild><a href="#contact">View</a></Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
