import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Archive, 
  Tag, 
  DollarSign, 
  Box, 
  AlertTriangle,
  Save,
  X,
  Image as ImageIcon,
  Upload,
  Activity,
  ShieldCheck,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import GoldButton from './shared/GoldButton';

export default function InventoryModule() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'inventory'));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Inventory Fetch Error:", e);
      toast.error('Logistics error: Could not retrieve inventory state');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: editingItem.name,
      category: editingItem.category,
      price: Number(editingItem.price),
      stock: Number(editingItem.stock),
      imageUrl: editingItem.imageUrl,
      updatedAt: serverTimestamp()
    };

    try {
      if (editingItem.id) {
        await setDoc(doc(db, 'inventory', editingItem.id), data, { merge: true });
        toast.success('Asset Protocol Updated');
      } else {
        await addDoc(collection(db, 'inventory'), { ...data, createdAt: serverTimestamp() });
        toast.success('New Asset Deployed to Depot');
      }
      setEditingItem(null);
      setIsAdding(false);
      fetchItems();
    } catch (e) {
      console.error("Save Error:", e);
      toast.error('System failure: Asset synchronization corrupted');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ARE YOU SURE YOU WANT TO DECOMMISSION THIS ASSET?')) return;
    try {
      await deleteDoc(doc(db, 'inventory', id));
      toast.success('Asset Decommissioned');
      fetchItems();
    } catch (e) {
      toast.error('Decommissioning failed');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800000) {
      toast.error('Asset exceeds 800KB bandwidth limit');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingItem({ ...editingItem, imageUrl: reader.result as string });
      toast.success('Visual Data Cached');
    };
    reader.readAsDataURL(file);
  };

  const filteredItems = items.filter(item => 
    (item.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (item.category?.toLowerCase() || '').includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-10">
      <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-glow-gold" />
      <div className="space-y-2">
         <p className="text-[12px] font-bold uppercase tracking-[0.6em] text-primary italic animate-pulse">Syncing_Logistics_Depot...</p>
         <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.4em]">Authorized Access Required</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-background pb-32 pt-8">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="space-y-4 text-left">
          <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary bg-primary/5 border-primary/20 px-4 py-1.5 italic rounded-full">Logistics Center</Badge>
          <h2 className="text-5xl md:text-7xl font-heading font-bold text-foreground tracking-tighter uppercase italic leading-none">Supply_ <br /><span className="text-primary italic">Depot</span></h2>
          <div className="flex items-center gap-3 pl-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow-gold" />
            <p className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-[0.4em] italic">Inventory State: Stable</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
            <input 
              placeholder="PROBE_ASSET_DNA..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 bg-secondary/20 border border-border/50 focus:bg-secondary/40 focus:border-primary/20 pl-16 rounded-[24px] text-[10px] font-bold uppercase tracking-[0.3em] text-foreground italic outline-none transition-all placeholder:text-muted-foreground/10"
            />
          </div>
          <GoldButton 
            onClick={() => {
              setEditingItem({ name: '', category: '', price: '', stock: '', imageUrl: '' });
              setIsAdding(true);
            }}
            size="md" 
            className="h-16 px-10 rounded-[32px] w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-3" /> Requisition Asset
          </GoldButton>
        </div>
      </div>

      {/* Asset Editor Overlay */}
      <AnimatePresence>
        {(editingItem || isAdding) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-12 bg-secondary/20 backdrop-blur-3xl border border-border/50 rounded-[60px] shadow-3xl text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
              <div className="space-y-10">
                <div className="space-y-4">
                  <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest text-primary italic border-primary/20">Asset Parameters</Badge>
                  <div className="grid gap-4">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 ml-2 italic">Unit Identifier</Label>
                    <input 
                      required
                      placeholder="ENTER_ASSET_NAME..."
                      value={editingItem.name}
                      onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                      className="bg-background/60 border border-border/50 h-16 rounded-[22px] px-8 text-foreground font-bold uppercase italic outline-none focus:border-primary/40 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 ml-2 italic">Fiscal Depth</Label>
                    <input 
                      required
                      type="number"
                      placeholder="0.00"
                      value={editingItem.price}
                      onChange={e => setEditingItem({...editingItem, price: e.target.value})}
                      className="bg-background/60 border border-border/50 h-16 rounded-[22px] px-8 text-foreground font-bold italic outline-none focus:border-primary/40 transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 ml-2 italic">Logistics Count</Label>
                    <input 
                      required
                      type="number"
                      placeholder="0"
                      value={editingItem.stock}
                      onChange={e => setEditingItem({...editingItem, stock: e.target.value})}
                      className="bg-background/60 border border-border/50 h-16 rounded-[22px] px-8 text-foreground font-bold italic outline-none focus:border-primary/40 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 ml-2 italic">Departmental Vector</Label>
                  <select 
                    className="bg-background/60 border border-border/50 h-16 rounded-[22px] px-8 text-foreground font-bold uppercase italic outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer"
                    value={editingItem.category}
                    onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                    required
                  >
                    <option value="" disabled className="bg-background">Select Sector</option>
                    <option value="UNIFORMS" className="bg-background">UNIFORMS</option>
                    <option value="GUARDS" className="bg-background">SPARRING GEAR</option>
                    <option value="APPAREL" className="bg-background">APPAREL</option>
                    <option value="EQUIPMENT" className="bg-background">EQUIPMENT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest text-primary italic border-primary/20">Visual Archetype</Badge>
                  <div className="flex flex-col gap-6">
                    <div className="aspect-video bg-background/60 rounded-[40px] border border-border/50 overflow-hidden flex items-center justify-center group relative shadow-inner">
                      {editingItem.imageUrl ? (
                        <img src={editingItem.imageUrl} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" />
                      ) : (
                        <div className="text-muted-foreground/10 flex flex-col items-center gap-6">
                          <ImageIcon className="w-16 h-16" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.5em] italic">Capture Visual ID</span>
                        </div>
                      )}
                      {editingItem.imageUrl && (
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                           <Button type="button" onClick={() => setEditingItem({...editingItem, imageUrl: ''})} className="bg-rose-500/20 text-rose-500 border border-rose-500/20 h-16 px-10 rounded-[22px] font-bold uppercase tracking-widest italic hover:bg-rose-500 hover:text-white transition-all">
                              Scrub Visual
                           </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <input 
                        placeholder="ENTER_VISUAL_RESOURCE_URL..." 
                        value={editingItem.imageUrl || ''}
                        onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})}
                        className="bg-background/60 border border-border/50 h-16 rounded-[22px] px-8 text-[10px] font-bold uppercase italic flex-1 focus:border-primary/40 outline-none"
                      />
                      <label className="h-16 px-10 bg-secondary/50 border border-border/50 rounded-[22px] flex items-center justify-center cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all text-primary">
                        <Upload className="w-6 h-6" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 pt-6">
                  <GoldButton className="flex-1 h-20 rounded-[35px] text-[11px] font-bold uppercase tracking-[0.4em] italic shadow-glow-gold">
                    {editingItem.id ? 'UPDATE_PROTOCOL' : 'DEPLOY_RESOURCE'}
                  </GoldButton>
                  <Button type="button" onClick={() => {setEditingItem(null); setIsAdding(false);}} variant="ghost" className="h-20 px-12 border border-border/50 text-muted-foreground/30 uppercase font-bold text-[11px] rounded-[35px] italic hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all">
                    ABORT
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative"
            >
              <div className="premium-card overflow-hidden bg-secondary/10 flex flex-col border border-border/50 hover:bg-secondary/20 hover:border-primary/30 transition-all duration-700 rounded-[60px] shadow-2xl h-full">
                <div className="aspect-[5/4] relative overflow-hidden bg-background">
                  <img src={item.imageUrl} className="w-full h-full object-cover grayscale brightness-[0.35] group-hover:grayscale-0 group-hover:brightness-[0.85] transition-all duration-1000 group-hover:scale-110" alt="" />
                  <div className="absolute top-8 left-8">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-xl text-primary border-primary/20 text-[9px] font-bold italic uppercase tracking-widest px-5 py-2 rounded-xl">{item.category}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Status Overlay */}
                  <div className="absolute bottom-8 right-8 flex items-center gap-3">
                     {item.stock < 5 && (
                       <Badge className="bg-rose-500/20 border border-rose-500/40 text-rose-500 text-[8px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full animate-pulse backdrop-blur-md">
                          Critical Reserves
                       </Badge>
                     )}
                     <div className="w-12 h-12 rounded-2xl bg-background/60 border border-border/20 flex items-center justify-center text-primary backdrop-blur-lg shadow-2xl">
                        <BarChart3 className="w-5 h-5" />
                     </div>
                  </div>
                </div>
                
                <div className="p-10 space-y-10 flex-1 flex flex-col justify-between text-left relative z-10">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start gap-6">
                      <h4 className="text-2xl font-heading font-bold text-foreground uppercase italic tracking-tight leading-none group-hover:text-primary transition-colors duration-500">{item.name}</h4>
                      <span className="text-3xl font-heading font-bold text-primary italic leading-none">${item.price}</span>
                    </div>
                    <div className="flex items-center gap-6 py-4 px-6 bg-background/40 rounded-[28px] border border-border/10 group-hover:border-primary/10 transition-all">
                       <div className="flex items-center gap-3">
                          <Package className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                          <span className={cn(
                            "text-[10px] font-bold uppercase italic tracking-widest leading-none mt-0.5",
                            item.stock < 5 ? "text-rose-500/80" : "text-muted-foreground/30 group-hover:text-foreground/60 transition-colors"
                          )}>Units: {item.stock}</span>
                       </div>
                       <div className="w-1 h-4 bg-border/20 rounded-full" />
                       <div className="flex items-center gap-3">
                          <Activity className="w-4 h-4 text-primary/40" />
                          <span className="text-[10px] font-bold uppercase italic tracking-widest leading-none mt-0.5 text-muted-foreground/30 group-hover:text-foreground/60 transition-colors">Stable</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-border/10">
                    <Button 
                      onClick={() => setEditingItem(item)}
                      variant="ghost"
                      className="flex-1 h-14 rounded-[22px] bg-background/40 border border-border/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all"
                    >
                      Protocol_Mod
                    </Button>
                    <Button 
                      onClick={() => handleDelete(item.id)}
                      variant="ghost" className="w-14 h-14 rounded-[22px] bg-background/40 border border-border/10 text-muted-foreground/20 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-all p-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                {/* Tactical Accent */}
                <div className="absolute left-0 bottom-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Global Supply Status */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="p-12 rounded-[70px] bg-secondary/20 border border-border/50 text-left relative overflow-hidden group shadow-2xl"
      >
         <div className="absolute top-0 left-0 w-full h-full bg-grid-tactical opacity-5 pointer-events-none" />
         <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="w-32 h-32 rounded-[45px] bg-primary flex items-center justify-center text-primary-foreground shadow-glow-gold relative shrink-0">
               <TrendingUp className="w-16 h-16" />
               <div className="absolute inset-0 bg-white/20 rounded-[45px] animate-ping opacity-10" />
            </div>
            <div className="flex-1 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-glow-gold animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary italic leading-none">Supply_Vector_Intelligence</p>
               </div>
               <h4 className="text-3xl md:text-5xl font-heading font-bold text-foreground uppercase italic tracking-tighter leading-tight">Supply Reserves Stabilized at 94%</h4>
               <p className="text-lg font-medium text-muted-foreground/50 italic leading-relaxed max-w-4xl tracking-tight">The logistics network is currently operating at optimal efficiency. Automated re-order protocols have been successfully cached for high-velocity uniform assets. Field technicians suggest a visual audit of sparring equipment within the next 48 hours for operational continuity.</p>
            </div>
            <GoldButton variant="outline" className="h-20 px-12 text-[11px] font-bold uppercase tracking-[0.4em] italic rounded-[35px] border border-border/50 hover:bg-primary/5 shrink-0">
               Audit Full Depot
            </GoldButton>
         </div>
      </motion.div>
    </div>
  );
}
