import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Search, Play, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GalleryPage() {
  const categories = ['ALL', 'TRAINING', 'EVENTS', 'GRADING', 'TOURNAMENTS'];
  const [activeCategory, setActiveCategory] = useState('ALL');

  const galleryItems = [
    { title: 'Black Belt Grading', category: 'GRADING', type: 'image', url: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=800' },
    { title: 'Junior Training', category: 'TRAINING', type: 'image', url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800' },
    { title: 'Tactical Seminar', category: 'EVENTS', type: 'video', url: 'https://images.unsplash.com/photo-1544117519-31a4b7192233?q=80&w=800' },
    { title: 'Precision Drills', category: 'TRAINING', type: 'image', url: 'https://images.unsplash.com/photo-1521791136064-7986c2950663?q=80&w=800' },
    { title: 'Regional Open', category: 'TOURNAMENTS', type: 'image', url: 'https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=800' },
    { title: 'Masters Class', category: 'TRAINING', type: 'video', url: 'https://images.unsplash.com/photo-1540206276207-3af25c08abbb?q=80&w=800' },
    { title: 'Youth Excellence', category: 'TRAINING', type: 'image', url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=800' },
    { title: 'Belt Promotion', category: 'GRADING', type: 'image', url: 'https://images.unsplash.com/photo-1533107862482-0e6974b06017?q=80&w=800' },
  ];

  const filteredItems = activeCategory === 'ALL' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-32 pt-28 relative overflow-hidden">
      {/* Light highlights */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[25rem] h-[25rem] bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

      {/* HEADER SECTION - Consistent with other modules */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-8 mb-16 animate-fade-in">
        <div className="text-left space-y-4 max-w-3xl">
          <span className="section-subtitle">
            Visual Intel
          </span>
          <h1 className="hero-title text-white tracking-wide uppercase font-bold leading-none">
            TACTICAL_ <br />
            <span className="text-primary">MEDIA_ARCHIVES</span>
          </h1>
          <p className="body-text-premium text-white/70 font-sans text-base md:text-lg leading-relaxed max-w-2xl">
            Inspect captured visual reports detailing recent sparring operations, rank promotions, and elite competitive combat deployments.
          </p>
        </div>
      </section>

      {/* CATEGORIES COLD BAR - Unified Glassmorphism */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="glass p-3 rounded-2xl flex flex-wrap items-center justify-start gap-2 border border-white/5 shadow-xl">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-heading font-bold tracking-widest uppercase italic transition-all duration-300 cursor-pointer",
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground shadow-glow-gold" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* IMAGES MASONRY GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div
                layout
                key={item.title}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-3xl overflow-hidden border border-white/5 hover:border-primary/20 hover:shadow-glow-gold transition-all duration-300 aspect-[4/5] cursor-crosshair bg-neutral-900"
              >
                <img 
                  src={`${item.url}&auto=format&fit=crop&q=80&w=800`} 
                  className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-1000 group-hover:scale-105" 
                  alt={item.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/10 to-transparent opacity-90 transition-opacity" />
                
                {/* Details overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 text-left">
                  <div className="space-y-1.5">
                    <Badge className="bg-primary text-primary-foreground border-none text-[8px] font-heading italic font-bold tracking-wider rounded-md py-0.5 px-2">
                      {item.category}
                    </Badge>
                    <h4 className="text-lg font-heading font-bold text-white italic uppercase tracking-wider leading-none">
                      {item.title}
                    </h4>
                  </div>
                  <div className="w-9 h-9 bg-primary/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shrink-0 text-primary">
                    {item.type === 'video' ? <Play className="w-4.5 h-4.5 fill-current ml-0.5" /> : <ZoomIn className="w-4.5 h-4.5" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
