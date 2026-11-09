import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  Target, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Filter,
  ShieldCheck,
  Zap,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import GoldButton from './shared/GoldButton';

export default function ReportsModule() {
  const metrics = [
    { label: 'Fiscal Velocity', value: 'R142.5k', change: '+12.5%', trend: 'up', icon: CreditCard },
    { label: 'Active Personnel', value: '428', change: '+18', trend: 'up', icon: Users },
    { label: 'Conversion Rate', value: '24.2%', change: '-2.1%', trend: 'down', icon: Target },
    { label: 'System Retention', value: '94.8%', change: '+0.5%', trend: 'up', icon: Activity },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-background pb-32 pt-8">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="space-y-4 text-left">
          <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary bg-primary/5 border-primary/20 px-4 py-1.5 italic rounded-full">Telemetry Hub</Badge>
          <h2 className="text-5xl md:text-7xl font-heading font-bold text-foreground tracking-tighter uppercase italic leading-none">Field_ <br /><span className="text-primary italic">Intelligence</span></h2>
          <div className="flex items-center gap-3 pl-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow-gold" />
            <p className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-[0.4em] italic">Real-time Node Telemetry Active</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Button variant="ghost" className="h-16 px-10 rounded-[32px] bg-secondary/20 border border-border/50 text-muted-foreground/40 hover:text-foreground font-bold uppercase italic tracking-widest text-[10px]">
             <Calendar className="w-5 h-5 mr-3 text-primary" /> Temporal Range
          </Button>
          <GoldButton size="md" className="h-16 px-10 rounded-[32px] w-full md:w-auto">
             <Download className="w-5 h-5 mr-3" /> Export Archives
          </GoldButton>
        </div>
      </div>

      {/* Metric Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card bg-secondary/10 border border-border/50 rounded-[45px] group hover:bg-secondary/20 hover:border-primary/30 transition-all duration-700 relative overflow-hidden shadow-2xl"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center justify-between mb-10">
                <div className="w-14 h-14 rounded-2xl bg-secondary border border-border/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl group-hover:scale-110">
                   <m.icon className="w-7 h-7" />
                </div>
                <div className="flex flex-col items-end">
                   <Badge className={cn(
                       "bg-transparent border-none font-bold italic text-[9px] tracking-[0.2em] uppercase leading-none mb-1",
                       m.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                   )}>
                       {m.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1 inline" /> : <TrendingDown className="w-3 h-3 mr-1 inline" />}
                       {m.change}
                   </Badge>
                   <p className="text-[7px] font-bold text-muted-foreground/20 uppercase tracking-widest italic leading-none">V4 Protocol Status</p>
                </div>
             </div>
             <div className="space-y-2 text-left">
                <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.5em] italic leading-tight group-hover:text-primary transition-colors">{m.label}</p>
                <div className="text-4xl md:text-5xl font-heading font-bold text-foreground italic tracking-tighter leading-none">{m.value}</div>
             </div>
             {/* Tactical accent */}
             <div className="absolute left-10 bottom-0 h-1 w-12 bg-primary/20 group-hover:w-32 group-hover:bg-primary transition-all duration-700" />
          </motion.div>
        ))}
      </div>

      {/* Strategic Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <Card className="lg:col-span-2 premium-card bg-secondary/10 border border-border/50 rounded-[60px] space-y-12 relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,1)]">
            <div className="absolute inset-0 bg-grid-tactical opacity-10 pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-8">
                <div className="text-left space-y-2">
                    <div className="flex items-center gap-3">
                       <Activity className="w-4 h-4 text-primary" />
                       <h4 className="text-3xl font-heading font-bold text-foreground uppercase italic tracking-tight leading-none">Deployment Velocity</h4>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-[0.4em] italic">Personnel Acquisition Flow Matrix</p>
                </div>
                <div className="flex gap-2 bg-background/40 p-2 rounded-2xl border border-border/10">
                    {['1M', '3M', '6M', '1Y'].map(t => (
                        <button key={t} className="w-12 h-12 rounded-xl text-[10px] font-bold text-muted-foreground/30 hover:text-primary hover:bg-primary/10 transition-all italic uppercase tracking-widest">{t}</button>
                    ))}
                </div>
            </div>
            <div className="h-[450px] w-full bg-background/40 rounded-[50px] border border-border/30 flex items-center justify-center relative overflow-hidden group shadow-inner">
                 <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-0 border border-primary/5 rounded-full scale-[2] pointer-events-none" 
                 />
                 <BarChart3 className="w-24 h-24 text-muted-foreground/10 group-hover:text-primary/20 transition-all duration-700 group-hover:scale-110" />
                 <p className="absolute bottom-10 text-[9px] font-bold text-primary/30 uppercase tracking-[1em] italic select-none">Tactical Stream Optimized</p>
                 
                 {/* Visual Data Stream simulation */}
                 <div className="absolute inset-0 flex items-end p-20 gap-4 opacity-5 pointer-events-none">
                    {[40, 70, 45, 90, 65, 80, 50, 100, 85, 95, 60, 75, 40].map((h, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05, duration: 1 }}
                          className="flex-1 bg-primary rounded-full" 
                        />
                    ))}
                 </div>
                 <Button variant="ghost" className="absolute top-8 right-8 h-12 w-12 rounded-2xl bg-secondary/40 border border-border/30 text-primary opacity-0 group-hover:opacity-100 transition-all">
                    <Maximize2 className="w-5 h-5" />
                 </Button>
            </div>
         </Card>

         <div className="space-y-12">
            <Card className="premium-card bg-secondary/10 border border-border/50 rounded-[60px] space-y-12 shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="text-left space-y-2 relative z-10">
                    <div className="flex items-center gap-3">
                       <Zap className="w-4 h-4 text-primary" />
                       <h4 className="text-2xl font-heading font-bold text-foreground uppercase italic tracking-tight leading-none">Sector Resonance</h4>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-[0.4em] italic">Demographic Operational Status</p>
                </div>
                <div className="space-y-10 relative z-10">
                    {[
                        { label: 'Little Lions Unit', level: 85, color: 'bg-primary' },
                        { label: 'Youth Warriors HQ', level: 92, color: 'bg-emerald-500' },
                        { label: 'Elite Combatants', level: 68, color: 'bg-amber-500' },
                    ].map((s, i) => (
                        <div key={i} className="space-y-4">
                            <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-[0.2em] italic">
                                <span className="text-muted-foreground/40 group-hover:text-primary transition-colors">{s.label}</span>
                                <span className="text-foreground tracking-widest">{s.level}% <span className="text-[8px] text-muted-foreground/20 ml-1">CAPACITY</span></span>
                            </div>
                            <div className="h-2.5 bg-background border border-border/10 rounded-full overflow-hidden shadow-inner">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${s.level}%` }}
                                    transition={{ duration: 1.5, ease: 'circOut' }}
                                    className={cn("h-full relative shadow-glow-gold", s.color)} 
                                >
                                   <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
                <Button variant="ghost" className="w-full h-14 rounded-2xl bg-secondary/20 border border-border/20 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.4em] italic hover:text-primary hover:bg-primary/5 transition-all">
                   Deploy Full Sector Audit
                </Button>
            </Card>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="premium-card bg-rose-500/5 border border-rose-500/20 text-left space-y-8 relative overflow-hidden group rounded-[60px] shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-rose-500/20 transition-all duration-1000 pointer-events-none" />
              <div className="w-16 h-16 rounded-[22px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.1)] group-hover:scale-110 transition-transform">
                 <Filter className="w-8 h-8 text-rose-500" />
              </div>
              <div className="space-y-3 text-left relative z-10">
                 <h5 className="text-3xl font-heading font-bold uppercase italic tracking-tighter text-foreground leading-none group-hover:text-rose-500 transition-colors">Attrition_Alert</h5>
                 <p className="text-[12px] font-bold text-rose-500/50 leading-relaxed uppercase tracking-[0.3em] italic">
                    12 Units Signal Loss Checked &gt;14 Cycles. Recommend High-Impact Inbound Target Protocol Deployment.
                 </p>
              </div>
              <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all p-0">
                 <ChevronRight className="w-6 h-6" />
              </Button>
            </motion.div>
         </div>
      </div>
    </div>
  );
}
