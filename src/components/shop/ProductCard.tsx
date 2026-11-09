import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";

const FALLBACK = "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&q=80";

export default function ProductCard({ product, onAdd, index = 0 }: any) {
  const img = product.images?.[0] || FALLBACK;
  const img2 = product.images?.[1];
  const sale = product.compare_at_price && product.compare_at_price > product.price;
  const stock = product.stock ?? 0;
  const out = stock <= 0;
  const low = !out && stock <= 5;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.3) }}
      className="group bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 transition-colors select-none">
      <Link to={`/shop/${product.id}`} className="relative block h-52 overflow-hidden bg-secondary">
        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        {img2 && (<img src={img2} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" loading="lazy" />)}
        {product.badge && (<span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-heading font-semibold uppercase tracking-wider">{product.badge}</span>)}
        {sale && (<span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-heading font-semibold uppercase tracking-wider">Sale</span>)}
        {out && (<div className="absolute inset-0 bg-background/60 flex items-center justify-center"><span className="px-3 py-1 rounded-full bg-card border border-border text-xs font-heading uppercase tracking-wider">Out of Stock</span></div>)}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs uppercase tracking-widest text-primary font-heading">{product.category}</span>
        <Link to={`/shop/${product.id}`}><h3 className="font-body font-semibold text-base text-foreground mt-1 leading-snug hover:text-primary transition-colors">{product.name}</h3></Link>
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5 text-sm text-muted-foreground font-body">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="font-medium text-foreground">{Number(product.rating).toFixed(1)}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold text-primary">R {Number(product.price).toLocaleString()}</span>
            {sale && <span className="text-sm text-muted-foreground line-through">R {Number(product.compare_at_price).toLocaleString()}</span>}
          </div>
          <button onClick={() => onAdd(product)} disabled={out}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary font-heading text-sm font-semibold uppercase tracking-wider hover:bg-primary/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {low && <p className="text-xs text-orange-400 font-body mt-2">Only {stock} left</p>}
      </div>
    </motion.div>
  );
}
