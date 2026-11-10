import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  UserPlus, 
  Target, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  Search, 
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeroBanner from "@/components/shared/HeroBanner";
import GoldButton from "@/components/shared/GoldButton";
import StatCard from "@/components/shared/StatCard";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function LeadsPage() {
  const [activeStage, setActiveStage] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    program_interest: "Lionmode Kids (Ages 3–8)",
    notes: ""
  });

  const { data: leads = [], refetch } = useQuery({
    queryKey: ["leads"],
    queryFn: () => base44.entities.Lead.list("-createdAt", 50),
  });

  const filtered = leads.filter((l: any) => {
    const matchesStage = activeStage === "all" || l.stage === activeStage;
    const matchesSearch = 
      (l.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.program_interest || "").toLowerCase().includes(search.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) {
      toast.error("Please provide lead name and phone number");
      return;
    }

    const created = {
      name: newLead.name,
      phone: newLead.phone,
      email: newLead.email,
      program_interest: newLead.program_interest,
      stage: "new",
      source: "lionmodekarate.com Inbound",
      notes: newLead.notes || "Inquired via Dojo OS portal",
      createdAt: new Date().toISOString()
    };

    await base44.entities.Lead.create(created);
    toast.success(`New prospect ${newLead.name} added to pipeline`);
    setShowAddModal(false);
    refetch();
  };

  const updateStage = async (id: string, stage: string, name: string) => {
    await base44.entities.Lead.update(id, { stage });
    toast.success(`Updated ${name} to "${stage}"`);
    refetch();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">
      <HeroBanner
        slot="hero_leads"
        title="Dojo CRM & Lead Pipeline"
        subtitle="Track inbound inquiries from lionmodekarate.com, manage free trial bookings, and convert new martial arts students."
        image="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1600&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-8">
        {/* Pipeline Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={UserPlus}
            label="Total Prospects"
            value={leads.length}
            trend="+18% inquiries"
          />
          <StatCard
            icon={Clock}
            label="New Inquiries"
            value={leads.filter((l: any) => l.stage === "new").length}
          />
          <StatCard
            icon={Target}
            label="Active Trials"
            value={leads.filter((l: any) => l.stage === "trial").length}
          />
          <StatCard
            icon={CheckCircle2}
            label="Enrolled This Term"
            value={leads.filter((l: any) => l.stage === "enrolled").length}
          />
        </div>

        {/* Filter and Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search leads by name or program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] font-body"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto no-scrollbar">
              {[
                { id: "all", label: "All Leads" },
                { id: "new", label: "New" },
                { id: "contacted", label: "Contacted" },
                { id: "trial", label: "Trial Booked" },
                { id: "enrolled", label: "Enrolled" }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setActiveStage(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    activeStage === st.id
                      ? "bg-[#D4AF37] text-black font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <GoldButton onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </GoldButton>
          </div>
        </div>

        {/* Leads Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lead: any) => {
            const isNew = lead.stage === "new";
            const isContacted = lead.stage === "contacted";
            const isTrial = lead.stage === "trial";
            const isEnrolled = lead.stage === "enrolled";

            return (
              <motion.div
                key={lead.id}
                whileHover={{ y: -4 }}
                className="bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 rounded-3xl p-6 backdrop-blur-xl transition-all shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading text-xl font-bold uppercase text-white">
                        {lead.name}
                      </h4>
                      {lead.child_name && (
                        <p className="text-xs text-[#D4AF37] font-body mt-0.5">
                          Child: {lead.child_name}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-heading uppercase tracking-wider font-bold ${
                        isEnrolled
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : isTrial
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : isContacted
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {lead.stage}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs text-white/70 font-body">
                    <p className="text-white font-medium flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {lead.program_interest}
                    </p>
                    <p className="flex items-center gap-1.5 text-white/60">
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {lead.phone}
                    </p>
                    {lead.email && (
                      <p className="flex items-center gap-1.5 text-white/60">
                        <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {lead.email}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-white/60 font-body leading-relaxed">
                    <span className="text-white/40 font-heading uppercase tracking-wider text-[10px] block mb-0.5">
                      Notes
                    </span>
                    "{lead.notes || "Inquired for curriculum class times and pricing."}"
                  </div>

                  {lead.trial_date && (
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>Trial: {lead.trial_date}</span>
                    </div>
                  )}
                </div>

                {/* Pipeline Progression Buttons */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex gap-1.5">
                    {isNew && (
                      <button
                        onClick={() => updateStage(lead.id, "contacted", lead.name)}
                        className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-heading uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Contact
                      </button>
                    )}
                    {(isNew || isContacted) && (
                      <button
                        onClick={() => updateStage(lead.id, "trial", lead.name)}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-heading uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Book Trial
                      </button>
                    )}
                    {isTrial && (
                      <button
                        onClick={() => updateStage(lead.id, "enrolled", lead.name)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-heading uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Enroll Student
                      </button>
                    )}
                  </div>

                  <span className="text-[10px] text-white/40">
                    via {lead.source || "Website"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-[#0A0A0A] border border-white/10 text-white rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold uppercase text-white">
              Add New Lead Prospect
            </DialogTitle>
            <DialogDescription className="text-white/60 font-body text-xs">
              Log an inbound phone, WhatsApp, or walk-in student inquiry.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddLead} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Parent / Prospect Name</label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Phone Number</label>
                <input
                  type="text"
                  placeholder="+27 82 ..."
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Email</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Program Interest</label>
              <select
                value={newLead.program_interest}
                onChange={(e) => setNewLead({ ...newLead, program_interest: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Lionmode Kids (Ages 3–8)">Lionmode Kids (Ages 3–8)</option>
                <option value="Little Lions (Ages 8–12)">Little Lions (Ages 8–12)</option>
                <option value="Lionmode Teens (Ages 13–18)">Lionmode Teens (Ages 13–18)</option>
                <option value="Adult Traditional Karate & Self-Defense">Adult Traditional Karate & Self-Defense</option>
                <option value="Black Belt Elite & Tournament Squad">Black Belt Elite & Tournament Squad</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Notes / Goals</label>
              <textarea
                rows={3}
                placeholder="Student goals, age of child, preferred trial times..."
                value={newLead.notes}
                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <GoldButton type="submit" className="w-full mt-2">
              Save Lead to Pipeline
            </GoldButton>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
