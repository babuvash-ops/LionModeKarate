import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import GoldButton from "../shared/GoldButton";
import { formatZAR, SHIPPING_FLAT, FREE_SHIPPING_THRESHOLD } from "@/data/products";
import { cart } from "@/lib/cartStore";

const FALLBACK = "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=300&q=80";

export default function CartSheet({ open, items, products }: any) {
  const lines = items.map((it: any) => { const p = products.find((pr: any) => pr.id === it.id); return p ? { ...p, qty: it.qty, size: it.size, key: it.key } : null; }).filter(Boolean);
  const subtotal = lines.reduce((s: number, l: any) => s + l.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) cart.closeCart(); }}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 bg-background">
        <SheetHeader className="p-5 border-b border-border">
          <SheetTitle className="font-heading text-xl uppercase tracking-wider flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" /> Your Cart</SheetTitle>
          <SheetDescription className="sr-only">Review your cart and proceed to checkout</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {lines.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="font-heading text-lg uppercase tracking-wider text-muted-foreground">Cart is empty</p>
              <p className="text-sm text-muted-foreground font-body mt-1">Add some gear to get started.</p>
            </div>
          ) : (
            lines.map((l: any) => (
              <div key={l.key} className="flex gap-3 p-3 rounded-2xl bg-card border border-border">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0"><img src={l.images?.[0] || FALLBACK} alt={l.name} className="w-full h-full object-cover" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-sm text-foreground truncate">{l.name}</p>
                  {l.size && <p className="text-xs text-muted-foreground font-body">Size: {l.size}</p>}
                  <p className="text-sm text-primary font-heading font-bold mt-0.5">R {(l.price * l.qty).toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => cart.setQty(l.key, l.qty - 1)} className="w-7 h-7 rounded-lg bg-secondary text-foreground flex items-center justify-center active:scale-90 transition-transform"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="font-heading font-bold text-sm w-6 text-center">{l.qty}</span>
                    <button onClick={() => cart.setQty(l.key, l.qty + 1)} className="w-7 h-7 rounded-lg bg-secondary text-foreground flex items-center justify-center active:scale-90 transition-transform"><Plus className="w-3.5 h-3.5" /></button>
                    <button onClick={() => cart.remove(l.key)} className="ml-auto w-7 h-7 rounded-lg text-destructive flex items-center justify-center hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {lines.length > 0 && (
          <div className="p-4 border-t border-border space-y-2 bg-card">
            <Row label="Subtotal" value={formatZAR(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatZAR(shipping)} />
            {subtotal < FREE_SHIPPING_THRESHOLD && <p className="text-xs text-muted-foreground font-body">Add {formatZAR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.</p>}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="font-heading text-base uppercase tracking-wider">Total</span>
              <span className="font-heading text-2xl font-bold text-primary">{formatZAR(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground font-body text-right">VAT included</p>
            <GoldButton onClick={cart.openCheckout} className="w-full mt-2" size="lg">Checkout</GoldButton>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value }: { label: string, value: string }) {
  return (<div className="flex items-center justify-between text-sm font-body"><span className="text-muted-foreground">{label}</span><span className="text-foreground font-medium">{value}</span></div>);
}
