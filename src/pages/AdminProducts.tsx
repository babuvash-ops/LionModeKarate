import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Upload, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import GoldButton from "../components/shared/GoldButton";
import { toast } from "sonner";

const CATEGORIES = ["Uniforms", "Equipment", "Belts", "Apparel", "Accessories"];
const FALLBACK = "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&q=80";
const empty = { name: "", description: "", price: "", compare_at_price: "", category: "Equipment", sizes: "", stock: "", badge: "", rating: "", is_active: true, images: [] };

export default function AdminProducts() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: () => base44.entities.Product.list("-created_date", 200) });
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const createM = useMutation({ mutationFn: (d: any) => base44.entities.Product.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); close(); toast.success("Product added"); } });
  const updateM = useMutation({ mutationFn: ({ id, d }: any) => base44.entities.Product.update(id, d), onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); close(); toast.success("Product updated"); } });
  const deleteM = useMutation({ mutationFn: (id: string) => base44.entities.Product.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Product deleted"); } });

  const openNew = () => { setForm(empty); setEditingId(null); setOpen(true); };
  const openEdit = (p: any) => { setForm({ ...empty, ...p, sizes: (p.sizes || []).join(", "), images: p.images || [], price: p.price ?? "", compare_at_price: p.compare_at_price ?? "", stock: p.stock ?? "", rating: p.rating ?? "" }); setEditingId(p.id); setOpen(true); };
  const close = () => setOpen(false);
  const set = (k: string) => (e: any) => { const v = e?.target ? e.target.value : e; setForm((f: any) => ({ ...f, [k]: v })); };

  const uploadImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file }) as any;
      setForm((f: any) => ({ ...f, images: [...f.images, file_url] }));
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const submit = () => {
    if (!form.name || form.price === "") { toast.error("Name and price required"); return; }
    const payload = {
      name: form.name, description: form.description, price: Number(form.price) || 0,
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      category: form.category, sizes: form.sizes ? form.sizes.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      stock: Number(form.stock) || 0, badge: form.badge || null, rating: Number(form.rating) || 0,
      is_active: form.is_active, images: form.images,
    };
    if (editingId) updateM.mutate({ id: editingId, d: payload }); else createM.mutate(payload);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">Products</h1>
          <p className="text-sm text-muted-foreground font-body">Manage your store catalogue</p>
        </div>
        <GoldButton onClick={openNew}><Plus className="w-4 h-4 mr-1 inline" /> Add Product</GoldButton>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-40 rounded-2xl bg-card border border-border shimmer" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p: any) => (
            <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden flex">
              <div className="w-24 h-24 bg-secondary flex-shrink-0"><img src={p.images?.[0] || FALLBACK} alt={p.name} className="w-full h-full object-cover" /></div>
              <div className="flex-1 p-3 min-w-0">
                <p className="font-body font-semibold text-sm truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground font-body">{p.category} · R {Number(p.price).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">Stock: {p.stock ?? 0}{p.is_active === false ? " · Hidden" : ""}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/70"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm("Delete this product?")) deleteM.mutate(p.id); }} className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={(o) => { if (!o) close(); }}>
        <DialogContent className="max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogTitle className="font-heading text-xl uppercase tracking-wider">{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription className="sr-only">Product details</DialogDescription>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground font-body">Images</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.images.map((url: string, i: number) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setForm((f: any) => ({ ...f, images: f.images.filter((_: any, idx: number) => idx !== i) }))} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                <button onClick={() => fileRef.current?.click()} className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50">
                  {uploading ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                </button>
                <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} multiple />
              </div>
            </div>
            <div><Label className="text-xs text-muted-foreground font-body">Name</Label><Input value={form.name} onChange={set("name")} className="bg-secondary border-border mt-1" /></div>
            <div><Label className="text-xs text-muted-foreground font-body">Description</Label><Textarea value={form.description} onChange={set("description")} className="bg-secondary border-border mt-1 h-20" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs text-muted-foreground font-body">Price (R)</Label><Input type="number" value={form.price} onChange={set("price")} className="bg-secondary border-border mt-1" /></div>
              <div><Label className="text-xs text-muted-foreground font-body">Compare-at (R)</Label><Input type="number" value={form.compare_at_price} onChange={set("compare_at_price")} className="bg-secondary border-border mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground font-body">Category</Label>
                <Select value={form.category} onValueChange={(v) => set("category")(v)}><SelectTrigger className="bg-secondary border-border mt-1"><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
              </div>
              <div><Label className="text-xs text-muted-foreground font-body">Stock</Label><Input type="number" value={form.stock} onChange={set("stock")} className="bg-secondary border-border mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs text-muted-foreground font-body">Sizes (comma separated)</Label><Input value={form.sizes} onChange={set("sizes")} placeholder="S, M, L, XL" className="bg-secondary border-border mt-1" /></div>
              <div><Label className="text-xs text-muted-foreground font-body">Badge</Label><Input value={form.badge} onChange={set("badge")} placeholder="New, Best Seller" className="bg-secondary border-border mt-1" /></div>
            </div>
            <div><Label className="text-xs text-muted-foreground font-body">Rating (0-5)</Label><Input type="number" step="0.1" value={form.rating} onChange={set("rating")} className="bg-secondary border-border mt-1" /></div>
            <div className="flex items-center justify-between rounded-xl bg-secondary p-3">
              <Label className="text-sm font-body">Active (visible in shop)</Label>
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm((f: any) => ({ ...f, is_active: v }))} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={close} className="flex-1 rounded-xl border border-border py-2.5 font-heading uppercase tracking-wider text-sm">Cancel</button>
              <GoldButton onClick={submit} disabled={createM.isPending || updateM.isPending} className="flex-1">{createM.isPending || updateM.isPending ? "Saving..." : editingId ? "Save" : "Add Product"}</GoldButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
