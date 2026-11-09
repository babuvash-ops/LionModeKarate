import * as React from 'react';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Shield, 
  Settings, 
  Bell, 
  Users, 
  Target, 
  PlayCircle, 
  Calendar, 
  Archive, 
  Map, 
  CreditCard,
  Lock,
  Search,
  Filter,
  ArrowRight,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SystemNodeModuleProps {
  title: string;
  icon: any;
  description: string;
  category: string;
}

export default function SystemNodeModule({ title, icon: Icon, description, category }: SystemNodeModuleProps) {
  // Generate some high-quality placeholder data based on the title
  const activities = [
    { label: 'Security Handshake', status: 'COMPLETED', time: '02m ago', color: 'emerald' },
    { label: 'Protocol Update', status: 'IN_PROGRESS', time: '05m ago', color: 'gold' },
    { label: 'Integrity Check', status: 'COMPLETED', time: '12m ago', color: 'emerald' },
    { label: 'Sector Scan', status: 'PENDING', time: '20m ago', color: 'white/20' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="relative p-10 md:p-16 bg-charcoal/40 border border-white/5 rounded-[48px] overflow-hidden group shadow-3xl">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-1000">
          <Icon className="w-64 h-64 text-gold" />
        </div>
        
        <div className="relative z-10 space-y-8 max-w-2xl">
          <Badge className="bg-gold/10 text-gold border-gold/20 uppercase font-black tracking-[0.4em] px-6 py-2 text-xs italic">{category}</Badge>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-display text-white uppercase italic tracking-tighter leading-none">{title}</h1>
            <p className="text-lg md:text-xl text-white/40 italic leading-relaxed border-l-2 border-gold pl-8">{description}</p>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
             <Button className="h-16 px-10 bg-gold text-black font-display text-lg uppercase italic tracking-widest rounded-2xl shadow-glow-gold hover:scale-105 transition-all">
                Execute Action
             </Button>
             <Button variant="ghost" className="h-16 px-10 bg-white/5 border border-white/10 text-white font-display text-lg uppercase italic tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                Config Node
             </Button>
          </div>
        </div>
      </div>

      {/* CORE DATA GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TELEMETRY */}
        <div className="lg:col-span-2 premium-card">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <Activity className="w-6 h-6 text-gold" />
                 <h3 className="text-2xl font-display text-white italic uppercase">Operational Telemetry</h3>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Live Feed</span>
              </div>
           </div>

           <div className="space-y-4">
              {activities.map((act, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-deep-black/60 border border-white/5 rounded-3xl group hover:border-white/20 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-1.5 h-10 bg-gold/20 rounded-full overflow-hidden">
                         <div className="w-full bg-gold animate-shimmer" style={{ height: '40%' }} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white mb-1">{act.label}</p>
                         <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">{act.time}</p>
                      </div>
                   </div>
                   <Badge className={cn(
                     "bg-transparent border-white/10 text-[9px] font-black tracking-widest italic",
                     act.color === 'emerald' ? 'text-emerald-500 border-emerald-500/20' : 
                     act.color === 'gold' ? 'text-gold border-gold/20' : 'text-white/20'
                   )}>
                     {act.status}
                   </Badge>
                </div>
              ))}
           </div>
        </div>

        {/* METRICS SIDEBAR */}
        <div className="space-y-8">
           <div className="premium-card bg-gold/5 border-gold/10">
              <Zap className="w-8 h-8 text-gold mb-6" />
              <h4 className="text-4xl font-display text-white italic uppercase tracking-tight mb-2">Efficiency</h4>
              <p className="text-[11px] font-black text-gold/60 uppercase tracking-[0.4em] italic mb-8">Node Rating</p>
              <div className="text-7xl font-display text-white leading-none italic">98.4%</div>
              <div className="mt-8 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-gold w-[98.4%] shadow-glow-gold" />
              </div>
           </div>

           <div className="premium-card">
              <Lock className="w-8 h-8 text-rose-500 mb-6" />
              <h4 className="text-xl font-display text-white italic uppercase tracking-tight mb-6">Security Clearance</h4>
              <div className="space-y-4">
                 {[
                   { label: 'Admin Access', enabled: true },
                   { label: 'API Uplink', enabled: true },
                   { label: 'Public Display', enabled: false },
                 ].map((s, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/40 uppercase tracking-widest italic">{s.label}</span>
                      {s.enabled ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-white/10" />}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* DETAIL LIST VIEW */}
      <div className="premium-card">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <h3 className="text-3xl font-display text-white italic uppercase tracking-tight">Active Logs</h3>
            <div className="flex gap-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input placeholder="Filter Data..." className="h-12 bg-deep-black/60 border border-white/10 rounded-xl pl-12 pr-6 text-xs italic font-bold uppercase tracking-widest text-white outline-none focus:border-gold/30 w-full md:w-64" />
               </div>
               <Button variant="ghost" className="h-12 bg-white/5 border border-white/5 rounded-xl px-5 text-white/40 hover:text-white">
                  <Filter className="w-4 h-4" />
               </Button>
            </div>
         </div>

         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">
                     <th className="pb-6 px-4">Entity ID</th>
                     <th className="pb-6 px-4">Subject</th>
                     <th className="pb-6 px-4">Protocol</th>
                     <th className="pb-6 px-4 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="group hover:bg-white/[0.02] transition-all">
                       <td className="py-6 px-4">
                          <span className="text-sm font-display text-white/40 italic">#NODE_{item * 1024}</span>
                       </td>
                       <td className="py-6 px-4 font-bold text-white italic">Operational Node Alpha {item}</td>
                       <td className="py-6 px-4">
                          <Badge className="bg-white/5 text-gold border-none italic font-bold text-[9px] px-3">V4_CORE</Badge>
                       </td>
                       <td className="py-6 px-4 text-right">
                          <Button variant="ghost" className="text-white/20 group-hover:text-gold transition-colors">
                             <ArrowRight className="w-5 h-5" />
                          </Button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
