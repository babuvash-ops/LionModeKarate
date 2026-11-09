import React from 'react';
import { motion } from 'motion/react';
import { Map, Calendar, Users, Target, Shield, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GoldButton from './shared/GoldButton';

export default function EventsPage() {
  const missions = [
    { 
      title: 'Summer Belt Grading', 
      date: 'June 15, 2026', 
      type: 'Rank Assessment',
      img: 'https://images.unsplash.com/photo-1543326168-5f2ca03db82d?auto=format&fit=crop&q=80&w=800',
      description: 'The final rank evaluation session for the active term. All candidates must have verified 90%+ roster attendance pulse.'
    },
    { 
      title: 'Inter-Club Championship', 
      date: 'July 04, 2026', 
      type: 'Tactical Elite Ops',
      img: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800',
      description: 'Multi-sector combat drills and tournaments. Participant registration closes June 20th. Forge your legacy on the premium mats.'
    },
    { 
      title: 'Urban Self-Defense Seminar', 
      date: 'July 22, 2026', 
      type: 'Special Operation',
      img: 'https://images.unsplash.com/photo-1552072805-2a9039d00e57?auto=format&fit=crop&q=80&w=800',
      description: 'Advanced defensive awareness and physical protection protocols for civilian and professional applications.'
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 pt-28 relative overflow-hidden">
      {/* Background visual artifacts */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[25rem] h-[25rem] bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

      {/* HEADER SECTION - Consistent across branding pages */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-8 mb-20">
        <div className="text-left space-y-4 max-w-3xl animate-fade-in">
          <span className="section-subtitle">
            Deployment Log
          </span>
          <h1 className="hero-title text-white tracking-wide uppercase font-bold leading-none">
            FIELD_ <br />
            <span className="text-primary">MISSION_INTEL</span>
          </h1>
          <p className="body-text-premium text-white/70 font-sans text-base md:text-lg leading-relaxed max-w-2xl">
            Monitor upcoming deployments, physical assessments, belt grading sequences, and technical seminars across all training sectors.
          </p>
        </div>
      </section>

      {/* LIST OF EVENTS */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        {missions.map((mission, i) => (
          <motion.div
            key={mission.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group grid grid-cols-1 lg:grid-cols-12 glass rounded-[32px] overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300 shadow-2xl relative"
          >
            {/* Top Date Stamp Overlay */}
            <div className="absolute top-6 right-6 z-20 hidden lg:block">
              <div className="bg-primary text-primary-foreground p-4 rounded-2xl flex flex-col items-center justify-center min-w-[90px] shadow-lg shadow-primary/10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <span className="text-[10px] font-sans font-black uppercase tracking-widest">{mission.date.split(' ')[0]}</span>
                <span className="font-heading text-3xl font-extrabold italic leading-none mt-1">{mission.date.split(' ')[1].replace(',', '')}</span>
              </div>
            </div>

            {/* Event Photo */}
            <div className="lg:col-span-4 h-64 lg:h-auto overflow-hidden relative">
              <img 
                src={mission.img} 
                className="w-full h-full object-cover grayscale brightness-50 contrast-[1.15] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-75" 
                alt="Mission Outpost" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent lg:hidden" />
            </div>

            {/* Event Info Details */}
            <div className="lg:col-span-8 p-8 md:p-12 flex flex-col justify-between text-left space-y-6">
              <div className="space-y-4">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase font-black tracking-widest text-[8px] py-1 px-3 italic rounded-full inline-flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-primary animate-pulse" />
                  {mission.type}
                </Badge>
                
                <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-white uppercase italic tracking-tight group-hover:text-primary transition-colors leading-none">
                  {mission.title}
                </h3>
                
                <p className="font-sans text-xs md:text-sm text-white/50 leading-relaxed italic max-w-2xl">
                  {mission.description}
                </p>
              </div>

              {/* Specs parameters line */}
              <div className="flex flex-wrap items-center gap-6 py-2 border-t border-b border-white/5 text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] italic font-mono">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {mission.date}
                </div>
                <div className="flex items-center gap-2">
                  <Map className="w-3.5 h-3.5 text-primary" />
                  HQ Tactical Sector A
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  All Ranks Authorized
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex flex-col sm:flex-row gap-4 pt-1">
                <GoldButton 
                  className="h-12 px-8 text-xs font-heading font-bold tracking-widest uppercase italic rounded-xl shadow-glow-gold"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  SECURE_SLOT
                </GoldButton>
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
}
