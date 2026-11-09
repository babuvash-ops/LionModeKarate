import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Package, 
  ArrowRight, 
  CreditCard, 
  Tag, 
  Trash2,
  Heart,
  Search,
  Zap,
  Shield,
  Box,
  Truck,
  Plus
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function ProShop() {
  const [items, setItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const snap = await getDocs(collection(db, 'inventory'));
        if (snap.empty) {
          setItems([
            { id: '1', name: 'Elite Heavyweight Gi', category: 'UNIFORMS', price: 120, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=600' },
            { id: '2', name: 'Sparring Set (Red)', category: 'SPARRING GEAR', price: 95, stock: 8, imageUrl: 'https://images.unsplash.com/photo-1599058917233-358336634be9?auto=format&fit=crop&q=80&w=600' },
            { id: '3', name: 'Nexus Branded Hoodie', category: 'APPAREL', price: 55, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600' },
            { id: '4', name: 'Precision Focus Mitts', category: 'EQUIPMENT', price: 45, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1594970544554-523146d05aac?auto=format&fit=crop&q=80&w=600' },
          ]);
        } else {
          setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (e) {
        console.error("Shop Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} deployed to tactical loadout`);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const categories = ['ALL', 'UNIFORMS', 'SPARRING GEAR', 'APPAREL', 'EQUIPMENT'];

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.name?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesCategory = category === 'ALL' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center animate-pulse">
        <Box className="w-8 h-8 text-primary" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Syncing Quartermaster Stores...</p>
    </div>
  );

  return (
    <div className="relative min-h-screen pb-40 animate-in fade-in duration-700">
      {/* Decorative ambient spots */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[25rem] h-[25rem] bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10 px-4 md:px-8">
        {/* HEADER SECTION - Beautiful Oswald Typography & Sizes */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
          <div className="space-y-4">
            <span className="section-subtitle">
              Quartermaster Logistics
            </span>
            <h1 className="hero-title text-white tracking-wide uppercase font-bold leading-none animate-fade-in">
              ELITE_ <br />
              <span className="text-primary">SUPPLIES</span>
            </h1>
            <p className="body-text-premium text-white/70 font-sans text-base md:text-lg leading-relaxed max-w-xl">
              Authorized tactical uniform loadout point, premium protective sparring armor, and certified dojo combat lifestyle accessories.
            </p>
          </div>

          <div className="flex items-center gap-6 pb-4 w-full md:w-auto shrink-0">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="PROBE INVENTORY..." 
                className="bg-white/5 border border-white/10 placeholder:text-white/20 rounded-[28px] pl-16 h-20 text-[11px] font-black uppercase italic text-white outline-none focus:border-primary/45 focus:ring-2 focus:ring-primary/10 transition-all font-sans"
              />
            </div>
          </div>
        </div>

      {/* Authorized Categories */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 sticky top-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 py-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "flex-none px-10 h-16 rounded-2xl border font-black uppercase text-[10px] tracking-[0.3em] transition-all italic duration-500 cursor-pointer",
              category === c 
              ? "bg-primary text-black border-primary shadow-glow-gold -translate-y-1 font-bold" 
              : "bg-white/5 border-white/5 text-white/30 hover:border-primary/40 hover:text-white"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-16 px-4">
        {/* Gear Matrix */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {filteredItems.map((item) => (
             <motion.div
               key={item.id}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               whileHover={{ y: -12 }}
               className="group relative h-full"
             >
                <div className="premium-card h-full flex flex-col p-0 overflow-hidden hover:border-primary/35 transition-all duration-700 bg-[#121212]/30">
                  <div className="aspect-[4/5] relative overflow-hidden bg-black/40">
                     <img 
                       src={item.imageUrl} 
                       alt={item.name} 
                       className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale brightness-[0.4] group-hover:grayscale-0 group-hover:brightness-[1]" 
                       referrerPolicy="no-referrer"
                     />
                     <div className="absolute top-6 left-6">
                        <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-white text-[9px] font-black uppercase px-5 py-2 tracking-[0.2em] italic">{item.category}</Badge>
                     </div>
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
                        <button className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-black shadow-2xl scale-75 group-hover:scale-100 transition-transform cursor-pointer">
                          <Plus className="w-10 h-10" />
                        </button>
                     </div>
                  </div>
                  <div className="p-10 space-y-6 flex-1 flex flex-col justify-between text-left">
                     <div className="space-y-4">
                        <div className="flex justify-between items-start">
                           <h4 className="text-3xl font-heading font-black uppercase italic tracking-wider text-white group-hover:text-primary transition-colors leading-none">{item.name}</h4>
                           <span className="text-4xl font-heading font-black italic tracking-wider text-primary drop-shadow-lg leading-none">${item.price}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic">
                           <Zap className="w-4 h-4 text-primary/45" />
                           <span>Tactical Reserve: {item.stock} Units</span>
                        </div>
                     </div>
                     <Button 
                       onClick={() => addToCart(item)}
                       className="btn-gold w-full h-16 rounded-[24px] text-[11px] group cursor-pointer"
                     >
                       DEPLOY TO LOADOUT
                       <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-2" />
                     </Button>
                  </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Tactical Order Sidecar */}
        <div className="space-y-12">
           <Card className="glass p-10 bg-[#0A0A0A]/85 border-white/10 shadow-2xl rounded-[32px] sticky top-32">
              <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/5 text-left">
                 <div className="flex items-center gap-4">
                    <Box className="w-6 h-6 text-primary" />
                    <h3 className="text-3xl font-heading font-black uppercase italic tracking-wider text-white">Tactical Loadout</h3>
                 </div>
                 <Badge className="bg-primary text-black font-black uppercase px-3 py-1 text-[10px] rounded-lg shadow-glow-gold italic">{cart.length}</Badge>
              </div>

              <div className="space-y-6 max-h-[450px] overflow-y-auto no-scrollbar mb-10">
                 <AnimatePresence mode="popLayout">
                   {cart.length === 0 ? (
                     <div className="text-center py-20 space-y-6 opacity-20 italic">
                        <ShoppingBag className="w-16 h-16 mx-auto text-white" />
                        <p className="text-[11px] font-black uppercase tracking-[0.4em]">Loadout Neutral</p>
                     </div>
                   ) : (
                     cart.map((item) => (
                       <motion.div 
                         key={item.id}
                         layout
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         className="flex items-center gap-6 bg-white/5 p-4 rounded-2xl border border-white/5 group border-transparent hover:border-primary/25 transition-all text-left"
                       >
                          <div className="w-20 h-20 rounded-xl bg-[#121212] overflow-hidden flex-none border border-white/5">
                             <img src={item.imageUrl} alt="" className="w-full h-full object-cover brightness-[0.6] group-hover:brightness-[1] transition-all" />
                          </div>
                          <div className="flex-1 space-y-2">
                             <h5 className="text-[10px] font-black uppercase tracking-[0.2em] truncate text-white">{item.name}</h5>
                             <div className="flex justify-between items-center">
                                <span className="text-2xl font-heading font-black text-primary italic leading-none">${item.price * item.quantity}</span>
                                <button 
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-white/20 hover:text-rose-500 transition-colors"
                                >
                                   <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </div>
                          <div className="flex flex-col items-center gap-1 justify-center border-l border-white/5 pl-4">
                             <span className="text-[9px] font-black text-white/20 uppercase">UNIT</span>
                             <span className="text-2xl font-heading font-black italic text-white leading-none">{item.quantity}</span>
                          </div>
                       </motion.div>
                     ))
                   )}
                 </AnimatePresence>
              </div>

              <div className="space-y-6 pt-10 border-t border-white/5 text-left">
                 <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-white/20 italic">
                    <span>Operational Subtotal</span>
                    <span className="text-white">${cartTotal}</span>
                 </div>
                 <div className="flex justify-between items-center text-left">
                    <span className="text-[14px] font-black uppercase tracking-[0.3em] italic text-white/50">Tactical Allocation</span>
                    <span className="text-5xl font-heading font-black italic tracking-wider text-primary shadow-glow-gold leading-none">${cartTotal}</span>
                 </div>
                 <Button 
                   disabled={cart.length === 0}
                   className="btn-gold w-full h-18 rounded-[28px] mt-6 text-[12px] gap-4"
                 >
                    <CreditCard className="w-6 h-6" />
                    FINALIZE TRANSACTION
                 </Button>
              </div>
           </Card>

           <div className="p-10 glass bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-[32px] text-left space-y-6">
              <div className="flex items-center gap-4">
                <Truck className="w-6 h-6 text-primary" />
                <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary italic">Logistics Note</h5>
              </div>
              <p className="text-[12px] font-medium text-white/40 leading-relaxed uppercase tracking-widest pl-4 border-l border-primary/20">
                 "Deployment usually occurs within 24 operational cycles. Elite units receive priority courier protocol."
              </p>
           </div>
        </div>
      </div>
    </div>
    </div>
  );
}
