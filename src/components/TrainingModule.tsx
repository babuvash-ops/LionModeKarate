import { useState } from 'react';
import { 
  Play, 
  Sword, 
  Activity, 
  ChevronRight,
  Info,
  Zap,
  Shield,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import GoldButton from './shared/GoldButton';
import { cn } from '@/lib/utils';

const COURSES = [
  { 
    id: 1, 
    title: 'Precision Fundamentals', 
    category: 'STRETCHING', 
    duration: '45m', 
    lessons: 12, 
    progress: 100, 
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=1200', 
  },
  { 
    id: 2, 
    title: 'Heian Shodan Mastery', 
    category: 'KATA', 
    duration: '1.2h', 
    lessons: 8, 
    progress: 45, 
    image: 'https://images.unsplash.com/photo-1543326168-5f2ca03db82d?auto=format&fit=crop&q=80&w=1200', 
  },
  { 
    id: 3, 
    title: 'Strike Velocity X', 
    category: 'SPARRING', 
    duration: '30m', 
    lessons: 5, 
    progress: 12, 
    image: 'https://images.unsplash.com/photo-1629739683357-19e0b1d38fc1?auto=format&fit=crop&q=80&w=1200', 
  },
  { 
    id: 4, 
    title: 'Tactical Conditioning', 
    category: 'FITNESS', 
    duration: '15m', 
    lessons: 3, 
    progress: 0, 
    image: 'https://images.unsplash.com/photo-1549413242-bd9ac911a141?auto=format&fit=crop&q=80&w=1200', 
  },
];

export default function TrainingModule({ branding }: any) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const categories = ['ALL', 'KATA', 'SPARRING', 'STRETCHING', 'FITNESS'];

  return (
    <div className="flex flex-col min-h-full bg-background animate-in fade-in duration-700">
      {/* Neural Protocol Hero */}
      <section className="relative h-[65vh] w-full flex flex-col justify-end p-12 lg:p-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549576490-b0b4831da60a?auto=format&fit=crop&q=80&w=1800" 
            alt="Feature Protocol" 
            className="w-full h-full object-cover grayscale brightness-[0.25] contrast-[120%] transition-transform duration-[20s] group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-grid-tactical opacity-20 pointer-events-none" />
        </div>

        <div className="relative z-10 space-y-10 max-w-5xl text-left">
           <div className="flex items-center gap-8">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold uppercase tracking-[0.6em] px-10 py-3 rounded-full italic shadow-glow-gold">
                LOCKED_PROTOCOL_BETA
              </Badge>
              <div className="flex items-center gap-4 text-muted-foreground/30 text-[10px] font-bold uppercase tracking-[0.4em] italic">
                 <Sword className="w-5 h-5 text-primary" /> Mastery Node_04
              </div>
           </div>
           
           <h2 className="text-7xl md:text-[11rem] font-heading font-black text-foreground italic leading-[0.75] tracking-tighter uppercase mb-6 drop-shadow-2xl">
              Heian_ <br />
              <span className="text-primary italic opacity-90">Shodan.</span>
           </h2>

           <div className="flex flex-col md:flex-row items-center gap-8 pt-12">
              <GoldButton className="h-24 px-20 gap-8 rounded-[40px] w-full md:w-80 shadow-glow-gold group relative overflow-hidden">
                 <Play className="w-8 h-8 fill-primary-foreground group-hover:scale-125 transition-transform duration-500" />
                 <span className="text-xl font-bold tracking-[0.3em]">INITIALIZE FEED</span>
              </GoldButton>
              <Button className="h-24 w-24 bg-secondary/10 border border-border/10 hover:bg-secondary/20 rounded-[40px] flex items-center justify-center p-0 backdrop-blur-3xl transition-all group shadow-xl">
                 <Info className="w-8 h-8 text-muted-foreground/20 group-hover:text-primary transition-colors" />
              </Button>
           </div>
        </div>
      </section>

      {/* Protocol Intelligence Filters */}
      <section className="py-16 px-12 space-y-16 bg-background/80 backdrop-blur-3xl sticky top-0 z-50 border-b border-border/10 shadow-2xl">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 max-w-7xl mx-auto w-full">
            <div className="text-left space-y-2">
              <h3 className="text-4xl font-heading font-black uppercase tracking-tight italic text-foreground leading-none">Instruction_Rails</h3>
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground/20 italic">Active training vectors for tactical growth.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-primary cursor-pointer hover:opacity-80 transition-opacity italic group">
               <span>Access Black Belt Archives</span>
               <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
         </div>

         <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 max-w-7xl mx-auto w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex-none px-12 h-16 rounded-[28px] text-[10px] font-bold uppercase tracking-[0.4em] border transition-all duration-700 italic",
                  activeCategory === cat 
                  ? 'bg-primary border-primary text-primary-foreground shadow-glow-gold -translate-y-2' 
                  : 'bg-secondary/10 border-border/30 text-muted-foreground/30 hover:border-primary/20 hover:text-foreground'
                )}
              >
                {cat.replace('ALL', 'ALL_SYSTEMS')}
              </button>
            ))}
         </div>
      </section>

      {/* Modular Rails */}
      <section className="pb-48 space-y-32 px-12 mt-16 max-w-[1800px] mx-auto">
         {/* ACTIVE PROGRESSION */}
         <div className="space-y-12">
            <div className="flex items-center justify-between text-left px-4">
               <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[28px] bg-primary/5 flex items-center justify-center text-primary border border-primary/20 shadow-xl">
                     <Layers className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-3xl font-heading font-bold uppercase italic tracking-tighter text-foreground">Unit_Progression</h4>
                     <div className="h-1 w-12 bg-primary/20" />
                  </div>
               </div>
            </div>

            <div className="flex gap-16 overflow-x-auto no-scrollbar py-6 px-4">
               {COURSES.map((course, i) => (
                 <motion.button
                   key={course.id}
                   whileHover={{ y: -16 }}
                   className="flex-none w-[520px] group text-left relative"
                 >
                    <div className="relative aspect-video rounded-[60px] overflow-hidden border border-border/30 mb-10 shadow-3xl transition-all duration-700 bg-secondary/20">
                       <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover grayscale brightness-[0.5] group-hover:grayscale-0 group-hover:brightness-[0.8] transition-all duration-[1.5s]"
                        referrerPolicy="no-referrer"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                       
                       {/* Play Overlay */}
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
                          <div className="w-28 h-28 bg-primary rounded-[40px] flex items-center justify-center shadow-glow-gold scale-50 group-hover:scale-100 transition-transform duration-500">
                             <Play className="w-12 h-12 text-primary-foreground fill-primary-foreground translate-x-1" />
                          </div>
                       </div>

                       {/* Progress Tracking */}
                       <div className="absolute bottom-10 left-10 right-10">
                          <div className="flex justify-between text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.5em] mb-4 italic">
                            <span>Diagnostic Status</span>
                            <span className="text-primary font-black">{course.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-background/40 rounded-full overflow-hidden shadow-inner">
                             <div className="h-full bg-primary shadow-glow-gold transition-all duration-1500" style={{ width: `${course.progress}%` }} />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 px-10 text-left">
                       <p className="text-[11px] font-bold text-primary uppercase tracking-[0.6em] italic leading-none">{course.category}_PROTOCOL</p>
                       <h5 className="text-5xl font-heading font-black uppercase tracking-tighter text-foreground leading-[0.8] italic group-hover:text-primary transition-colors">{course.title}</h5>
                       <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground/20 pt-2">
                          <div className="flex items-center gap-3 italic"><Zap className="w-5 h-5 text-primary/40" /> {course.duration}</div>
                          <div className="w-2 h-2 rounded-full bg-border/20" />
                          <span className="italic">{course.lessons} Neural_Nodes</span>
                       </div>
                    </div>
                 </motion.button>
               ))}
            </div>
         </div>

         {/* POPULAR PROTOCOLS */}
         <div className="space-y-10">
            <div className="flex items-center justify-between text-left">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                     <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-display font-black uppercase italic tracking-[0.2em] text-white/40">Archives: Popular Protocols</h4>
               </div>
            </div>

            <div className="flex gap-10 overflow-x-auto no-scrollbar">
               {[...COURSES].reverse().map((course, i) => (
                 <motion.button
                   key={`popular-${course.id}`}
                   whileHover={{ scale: 1.02 }}
                   className="flex-none w-[320px] group text-left"
                 >
                    <div className="relative aspect-[3/4] rounded-[60px] overflow-hidden border border-white/5 mb-8 shadow-2xl transition-all duration-700 bg-charcoal">
                       <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover brightness-[0.6] group-hover:brightness-[0.8] transition-all duration-700"
                        referrerPolicy="no-referrer"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                       <div className="absolute bottom-10 left-10 right-10">
                         <h5 className="text-3xl font-display font-black uppercase tracking-tighter text-white italic group-hover:text-gold transition-colors leading-[0.9]">{course.title}</h5>
                       </div>
                    </div>
                 </motion.button>
               ))}
            </div>
         </div>
      </section>

      <div className="flex items-center justify-between px-12 py-16 opacity-10 italic border-t border-white/5">
         <div className="flex items-center gap-4">
           <Zap className="w-6 h-6 text-gold" />
           <span className="text-[11px] font-black tracking-[0.4em] uppercase">NEURAL DOJO OPS v6.0</span>
         </div>
         <p className="text-[11px] font-black uppercase tracking-[0.6em]">Uptime: 99.98%</p>
      </div>
    </div>
  );
}
