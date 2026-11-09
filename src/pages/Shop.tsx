import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HeroBanner from "../components/shared/HeroBanner";
import ProductCard from "../components/shop/ProductCard";
import { useSiteImages } from "@/hooks/useSiteImages";
import { cart } from "@/lib/cartStore";

const CATEGORIES = ["All", "Uniforms", "Equipment", "Belts", "Apparel", "Accessories"];
const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function Shop() {
  const images = useSiteImages();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("-created_date", 200),
  });
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const active = products.filter((p: any) => p.is_active !== false);
  const filtered = useMemo(() => {
    let list = active.filter(
      (p: any) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [active, category, search, sort]);

  const add = (p: any) => cart.add(p.id, p.sizes?.[0] || null);

  return (
    <div>
      <div className="bg-primary text-primary-foreground text-center text-[11px] md:text-xs font-heading uppercase tracking-widest py-2 px-4">
        Free shipping over R1000 · Pay with PayFast or Yoco · 14-day returns
      </div>
      <HeroBanner slot="hero_shop" title="Pro Shop" subtitle="Gear up and train hard" height="h-40 md:h-56" />
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="relative h-32 md:h-40 rounded-2xl overflow-hidden border border-border">
          <img src={images.shop_promo} alt="Promo" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <p className="text-primary text-xs font-heading uppercase tracking-widest">Limited Offer</p>
            <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase mt-1">20% Off All Gear</h3>
            <p className="text-sm text-muted-foreground font-body mt-1">Use code WARRIOR20 at checkout</p>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search the shop…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border rounded-xl font-body" />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="bg-card border-border rounded-xl h-10 md:w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-muted-foreground">
          <Filter className="w-3.5 h-3.5" /> Categories
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-heading uppercase tracking-wider whitespace-nowrap transition-all border ${
                category === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground font-body">
          <span className="text-foreground font-semibold">{filtered.length}</span> products
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (<div key={i} className="h-72 rounded-2xl bg-card border border-border shimmer" />))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((p: any, i: number) => (<ProductCard key={p.id} product={p} index={i} onAdd={add} />))}
          </div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16"><p className="font-heading text-lg uppercase tracking-wider text-muted-foreground">No products found</p></div>
        )}
      </div>
    </div>
  );
}
