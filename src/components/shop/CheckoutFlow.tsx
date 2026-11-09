import React, { useState } from "react";
import { CreditCard, Lock, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoldButton from "../shared/GoldButton";
import { formatZAR, SHIPPING_FLAT, FREE_SHIPPING_THRESHOLD } from "@/data/products";
import { cart } from "@/lib/cartStore";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const GATEWAYS = [
  { id: "payfast", name: "PayFast", blurb: "Cards, Instant EFT, Masterpass", color: "from-blue-600 to-blue-500" },
  { id: "yoco", name: "Yoco", blurb: "Card payment on-site", color: "from-emerald-500 to-teal-500" },
];
const ADMIN_EMAIL = "lionsdentck@gmail.com";

export default function CheckoutFlow({ open, items, products }: any) {
  const [step, setStep] = useState("details");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", gateway: "payfast" });
  const [orderRef, setOrderRef] = useState("");

  const lines = items.map((it: any) => { const p = products.find((pr: any) => pr.id === it.id); return p ? { ...p, qty: it.qty, size: it.size } : null; }).filter(Boolean);
  const subtotal = lines.reduce((s: number, l: any) => s + l.price * l.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  const set = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const canContinue = form.name.trim() && /.+@.+\..+/.test(form.email) && form.phone.trim() && form.address.trim();

  const pay = () => {
    setStep("processing");
    const ref = "LMK-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setTimeout(async () => {
      try {
        await base44.entities.Order.create({
          order_ref: ref, customer_name: form.name, customer_email: form.email, customer_phone: form.phone, address: form.address,
          items: lines.map((l: any) => ({ product_id: l.id, name: l.name, price: l.price, qty: l.qty, size: l.size || "" })),
          subtotal, shipping, total, status: "paid", payment_method: form.gateway,
        });
        try { await base44.integrations.Core.SendEmail({ to: ADMIN_EMAIL, subject: `New order ${ref}`, body: `${form.name} placed an order for R ${total.toLocaleString()}.\n\nItems:\n${lines.map((l: any) => `- ${l.name}${l.size ? ` (${l.size})` : ""} x${l.qty} — R ${(l.price * l.qty).toLocaleString()}`).join("\n")}\n\nContact: ${form.email} / ${form.phone}\nAddress: ${form.address}` }); } catch {}
        setOrderRef(ref); setStep("success");
      } catch (e) { toast.error("Order failed"); setStep("payment"); }
    }, 1800);
  };

  const reset = () => { setStep("details"); setForm({ name: "", email: "", phone: "", address: "", gateway: "payfast" }); cart.clear(); cart.closeCheckout(); };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && step !== "processing") cart.closeCheckout(); }}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogTitle className="sr-only">Checkout</DialogTitle>
        <DialogDescription className="sr-only">Complete your purchase</DialogDescription>

        {step !== "success" && (
          <div className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider">
            <StepDot n={1} active={step !== "details"} current={step === "details"} />
            <div className={step === "payment" || step === "processing" ? "h-px flex-1 bg-primary" : "h-px flex-1 bg-border"} />
            <StepDot n={2} active={step === "payment" || step === "processing"} current={step === "payment" || step === "processing"} />
          </div>
        )}

        {step === "details" && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider">Your Details</h2>
            <Field label="Full name"><Input value={form.name} onChange={set("name")} placeholder="Thabo Mokoena" /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={set("phone")} placeholder="082 123 4567" /></Field>
            <Field label="Delivery address"><Input value={form.address} onChange={set("address")} placeholder="123 Main St, Cape Town" /></Field>
            <Summary subtotal={subtotal} shipping={shipping} total={total} />
            <GoldButton onClick={() => setStep("payment")} className="w-full" size="lg" disabled={!canContinue}>Continue to Payment</GoldButton>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <button onClick={() => setStep("details")} className="flex items-center gap-1 text-sm text-muted-foreground font-body hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Back</button>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider">Payment Method</h2>
            <div className="rounded-lg bg-primary/10 border border-primary/30 px-3 py-2 text-sm text-primary font-body flex items-center gap-2"><Lock className="w-4 h-4" /> Demo checkout — no real card will be charged.</div>
            <div className="space-y-2.5">
              {GATEWAYS.map((g) => {
                const selected = form.gateway === g.id;
                return (
                  <button key={g.id} onClick={() => setForm((f) => ({ ...f, gateway: g.id }))}
                    className={`w-full text-left p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-white`}><CreditCard className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-base uppercase tracking-wider">{g.name}</p>
                      <p className="text-sm text-muted-foreground font-body">{g.blurb}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-primary bg-primary" : "border-border"}`}>{selected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}</div>
                  </button>
                );
              })}
            </div>
            <Summary subtotal={subtotal} shipping={shipping} total={total} />
            <GoldButton onClick={pay} className="w-full" size="lg">Pay {formatZAR(total)}</GoldButton>
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h2 className="font-heading text-lg uppercase tracking-wider">Contacting {GATEWAYS.find((g) => g.id === form.gateway)?.name}…</h2>
            <p className="text-sm text-muted-foreground font-body mt-1">Do not close this window.</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wider">Payment Successful</h2>
            <p className="text-sm text-muted-foreground font-body mt-1">A confirmation has been sent to {form.email}.</p>
            <div className="mt-4 px-4 py-3 rounded-xl bg-secondary border border-border w-full">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Order Reference</p>
              <p className="font-heading text-xl font-bold text-primary mt-0.5">{orderRef}</p>
            </div>
            <GoldButton onClick={reset} className="w-full mt-5" size="lg">Done</GoldButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepDot({ n, active, current }: { n: number, active: boolean, current: boolean }) {
  return (<div className={`w-7 h-7 rounded-full flex items-center justify-center font-heading font-bold text-sm ${active || current ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{n}</div>);
}
function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (<div className="space-y-1.5"><Label className="text-sm font-body text-foreground">{label}</Label>{children}</div>);
}
function Summary({ subtotal, shipping, total }: { subtotal: number, shipping: number, total: number }) {
  return (
    <div className="rounded-xl bg-secondary/40 border border-border p-3 space-y-1.5">
      <div className="flex justify-between text-sm font-body"><span className="text-muted-foreground">Subtotal</span><span>{formatZAR(subtotal)}</span></div>
      <div className="flex justify-between text-sm font-body"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatZAR(shipping)}</span></div>
      <div className="flex justify-between pt-1.5 border-t border-border"><span className="font-heading uppercase tracking-wider">Total</span><span className="font-heading font-bold text-lg text-primary">{formatZAR(total)}</span></div>
    </div>
  );
}
