import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Phone, 
  Plus, 
  Search, 
  MoreVertical, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Calendar,
  Zap,
  ArrowRight,
  TrendingUp,
  Star,
  Activity,
  ShieldCheck,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import GoldButton from './shared/GoldButton';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: 'new' | 'contacted' | 'trial' | 'converted';
  lastActivity: string;
  potentialScore: number;
  aiInsight: string;
}

const initialLeads: Lead[] = [
  { id: '1', name: 'Zanele Khumalo', phone: '+27 82 567 8901', email: 'zanele@example.co.za', source: 'Facebook', status: 'new', lastActivity: '2h ago', potentialScore: 88, aiInsight: 'High engagement. Ready for trial.' },
  { id: '2', name: 'Johan van der Merwe', phone: '+27 71 567 8902', email: 'johan@example.co.za', source: 'Website', status: 'contacted', lastActivity: '5h ago', potentialScore: 65, aiInsight: 'Inquired about weekend adult classes.' },
  { id: '3', name: 'Aarav Patel', phone: '+27 63 567 8903', email: 'aarav@example.co.za', source: 'Referral', status: 'trial', lastActivity: '1d ago', potentialScore: 92, aiInsight: 'Sibling of active member.' },
  { id: '4', name: 'Thabo Mbeki', phone: '+27 84 567 8904', email: 'thabo@example.co.za', source: 'Google', status: 'trial', lastActivity: '2d ago', potentialScore: 48, aiInsight: 'Needs scholarship follow-up.' },
];

const STAGES = [
  { id: 'new', label: 'New Vector', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Signal Locked', color: 'bg-amber-500' },
  { id: 'trial', label: 'Field Evaluation', color: 'bg-purple-500' },
  { id: 'converted', label: 'Unit Activated', color: 'bg-emerald-500' },
];

export default function CRMModule({ branding }: any) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search)
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-background pb-32 pt-8">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="space-y-4 text-left">
          <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary bg-primary/5 border-primary/20 px-4 py-1.5 italic rounded-full">Growth Matrix</Badge>
          <h2 className="text-5xl md:text-7xl font-heading font-bold text-foreground tracking-tighter uppercase italic leading-none">Intake <br /><span className="text-primary italic">Manifest</span></h2>
          <div className="flex items-center gap-3 pl-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow-gold" />
            <p className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-[0.4em] italic">Operational Pipeline Active</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
            <input 
              placeholder="FILTER_SIGNALS..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 bg-secondary/20 border border-border/50 focus:bg-secondary/40 focus:border-primary/20 pl-16 rounded-[24px] text-[10px] font-bold uppercase tracking-[0.3em] text-foreground italic outline-none transition-all placeholder:text-muted-foreground/10"
            />
          </div>
          <GoldButton size="md" className="h-16 px-10 rounded-[32px] w-full md:w-auto">
            <Plus className="w-5 h-5 mr-3" /> New Target
          </GoldButton>
        </div>
      </div>

      {/* Kanban Environment */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pb-12">
        <div className="flex gap-10 min-w-max">
          {STAGES.map((stage) => (
            <div key={stage.id} className="w-[380px] space-y-10">
              <div className="flex items-center justify-between px-6 py-4 bg-secondary/10 border border-border/10 rounded-[28px] backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]", stage.color.replace('bg-', 'text-'))} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60 italic">{stage.label}</span>
                </div>
                <Badge className="bg-secondary/50 border border-border/10 text-primary text-[10px] font-bold rounded-lg px-3 italic">
                  {filteredLeads.filter(l => l.status === stage.id).length}
                </Badge>
              </div>

              <div className="space-y-8 min-h-[600px]">
                <AnimatePresence mode="popLayout">
                  {filteredLeads
                    .filter((lead) => lead.status === stage.id)
                    .map((lead, idx) => (
                      <motion.div
                        key={lead.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative"
                      >
                        <div className="premium-card bg-secondary/10 border border-border/30 hover:bg-secondary/20 hover:border-primary/30 transition-all duration-700 rounded-[50px] overflow-hidden text-left shadow-2xl">
                          <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-5 blur-3xl pointer-events-none transition-all duration-1000 group-hover:opacity-10", stage.color.replace('bg-', 'text-'))} style={{ backgroundColor: 'currentColor' }} />
                          <div className={cn("absolute top-0 left-0 w-1.5 h-full opacity-20 group-hover:opacity-100 transition-opacity", stage.color)} />
                          
                          <div className="flex items-start justify-between mb-10">
                            <div className="space-y-3">
                              <h3 className="text-3xl font-heading font-bold text-foreground group-hover:text-primary transition-colors tracking-tight uppercase italic leading-[0.85]">{lead.name}</h3>
                              <div className="flex items-center gap-3">
                                 <Badge variant="outline" className="bg-background/40 border border-border/10 text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.3em] px-4 py-1 italic rounded-lg group-hover:text-primary/60 transition-colors">
                                   {lead.source}
                                 </Badge>
                              </div>
                            </div>
                            <div className={cn(
                              "w-14 h-14 rounded-2xl flex flex-col items-center justify-center border border-border/10 shadow-xl relative overflow-hidden group-hover:scale-110 transition-transform duration-500",
                              lead.potentialScore > 80 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-background/40 text-muted-foreground/20"
                            )}>
                              <span className="text-[13px] font-bold italic leading-none">{lead.potentialScore}</span>
                              <span className="text-[7px] font-bold uppercase tracking-widest opacity-40 mt-1">INTEL</span>
                            </div>
                          </div>

                          <div className="bg-background/40 border border-border/10 rounded-[35px] p-8 mb-10 relative group/insight transition-all group-hover:bg-background/60">
                             <Zap className="absolute top-6 right-8 w-4 h-4 text-primary opacity-20 animate-pulse" />
                             <p className="text-[12px] font-medium text-muted-foreground/50 leading-relaxed italic uppercase tracking-wider">
                               "{lead.aiInsight}"
                             </p>
                          </div>

                          <div className="flex items-center justify-between pt-8 border-t border-border/10">
                            <div className="flex items-center gap-3 px-6 py-2 bg-secondary/30 rounded-full border border-border/5 group-hover:border-primary/10 transition-all">
                              <Clock className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                              <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest italic group-hover:text-foreground/60 transition-colors">
                                {lead.lastActivity}
                              </span>
                            </div>
                            <div className="flex gap-4">
                               <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-background/40 border border-border/10 text-muted-foreground/20 hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all shadow-xl group-hover:scale-105">
                                 <Phone className="w-5 h-5" />
                               </Button>
                               <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-background/40 border border-border/10 text-muted-foreground/20 hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all shadow-xl group-hover:scale-105">
                                 <MessageSquare className="w-5 h-5" />
                               </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  }
                </AnimatePresence>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-32 border-2 border-dashed border-border/20 rounded-[50px] text-[11px] uppercase font-bold tracking-[0.4em] text-muted-foreground/10 hover:bg-secondary/10 hover:border-primary/20 hover:text-primary transition-all flex flex-col items-center justify-center gap-3 italic group shadow-inner"
                >
                   <div className="w-10 h-10 rounded-2xl bg-secondary/50 border border-border/20 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                      <Plus className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" /> 
                   </div>
                   Deploy Vector
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Intelligence Feed */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="p-12 rounded-[70px] bg-secondary/10 border border-border/50 text-left relative overflow-hidden group shadow-2xl"
      >
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-[120px] pointer-events-none" />
         <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="w-24 h-24 rounded-[40px] bg-primary flex items-center justify-center text-primary-foreground shadow-glow-gold relative">
               <TrendingUp className="w-12 h-12" />
               <div className="absolute inset-0 bg-white/20 rounded-[40px] animate-ping opacity-20" />
            </div>
            <div className="flex-1 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-gold animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary italic leading-none">Global Activation Insight</p>
               </div>
               <h4 className="text-3xl md:text-5xl font-heading font-bold text-foreground uppercase italic tracking-tighter leading-tight">Neural Conversion Metrics +12.4%</h4>
               <p className="text-lg font-medium text-muted-foreground/50 italic leading-relaxed max-w-4xl tracking-tight">Signal response protocols have achieved optimal resonance. Recruitment vectors are currently experiencing peak throughput. Recommend increasing field evaluation deployments for the following 72 hours.</p>
            </div>
            <GoldButton variant="outline" className="h-20 px-12 text-[11px] font-bold uppercase tracking-[0.4em] italic rounded-[35px] border border-border/50 hover:bg-primary/5">
                Full Analytics <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-3 transition-all duration-500" />
            </GoldButton>
         </div>
      </motion.div>
    </div>
  );
}
