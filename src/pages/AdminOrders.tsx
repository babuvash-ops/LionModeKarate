import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

const STATUSES = ["pending", "paid", "processing", "shipped", "completed", "cancelled"];
const tone: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  paid: "text-green-400 bg-green-500/10 border-green-500/30",
  processing: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  shipped: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  completed: "text-primary bg-primary/10 border-primary/30",
  cancelled: "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["orders"], queryFn: () => base44.entities.Order.list("-created_date", 200) });
  const updateM = useMutation({ mutationFn: ({ id, d }: any) => base44.entities.Order.update(id, d), onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); toast.success("Order updated"); } });

  const revenue = orders.filter((o: any) => ["paid", "processing", "shipped", "completed"].includes(o.status)).reduce((s: number, o: any) => s + (o.total || 0), 0);
  const count = orders.length;
  const pending = orders.filter((o: any) => o.status === "pending" || o.status === "paid").length;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">Orders</h1>
        <p className="text-sm text-muted-foreground font-body">Track sales and fulfilment</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4"><p className="text-xs uppercase tracking-widest text-muted-foreground font-heading">Revenue</p><p className="font-heading text-2xl font-bold text-primary mt-1">R {revenue.toLocaleString()}</p></div>
        <div className="bg-card border border-border rounded-2xl p-4"><p className="text-xs uppercase tracking-widest text-muted-foreground font-heading">Orders</p><p className="font-heading text-2xl font-bold mt-1">{count}</p></div>
        <div className="bg-card border border-border rounded-2xl p-4"><p className="text-xs uppercase tracking-widest text-muted-foreground font-heading">To Fulfil</p><p className="font-heading text-2xl font-bold text-orange-400 mt-1">{pending}</p></div>
      </div>
      {isLoading ? (
        <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-card border border-border shimmer" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16"><p className="font-heading text-lg uppercase tracking-wider text-muted-foreground">No orders yet</p></div>
      ) : (
        <div className="space-y-3">
          {orders.map((o: any) => (
            <div key={o.id} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-bold text-primary">{o.order_ref || "—"}</span>
                    <span className={`text-xs font-heading uppercase tracking-wider px-2 py-0.5 rounded-full border ${tone[o.status] || tone.pending}`}>{o.status}</span>
                  </div>
                  <p className="font-body text-sm mt-1">{o.customer_name} · {o.customer_email}</p>
                  <p className="text-xs text-muted-foreground font-body">{o.customer_phone} · {o.address}</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">{o.created_date ? format(new Date(o.created_date), "MMM d, yyyy • HH:mm") : ""}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-heading text-xl font-bold">R {Number(o.total || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground font-body capitalize">{o.payment_method || ""}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border space-y-1">
                {(o.items || []).map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{it.name}{it.size ? ` (${it.size})` : ""} × {it.qty}</span>
                    <span>R {Number(it.price * it.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-heading uppercase tracking-wider text-muted-foreground">Status:</span>
                <Select value={o.status} onValueChange={(v) => updateM.mutate({ id: o.id, d: { status: v } })}>
                  <SelectTrigger className="bg-secondary border-border h-8 w-44 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
