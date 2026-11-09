import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Calendar, 
  Mail, 
  Phone, 
  ArrowRight, 
  UserPlus, 
  CheckCircle2,
  Trash2,
  Clock,
  Filter,
  Activity,
  Zap,
  ShieldAlert,
  BrainCircuit,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { scoreLeads } from '@/services/aiIntelligence';

export default function LeadCRM() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'contacted' | 'enrolled'>('all');
  const [scoring, setScoring] = useState(false);
  const [leadScores, setLeadScores] = useState<Record<string, any>>({});

  React.useEffect(() => {
    const fetchLeads = async () => {
      try {
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("CRM Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const runAIScoring = async () => {
    if (leads.length === 0) return;
    setScoring(true);
    try {
      const scores = await scoreLeads(leads);
      const scoreMap: Record<string, any> = {};
      scores.forEach((s: any) => {
        scoreMap[s.leadId] = s;
      });
      setLeadScores(scoreMap);
      toast.success('Lead Recon AI Analysis Complete');
    } catch (e) {
      toast.error('AI Nexus Sync Failure');
    } finally {
      setScoring(false);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status });
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
      toast.success(`Unit Status: ${status}`);
    } catch (e) {
      toast.error("Status protocol failure");
    }
  };

  const stats = [
    { label: 'New Recon', count: leads.filter(l => l.status === 'new').length, icon: Target, status: 'Active Discovery' },
    { label: 'Trial Deployed', count: leads.filter(l => l.status === 'contacted').length, icon: Zap, status: 'Active Engagement' },
    { label: 'Enrolled Units', count: leads.filter(l => l.status === 'enrolled').length, icon: ShieldAlert, status: 'Asset Confirmed' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-12 lg:p-20 space-y-16 animate-in fade-in duration-700 bg-deep-black">
      {/* Recon Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card group relative border-white/5 bg-charcoal/30 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-between">
               <div className="space-y-2">
                  <div className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 italic">{s.label}</div>
                  <div className="text-6xl font-display font-black italic tracking-tighter text-white group-hover:text-gold transition-colors">{s.count}</div>
                  <p className="text-[8px] font-black text-gold/40 uppercase tracking-[0.3em] italic">{s.status}</p>
               </div>
               <div className={cn("w-18 h-18 rounded-[24px] bg-white/5 flex items-center justify-center text-gold shadow-2xl group-hover:scale-110 transition-transform")}>
                  <s.icon className="w-8 h-8" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-16">
        <div className="xl:col-span-3 space-y-12">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 px-4">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[22px] bg-gold/10 flex items-center justify-center text-gold shadow-[0_10px_30px_rgba(244,224,47,0.1)] border border-gold/20">
                    <Filter className="w-7 h-7" />
                 </div>
                 <div className="text-left space-y-1">
                    <h3 className="text-4xl font-display font-black uppercase italic tracking-tighter text-white leading-none">Unit Pipeline</h3>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 italic">Intelligence Lifecycle Monitoring</p>
                 </div>
              </div>
              <div className="flex bg-white/5 border border-white/5 p-2 rounded-[24px]">
                 {['all', 'new', 'contacted', 'enrolled'].map((t: any) => (
                   <Button
                     key={t}
                     onClick={() => setActiveTab(t)}
                     className={cn(
                       "h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic transition-all",
                       activeTab === t ? "bg-gold text-black shadow-2xl" : "bg-transparent text-white/20 hover:text-white"
                     )}
                   >
                     {t}
                   </Button>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {leads.filter(l => activeTab === 'all' || l.status === activeTab).map((lead, idx) => (
                  <motion.div 
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="premium-card group flex flex-col md:flex-row items-center justify-between border-white/5 bg-charcoal/20 hover:bg-charcoal/40 hover:border-gold/20 cursor-pointer overflow-hidden gap-8"
                  >
                    <div className="flex items-center gap-10 flex-1">
                      <div className="w-16 h-16 rounded-[40px] bg-black border border-white/10 flex items-center justify-center text-[18px] font-display font-black text-gold shadow-2xl italic group-hover:scale-110 transition-transform">
                        {lead.firstName?.[0] || lead.name?.[0] || '?'}
                      </div>
                      <div className="space-y-2 text-left">
                         <div className="text-2xl font-display font-black uppercase italic tracking-tighter text-white group-hover:text-gold transition-colors leading-none">
                           {lead.firstName || lead.name || 'Unknown'} {lead.lastName || ''}
                         </div>
                         {leadScores[lead.id] && (
                           <div className="flex items-center gap-3">
                              <Badge className="bg-primary text-black font-black italic text-[9px] tracking-widest px-3">
                                 CONV_PROB: {leadScores[lead.id].score}%
                              </Badge>
                              <span className="text-[9px] text-primary/60 font-black italic uppercase tracking-wider">{leadScores[lead.id].priorityTactic}</span>
                           </div>
                         )}
                         <div className="flex items-center gap-4">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic text-left">Potential Tier: Tactical</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest italic">{lead.createdAt instanceof Date ? (lead.createdAt as Date).toLocaleDateString() : 'Active Recon'}</p>
                         </div>
                      </div>
                    </div>

                    <div className="hidden lg:flex flex-col gap-3 flex-1 text-left">
                       <div className="flex items-center gap-3 text-[11px] font-black text-white/30 uppercase italic tracking-widest group-hover:text-white/60 transition-colors">
                          <Mail className="w-4 h-4 text-gold/40" />
                          {lead.email}
                       </div>
                       <div className="flex items-center gap-3 text-[11px] font-black text-white/30 uppercase italic tracking-widest">
                          <Phone className="w-4 h-4 text-gold/40" />
                          +27 (OPERATIONAL)
                       </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <Badge className={cn(
                         "rounded-full px-6 py-2 font-black uppercase tracking-[0.3em] text-[9px] italic shadow-2xl",
                         lead.status === 'new' ? "bg-gold text-black" :
                         lead.status === 'contacted' ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/20" :
                         lead.status === 'enrolled' ? "bg-blue-500/20 text-blue-500 border border-blue-500/20" : "bg-white/5 text-white/20"
                       )}>
                          {lead.status}
                       </Badge>
                       <div className="flex items-center gap-4">
                          <Button 
                            onClick={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, 'enrolled'); }}
                            className="h-12 px-8 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:bg-gold hover:text-black hover:border-gold transition-all text-[10px] font-black uppercase tracking-[0.2em] italic"
                          >
                             MOBLIZE
                          </Button>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 text-white/10 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all">
                             <Trash2 className="w-5 h-5" />
                          </Button>
                       </div>
                    </div>
                    {/* Tactical trace */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>

        {/* Lead Sidebar: Automation */}
        <div className="space-y-12">
           <Card className="premium-card space-y-12 bg-charcoal/20 border-white/5">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[24px] bg-black flex items-center justify-center text-gold shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                    <Clock className="w-8 h-8" />
                 </div>
                 <div className="text-left">
                    <h4 className="text-xl font-display font-black uppercase italic tracking-tighter text-white leading-none">Nurture</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Intelligence Sync</p>
                 </div>
              </div>
              
              <div className="space-y-6">
                 {[
                   { label: 'Tactical Intro', status: 'Inbound', color: 'bg-emerald-500' },
                   { label: 'Social Proof', status: 'Authorized', color: 'bg-emerald-500' },
                   { label: 'Trial Warning', status: 'Standby', color: 'bg-gold' },
                 ].map((n, i) => (
                   <div key={i} className="flex items-center gap-6 p-6 bg-black/40 rounded-[28px] border border-white/5 group hover:border-gold/20 transition-all cursor-crosshair">
                      <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]", n.color)} />
                      <div className="flex-1 text-left">
                         <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors italic">{n.label}</div>
                         <div className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em] italic mt-1">{n.status}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-gold transition-all group-hover:translate-x-1" />
                   </div>
                 ))}
              </div>

              <Button 
                onClick={runAIScoring}
                disabled={scoring}
                className="w-full h-20 btn-gold rounded-[30px] shadow-2xl italic transition-all active:scale-95 flex items-center justify-center gap-4"
              >
                 {scoring ? <RefreshCw className="w-6 h-6 animate-spin" /> : <BrainCircuit className="w-6 h-6" />}
                 {scoring ? 'SYNCING...' : 'AI NEURAL ASSESSMENT'}
              </Button>
           </Card>

           <div className="premium-card bg-emerald-500/5 border border-emerald-500/10 text-left space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-1000" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-xl">
                 <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <div className="space-y-2">
                 <h5 className="text-2xl font-display font-black uppercase italic tracking-tighter text-emerald-500">Pipeline Alpha</h5>
                 <p className="text-[11px] font-black text-emerald-500/40 leading-relaxed uppercase tracking-[0.4em] italic leading-relaxed">
                    Matrix Efficiency +18%. Higher than Global Benchmarks. Systems Optimal.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
