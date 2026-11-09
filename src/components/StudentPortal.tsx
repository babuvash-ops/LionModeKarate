import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Map, 
  PlayCircle, 
  Flame, 
  ShieldCheck, 
  Target,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Activity,
  User as UserIcon,
  Compass
} from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function StudentPortal() {
  const [studentData, setStudentData] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      
      try {
        const sQuery = query(collection(db, 'students'), where('email', '==', auth.currentUser.email));
        const sSnap = await getDocs(sQuery);
        
        if (!sSnap.empty) {
          const sDoc = sSnap.docs[0].data();
          setStudentData({ id: sSnap.docs[0].id, ...sDoc });
          
          const aQuery = query(
            collection(db, 'attendance'), 
            where('studentId', '==', sSnap.docs[0].id),
            orderBy('date', 'desc'),
            limit(10)
          );
          const aSnap = await getDocs(aQuery);
          setAttendance(aSnap.docs.map(d => d.data()));
        }
      } catch (e) {
        console.error("Error fetching student portal data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center animate-pulse">
        <Zap className="w-8 h-8 text-gold" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Synchronizing Neural Passport...</p>
    </div>
  );

  if (!studentData) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-8 text-center p-12">
      <div className="w-24 h-24 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-2xl">
        <ShieldCheck className="w-12 h-12" />
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-display font-black text-white italic tracking-tighter uppercase leading-none">Identity Not Verified</h2>
        <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em] max-w-sm leading-relaxed">
          Operational profile is not yet linked to an active student unit. 
          Initialize connection with Command Staff for authentication.
        </p>
      </div>
      <Button variant="outline" className="border-white/10 text-white rounded-2xl h-14 px-10 uppercase font-black tracking-widest text-[11px] hover:bg-white/5">
        Request Support Intel
      </Button>
    </div>
  );

  const beltRoadmap = [
    { rank: 'White', progress: 100, status: 'Completed' },
    { rank: 'Yellow', progress: 100, status: 'Completed' },
    { rank: 'Orange', progress: 65, status: 'Current Rank' },
    { rank: 'Green', progress: 0, status: 'Locked' },
    { rank: 'Blue', progress: 0, status: 'Locked' },
    { rank: 'Purple', progress: 0, status: 'Locked' },
    { rank: 'Brown', progress: 0, status: 'Locked' },
    { rank: 'Black', progress: 0, status: 'Locked' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-24">
      {/* AUTHORIZED IDENTITY HERO */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[60px] bg-deep-black min-h-[500px] flex items-end shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] group"
      >
        <img 
          src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=1800"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5] saturate-[1.2] transition-transform duration-[3s] group-hover:scale-110"
          alt="Identity Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/40 to-transparent" />
        
        <div className="relative z-10 w-full p-12 lg:p-20 flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="flex items-center gap-12 text-left">
            <div className="relative">
              <div className="w-40 h-40 rounded-[48px] bg-charcoal flex items-center justify-center shadow-2xl overflow-hidden border-4 border-white/10 group-hover:border-gold/50 transition-colors">
                <div className="absolute inset-x-0 bottom-0 h-4 bg-gold shadow-[0_0_30px_rgba(244,224,47,0.5)]" />
                <UserIcon className="w-16 h-16 text-white/10" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-3xl bg-gold flex items-center justify-center text-black shadow-2xl ring-8 ring-deep-black group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <Badge className="bg-gold text-black border-none font-black uppercase italic text-[10px] tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg">Rank: Orange Belt</Badge>
                <Badge className="bg-white/5 text-white/40 border-white/10 font-black uppercase tracking-[0.2em] text-[9px] px-3 py-1.5 rounded-full">ID: PASSPORT-912</Badge>
              </div>
              <div>
                <h1 className="text-5xl lg:text-8xl font-display font-black text-white italic tracking-tighter uppercase leading-none mb-2">
                  {studentData.firstName} <span className="text-gold text-glow-gold">{studentData.lastName}</span>
                </h1>
                <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.5em] italic">Authorized Development Identity</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-16 pb-4">
            <div className="text-center group-hover:scale-105 transition-transform">
               <div className="relative inline-flex items-center justify-center mb-2">
                  <Flame className="w-24 h-24 text-gold/20 animate-pulse" />
                  <span className="absolute text-4xl font-display font-black italic text-gold mt-4 tracking-tighter drop-shadow-[0_0_15px_rgba(244,224,47,0.5)]">7</span>
               </div>
               <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Force Streak</div>
            </div>
            <div className="h-20 w-px bg-white/10 hidden lg:block" />
            <div className="text-center group-hover:scale-105 transition-transform">
               <div className="text-5xl font-display font-black text-white italic tracking-tighter leading-none mb-4">142</div>
               <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Log Count</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* TACTICAL ROADMAP */}
        <div className="lg:col-span-2 space-y-12">
           <div className="flex items-center justify-between px-4 text-left">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-3xl bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
                    <Compass className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-display font-black uppercase italic tracking-tighter text-white">Elite Roadmap</h3>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">Operational vector to Black Belt command status.</p>
                 </div>
              </div>
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-gold italic hover:bg-gold/10 px-8 h-12 rounded-2xl transition-all">Protocol Requirements</Button>
           </div>

           <Card className="premium-card bg-charcoal/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                {beltRoadmap.map((b, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      "group p-8 rounded-[40px] border transition-all duration-500 flex flex-col items-center gap-6",
                      b.status === 'Current Rank' ? "bg-charcoal border-gold/40 shadow-[0_20px_60px_-15px_rgba(244,224,47,0.2)]" :
                      b.status === 'Completed' ? "bg-white/5 border-white/5 opacity-40 shadow-xl" : "bg-transparent border-white/5 opacity-10"
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12",
                      b.status === 'Completed' ? "bg-gold/20 text-gold" : "bg-black/40 text-white/10"
                    )}>
                      {b.status === 'Completed' ? <ShieldCheck className="w-8 h-8" /> : <Trophy className="w-7 h-7" />}
                    </div>
                    <div className="text-center">
                       <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-2">{b.rank} Belt</div>
                       <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">{b.status}</div>
                    </div>
                    {b.status === 'Current Rank' && (
                      <div className="w-full mt-2">
                        <Progress value={b.progress} className="h-1.5 bg-black" />
                        <div className="text-[10px] font-black text-gold mt-3 uppercase tracking-widest text-center shadow-gold/20">{b.progress}% MASTERY</div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
           </Card>

           {/* DRILL FEED */}
           <div className="space-y-8">
              <div className="flex items-center justify-between px-4 text-left">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                      <PlayCircle className="w-8 h-8" />
                   </div>
                   <div>
                      <h3 className="text-3xl font-display font-black uppercase italic tracking-tighter text-white">Neural Drills</h3>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">Active training protocols for current sector mastery.</p>
                 </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                 {['Heian Shodan Protocols', 'Force Strike Matrix V1'].map((skill, i) => (
                   <Card key={i} className="group overflow-hidden premium-card bg-charcoal hover:scale-[1.02] transition-all p-0">
                      <div className="aspect-video bg-black/60 flex items-center justify-center relative">
                         <PlayCircle className="w-16 h-16 text-white/5 group-hover:text-gold group-hover:scale-110 transition-all duration-500" />
                         <div className="absolute top-6 left-6">
                            <Badge className="bg-black/60 backdrop-blur-xl border-white/10 text-[9px] font-black px-4 py-1 uppercase tracking-widest text-gold italic">SECURE FEED</Badge>
                         </div>
                      </div>
                      <div className="p-8 text-left">
                         <h4 className="text-xl font-display font-black text-white uppercase italic tracking-widest">{skill}</h4>
                         <div className="flex items-center justify-between mt-4">
                            <span className="tactical-mono text-[10px] text-white/30 uppercase">Operational Time: 12:44</span>
                            <ChevronRight className="w-5 h-5 text-gold" />
                         </div>
                      </div>
                   </Card>
                 ))}
              </div>
           </div>
        </div>

        {/* PERFORMANCE SIDEBAR */}
        <div className="space-y-12">
           <Card className="premium-card space-y-10 border-gold/10">
              <div className="flex items-center gap-4 text-left">
                <Target className="w-6 h-6 text-gold" />
                <h4 className="text-xl font-display font-black uppercase italic tracking-tighter text-white leading-none">Mastery Targets</h4>
              </div>
              <div className="space-y-10 text-left">
                 {[
                   { label: 'FORCE FREQUENCY', current: 12, target: 15 },
                   { label: 'PRECISION COHESION', current: 8.5, target: 9.0 },
                   { label: 'REACTION VELOCITY', current: 100, target: 100 },
                 ].map((goal, i) => (
                   <div key={i} className="space-y-4">
                      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em]">
                         <span className="text-white/40">{goal.label}</span>
                         <span className="text-gold italic">{goal.current} / {goal.target}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-1.5 bg-black shadow-inner" />
                   </div>
                 ))}
              </div>
              <Button className="w-full h-16 bg-white/5 border border-white/5 text-white/40 hover:text-gold hover:bg-gold/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all">Redefine Parameters</Button>
           </Card>

           <Card className="premium-card bg-gold/5 border-gold/20 shadow-[0_30px_60px_-15px_rgba(244,224,47,0.15)] space-y-8 text-left">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[28px] bg-gold flex items-center justify-center text-black shadow-2xl">
                    <Activity className="w-8 h-8" />
                 </div>
                 <div>
                    <h4 className="text-xl font-display font-black uppercase italic tracking-tighter text-white">Nexus Pulse</h4>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gold mt-1">Live Technical Feed</p>
                 </div>
              </div>
              <p className="text-[13px] font-medium italic leading-relaxed text-white/50 uppercase tracking-widest pl-4 border-l-2 border-gold/40">
                "Neural analysis detected suboptimal rotation in Heian Shodan transition. Precision at 82.5%. Recommend immediate strike matrix recalibration." 
              </p>
              <Button className="w-full h-16 rounded-2xl bg-gold text-black shadow-2xl font-black uppercase tracking-[0.3em] italic hover:scale-105 transition-transform">Analyze Intel Docs</Button>
           </Card>
        </div>
      </div>
    </div>
  );
}
