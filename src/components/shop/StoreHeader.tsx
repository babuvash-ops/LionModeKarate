import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, PawPrint } from "lucide-react";
import { useCart, cart } from "@/lib/cartStore";

export default function StoreHeader() {
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-14">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><PawPrint className="w-4 h-4 text-primary-foreground" /></div>
          <span className="font-heading text-base font-bold uppercase tracking-wider">Lionmode Karate</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/shop" className="text-sm font-heading uppercase tracking-wider text-muted-foreground hover:text-foreground">Shop</Link>
          <Link to="/dashboard" className="hidden sm:inline text-sm font-heading uppercase tracking-wider text-primary hover:opacity-80">Login</Link>
          <button onClick={cart.openCart} className="relative p-2 rounded-lg hover:bg-secondary">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {count > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
