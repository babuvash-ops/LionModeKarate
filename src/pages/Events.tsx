import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Calendar, MapPin, Users, Clock, Tag, Plus, CheckCircle2, ShieldCheck, Ticket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeroBanner from "@/components/shared/HeroBanner";
import GoldButton from "@/components/shared/GoldButton";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [registeringEvent, setRegisteringEvent] = useState<any>(null);

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => base44.entities.Event.list("date", 50),
  });

  const filtered = events.filter((e: any) => {
    if (selectedCategory === "all") return true;
    return e.category?.toLowerCase() === selectedCategory.toLowerCase() || e.event_type === selectedCategory;
  });

  const handleRegister = (event: any) => {
    toast.success(`Registered for ${event.title}! Confirmation ticket generated.`);
    setRegisteringEvent(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">
      <HeroBanner
        title="Dojo Events & Tournaments"
        subtitle="Belt grading examinations, regional championships, and specialized martial arts masterclasses in Durban."
        image="https://images.unsplash.com/photo-1543326168-5f2ca03db82d?w=1600&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-10">
        {/* Category Filter */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-white/[0.03] border border-white/10">
            {[
              { id: "all", label: "All Events" },
              { id: "grading", label: "Belt Grading" },
              { id: "competition", label: "Championships" },
              { id: "seminar", label: "Master Seminars" },
              { id: "community", label: "Workshops" }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-heading uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="text-sm text-white/50 font-body">
            Showing <strong className="text-white">{filtered.length}</strong> upcoming academy events
          </div>
        </div>

        {/* Events Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((event: any) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -4 }}
              className="bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 rounded-3xl overflow-hidden backdrop-blur-xl transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={event.image_url || "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                  
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-heading uppercase tracking-wider font-semibold">
                    {event.category || "Event"}
                  </span>

                  <span className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-[#D4AF37] text-black text-xs font-heading uppercase tracking-wider font-bold">
                    {event.price ? `R ${event.price}` : "Free Admission"}
                  </span>
                </div>

                <div className="p-6 md:p-8 space-y-4">
                  <h3 className="font-heading text-2xl font-bold uppercase text-white leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-sm text-white/70 font-body leading-relaxed">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-white/60 font-body">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <span>{event.time || "09:00 AM"}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span className="truncate">{event.location || "Lion Mode Main Dojo, Durban"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                <div className="text-xs text-white/50">
                  <span>Registered: </span>
                  <strong className="text-white">{event.registered_count || 24}</strong> / {event.capacity || 50}
                </div>

                <GoldButton onClick={() => setRegisteringEvent(event)}>
                  <Ticket className="w-4 h-4 mr-2" />
                  Register Entry
                </GoldButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={!!registeringEvent} onOpenChange={() => setRegisteringEvent(null)}>
        <DialogContent className="max-w-md bg-[#0A0A0A] border border-white/10 text-white rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold uppercase text-white">
              Event Registration
            </DialogTitle>
            <DialogDescription className="text-white/60 font-body text-xs">
              Confirm entry for {registeringEvent?.title}
            </DialogDescription>
          </DialogHeader>

          {registeringEvent && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/50">Date & Time:</span>
                  <span className="text-white font-medium">{registeringEvent.date} ({registeringEvent.time})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Location:</span>
                  <span className="text-white font-medium">{registeringEvent.location}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2">
                  <span className="text-white/50">Entry Fee:</span>
                  <span className="text-[#D4AF37] font-bold text-sm">
                    {registeringEvent.price ? `R ${registeringEvent.price}` : "Free"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Competitor / Participant Name</label>
                <input
                  type="text"
                  defaultValue="Liam Naidoo"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <GoldButton className="w-full" onClick={() => handleRegister(registeringEvent)}>
                Confirm Registration Ticket
              </GoldButton>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
