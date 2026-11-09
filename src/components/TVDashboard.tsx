import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Zap, 
  AlertTriangle,
  Award, 
  Target,
  Flame,
  ArrowBigUp,
  X,
  Clock as ClockIcon,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DojoLogo from '@/components/shared/DojoLogo';

export default function TVDashboard({ branding, onClose }: any) {
  const [time, setTime] = useState(new Date());
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const slideTimer = setInterval(() => setActiveSlide((prev) => (prev + 1) % 3), 12000);
    return () => {
      clearInterval(timer);
      clearInterval(slideTimer);
    };
  }, []);

  const stats = [
    { label: 'Mat Attendance', value: '42', description: 'Active today', icon: Users },
    { label: 'Daily Goal', value: '84%', description: 'Target reached', icon: Target },
    { label: 'Next Session', value: '11:00', description: 'Elite Karate', icon: ClockIcon },
  ];

  const leaderboard = [
    { name: 'Liam Anderson', points: 2850, streak: 12 },
    { name: 'Sarah Jenkins', points: 2420, streak: 8 },
    { name: 'Mike Ross', points: 1980, streak: 5 },
  ];

  return (
    <div className="fixed inset-0 z-[2000] bg-[#0A0A0A] flex flex-col font-sans overflow-hidden select-none text-white">
      {/* Top Header Bar */}
      <div className="h-32 px-12 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-8">
          <DojoLogo 
            size="xl" 
            title={branding?.dojoName || "LION MODE"} 
            subtitle="OPERATION DISPLAY" 
            glowing 
          />
        </div>

        <div className="flex items-center gap-12">
          <div className="text-right">
             <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Local Time</p>
             <p className="text-5xl font-heading font-black text-primary tabular-nums tracking-tighter italic">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
             </p>
          </div>
          <Button variant="ghost" onClick={onClose} className="w-14 h-14 rounded-xl text-white/40 hover:bg-rose-500/10 hover:text-rose-500 transition-all">
             <X className="w-7 h-7" />
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex-1 p-12 grid grid-cols-12 gap-12 overflow-hidden">
        
        {/* Left Stats Rail */}
        <div className="col-span-3 flex flex-col gap-8">
           {stats.map((stat, i) => (
             <motion.div
               key={stat.label}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               className="glass border border-white/5 rounded-[32px] p-8 flex flex-col gap-6"
             >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                   <stat.icon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className="text-5xl font-heading font-bold text-white tracking-tighter mb-2 italic">{stat.value}</p>
                   <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> {stat.description}
                   </div>
                </div>
             </motion.div>
           ))}

           <div className="flex-1 bg-gradient-to-br from-secondary/40 to-black/80 border border-primary/10 rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-end group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />
              <Activity className="w-12 h-12 text-primary mb-4 opacity-70 animate-pulse" />
              <h3 className="text-2xl font-heading font-bold text-white mb-2 leading-tight uppercase italic">Live Sector <br />Status Tracking</h3>
              <p className="text-xs text-white/40 font-medium leading-relaxed">System monitoring real-time mats and session analytics across all training zones.</p>
           </div>
        </div>

        {/* Center Display: Sliding Carousel */}
        <div className="col-span-9 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {activeSlide === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex-1 bg-gradient-to-br from-black to-secondary/30 border border-white/5 rounded-[48px] p-24 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl"
              >
                  <img 
                    src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=1800" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale-[0.5]"
                    alt="South African Diversity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <Badge variant="outline" className="mb-12 px-8 py-3 border-primary/20 text-primary text-sm font-bold uppercase tracking-[0.5em] rounded-full backdrop-blur-md">
                       South African Unity in Combat
                    </Badge>
                    <h2 className="text-8xl font-heading font-bold text-white tracking-tighter leading-none mb-12 drop-shadow-2xl uppercase italic">
                       One Team. <br /><span className="text-primary italic">One Discipline.</span>
                    </h2>
                    <div className="h-1.5 w-48 bg-primary rounded-full shadow-lg" />
                    <p className="mt-12 text-2xl font-medium text-white/80 max-w-4xl leading-relaxed italic">
                       Celebrating the rich diversity of our nation through the art of Karate. 
                       Empowering youth from all backgrounds to reach their full tactical potential.
                    </p>
                  </div>
              </motion.div>
            )}

            {activeSlide === 1 && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex-1 flex flex-col gap-10"
              >
                 <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-heading font-bold text-white tracking-tight uppercase italic">Deployment Schedule</h2>
                    <Badge className="bg-primary text-black px-6 py-2 rounded-full uppercase font-bold tracking-widest text-sm">Mat Time Next</Badge>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-6">
                    {[
                      { time: '11:00 AM', name: 'Elite Striking Intensive', instructor: 'Master Lee', room: 'Main Hall', attendees: 14, cap: 20 },
                      { time: '12:30 PM', name: 'Junior Dragons BJJ', instructor: 'Coach Sarah', room: 'Arena B', attendees: 22, cap: 25 },
                      { time: '02:00 PM', name: 'Black Belt Lab Session', instructor: 'Sensei Jack', room: 'Private Sector', attendees: 4, cap: 10 },
                    ].map((cls, idx) => (
                      <div key={idx} className="bg-secondary/10 border border-white/5 rounded-[32px] p-10 flex items-center justify-between group hover:border-primary/20 hover:bg-secondary/20 transition-all">
                         <div className="flex items-center gap-16">
                            <div className="text-6xl font-heading font-bold text-primary group-hover:scale-105 transition-all tabular-nums tracking-tighter w-48 italic">{cls.time}</div>
                            <div>
                               <h3 className="text-3xl font-heading font-bold text-white mb-2 tracking-tight uppercase italic">{cls.name}</h3>
                               <div className="flex items-center gap-4 text-white/40 font-bold text-sm uppercase tracking-widest italic">
                                  <span>{cls.instructor}</span>
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  <span>{cls.room}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-12 pr-6">
                            <div className="text-right">
                               <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1 italic">Capacity</p>
                               <p className="text-3xl font-heading font-bold text-primary italic">{cls.attendees}/{cls.cap}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {activeSlide === 2 && (
               <motion.div
               key="leaderboard"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.02 }}
               className="flex-1 flex flex-col gap-10"
             >
                <div className="flex items-center justify-between">
                   <h2 className="text-4xl font-heading font-bold text-white tracking-tight uppercase italic">Warrior Rankings</h2>
                   <p className="text-sm font-bold text-primary uppercase tracking-widest italic">Season 04 Intake</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                   {leaderboard.map((student, idx) => (
                     <div key={idx} className="bg-secondary/10 border border-white/5 rounded-[32px] p-8 flex items-center justify-between hover:border-primary/20 hover:bg-secondary/20 transition-all group">
                        <div className="flex items-center gap-12">
                           <div className="text-6xl font-heading font-bold text-primary italic w-16 opacity-40">#{idx + 1}</div>
                           <div className="w-20 h-20 rounded-full bg-secondary/80 border border-white/10 flex items-center justify-center text-2xl font-heading font-bold uppercase text-white group-hover:border-primary/30 transition-colors">
                              {student.name.charAt(0)}
                           </div>
                           <div>
                              <h3 className="text-3xl font-heading font-bold text-white tracking-tight uppercase italic">{student.name}</h3>
                              <div className="flex items-center gap-6 mt-2">
                                 <div className="flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    <span className="text-lg font-bold text-white italic">{student.streak} Day Streak</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="text-right pr-6">
                           <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1 italic">Combat Points</p>
                           <p className="text-5xl font-heading font-bold text-primary tabular-nums tracking-tighter italic">{student.points.toLocaleString()}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Persistence Bar */}
      <div className="h-24 px-12 border-t border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
         <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
               <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 italic">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow-gold" /> Security Link Verified
               </span>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 italic">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow-gold" /> Biometric Uplink Operational
               </span>
            </div>
         </div>
         <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.5em] italic">
            Dojo_OS v4.0.0 Tactical Interface · AIS-X-99
         </p>
      </div>
    </div>
  );
}
