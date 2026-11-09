import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Outlet } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import StoreHeader from "./StoreHeader";
import CartSheet from "./CartSheet";
import CheckoutFlow from "./CheckoutFlow";
import { useCart, cart } from "@/lib/cartStore";

export default function StoreLayout() {
  const { items, cartOpen, checkoutOpen } = useCart();
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => base44.entities.Product.list("-created_date", 200) });
  const count = items.reduce((s: number, i: any) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <StoreHeader />
      <Outlet />
      <button onClick={cart.openCart} className="fixed bottom-5 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground font-heading font-semibold uppercase tracking-wider text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform">
        <ShoppingBag className="w-5 h-5" />
        {count > 0 && <span className="min-w-6 h-6 px-1.5 rounded-full bg-primary-foreground text-primary text-xs font-bold flex items-center justify-center">{count}</span>}
      </button>
      <CartSheet open={cartOpen} items={items} products={products} />
      <CheckoutFlow open={checkoutOpen} items={items} products={products} />
    </div>
  );
}
