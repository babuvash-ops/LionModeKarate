import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  BrainCircuit, 
  TrendingDown, 
  UserMinus, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  ArrowRight,
  MessageCircle,
  FileText
} from 'lucide-react';
import { predictChurn, analyzeGradingReadiness } from '@/services/aiIntelligence';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function StrategicAI() {
  const [churnRisks, setChurnRisks] = useState<any[]>([]);
  const [readiness, setReadiness] = useState<any>(null);
  const [loading, setLoading] = useState(false);

   const runAnalysis = async () => {
    setLoading(true);
    try {
      const churnData = await predictChurn();
      const readyData = await analyzeGradingReadiness();
      
      setChurnRisks(churnData);
      setReadiness(readyData);
      toast.success('Strategic Intelligence Matrix Updated');
    } catch (e: any) {
      console.error("Analysis Error:", e);
      toast.error(e.message || 'AI Nexus synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  const risksByLevel = {
    high: churnRisks.filter(r => r.riskLevel === 'high'),
    medium: churnRisks.filter(r => r.riskLevel === 'medium'),
    low: churnRisks.filter(r => r.riskLevel === 'low'),
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-12">
      {/* AI Hero */}
      <div className="bg-black rounded-[48px] p-12 lg:p-20 shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-40" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(212,175,55,0.3)] animate-pulse">
                     <BrainCircuit className="w-8 h-8" />
                  </div>
                  <Badge className="bg-emerald-500 text-black font-black uppercase text-[9px] tracking-widest px-4 py-1 italic">Tactical AI Engine v2.4</Badge>
               </div>
               <h2 className="text-4xl lg:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                 Strategic <span className="text-primary">Intelligence</span>
               </h2>
               <p className="text-[#94a3b8] text-[11px] font-black uppercase tracking-[0.4em] max-w-xl leading-relaxed">
                 Leveraging neural analytics to predict student attrition, grading readiness, and operational bottlenecks.
               </p>
               <div className="space-y-4">
                 <Button 
                  onClick={runAnalysis}
                  disabled={loading}
                  className="bg-primary text-black hover:bg-primary/90 h-16 px-12 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] italic shadow-2xl group w-full md:w-auto"
                 >
                   {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-3" /> : <RefreshCw className="w-5 h-5 mr-3 transition-transform group-hover:rotate-180 duration-500" />}
                   {loading ? 'Analyzing Data Streams...' : 'Execute Full System Scan'}
                 </Button>
                 
                 {loading && (
                   <div className="space-y-2 max-w-xs transition-all animate-in fade-in slide-in-from-top-2">
                     <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-primary/60 italic">
                        <span>Syncing Grid</span>
                        <span>78%</span>
                     </div>
                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '78%' }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          className="h-full bg-primary"
                        />
                     </div>
                   </div>
                 )}
               </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4">
               {[
                 { label: 'Neural Mapping', value: 'Active', color: 'text-emerald-500' },
                 { label: 'Integrity Check', value: '100%', color: 'text-primary' },
                 { label: 'Response Latency', value: '142ms', color: 'text-white' },
                 { label: 'Data Points', value: '14k+', color: 'text-white' },
               ].map((stat, i) => (
                 <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-xl">
                    <div className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className={cn("text-xl font-black italic tracking-tighter", stat.color)}>{stat.value}</div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Churn Prediction */}
        <div className="space-y-8">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                    <UserMinus className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-rose-500">Churn Risk Matrix</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Neural prediction of student units at risk of attrition.</p>
                 </div>
              </div>
           </div>

            <Card className="border border-white/5 bg-secondary/5 rounded-[40px] overflow-hidden">
              <CardContent className="p-0">
                 {churnRisks.length === 0 ? (
                   <div className="p-20 text-center space-y-4 opacity-20 italic font-black uppercase tracking-widest text-[10px]">
                      No active data stream. Execute scan to populate.
                   </div>
                 ) : (
                   <div className="divide-y divide-white/5">
                      {['high', 'medium', 'low'].map((level) => {
                        const students = risksByLevel[level as keyof typeof risksByLevel];
                        if (students.length === 0) return null;

                        return (
                          <div key={level} className="p-0">
                            <div className={cn(
                              "px-8 py-4 text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-3",
                              level === 'high' ? 'bg-rose-500/10 text-rose-500' : 
                              level === 'medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'
                            )}>
                               <AlertTriangle className="w-3 h-3" />
                               {level} Priority Targets
                            </div>
                            <div className="divide-y divide-white/5">
                              {students.map((risk, i) => (
                                <div key={i} className="p-8 hover:bg-white/[0.02] transition-all group">
                                   <div className="flex items-start justify-between gap-6">
                                      <div className="flex items-start gap-6">
                                         <div className={cn(
                                           "w-14 h-14 rounded-2xl flex items-center justify-center font-black italic shadow-2xl shrink-0 mt-1",
                                           risk.riskLevel === 'high' ? 'bg-rose-500 text-white shadow-rose-500/20' : 
                                           risk.riskLevel === 'medium' ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-emerald-500 text-black shadow-emerald-500/20'
                                         )}>
                                            {risk.name[0]}
                                         </div>
                                         <div className="space-y-4">
                                            <div className="space-y-1">
                                               <div className="flex items-center gap-3">
                                                  <h4 className="text-[14px] font-black uppercase italic tracking-widest">{risk.name}</h4>
                                                  <Badge className={cn(
                                                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                                                    risk.riskLevel === 'high' ? 'bg-rose-500 text-white' : 
                                                    risk.riskLevel === 'medium' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-black'
                                                  )}>
                                                    Risk Alert
                                                  </Badge>
                                               </div>
                                               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
                                                 Neural Trigger: {risk.reason}
                                               </p>
                                            </div>

                                            {/* Suggested Actions */}
                                            {risk.suggestedActions && (
                                              <div className="space-y-3">
                                                 <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] italic">Strategic Suggestions:</p>
                                                 <div className="flex flex-wrap gap-2">
                                                    {risk.suggestedActions.map((action: string, j: number) => (
                                                      <div key={j} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[9px] font-bold text-white/60">
                                                         <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                                         {action}
                                                      </div>
                                                    ))}
                                                 </div>
                                              </div>
                                            )}
                                         </div>
                                      </div>
                                      <Button size="icon" variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-emerald-500 hover:text-black shrink-0">
                                         <MessageCircle className="w-4 h-4" />
                                      </Button>
                                   </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                   </div>
                 )}
              </CardContent>
            </Card>
        </div>

        {/* Grading Readiness */}
        <div className="space-y-8">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <CheckCircle className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Grading Assessment</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">AI verification of technical and attendance prerequisites.</p>
                 </div>
              </div>
           </div>

           <Card className="border border-white/5 bg-secondary/5 rounded-[40px] overflow-hidden">
              <CardContent className="p-0">
                 {!readiness ? (
                   <div className="p-20 text-center space-y-4 opacity-20 italic font-black uppercase tracking-widest text-[10px]">
                      Awaiting strategic analysis results...
                   </div>
                 ) : (
                   <div className="divide-y divide-white/5">
                      {readiness.ready.map((unit: any, i: number) => (
                        <div key={i} className="p-8 hover:bg-white/5 transition-all group flex items-center justify-between gap-6">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-primary font-black italic shadow-2xl border border-primary/20">
                                 {unit.name[0]}
                              </div>
                              <div className="space-y-1">
                                 <div className="flex items-center gap-3">
                                    <h4 className="text-[14px] font-black uppercase italic tracking-widest">{unit.name}</h4>
                                    <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-widest px-2 py-0.5">READY FOR {unit.nextRank}</Badge>
                                 </div>
                                 <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                    Current Rank: {unit.currentRank} • Progress: 100% Verified
                                 </div>
                              </div>
                           </div>
                           <Button size="icon" variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:border-primary/40 hover:text-primary">
                              <FileText className="w-4 h-4" />
                           </Button>
                        </div>
                      ))}
                      {readiness.ready.length === 0 && (
                        <div className="p-12 text-center opacity-30 text-[10px] font-black uppercase tracking-widest">
                           No units currently verified for deployment.
                        </div>
                      )}
                   </div>
                 )}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
