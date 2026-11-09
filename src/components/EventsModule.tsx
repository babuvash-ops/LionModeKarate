import { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star,
  ChevronRight,
  Plus,
  ShieldCheck,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import GoldButton from './shared/GoldButton';
import { cn } from '@/lib/utils';

const EVENTS = [
  {
    id: 1,
    title: 'Bushido Seminar 2024',
    date: 'June 15, 2024',
    time: '09:00 AM',
    location: 'Main Dojo Hall',
    category: 'Seminar',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800',
    organizer: 'Shihan Kenzo',
    capacity: '50 Slots',
    price: '$45'
  },
  {
    id: 2,
    title: 'Regional Summit',
    date: 'July 12, 2024',
    time: '08:00 AM',
    location: 'City Sports Arena',
    category: 'Competition',
    image: 'https://images.unsplash.com/photo-1543326168-5f2ca03db82d?auto=format&fit=crop&q=80&w=800',
    organizer: 'National League',
    capacity: '200 Slots',
    price: '$75'
  },
  {
    id: 3,
    title: 'Black Belt Ascension',
    date: 'August 03, 2024',
    time: '10:00 AM',
    location: 'Mountain Retreat',
    category: 'Grading',
    image: 'https://images.unsplash.com/photo-1629739683357-19e0b1d38fc1?auto=format&fit=crop&q=80&w=800',
    organizer: 'Grandmaster Lee',
    capacity: '12 Candidates',
    price: '$120'
  }
];

export default function EventsModule() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Elite Summits Header */}
      <section className="relative h-[45vh] w-full flex flex-col justify-end p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=1800" 
            alt="Events" 
            className="w-full h-full object-cover grayscale brightness-[0.25] contrast-[130%]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-grid-tactical opacity-20 pointer-events-none" />
        </div>
        
        <div className="relative z-10 space-y-6 max-w-7xl mx-auto w-full text-left">
          <Badge variant="outline" className="bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold uppercase tracking-[0.5em] px-8 py-3 rounded-full backdrop-blur-3xl italic">Elite Summits Manifest</Badge>
          <h2 className="text-8xl md:text-[10rem] font-heading font-black text-foreground leading-[0.75] tracking-tighter uppercase italic drop-shadow-2xl">
            Combat_ <br />
            <span className="text-primary italic drop-shadow-[0_0_30px_rgba(var(--primary),0.3)]">Gatherings.</span>
          </h2>
        </div>
      </section>

      {/* Engagement Radar (Categories) */}
      <section className="p-8 md:p-12 max-w-7xl mx-auto w-full">
        <div className="flex gap-6 overflow-x-auto no-scrollbar py-4">
           {['All', 'Seminar', 'Competition', 'Grading'].map((cat) => (
             <Button
               key={cat}
               onClick={() => setFilter(cat)}
               className={cn(
                 "h-16 rounded-[28px] px-10 text-[11px] font-bold uppercase tracking-[0.3em] italic border transition-all flex-none flex items-center justify-center",
                 filter === cat 
                   ? "bg-primary border-primary text-primary-foreground shadow-glow-gold scale-105" 
                   : "bg-secondary/10 border-border/30 text-muted-foreground/30 hover:text-foreground hover:bg-secondary/20"
               )}
             >
               {cat === 'All' ? 'ALL_INTEL' : cat.toUpperCase()}
             </Button>
           ))}
        </div>
      </section>

      {/* Mission Briefings List */}
      <section className="px-8 md:px-12 pb-48 space-y-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <AnimatePresence mode="popLayout">
            {EVENTS.filter(e => filter === 'All' || e.category === filter).map((event, i) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="premium-card group cursor-pointer border-border/30 bg-secondary/5 hover:bg-secondary/10 hover:border-primary/30 overflow-hidden shadow-3xl flex flex-col rounded-[60px] relative"
              >
                <div className="aspect-[21/9] relative overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover grayscale brightness-[0.4] group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-[0.7] transition-all duration-1000" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                    <div className="absolute top-8 right-8">
                       <Badge className="bg-background/80 text-primary border border-primary/20 backdrop-blur-3xl px-8 py-3 font-bold text-[10px] italic tracking-[0.3em] shadow-glow-gold rounded-full">
                          {event.price}
                       </Badge>
                    </div>
                    <div className="absolute bottom-8 left-12">
                       <span className="text-[11px] font-bold text-primary uppercase tracking-[0.6em] italic drop-shadow-2xl">{event.category}_NODE</span>
                    </div>
                </div>
                
                <div className="p-12 md:p-16 space-y-12 flex-1 text-left relative z-10">
                    <div className="flex items-center justify-between">
                       <h3 className="text-5xl font-heading font-black text-foreground uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">{event.title}</h3>
                       <div className="flex items-center gap-4">
                          <Activity className="w-6 h-6 text-primary animate-pulse" />
                          <span className="text-[10px] font-bold uppercase text-muted-foreground/20 tracking-[0.4em] italic group-hover:text-primary/60">Active_Mission</span>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-10 bg-background/40 rounded-[40px] p-12 border border-border/10 shadow-inner">
                       <div className="flex items-center gap-5">
                          <Calendar className="w-6 h-6 text-primary/30" />
                          <span className="text-[11px] font-bold uppercase text-muted-foreground/60 tracking-[0.2em] italic">{event.date}</span>
                       </div>
                       <div className="flex items-center gap-5">
                          <Clock className="w-6 h-6 text-primary/30" />
                          <span className="text-[11px] font-bold uppercase text-muted-foreground/60 tracking-[0.2em] italic">{event.time}</span>
                       </div>
                       <div className="flex items-center gap-5 col-span-2">
                          <MapPin className="w-6 h-6 text-primary/30" />
                          <span className="text-[11px] font-bold uppercase text-muted-foreground/60 tracking-[0.2em] italic truncate">{event.location}</span>
                       </div>
                    </div>

                    <GoldButton className="w-full h-24 rounded-[40px] italic shadow-glow-gold group-hover:scale-[1.02] active:scale-95 transition-all text-sm font-bold tracking-[0.5em]">
                       SECURE_SECTOR_SLOT <ChevronRight className="ml-4 w-6 h-6" />
                    </GoldButton>
                </div>
                {/* Tactical trace */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full h-32 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02] flex items-center justify-center gap-6 hover:border-gold/30 hover:bg-gold/5 transition-all group mt-12"
        >
           <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-white/20 group-hover:text-gold transition-colors" />
           </div>
           <div className="text-left">
              <span className="text-xl font-display font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white transition-colors italic block">Manifest New Summit</span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">Authorized Command Input Required</span>
           </div>
        </motion.button>
      </section>
    </div>
  );
}
