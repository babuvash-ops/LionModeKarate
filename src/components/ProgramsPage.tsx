import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Trophy, Zap, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GoldButton from './shared/GoldButton';

export default function ProgramsPage({ branding }: { branding: any }) {
  const programs = [
    { 
      title: 'Little Lions', 
      age: 'Ages 4-7', 
      image: branding.littleLionsImage || 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800',
      desc: 'Developing concentration, social integration, and motor skills through foundational physical practices.',
      features: ['Basic Agility Routines', 'Focus Calibration', 'Confidence Building', 'Respect Protocols']
    },
    { 
      title: 'Youth Elite', 
      age: 'Ages 8-15', 
      image: branding.youthWarriorsImage || 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?auto=format&fit=crop&q=80&w=800',
      desc: 'Advancing physical strength, self-discipline, defensive awareness, and structural coordination.',
      features: ['Technical Mastery', 'Form & Sparring Dynamics', 'Bullying Interception', 'Leadership Fundamentals']
    },
    { 
      title: 'Adult Operational', 
      age: 'Ages 16+', 
      image: branding.adultEliteImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
      desc: 'Comprehensive modern defense, body mechanics, conditioning, and elite high-intensity training.',
      features: ['Full Combat Systems', 'Tactical Real-World Defense', 'Peak Metabolic Readiness', 'Systemic Stress Mitigation']
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 pt-28 relative overflow-hidden">
      {/* Decorative ambient spots */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[25rem] h-[25rem] bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

      {/* HEADER SECTION - Consistent with home page */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-8 mb-20 animate-fade-in">
        <div className="text-left space-y-4 max-w-3xl">
          <span className="section-subtitle">
            Training Matrix
          </span>
          <h1 className="hero-title text-white tracking-wide uppercase font-bold leading-none">
            FORGE_YOUR_ <br />
            <span className="text-primary">SPEC_PATH</span>
          </h1>
          <p className="body-text-premium text-white/70 font-sans text-base md:text-lg leading-relaxed max-w-2xl">
            Every curriculum track is meticulously engineered to build indominable character, physical capability, and tactical coordination.
          </p>
        </div>
      </section>

      {/* PROGRAMS CARD CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-32">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-[32px] overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300 flex flex-col shadow-2xl hover:shadow-glow-gold"
            >
              {/* Photo header */}
              <div className="h-64 relative overflow-hidden">
                <img 
                  src={program.image} 
                  className="w-full h-full object-cover grayscale opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100" 
                  alt={program.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-primary text-primary-foreground font-heading italic font-bold uppercase tracking-widest px-3 py-1 text-[10px] rounded-lg border-none">
                    {program.age}
                  </Badge>
                </div>
              </div>

              {/* Card content */}
              <div className="p-8 space-y-8 flex-1 flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <h3 className="font-heading text-3xl font-extrabold text-white uppercase italic tracking-tight group-hover:text-primary transition-colors leading-none">
                    {program.title}
                  </h3>
                  <p className="font-sans text-xs text-white/50 italic leading-relaxed">
                    {program.desc}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-[9px] font-bold text-primary tracking-widest uppercase italic leading-none block border-b border-white/5 pb-2">
                    CORE TARGET METRICS
                  </p>
                  <div className="space-y-3 text-left">
                    {program.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3 text-[10px] text-white/60 font-medium uppercase tracking-widest italic">
                        <div className="w-1.5 h-1.5 bg-primary/80 rounded-full shadow-glow shrink-0 animate-pulse" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3">
                  <GoldButton 
                    className="w-full h-12 text-xs font-heading tracking-widest font-bold uppercase italic rounded-xl" 
                    onClick={() => {
                      const trialNode = document.getElementById('main-content') || window;
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    SELECT_Induction
                  </GoldButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TACTICAL ADVANTAGE */}
        <section className="premium-card grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left overflow-hidden">
          
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-3">
              <span className="section-subtitle">Systemic Architecture</span>
              <h2 className="section-title">THE_WARRIOR_PROTOCOL</h2>
              <p className="body-text-premium text-white/50 text-sm md:text-base leading-relaxed">
                Our curriculum is calibrated on high-density instructional structures. No filler classes, only real-world physical and psychological conditioning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Shield, title: 'Defensive Sync', desc: 'Integrated physical protection principles and dynamic motor pathways.' },
                { icon: Target, title: 'Precision Strike', desc: 'Strategic training focused on high-efficiency output and discipline.' },
                { icon: Trophy, title: 'Elite Merit', desc: 'Standardized assessment tiers and credential verification.' },
                { icon: Zap, title: 'Neural Response', desc: 'Enhanced situational assessment and rapid reaction protocols.' },
              ].map((item, i) => (
                <div key={i} className="space-y-3 p-5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-primary/20 rounded-2xl transition-all duration-300">
                  <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary transition-all">
                    <item.icon className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="font-heading text-base font-bold text-white uppercase italic tracking-wider">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-white/50 italic font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/5] bg-neutral-900 rounded-[24px] overflow-hidden border border-white/5 shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1549576490-b0b4831da60a?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover grayscale brightness-[0.4] group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-1000" 
                alt="Systemic Training" 
              />
              <div className="absolute inset-0 bg-primary/2 pointer-events-none" />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg rotate-12 transition-transform duration-500 group-hover:rotate-0">
                <Flame className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
