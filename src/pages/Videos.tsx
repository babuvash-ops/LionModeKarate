import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Play, Clock, Eye, Search, X, CheckCircle2, Shield, Sparkles, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeroBanner from "@/components/shared/HeroBanner";
import GoldButton from "@/components/shared/GoldButton";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "kata", label: "Kata Forms" },
  { value: "sparring", label: "Kumite Sparring" },
  { value: "fundamentals", label: "Core Fundamentals" },
  { value: "grading_prep", label: "Belt Grading Prep" },
  { value: "self_defense", label: "Self-Defense" },
  { value: "fitness", label: "Dojo Fitness" },
  { value: "competition", label: "Competition Squad" },
];

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [playingVideo, setPlayingVideo] = useState<any>(null);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: () => base44.entities.Video.list("-views", 50),
  });

  const filtered = videos.filter((v: any) => {
    const matchesCat = activeCategory === "all" || v.category === activeCategory;
    const matchesSearch = (v.title || "").toLowerCase().includes(search.toLowerCase()) || 
                          (v.description || "").toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = filtered[0] || videos[0];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">
      <HeroBanner
        slot="hero_videos"
        title="Curriculum Video Library"
        subtitle="Master traditional Shotokan kata biomechanics, kumite sparring drills, and official belt grading syllabi in high definition."
        image="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1600&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-10">
        {/* Search & Category Pills */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search kata, drills, or techniques..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-all font-body"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto p-1.5 rounded-2xl bg-white/[0.02] border border-white/5">
            {categories.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`px-4 py-2.5 rounded-xl text-xs font-heading uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === value
                    ? "bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Video Card */}
        {featured && (
          <div
            onClick={() => setPlayingVideo(featured)}
            className="group relative h-[380px] md:h-[480px] rounded-3xl overflow-hidden border border-white/10 cursor-pointer shadow-2xl"
          >
            <img
              src={featured.thumbnail_url || "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&q=80"}
              alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.55]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFB800] text-black flex items-center justify-center shadow-xl shadow-[#D4AF37]/30 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-black ml-1" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-[#D4AF37] text-black font-heading text-xs uppercase tracking-wider font-bold">
                  Featured Masterclass
                </span>
                <span className="text-xs text-white/70 font-body flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {featured.duration_minutes || 18} mins
                </span>
                <span className="text-xs text-white/70 font-body flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {featured.views?.toLocaleString() || "2,840"} views
                </span>
              </div>
              <h2 className="font-heading text-2xl md:text-4xl font-bold uppercase text-white leading-tight">
                {featured.title}
              </h2>
              <p className="text-sm text-white/70 font-body max-w-2xl line-clamp-2">
                {featured.description}
              </p>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
              Curriculum Masterclasses ({filtered.length})
            </h3>
            <span className="text-xs text-white/50 font-body">Click any video to start training</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((video: any) => (
              <motion.div
                key={video.id}
                whileHover={{ y: -4 }}
                onClick={() => setPlayingVideo(video)}
                className="group bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 rounded-3xl overflow-hidden cursor-pointer backdrop-blur-xl transition-all shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={video.thumbnail_url || "https://images.unsplash.com/photo-1543326168-5f2ca03db82d?w=800&q=80"}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>

                  <span className="absolute top-3 right-3 text-[10px] font-heading uppercase px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30">
                    {video.belt_level || "All Belts"}
                  </span>

                  <span className="absolute bottom-3 right-3 text-xs bg-black/80 px-2 py-0.5 rounded text-white font-body">
                    {video.duration_minutes}m
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-heading uppercase tracking-widest text-[#D4AF37]">
                    {video.category?.replace(/_/g, " ")}
                  </span>
                  <h4 className="font-heading text-lg font-bold uppercase text-white line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-xs text-white/60 font-body line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-white/50 font-body">
                    <span>Instructor: {video.instructor || "Sensei Babu"}</span>
                    <span>{(video.views || 1000).toLocaleString()} views</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      <Dialog open={!!playingVideo} onOpenChange={() => setPlayingVideo(null)}>
        <DialogContent className="max-w-4xl bg-[#0A0A0A] border border-white/10 text-white p-0 rounded-3xl overflow-hidden">
          {playingVideo && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title={playingVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading uppercase tracking-widest text-[#D4AF37] px-2.5 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                    {playingVideo.category?.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-white/50">{playingVideo.views?.toLocaleString()} views • {playingVideo.duration_minutes} mins</span>
                </div>
                <h3 className="font-heading text-2xl font-bold uppercase text-white">{playingVideo.title}</h3>
                <p className="text-sm text-white/70 font-body leading-relaxed">{playingVideo.description}</p>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                  <span>Lead Instructor: <strong className="text-white">{playingVideo.instructor || "Sensei Babu"}</strong></span>
                  <span>Target Rank: <strong className="text-[#D4AF37]">{playingVideo.belt_level || "All Ranks"}</strong></span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
