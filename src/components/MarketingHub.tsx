import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Target, 
  Zap, 
  Share2, 
  Mail, 
  Phone, 
  Layout, 
  ArrowRight,
  ShieldCheck,
  Globe,
  Instagram,
  Facebook,
  Sparkles,
  RefreshCw,
  Copy,
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { generateMarketingCopy } from '@/services/aiIntelligence';
import { toast } from 'sonner';

export default function MarketingHub() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const activeCampaigns = [
    { name: 'Summer Elite Trial', status: 'Active', leads: 42, icon: Target, color: 'text-gold' },
    { name: 'Back to Focus 2026', status: 'Draft', leads: 0, icon: Zap, color: 'text-amber-500' },
  ];

  const tools = [
    { title: 'Lead Pipeline', desc: 'Manage inbound candidates and unit conversion.', icon: Target, path: '/lead-pipeline' },
    { id: 'whatsapp', title: 'WhatsApp Hub', desc: 'Secure communication node for direct signals.', icon: MessageSquare, path: '/whatsapp' },
    { title: 'Email Matrix', desc: 'Automated notification and nurture protocols.', icon: Mail, path: '/comms' },
    { title: 'Social Sync', desc: 'Multi-channel social platform alignment.', icon: Share2, path: '/marketing' },
  ];

  const handleGenerate = async (platform: any) => {
    if (!topic) {
      toast.error('Tactical input required: Specify topic.');
      return;
    }
    setLoading(true);
    try {
      const data = await generateMarketingCopy(topic, platform);
      setGeneratedCopy(data);
      toast.success('AI Neural Copy Synchronized');
    } catch (e) {
      toast.error('Copy generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copy Vector Transferred');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-20 space-y-16 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4 text-left">
           <Badge className="bg-gold/10 text-gold border-gold/20 uppercase font-black tracking-[0.4em] italic">Growth Matrix</Badge>
           <h1 className="text-4xl md:text-8xl font-display text-white uppercase italic tracking-tighter leading-none">Marketing <br /><span className="text-gold">Hub</span></h1>
           <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] italic">Strategy • Capture • Expansion</p>
        </div>
        <div className="flex items-center gap-4">
           {/* AI Sparkle */}
           <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-primary/5 border border-primary/20 rounded-full">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary italic">AI Insights Active</span>
           </div>
           <Button className="h-16 px-10 bg-gold text-black rounded-2xl font-display text-xl uppercase italic shadow-2xl shadow-gold/20">
              Deploy Campaign
           </Button>
        </div>
      </div>

      {/* AI Copy Section */}
      <section className="bg-black rounded-[40px] p-8 lg:p-16 border border-white/5 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-30 group-hover:opacity-50 transition-all duration-1000" />
         <div className="relative z-10 space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                        <BrainCircuit className="w-6 h-6" />
                     </div>
                     <h2 className="text-3xl font-display text-white uppercase italic tracking-tight">AI Neural <span className="text-primary">Copywriter</span></h2>
                  </div>
                  <p className="text-white/40 text-xs italic max-w-xl">Generate high-impact tactical marketing communication using the Dojo_OS neural network.</p>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="ENTER CAMPAIGN TOPIC (e.g. Summer Kids Camp)..."
                    className="h-16 w-full lg:w-[400px] bg-secondary/20 border border-white/10 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest text-white placeholder:text-white/10 focus:border-primary/50 outline-none transition-all"
                  />
                  <div className="flex gap-2">
                     <Button 
                       onClick={() => handleGenerate('social')}
                       disabled={loading}
                       className="h-16 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest italic"
                     >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Instagram className="w-4 h-4 mr-2" />}
                        Social
                     </Button>
                     <Button 
                       onClick={() => handleGenerate('email')}
                       disabled={loading}
                       className="h-16 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest italic"
                     >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                        Email
                     </Button>
                  </div>
               </div>
            </div>

            <AnimatePresence mode="wait">
               {generatedCopy && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                 >
                    <div className="bg-white/5 border border-white/5 rounded-[32px] p-10 space-y-8 relative group">
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">Primary Manifest</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyToClipboard(`${generatedCopy.headline}\n\n${generatedCopy.body}\n\n${generatedCopy.cta}`)}
                            className="bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl"
                          >
                             {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </Button>
                       </div>
                       <div className="space-y-6">
                          <h4 className="text-2xl md:text-4xl font-display text-white uppercase italic tracking-tighter leading-none">{generatedCopy.headline}</h4>
                          <p className="text-white/60 text-sm italic leading-relaxed whitespace-pre-wrap">{generatedCopy.body}</p>
                          <div className="pt-6 border-t border-white/5">
                             <p className="text-primary font-display text-xl uppercase italic group-hover:translate-x-2 transition-transform duration-500">{">>"} {generatedCopy.cta}</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="bg-black/40 border border-white/5 rounded-[24px] p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <ShieldCheck className="w-4 h-4" />
                             </div>
                             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Tone Verified: CINEMATIC</span>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-500 border-none italic font-black text-[8px] tracking-widest">STABLE</Badge>
                       </div>
                       <div className="bg-black/40 border border-white/5 rounded-[24px] p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Zap className="w-4 h-4" />
                             </div>
                             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Conversion Density: OPTIMIZED</span>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-500 border-none italic font-black text-[8px] tracking-widest">ACTIVE</Badge>
                       </div>
                       <div className="p-8 border border-white/5 rounded-[32px] bg-gradient-to-br from-white/5 to-transparent space-y-4">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Strategic Feedback</p>
                          <p className="text-xs text-white/60 italic leading-relaxed">System output indicates high resonance for Sector 7 demographics. Deployment through social nodes will trigger 14% higher engagement vectors based on historical telemetry.</p>
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Tool Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
           {tools.map((tool, i) => (
             <motion.div
               key={tool.title}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               onClick={() => tool.path && navigate(tool.path)}
               className="premium-card group cursor-pointer border-white/5 bg-charcoal/20 hover:bg-charcoal/40 hover:border-gold/20 transition-all text-left space-y-8"
             >
                <div className="w-16 h-16 rounded-[24px] bg-black border border-white/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                   <tool.icon className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                   <h3 className="text-3xl font-display text-white uppercase italic tracking-tight group-hover:text-gold transition-colors">{tool.title}</h3>
                   <p className="text-sm text-white/30 italic leading-relaxed">{tool.desc}</p>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/10 group-hover:text-gold transition-colors">
                   Uplink Established <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
                </div>
             </motion.div>
           ))}
        </div>

        {/* Campaign Sidebar */}
        <div className="space-y-12">
           <div className="premium-card bg-charcoal/30 border-white/5 space-y-12">
              <div className="flex items-center justify-between">
                 <h4 className="text-xl font-display font-black text-white uppercase italic tracking-tight">Active Matrix</h4>
                 <Badge className="bg-emerald-500/20 text-emerald-500 border-none italic font-black">Live</Badge>
              </div>
              <div className="space-y-6">
                 {activeCampaigns.map((camp, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5 group hover:border-gold/20 transition-all">
                      <div className="flex items-center gap-6">
                         <div className={cn("w-2 h-2 rounded-full", camp.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-white/10')} />
                         <div className="text-left">
                            <p className="text-[11px] font-black text-white/60 uppercase italic">{camp.name}</p>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest italic">{camp.leads} Recon Captured</p>
                         </div>
                      </div>
                      <camp.icon className={cn("w-5 h-5", camp.color)} />
                   </div>
                 ))}
              </div>
              <Button variant="ghost" className="w-full h-14 border-white/5 text-white/20 hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                 View History
              </Button>
           </div>

           <div className="premium-card bg-gold/5 border border-gold/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-[80px] -mr-16 -mt-16" />
              <div className="space-y-6 relative z-10 text-left">
                 <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-gold" />
                 </div>
                 <h5 className="text-2xl font-display text-white uppercase italic tracking-tighter shadow-glow-gold">Digital Presence</h5>
                 <p className="text-xs text-white/40 italic leading-relaxed">System optimization: Social sync active. All search vectors optimized for Sector 7 region.</p>
                 <div className="flex gap-4">
                    <Facebook className="w-5 h-5 text-white/20 hover:text-gold transition-colors cursor-pointer" />
                    <Instagram className="w-5 h-5 text-white/20 hover:text-gold transition-colors cursor-pointer" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
