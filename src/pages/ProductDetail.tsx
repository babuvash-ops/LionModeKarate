import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Minus, Plus, Star, Check, ShoppingBag } from "lucide-react";
import { cart } from "@/lib/cartStore";
import ProductCard from "../components/shop/ProductCard";
import GoldButton from "../components/shared/GoldButton";

const FALLBACK = "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80";

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading } = useQuery({ queryKey: ["product", id], queryFn: () => base44.entities.Product.get(id as string), enabled: !!id });
  const { data: all = [] } = useQuery({ queryKey: ["products"], queryFn: () => base44.entities.Product.list("-created_date", 200) });

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  if (isLoading || !product) {
    return (<div className="max-w-6xl mx-auto px-4 py-20 text-center"><div className="w-11 h-11 rounded-xl bg-primary mx-auto animate-pulse-gold" /></div>);
  }

  const images = product.images?.length ? product.images : [FALLBACK];
  const sale = product.compare_at_price && product.compare_at_price > product.price;
  const stock = product.stock ?? 0;
  const out = stock <= 0;
  const related = all.filter((p: any) => p.category === product.category && p.id !== product.id && p.is_active !== false).slice(0, 4);

  const addToCart = () => { if (product.sizes?.length && !size) return; cart.add(product.id, size, qty); };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground font-body hover:text-foreground mb-5">
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </Link>
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <div>
          <div className="relative h-80 md:h-[28rem] rounded-2xl overflow-hidden bg-secondary border border-border">
            <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
              {images.map((im: string, i: number) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${activeImg === i ? "border-primary" : "border-border"}`}>
                  <img src={im} alt={product.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-primary font-heading">{product.category}</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase leading-tight mt-1">{product.name}</h1>
          {product.rating > 0 && (<div className="flex items-center gap-1 mt-2 text-sm font-body"><Star className="w-4 h-4 text-primary fill-primary" /><span className="font-medium">{Number(product.rating).toFixed(1)}</span></div>)}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-heading text-3xl font-bold text-primary">R {Number(product.price).toLocaleString()}</span>
            {sale && <span className="text-lg text-muted-foreground line-through">R {Number(product.compare_at_price).toLocaleString()}</span>}
          </div>
          <div className="mt-3 text-sm font-body">
            {out ? <span className="text-red-400 font-medium">Out of stock</span>
              : stock <= 5 ? <span className="text-orange-400 font-medium">Only {stock} left in stock</span>
              : <span className="text-green-400 font-medium flex items-center gap-1"><Check className="w-4 h-4" /> In stock</span>}
          </div>
          {product.description && <p className="text-sm text-muted-foreground font-body mt-4 leading-relaxed">{product.description}</p>}
          {product.sizes?.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2">Size {size && <span className="text-foreground">· {size}</span>}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s: string) => (
                  <button key={s} onClick={() => setSize(s)} className={`min-w-10 px-3 py-2 rounded-xl border text-sm font-body ${size === s ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/40"}`}>{s}</button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"><Minus className="w-4 h-4" /></button>
              <span className="font-heading font-bold w-8 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"><Plus className="w-4 h-4" /></button>
            </div>
            <GoldButton onClick={addToCart} disabled={out || (product.sizes?.length > 0 && !size)} className="flex-1" size="lg">
              <ShoppingBag className="w-4 h-4 mr-2 inline" /> {out ? "Out of Stock" : "Add to Cart"}
            </GoldButton>
          </div>
          {product.sizes?.length > 0 && !size && !out && <p className="text-xs text-muted-foreground font-body mt-2">Select a size to continue</p>}
        </div>
      </div>
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-5">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p: any, i: number) => (<ProductCard key={p.id} product={p} index={i} onAdd={(p: any) => cart.add(p.id, p.sizes?.[0] || null)} />))}
          </div>
        </div>
      )}
    </div>
  );
}
