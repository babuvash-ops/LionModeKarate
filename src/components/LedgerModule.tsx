import { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Download, 
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  PieChart,
  Target,
  Zap,
  ShieldCheck,
  Activity,
  History,
  Lock,
  ChevronRight,
  Database,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import GoldButton from './shared/GoldButton';

// Dummy Financial Records
const ledgerEntries = [
  { id: '1', date: 'Mar 25, 2024', description: 'Equipment Procurement - Uniforms', category: 'Operational XP', amount: -12500.00, status: 'Audited', type: 'debit' },
  { id: '2', date: 'Mar 24, 2024', description: 'Elite Membership Renewal - Q1 Batch', category: 'Revenue Stream', amount: 45000.00, status: 'Cleared', type: 'credit' },
  { id: '3', date: 'Mar 23, 2024', description: 'Seminar Hosting - Master Class', category: 'Revenue Stream', amount: 15200.00, status: 'Cleared', type: 'credit' },
  { id: '4', date: 'Mar 22, 2024', description: 'Facility Maintenance - Mats & AC', category: 'Infrastructure', amount: -8400.00, status: 'Audited', type: 'debit' },
  { id: '5', date: 'Mar 20, 2024', description: 'Utility Deployment - Power/Water', category: 'Infrastructure', amount: -2100.00, status: 'Pending', type: 'debit' },
  { id: '6', date: 'Mar 18, 2024', description: 'Tournament Prize Fund Sponsorship', category: 'Marketing', amount: 25000.00, status: 'Cleared', type: 'credit' },
];

export default function LedgerModule() {
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Total Asset Liquidity', value: 'R742,850', icon: Database, detail: '+R12.5k Weekly' },
    { label: 'Operational Burn', value: 'R42,100', icon: Zap, detail: '14.2% Growth' },
    { label: 'Yield Projection', value: 'R150,000', icon: TrendingUp, detail: 'Q2 Targeted' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-background pb-32 pt-8">
      {/* Fiscal Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 group relative border border-border/50 bg-secondary/10 hover:bg-secondary/30 hover:border-primary/20 rounded-[45px] transition-all shadow-2xl flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-8">
               <div className="w-16 h-16 rounded-2xl bg-secondary border border-border/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-xl group-hover:scale-110">
                  <stat.icon className="w-8 h-8" />
               </div>
               <Badge variant="ghost" className="text-[9px] font-bold text-primary uppercase tracking-widest italic">{stat.detail}</Badge>
            </div>
            <div className="space-y-3 text-left">
               <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.4em] italic">{stat.label}</p>
               <h3 className="text-5xl font-heading font-bold text-foreground tracking-tighter italic group-hover:text-primary transition-colors">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Ledger Manifesto */}
      <div className="border border-border/30 bg-secondary/10 rounded-[60px] overflow-hidden shadow-2xl relative">
        <div className="p-8 md:p-12 border-b border-border/10 bg-secondary/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-4">
              <h3 className="text-4xl md:text-5xl font-heading font-bold text-foreground uppercase tracking-tighter italic leading-none">Fiscal Manifest</h3>
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(244,224,47,0.5)]" />
                 <p className="text-[10px] text-muted-foreground/20 font-bold uppercase tracking-[0.4em] italic">Authorized Financial Intelligence Grid v4.0</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group w-full md:min-w-[350px]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                <input 
                  placeholder="PROBE_FISCAL_MANIFEST..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-16 bg-secondary/30 border border-border/50 focus:bg-secondary/50 focus:border-primary/20 pl-16 rounded-[24px] text-[10px] font-bold uppercase tracking-[0.3em] text-foreground italic outline-none transition-all"
                />
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                 <Button variant="ghost" className="h-16 px-8 rounded-[24px] bg-secondary/30 border border-border/10 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40 hover:text-foreground transition-all italic">
                    <Filter className="w-5 h-5 mr-3" /> Filters
                 </Button>
                 <GoldButton size="md" className="h-16 px-10 rounded-[24px]">
                    <Download className="w-5 h-5 mr-3" /> Export Audit
                 </GoldButton>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-10 space-y-4 pb-20">
          <div className="hidden md:grid grid-cols-6 px-10 mb-8 text-[10px] font-bold text-muted-foreground/10 uppercase tracking-[0.6em] italic">
             <div className="col-span-2 text-left">Transactional Description</div>
             <div>Sector Tier</div>
             <div>Deployment ID</div>
             <div>Audit Delta</div>
             <div className="text-right">Settlement Status</div>
          </div>
          
          <div className="space-y-4">
            {ledgerEntries.map((entry, idx) => (
              <motion.div 
                key={entry.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-6 items-center p-6 md:p-10 bg-secondary/10 border border-border/20 rounded-[40px] hover:border-primary/20 hover:bg-secondary/20 transition-all duration-500 group relative overflow-hidden shadow-sm shadow-black/40"
              >
                <div className="col-span-2 flex items-center gap-8">
                  <div className={cn(
                    "w-16 h-16 rounded-3xl border border-border/10 flex items-center justify-center transition-all group-hover:scale-110 shadow-2xl",
                    entry.type === 'credit' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {entry.type === 'credit' ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownLeft className="w-7 h-7" />}
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors tracking-tight uppercase italic leading-none mb-2">{entry.description}</p>
                    <p className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-[0.3em] italic">{entry.date}</p>
                  </div>
                </div>
                
                <div className="hidden md:block">
                   <p className="text-[11px] font-bold text-foreground/40 uppercase tracking-[0.2em] italic">{entry.category}</p>
                </div>

                <div className="hidden md:block">
                   <p className="text-[11px] font-bold text-muted-foreground/20 uppercase tracking-[0.3em] italic">{entry.id.padStart(6, 'SEC-00')}</p>
                </div>

                <div className="hidden md:block">
                  <p className={cn(
                    "text-3xl font-heading font-bold italic group-hover:scale-105 transition-all text-left",
                    entry.type === 'credit' ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {entry.type === 'credit' ? '+' : '-'}R{Math.abs(entry.amount).toLocaleString()}
                  </p>
                </div>

                <div className="flex md:block justify-between items-center mt-6 md:mt-0 text-right">
                  <Badge variant="outline" className={cn(
                    "px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] shadow-xl italic border",
                    entry.status === 'Cleared' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                    entry.status === 'Pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {entry.status}
                  </Badge>
                </div>
                {/* Tactical accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-10 bg-secondary/30 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-8">
           <p className="text-[10px] text-muted-foreground/10 font-bold uppercase tracking-[0.3em] italic">System Audit: Showing 6 of 842 identified fiscal nodes</p>
           <div className="flex gap-4">
              <Button variant="ghost" className="h-14 bg-secondary/50 hover:bg-secondary rounded-2xl px-10 text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground/40 hover:text-foreground transition-all italic">Previous Sequence</Button>
              <Button variant="ghost" className="h-14 bg-secondary/50 hover:bg-secondary rounded-2xl px-10 text-[10px] uppercase font-bold tracking-[0.3em] text-primary hover:text-foreground transition-all italic underline decoration-primary/20">Next Sequence</Button>
           </div>
        </div>
      </div>

      {/* Yield Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 rounded-[50px] bg-secondary/10 border border-border/50 text-left space-y-12 relative overflow-hidden group shadow-2xl"
         >
            <div className="absolute inset-0 bg-grid-tactical opacity-10 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
               <div className="space-y-2">
                  <h4 className="text-3xl font-heading font-bold text-foreground uppercase italic tracking-tighter leading-none">Capture Velocity</h4>
                  <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.4em] italic leading-none">Rolling 30-Day Fiscal Analytics</p>
               </div>
               <div className="w-16 h-16 rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform shadow-xl">
                  <Activity className="w-8 h-8" />
               </div>
            </div>
            
            <div className="h-48 w-full flex items-end gap-3 px-4 relative z-10">
               {[40, 65, 45, 90, 70, 50, 85, 100, 75, 95, 60, 80].map((h, i) => (
                  <motion.div 
                     key={i}
                     initial={{ height: 0 }}
                     animate={{ height: `${h}%` }}
                     transition={{ delay: i * 0.05, duration: 1 }}
                     className={cn("flex-1 rounded-t-xl transition-colors duration-500", i > 8 ? "bg-primary shadow-[0_0_15px_rgba(244,224,47,0.3)]" : "bg-muted-foreground/10 group-hover:bg-muted-foreground/20")}
                  />
               ))}
            </div>
            
            <div className="flex justify-between items-center relative z-10 pt-4 border-t border-border/10">
               <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.5em] italic">Current Cycle Progress: 92% Efficiency</p>
               <Button variant="ghost" className="text-[10px] font-bold text-primary uppercase italic tracking-widest hover:bg-primary/10 px-4 py-2 rounded-xl transition-all h-auto">View Full Analytics_ <ChevronRight className="w-3 h-3 ml-2" /></Button>
            </div>
         </motion.div>

         <div className="space-y-8">
            <motion.div 
               initial={{ opacity: 0, x: 40 }}
               animate={{ opacity: 1, x: 0 }}
               className="p-10 rounded-[50px] bg-secondary/10 border border-border/50 text-left space-y-6 relative overflow-hidden group shadow-2xl"
            >
               <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
               </div>
               <h5 className="text-2xl font-heading font-bold text-foreground uppercase italic tracking-tight leading-none underline decoration-primary/20">Audit Security Notice</h5>
               <p className="text-sm font-medium text-muted-foreground/60 italic leading-relaxed">System-wide fiscal integrity is verified. High-intent audit protocols will initiate in T-minus 48 hours for Q1 closing sequence. Ensure all operational depletions are documented.</p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 40 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="p-10 rounded-[50px] border border-primary/10 bg-primary/5 group hover:bg-primary/10 transition-all shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
               <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[24px] bg-primary border border-primary flex items-center justify-center text-primary-foreground shadow-[0_10px_30px_rgba(244,224,47,0.3)]">
                     <Lock className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary italic leading-none">Sector Intelligence</p>
                     <h6 className="text-2xl font-heading font-bold text-foreground uppercase italic tracking-tighter leading-none">Financial Fortress Hub</h6>
                  </div>
                  <div className="ml-auto">
                     <Button size="icon" className="w-12 h-12 rounded-full bg-secondary/50 border border-border/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                        <ArrowRight className="w-6 h-6" />
                     </Button>
                  </div>
               </div>
            </motion.div>
         </div>
      </div>
    </div>
  );
}
