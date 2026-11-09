import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Trophy, Swords, Flame, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GoldButton from './shared/GoldButton';

export default function AboutPage({ branding }: { branding: any }) {
  const values = [
    { icon: Shield, label: 'DISCIPLINE', desc: 'Consistency over motivation. Everyday deployment of focus and mental control.' },
    { icon: Target, label: 'PRECISION', desc: 'Accuracy in mechanical movement, tactical execution, and strategic intent.' },
    { icon: Swords, label: 'RESILIENCE', desc: 'Building the physical and psychological capacity to endure, adapt, and thrive.' },
    { icon: Trophy, label: 'LOYALTY', desc: 'Commitment to the self, the roster units, the instructors, and the order.' }
  ];

  return (
    <div className="min-h-screen bg-background pb-32 pt-28 relative overflow-hidden">
      {/* Background gradients mirroring Homepage / TrialPage */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[25rem] h-[25rem] bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-8 mb-24">
        <div className="text-left space-y-6 max-w-3xl">
          <span className="section-subtitle">
            Mission Directive
          </span>
          <h1 className="hero-title text-white tracking-wide uppercase font-bold leading-none">
            THE_ <br />
            <span className="text-primary">ORDER_PROTOCOL</span>
          </h1>
          <p className="body-text-premium text-white/70 font-sans text-base md:text-lg leading-relaxed max-w-2xl">
            A tactical training ecosystem designed to synchronize mind, body, and character through elite martial discipline, modern physiological science, and centuries-old traditions.
          </p>
        </div>
      </section>

      {/* CORE PHILOSOPHY & STORY */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-32">
        
        {/* Row 1: Dual aspect content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-3 text-left">
              <span className="section-subtitle">
                Operational Foundations
              </span>
              <h2 className="section-title">
                THE_PHILOSOPHY <br /><span className="text-primary italic">OF_ENGAGEMENT</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-white/70 font-sans text-base leading-relaxed">
              <p>
                Founded on the principles of tactical precision and unwavering resilience, our dojo is more than a training facility—it is a nexus for personal evolution. We combine high-performance sports science with traditional bushido ethics.
              </p>
              <p>
                We prepare candidates for life's most demanding battles. Our curriculum focuses on three core operational pillars: static focus, dynamic power development, and strategic defensive restraint.
              </p>
              <p className="italic text-primary/80 font-semibold border-l-2 border-primary/40 pl-4">
                "We do not rise to the level of our expectations. We fall to the level of our training systems."
              </p>
            </div>
          </motion.div>

          {/* Right column: Image card */}
          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/5] bg-neutral-900 rounded-[32px] overflow-hidden border border-white/5 shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                alt="Dojo Philosophy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            </div>
            
            {/* Float Badge */}
            <div className="absolute -bottom-6 -right-4 glass rounded-3xl p-6 border border-white/10 shadow-glow text-left max-w-[200px]">
              <span className="font-heading text-4xl font-extrabold italic text-primary leading-none block">15+</span>
              <span className="text-[9px] font-sans font-black tracking-widest text-white/40 uppercase block mt-1">YEARS OF TACTICAL LEADERSHIP</span>
            </div>
          </div>
        </div>

        {/* VALUES SECTOR - Styled in Beautiful High-Density Glass Panels */}
        <div className="space-y-12">
          <div className="text-left space-y-2">
            <span className="section-subtitle">Tactical Parameters</span>
            <h2 className="section-title">CORE_VIRTUES_MATRIX</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {values.map((item, i) => (
              <div 
                key={i} 
                className="premium-card space-y-6 hover:border-primary/20 hover:shadow-glow-gold transition-all duration-300 text-left relative group overflow-hidden overflow-hidden"
              >
                <div className="w-12 h-12 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider italic">
                    {item.label}
                  </h4>
                  <p className="font-sans text-xs text-white/50 italic leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMMAND STAFF */}
        <div className="space-y-16 pt-12 border-t border-white/5">
          <div className="text-left space-y-2">
            <span className="section-subtitle">Leadership Unit</span>
            <h2 className="section-title">COMMAND_STAFF_OFFICERS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
            {[
              { 
                name: 'Sensei Marcus', 
                rank: '5th Dan Black Belt', 
                image: branding.instructor1Image || 'https://images.unsplash.com/photo-1615118625744-6684718a8d18?auto=format&fit=crop&q=80&w=800', 
                role: 'Head of Operations' 
              },
              { 
                name: 'Shihan Elena', 
                rank: '7th Dan Master', 
                image: branding.instructor2Image || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800', 
                role: 'Strategic Advisor' 
              },
            ].map((inst, i) => (
              <div 
                key={i} 
                className="premium-card shadow-2xl relative group h-[480px] overflow-hidden"
              >
                <img 
                  src={inst.image} 
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 brightness-[0.4] group-hover:brightness-[0.75] transition-all duration-1000" 
                  alt={inst.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
                
                <div className="absolute bottom-8 left-8 right-8 text-left space-y-1.5 z-10">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase font-black tracking-widest text-[8px] py-1 px-3 italic rounded-full mb-1">
                    {inst.rank}
                  </Badge>
                  <h4 className="font-heading text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wide leading-none">
                    {inst.name}
                  </h4>
                  <p className="font-sans text-xs text-white/40 uppercase tracking-widest font-black italic">
                    {inst.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FACILITY NEXUS OUTPOST */}
        <div className="premium-card text-left space-y-12 shadow-2xl relative overflow-hidden overflow-hidden">
          <div className="absolute top-0 right-0 w-[20rem] h-[20rem] bg-primary/[0.02] rounded-full blur-[60px] pointer-events-none" />
          
          <div className="space-y-3">
            <span className="section-subtitle">Tactical Outpost</span>
            <h2 className="section-title">THE_NEXUS_HQ</h2>
            <p className="body-text-premium text-white/50 max-w-2xl text-sm md:text-base leading-relaxed">
              2,400 square feet of high-impact technical training facilities. Fully equipped with premium Olympic-grade combat mats, digital performance assessment sensors, and dedicated recovery recovery docks.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {[
              'https://content.app-sources.com/s/09941769835917864/uploads/Images/IMG-20210610-WA0134-8490785.jpg',
              'https://content.app-sources.com/s/09941769835917864/uploads/Images/20210909_175558-7415561.jpg',
              'https://content.app-sources.com/s/40806072080313136/uploads/Images/rawpixel-com-395554-unsplash-4348288.jpg',
              'https://content.app-sources.com/s/09941769835917864/uploads/Images/241426277_229185769151696_3286067128154972950_n-7424218.jpg'
            ].map((img, i) => (
              <div 
                key={i} 
                className="aspect-square rounded-2xl overflow-hidden border border-white/5 opacity-50 hover:opacity-100 transition-all duration-500 relative group cursor-crosshair shadow-lg"
              >
                <img src={img} className="w-full h-full object-cover scale-[1.02] group-hover:scale-110 transition-transform duration-700" alt="Nexus Alpha" />
                <div className="absolute inset-0 bg-primary/5 mix-blend-color opacity-30 group-hover:opacity-0 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
