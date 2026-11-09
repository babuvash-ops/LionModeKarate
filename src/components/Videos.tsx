import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "../api/base44Client";
import { Play, Clock, Eye, Flame, Shield, Activity, Film } from "lucide-react";
import { motion } from "motion/react";
import HeroBanner from "./shared/HeroBanner";
import BeltBadge from "./shared/BeltBadge";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "ALL_RECORDS" },
  { value: "kata", label: "KATA_FORMS" },
  { value: "sparring", label: "SPARRING_OPS" },
  { value: "fundamentals", label: "CORE_BASICS" },
  { value: "grading_prep", label: "GRADING_PROTO" },
  { value: "self_defense", label: "TACTICAL_DEF" },
  { value: "fitness", label: "PHYSIO_FEED" },
  { value: "competition", label: "COMBAT_READY" },
];

export default function Videos() {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: () => (base44.entities as any).Video.list("-created_date", 100),
  });

  const filtered = activeCategory === "all" ? videos : (videos as any[]).filter((v) => v.category === activeCategory);

  return (
    <div className="relative min-h-screen pb-32 animate-in fade-in duration-700">
      {/* Decorative ambient spots */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[25rem] h-[25rem] bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10 px-4 md:px-8">
        {/* HEADER SECTION - Beautiful Oswald Typography & Sizes */}
        <div className="text-left space-y-4">
          <span className="section-subtitle">
            Cinematic Curriculum
          </span>
          <h1 className="hero-title text-white tracking-wide uppercase font-bold leading-none animate-fade-in">
            TRAINING_ <br />
            <span className="text-primary">LIBRARY</span>
          </h1>
          <p className="body-text-premium text-white/70 font-sans text-base md:text-lg leading-relaxed max-w-xl">
            Master your combat biomechanics, kata forms, tactical drills, and sparring progressions with our high-definition curriculum.
          </p>
        </div>

        <div className="space-y-12">
        {/* Category Tabs */}
        <div className="glass bg-[#0A0A0A]/60 backdrop-blur-xl p-6 rounded-[35px] border border-white/8 flex gap-3 overflow-x-auto no-scrollbar shadow-xl">
          {categories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className={cn(
                "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all border italic",
                activeCategory === value
                  ? "bg-primary text-black border-primary shadow-glow-gold"
                  : "bg-white/5 border-white/5 text-white/30 hover:border-primary/40 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Featured Video */}
        {!isLoading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[400px] md:h-[600px] rounded-[60px] overflow-hidden cursor-pointer group shadow-3xl border border-white/5"
          >
            <img
              src={filtered[0].thumbnail_url || "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&q=80"}
              alt={filtered[0].title}
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.4] group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-[0.7] transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-grid-tactical opacity-20 pointer-events-none" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-glow-gold backdrop-blur-md"
              >
                <Play className="w-10 h-10 text-black ml-1 fill-black" />
              </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-12 md:p-16">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-[12px] font-black uppercase tracking-[0.5em] text-primary italic bg-primary/10 px-6 py-2 rounded-xl border border-primary/20 backdrop-blur-xl">
                  {filtered[0].category?.replace(/_/g, "_").toUpperCase()}
                </span>
                {filtered[0].is_premium && (
                  <span className="text-[10px] px-4 py-2 rounded-xl bg-primary text-black font-black uppercase tracking-[0.2em] italic shadow-glow-gold">PREMIUM_ACCESS</span>
                )}
              </div>
              <h2 className="font-heading text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-[0.8] mb-8">
                {filtered[0].title.replace(/ /g, '_')}
              </h2>
              <div className="flex flex-wrap items-center gap-8 text-[11px] font-black text-white/40 uppercase tracking-[0.3em] font-heading italic">
                {filtered[0].duration_minutes && (
                  <span className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" /> {filtered[0].duration_minutes}_MINUTES
                  </span>
                )}
                {filtered[0].instructor && (
                   <span className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" /> INSTRUCTOR: {filtered[0].instructor.toUpperCase()}
                   </span>
                )}
                <BeltBadge belt={filtered[0].belt_level || "all"} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[40px] h-80 animate-pulse" />
            ))
          ) : (
            filtered.slice(1).map((video: any, i: number) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass bg-[#121212]/40 backdrop-blur-xl border border-white/8 rounded-[40px] overflow-hidden group cursor-pointer hover:border-primary/25 transition-all duration-500 shadow-2xl relative"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={video.thumbnail_url || "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80"}
                    alt={video.title}
                    className="w-full h-full object-cover grayscale brightness-[0.5] group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-[0.8] transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-glow-gold">
                      <Play className="w-7 h-7 text-black ml-1 fill-black" />
                    </div>
                  </div>
                  {video.is_premium && (
                    <span className="absolute top-6 right-6 text-[9px] px-3 py-1.5 rounded-lg bg-primary text-black font-black uppercase tracking-widest italic shadow-glow-gold">
                      PREMIUM
                    </span>
                  )}
                </div>
                <div className="p-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic mb-3 block">
                    {video.category?.replace(/_/g, "_").toUpperCase()}
                  </span>
                  <h3 className="font-heading text-2xl font-bold uppercase italic text-white group-hover:text-primary transition-colors line-clamp-1 tracking-tight leading-none">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-6 mt-6 text-[9px] font-black text-white/30 uppercase tracking-widest italic">
                    {video.duration_minutes && (
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary/40" /> {video.duration_minutes}M</span>
                    )}
                    <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-primary/40" /> {video.views || 0}_VIEWS</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {!isLoading && filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 glass bg-white/5 rounded-[40px] border border-white/10 border-dashed"
          >
            <Film className="w-20 h-20 text-white/5 mx-auto mb-8" />
            <p className="section-title tracking-[0.3em] text-white/20 italic">No_Tactical_Feeds_Found</p>
            <button 
              onClick={() => setActiveCategory("all")}
              className="mt-8 text-primary text-[10px] font-black uppercase tracking-[0.5em] italic hover:tracking-[0.7em] transition-all cursor-pointer"
            >
              RESTORE_ALL_FREQUENCIES
            </button>
          </motion.div>
        )}
      </div>
     </div>
    </div>
  );
}
