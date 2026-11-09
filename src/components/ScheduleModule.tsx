import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User,
  Users,
  Grid,
  List as ListIcon,
  Search,
  Calendar as CalendarIcon,
  CheckCircle2,
  MoreVertical,
  X,
  Zap,
  Target,
  Activity,
  ShieldCheck,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import GoldButton from './shared/GoldButton';

const classes = [
  { id: '1', title: 'Tactical Karate', instructor: 'Master Kenji', time: '09:00 AM', duration: '90m', category: 'KARATE', capacity: 20, registered: 14, attendees: ['Liam', 'Sarah', 'Mike'] },
  { id: '2', title: 'Advanced BJJ Control', instructor: 'Commander Sarah', time: '11:00 AM', duration: '60m', category: 'BJJ', capacity: 12, registered: 12, attendees: [] },
  { id: '3', title: 'Strike Unit Prep', instructor: 'Master Kenji', time: '02:00 PM', duration: '90m', category: 'STRIKING', capacity: 15, registered: 8, attendees: [] },
  { id: '4', title: 'Little Warriors HQ', instructor: 'Instructor Sarah', time: '04:00 PM', duration: '45m', category: 'YOUTH', capacity: 25, registered: 22, attendees: [] },
  { id: '5', title: 'Open Deployment', instructor: 'Various', time: '06:00 PM', duration: '120m', category: 'SPARRING', capacity: 30, registered: 15, attendees: [] },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleModule() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedClass, setSelectedClass] = useState<any>(null);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-background pb-32 pt-8">
      {/* Strategic Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="space-y-4 text-left">
          <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary bg-primary/5 border-primary/20 px-4 py-1.5 italic rounded-full">Deployment Matrix</Badge>
          <h2 className="text-5xl md:text-7xl font-heading font-bold text-foreground tracking-tighter uppercase italic leading-none">Ops_ <br /><span className="text-primary italic">Windows</span></h2>
          <div className="flex items-center gap-3 pl-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <p className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-[0.4em] italic">Tactical Rotation Active</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="bg-secondary/20 p-2 rounded-3xl border border-border/50 flex gap-2">
             <Button variant="ghost" size="sm" className="h-12 w-12 p-0 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20"><Grid className="w-5 h-5" /></Button>
             <Button variant="ghost" size="sm" className="h-12 w-12 p-0 rounded-2xl text-muted-foreground/20 hover:text-foreground"><ListIcon className="w-5 h-5" /></Button>
          </div>
          <GoldButton size="md" className="h-16 px-10 rounded-[32px]">
            <Plus className="w-6 h-6 mr-3" /> Initialize Session
          </GoldButton>
        </div>
      </div>

      {/* Temporal Navigation */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-8 pt-2 scroll-smooth">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={cn(
              "flex-none px-12 h-16 rounded-[28px] text-[10px] font-bold uppercase tracking-[0.2em] transition-all border italic shadow-sm",
              selectedDay === day 
                ? "bg-primary text-primary-foreground border-primary shadow-2xl scale-105" 
                : "bg-secondary/10 border-border/50 text-muted-foreground/20 hover:border-primary/20 hover:text-foreground hover:bg-secondary/20"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Tactical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {classes.map((c, i) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedClass(c)}
              className="group relative"
            >
              <Card className="premium-card h-full border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-all rounded-[50px] overflow-hidden cursor-pointer shadow-2xl">
                <div className="p-10 space-y-10 flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/5 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-[0.3em] px-5 py-2 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 italic">
                      {c.category}
                    </Badge>
                    <div className="flex -space-x-3 group-hover:translate-x-2 transition-transform duration-700">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="w-10 h-10 rounded-2xl bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-bold shadow-xl text-muted-foreground/20">
                          {String.fromCharCode(65 + j)}
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground border-2 border-background flex items-center justify-center text-[10px] font-bold shadow-glow-gold relative z-10">
                        +{c.registered - 3}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                     <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-none tracking-tight uppercase italic group-hover:text-primary transition-colors">{c.title}</h3>
                     <div className="flex items-center gap-3">
                        <div className="w-1 h-3 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/20 italic group-hover:text-muted-foreground/40 transition-colors">Phase_Identifier_Authorized</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-8 py-6 px-10 bg-background/40 rounded-[35px] border border-border/10 group-hover:border-primary/10 transition-all">
                    <div className="flex items-center gap-3 group-hover:scale-105 transition-transform">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-[11px] font-bold text-foreground uppercase tracking-widest italic">{c.time}</span>
                    </div>
                    <div className="h-6 w-px bg-border/20" />
                    <div className="flex items-center gap-3 group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4 text-muted-foreground/30" />
                      <span className="text-[11px] font-bold text-foreground/60 uppercase tracking-widest italic">{c.registered}/{c.capacity} Units</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 flex items-center justify-between border-t border-border/10">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-secondary border border-border/30 flex items-center justify-center text-[15px] font-bold text-primary shadow-xl italic group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-700">
                          {c.instructor.charAt(0)}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest italic leading-none mb-1">Squad Commander</span>
                          <span className="text-base font-bold text-foreground uppercase italic tracking-tight group-hover:text-primary transition-colors leading-none">{c.instructor}</span>
                        </div>
                     </div>
                     <div className="w-12 h-12 rounded-2xl bg-secondary/50 border border-border/30 flex items-center justify-center text-primary-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:bg-primary group-hover:scale-110 shadow-glow-gold">
                        <Timer className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                     </div>
                  </div>
                </div>
                {/* Visual Depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* System Status Alert */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="p-10 rounded-[60px] bg-secondary/10 border border-border/50 text-left space-y-6 relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute inset-0 bg-grid-tactical opacity-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center gap-10 relative z-10">
          <div className="w-24 h-24 rounded-[40px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow-gold bg-background shrink-0">
            <Activity className="w-12 h-12 animate-pulse" />
          </div>
          <div className="space-y-3">
             <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary italic leading-none mb-2 underline decoration-primary/30">System Integration Status</p>
             <h4 className="text-3xl font-heading font-bold text-foreground uppercase italic tracking-tight leading-none">Operational Capacity Verified</h4>
             <p className="text-[13px] font-medium text-muted-foreground/50 italic leading-relaxed max-w-4xl">All training windows are currently synchronized with the Dojo Central Nexus. Conflict monitoring is active across all sectors. Recommend 100% instructor mobilization for the upcoming peak-deployment windows.</p>
          </div>
        </div>
      </motion.div>

      {/* Briefing Overlay */}
      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent className="max-w-2xl bg-background border-border/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] p-0 overflow-hidden rounded-[80px] text-left">
          <div className="p-16 space-y-12">
            <div className="flex items-start justify-between">
              <div className="text-left space-y-4">
                <Badge variant="outline" className="bg-primary/5 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.4em] px-6 py-2 italic rounded-xl">
                  Mission_Briefing_Authorized
                </Badge>
                <DialogTitle className="text-6xl font-heading font-bold text-foreground uppercase italic tracking-tighter leading-[0.8] mb-2">{selectedClass?.title}</DialogTitle>
                <DialogDescription className="text-[11px] font-bold uppercase tracking-[0.5em] text-muted-foreground/30 italic">Initialize tactical phase synchronization sequence.</DialogDescription>
              </div>
              <Button variant="ghost" onClick={() => setSelectedClass(null)} className="h-16 w-16 p-0 rounded-3xl bg-secondary/40 text-muted-foreground/20 hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-border/20">
                <X className="w-7 h-7" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="p-8 bg-secondary/20 rounded-[40px] border border-border/10 space-y-3 flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-background border border-border/10 flex items-center justify-center text-primary shadow-xl mb-2">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] text-muted-foreground/25 font-bold uppercase tracking-[0.4em] italic mb-1">Temporal Window</p>
                  <p className="text-lg font-bold text-foreground uppercase tracking-tight italic leading-none">{selectedDay}, {selectedClass?.time}</p>
               </div>
               <div className="p-8 bg-secondary/20 rounded-[40px] border border-border/10 space-y-3 flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-background border border-border/10 flex items-center justify-center text-primary shadow-xl mb-2">
                    <Clock className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] italic mb-1">Cycle Duration</p>
                  <p className="text-lg font-bold text-foreground uppercase tracking-tight italic leading-none">{selectedClass?.duration} Deployment</p>
               </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between text-left">
                <div className="flex items-center gap-4">
                   <ShieldCheck className="w-5 h-5 text-primary" />
                   <h4 className="text-[11px] font-bold text-foreground uppercase tracking-[0.5em] italic">Personnel Manifest</h4>
                </div>
                <Badge className="bg-primary text-primary-foreground px-6 py-2 text-[10px] font-bold uppercase italic rounded-full shadow-glow-gold">{selectedClass?.registered} Units Logged</Badge>
              </div>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-4">
                {['Liam Anderson', 'Sarah Jenkins', 'Mike Ross', 'Harvey Specter', 'Louis Litt'].map((name, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-secondary/10 border border-border/10 rounded-[30px] hover:border-primary/20 transition-all group shadow-sm transition-all duration-500">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-3xl bg-background border border-border/10 flex items-center justify-center text-[14px] font-bold text-muted-foreground/30 uppercase italic group-hover:text-primary group-hover:scale-105 transition-all">
                        {name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <span className="text-lg font-heading font-bold text-foreground/70 tracking-tight uppercase group-hover:text-foreground transition-colors italic leading-none block">{name}</span>
                        <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest italic group-hover:text-primary/40 transition-colors">Unit_Identifier: SEC-{idx + 100}</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-background/50 border border-border/10 text-muted-foreground/10 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500 transition-all p-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-8 pt-8">
              <Button variant="ghost" className="flex-1 h-20 rounded-[40px] text-[11px] font-bold uppercase tracking-[0.4em] bg-secondary/10 border border-border/10 text-muted-foreground/30 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500 transition-all italic">
                SCRUB_SESSION
              </Button>
              <GoldButton onClick={() => setSelectedClass(null)} className="flex-1 h-20 rounded-[40px] text-[11px] font-bold uppercase tracking-[0.4em] italic shadow-glow-gold">
                DEPLOY_HUB_LINK
              </GoldButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
