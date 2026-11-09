import { useSyncExternalStore } from "react";

const KEY = "lionmode_shop_cart";
function loadItems() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

let state = { items: loadItems(), cartOpen: false, checkoutOpen: false };
const listeners = new Set<() => void>();

const set = (next: any) => {
  state = typeof next === "function" ? next(state) : next;
  try { localStorage.setItem(KEY, JSON.stringify(state.items)); } catch {}
  listeners.forEach((l) => l());
};

export const cart = {
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
  getSnapshot: () => state,
  add: (id: string, size: string | null = null, qty: number = 1) => {
    const key = size ? `${id}__${size}` : id;
    set((s: any) => {
      const found = s.items.find((i: any) => i.key === key);
      const items = found
        ? s.items.map((i: any) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
        : [...s.items, { key, id, qty, size }];
      return { ...s, items, cartOpen: true };
    });
  },
  setQty: (key: string, qty: number) =>
    set((s: any) => ({
      ...s,
      items: qty <= 0 ? s.items.filter((i: any) => i.key !== key) : s.items.map((i: any) => (i.key === key ? { ...i, qty } : i)),
    })),
  remove: (key: string) => set((s: any) => ({ ...s, items: s.items.filter((i: any) => i.key !== key) })),
  clear: () => set((s: any) => ({ ...s, items: [] })),
  openCart: () => set((s: any) => ({ ...s, cartOpen: true })),
  closeCart: () => set((s: any) => ({ ...s, cartOpen: false })),
  openCheckout: () => set((s: any) => ({ ...s, cartOpen: false, checkoutOpen: true })),
  closeCheckout: () => set((s: any) => ({ ...s, checkoutOpen: false })),
};

export function useCart() {
  return useSyncExternalStore(cart.subscribe, cart.getSnapshot, cart.getSnapshot);
}
