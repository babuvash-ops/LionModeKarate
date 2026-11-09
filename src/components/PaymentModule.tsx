import { useState } from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  Download, 
  Filter,
  Plus,
  CreditCard,
  History,
  TrendingDown,
  ChevronRight,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Database,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import GoldButton from './shared/GoldButton';

const transactions = [
  { id: '1', student: 'Liam Anderson', amount: 1200.00, date: 'Mar 24, 2024', status: 'completed', type: 'Membership' },
  { id: '2', student: 'Sarah Jenkins', amount: 150.00, date: 'Mar 23, 2024', status: 'completed', type: 'Open Mat' },
  { id: '3', student: 'Oliver Taylor', amount: 850.00, date: 'Mar 22, 2024', status: 'pending', type: 'Uniform' },
  { id: '4', student: 'Mike Ross', amount: 1200.00, date: 'Mar 20, 2024', status: 'completed', type: 'Membership' },
  { id: '5', student: 'Harvey Specter', amount: 500.00, date: 'Mar 18, 2024', status: 'failed', type: 'Seminar' },
  { id: '6', student: 'Louis Litt', amount: 1200.00, date: 'Mar 15, 2024', status: 'completed', type: 'Membership' },
];

export default function PaymentModule({ branding }: any) {
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Fiscal Velocity', value: 'R42,500', icon: TrendingUp, trend: '+12.4%', status: 'Growth Detected' },
    { label: 'Unsettled Assets', value: 'R8,200', icon: Clock, trend: '14 Units', status: 'Awaiting Protocol' },
    { label: 'Operational Nodes', value: '118', icon: Zap, trend: '92% Stability', status: 'Active Contracts' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-background pb-32 pt-8">
      {/* Revenue Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 group relative border border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/20 rounded-[40px] transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-10">
              <div className="w-16 h-16 rounded-2xl bg-secondary border border-border/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-xl group-hover:scale-110">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none mb-2">{stat.trend}</p>
                <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-[0.3em] italic">{stat.status}</p>
              </div>
            </div>
            <p className="text-[11px] font-bold text-muted-foreground/30 uppercase tracking-[0.4em] mb-4 italic">{stat.label}</p>
            <h3 className="text-5xl font-heading font-bold text-foreground tracking-tighter italic group-hover:text-primary transition-colors">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Fiscal Manifest */}
      <div className="border border-border/30 bg-secondary/10 rounded-[60px] overflow-hidden shadow-2xl relative">
        <div className="p-8 md:p-12 border-b border-border/10 bg-secondary/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-4">
              <h3 className="text-4xl md:text-5xl font-heading font-bold text-foreground uppercase tracking-tighter italic leading-none">Fiscal Manifest</h3>
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <p className="text-[10px] text-muted-foreground/20 font-bold uppercase tracking-[0.4em] italic">Authorized Live Asset Grid v2.1</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group w-full md:min-w-[320px]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                <input 
                  placeholder="PROBE_FISCAL_RECORDS..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-16 bg-secondary/30 border border-border/50 focus:bg-secondary/50 focus:border-primary/20 pl-16 rounded-[24px] text-[10px] font-bold uppercase tracking-[0.3em] text-foreground italic outline-none transition-all"
                />
              </div>
              <GoldButton size="md" className="w-full md:w-auto h-16 px-10">
                <Plus className="w-5 h-5 mr-3" /> Initial Credit
              </GoldButton>
            </div>
          </div>
        </div>

        <div className="p-10 bg-deep-black space-y-4 pb-20">
          <div className="hidden md:grid grid-cols-5 px-8 mb-6 text-[10px] font-black text-white/10 uppercase tracking-[0.6em] italic">
             <div className="col-span-2">Tactical Unit ID</div>
             <div>Protocol Type</div>
             <div>Fiscal Depth</div>
             <div className="text-right">Deployment Status</div>
          </div>
          
          <div className="space-y-4">
            {transactions.map((tx, idx) => (
              <motion.div 
                key={tx.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-5 items-center p-8 bg-secondary/10 border border-border/10 rounded-[32px] hover:border-primary/20 hover:bg-secondary/20 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="col-span-2 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary border border-border/10 flex items-center justify-center text-[13px] font-bold uppercase italic shadow-2xl text-primary group-hover:scale-110 transition-transform">
                    {tx.student.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors tracking-tight uppercase italic leading-none mb-1">{tx.student}</p>
                    <p className="text-[9px] text-muted-foreground/20 font-bold uppercase tracking-[0.3em] italic">{tx.date}</p>
                  </div>
                </div>
                
                <div className="hidden md:block">
                   <Badge variant="outline" className="bg-secondary/50 border-border/10 text-muted-foreground/40 text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full italic group-hover:border-primary/20 transition-all">
                      {tx.type}
                   </Badge>
                </div>

                <div className="hidden md:block">
                  <p className="text-3xl font-heading font-bold text-foreground italic group-hover:text-primary transition-all">R{tx.amount.toFixed(2)}</p>
                </div>

                <div className="flex md:block justify-between items-center mt-6 md:mt-0 text-right">
                  <span className={cn(
                    "px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] shadow-2xl italic",
                    tx.status === 'completed' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
                    tx.status === 'pending' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  )}>
                    {tx.status}
                  </span>
                </div>
                {/* Tactical accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-secondary/30 border-t border-border/10 flex items-center justify-between">
           <p className="text-[10px] text-muted-foreground/10 font-bold uppercase tracking-[0.3em] italic">System Audit: Showing 6 of 142 authorized records</p>
           <div className="flex gap-4">
              <Button variant="ghost" className="h-12 bg-secondary/5 hover:bg-secondary/10 rounded-2xl px-8 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40 hover:text-foreground transition-all italic">Previous Block</Button>
              <Button variant="ghost" className="h-12 bg-secondary/5 hover:bg-secondary/10 rounded-2xl px-8 text-[10px] uppercase font-bold tracking-widest text-primary hover:text-foreground transition-all italic underline">Next Block</Button>
           </div>
        </div>
      </div>

      {/* Payment Gateways */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['PayFast', 'Yoco', 'Stripe', 'Ozow'].map((gateway, i) => (
          <motion.div
            key={gateway}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-8 bg-secondary/10 border border-border/50 rounded-[32px] flex flex-col items-center justify-center text-center group hover:border-primary/20 hover:bg-secondary/20 transition-all"
          >
            <div className="w-16 h-16 rounded-[20px] bg-secondary border border-border/20 flex items-center justify-center text-muted-foreground/20 group-hover:text-primary mb-6 shadow-xl group-hover:scale-110 transition-transform">
               <Database className="w-8 h-8" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-foreground italic group-hover:text-primary transition-colors">{gateway} Integration</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/20 mt-3 group-hover:text-muted-foreground/40 italic">Awaiting API Protocol</p>
          </motion.div>
        ))}
      </div>

      {/* Authorized Notice */}
      <div className="flex items-center gap-6 p-8 bg-secondary/30 border border-primary/10 text-foreground rounded-[40px] relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-all duration-1000" />
         <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(244,224,47,0.1)]">
            <ShieldCheck className="w-7 h-7 text-primary animate-pulse" />
         </div>
         <div className="relative z-10 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary italic mb-1">Fiscal Protocol Notice.a2</p>
            <p className="text-sm font-medium text-muted-foreground/60 italic leading-relaxed">Automatic settlement protocols will initiate in 24 hours. Verify all pending memberships for operational continuity.</p>
         </div>
      </div>
    </div>
  );
}
