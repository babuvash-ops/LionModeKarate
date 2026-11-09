import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Award, 
  Target, 
  Flame, 
  Check, 
  ExternalLink,
  ChevronRight,
  Home
} from "lucide-react";
import GoldButton from "@/components/shared/GoldButton";
import DojoLogo from "@/components/shared/DojoLogo";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { useSiteImages } from "@/hooks/useSiteImages";
import { getInitialFunnels } from "@/data/funnelData";

export default function TrialFunnelPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const images = useSiteImages();
  const funnels = getInitialFunnels();
  
  // Support slug parameter or default to trial
  const funnelSlug = searchParams.get("slug") || "trial";
  const activeFunnel = funnels.find(f => f.slug === funnelSlug) || funnels[0];

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    program: searchParams.get("program") || "Little Lions (Ages 8–12)",
    preferredSlot: "Tuesday & Thursday: 17:00 – 18:00",
    studentName: "",
    parentName: "",
    phone: "",
    email: "",
    goal: "Confidence & Anti-Bullying",
    experience: "Complete Beginner"
  });

  const [submitting, setSubmitting] = useState(false);
  const [leadRecord, setLeadRecord] = useState<any>(null);

  const programs = [
    {
      id: "Little Cubs (Ages 3–8)",
      title: "Lionmode Kids (Cubs)",
      age: "Ages 3 – 8",
      desc: "Play-based coordination, focus span & respectful listening.",
      icon: Sparkles
    },
    {
      id: "Little Lions (Ages 8–12)",
      title: "Little Lions",
      age: "Ages 8 – 12",
      desc: "Shotokan kata, anti-bully confidence & belt progression.",
      icon: Target
    },
    {
      id: "Lionmode Teens (Ages 13–18)",
      title: "Lionmode Teens",
      age: "Ages 13 – 18",
      desc: "High-intensity kumite sparring, fitness & self-defense.",
      icon: Flame
    },
    {
      id: "Adult Martial Arts (18+)",
      title: "Adults & Seniors",
      age: "Ages 18+",
      desc: "Traditional karate bunkai, mobility, strength & black belt mastery.",
      icon: Award
    }
  ];

  const timeSlots = [
    { id: "Mon & Wed: 16:00 – 17:00", label: "Mon & Wed: 16:00 – 17:00", note: "Recommended for Kids & Beginners" },
    { id: "Tue & Thu: 17:00 – 18:00", label: "Tue & Thu: 17:00 – 18:00", note: "Intermediate & Junior Kata" },
    { id: "Mon & Wed: 18:00 – 19:30", label: "Mon & Wed: 18:00 – 19:30", note: "Teens & Adult Sparring" },
    { id: "Saturday Morning: 09:00 – 10:30", label: "Saturday: 09:00 – 10:30", note: "Weekend Academy Mat" }
  ];

  const goals = [
    "Build Self-Confidence & Focus",
    "Anti-Bullying Defense & Boundary Setting",
    "Physical Fitness & Athletic Coordination",
    "Compete in Kumite / Kata Championships",
    "Earn Official Black Belt Shodan"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.phone) {
      toast.error("Please enter student name and phone number");
      return;
    }

    setSubmitting(true);
    try {
      const createdLead = await base44.entities.Lead.create({
        name: formData.studentName,
        parent_name: formData.parentName,
        phone: formData.phone,
        email: formData.email,
        program_interest: formData.program,
        stage: "trial",
        source: `Funnel: ${activeFunnel.name}`,
        notes: `Selected Slot: ${formData.preferredSlot} | Goal: ${formData.goal} | Experience: ${formData.experience}`,
        createdAt: new Date().toISOString()
      });

      setLeadRecord(createdLead);
      setStep(4);
      toast.success("Osu! Your Free VIP Trial Pass has been generated!");
    } catch (err: any) {
      console.error("Funnel submission error:", err);
      toast.error("Could not submit. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Osu Sensei Babu! I just claimed my 1-Week Free VIP Trial Pass for ${formData.studentName} (${formData.program}) via lionmodekarate.com. Looking forward to meeting you on the tatami!`
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-4 h-4 text-white/50 group-hover:text-[#D4AF37] transition-colors" />
            <span className="text-xs font-heading uppercase tracking-wider text-white/70 group-hover:text-white transition-colors">
              Return to Website
            </span>
          </Link>
          <DojoLogo size="md" href="/" />
          <Link to="/dashboard">
            <span className="text-xs font-heading uppercase tracking-wider text-[#D4AF37] hover:underline">
              Member Login
            </span>
          </Link>
        </div>
      </header>

      {/* Main Funnel Body */}
      <main className="flex-1 py-10 px-4 md:px-8 max-w-4xl mx-auto w-full">
        {/* Progress Tracker (Steps 1 to 4) */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-md mx-auto relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 -z-0" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#FFB800] -z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center gap-1.5">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-heading text-xs font-bold transition-all duration-300 ${
                    step > s
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                      : step === s
                      ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/30 scale-110"
                      : "bg-[#171717] text-white/40 border border-white/10"
                  }`}
                >
                  {step > s ? <Check className="w-4 h-4 stroke-[3]" /> : s}
                </div>
                <span className={`text-[10px] font-heading uppercase tracking-wider ${
                  step === s ? "text-[#D4AF37] font-bold" : "text-white/40"
                }`}>
                  {s === 1 ? "Program" : s === 2 ? "Schedule" : s === 3 ? "Details" : "VIP Pass"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel Content Container */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* STEP 1: SELECT PROGRAM */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-heading uppercase tracking-widest font-bold">
                  {activeFunnel.badge}
                </span>
                <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight text-white">
                  {activeFunnel.headline}
                </h1>
                <p className="text-sm md:text-base text-white/60 font-body max-w-xl mx-auto leading-relaxed">
                  {activeFunnel.subheadline}
                </p>
              </div>

              {/* Programs Grid */}
              <div className="space-y-3">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">
                  Step 1: Choose Student Martial Arts Division
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programs.map((p) => {
                    const isSelected = formData.program === p.id;
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setFormData({ ...formData, program: p.id })}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                          isSelected
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10"
                            : "bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-heading uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-[#D4AF37] text-black font-bold">
                            {p.age}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold uppercase text-white">
                            {p.title}
                          </h3>
                          <p className="text-xs text-white/60 font-body mt-1">
                            {p.desc}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[11px] font-heading uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 7 Days Free Access
                          </span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-white/30"
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <GoldButton size="lg" onClick={() => setStep(2)} className="w-full sm:w-auto">
                  Continue to Step 2 <ChevronRight className="w-4 h-4 ml-1" />
                </GoldButton>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT SCHEDULE & GOAL */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="text-left space-y-2 border-b border-white/10 pb-4">
                <span className="text-xs font-heading uppercase tracking-widest text-[#D4AF37]">
                  Step 2 of 4
                </span>
                <h2 className="font-heading text-2xl md:text-4xl font-bold uppercase text-white">
                  Select Preferred Class Slot & Goals
                </h2>
                <p className="text-xs md:text-sm text-white/60 font-body">
                  Target Program: <strong className="text-white">{formData.program}</strong>
                </p>
              </div>

              {/* Time Slots */}
              <div className="space-y-3">
                <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                  Select Preferred Dojo Training Session
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {timeSlots.map((ts) => {
                    const isSelected = formData.preferredSlot === ts.id;
                    return (
                      <div
                        key={ts.id}
                        onClick={() => setFormData({ ...formData, preferredSlot: ts.id })}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
                            : "bg-white/[0.02] border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-sm font-bold uppercase text-white">
                            {ts.label}
                          </span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-white/30"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-white/50 font-body mt-1">
                          {ts.note}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-3">
                <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                  Primary Martial Arts Objective
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {goals.map((g) => {
                    const isSelected = formData.goal === g;
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setFormData({ ...formData, goal: g })}
                        className={`p-3 rounded-xl border text-xs font-body text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#D4AF37] text-black font-semibold border-[#D4AF37]"
                            : "bg-white/5 text-white/70 border-white/5 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-heading uppercase tracking-wider text-white/60 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5 inline mr-1" /> Back
                </button>
                <GoldButton size="lg" onClick={() => setStep(3)}>
                  Next: Contact Details <ChevronRight className="w-4 h-4 ml-1" />
                </GoldButton>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONTACT FORM */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="text-left space-y-2 border-b border-white/10 pb-4">
                <span className="text-xs font-heading uppercase tracking-widest text-[#D4AF37]">
                  Step 3 of 4
                </span>
                <h2 className="font-heading text-2xl md:text-4xl font-bold uppercase text-white">
                  Where Shall We Send Your VIP Pass?
                </h2>
                <p className="text-xs md:text-sm text-white/60 font-body">
                  No credit card required. Your 1-week complimentary access begins on your first tatami check-in.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                      Student Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        required
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        placeholder="e.g. Leo Naidoo"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                      Parent / Guardian Name (if under 18)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="e.g. Sarah Naidoo"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                      WhatsApp / Mobile Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+27 82 123 4567"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="parent@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs text-white/70">
                  <div className="flex items-center justify-between">
                    <span>Selected Program:</span>
                    <strong className="text-white">{formData.program}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Preferred Session:</span>
                    <strong className="text-[#D4AF37]">{formData.preferredSlot}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dojo Location:</span>
                    <span className="text-white">Lion Mode Karate Academy • Durban</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl text-xs font-heading uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 inline mr-1" /> Back
                  </button>
                  <GoldButton size="lg" type="submit" disabled={submitting}>
                    {submitting ? "Securing VIP Pass..." : "Generate My 1-Week VIP Pass"}
                  </GoldButton>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 4: PASS GENERATED & CONFIRMATION */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-heading uppercase tracking-widest font-bold">
                  VIP Pass Activated
                </span>
                <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase text-white">
                  Welcome to the Tatami, {formData.studentName}!
                </h2>
                <p className="text-sm text-white/60 font-body max-w-lg mx-auto">
                  Your complimentary 1-Week Martial Arts Experience has been reserved. Sensei Babu and the coaching staff are ready for you.
                </p>
              </div>

              {/* Digital VIP Pass Card */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border-2 border-[#D4AF37] rounded-3xl p-6 text-left space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#D4AF37] text-black font-heading uppercase font-bold text-[10px] px-4 py-1 rounded-bl-xl tracking-wider">
                  Official Guest Pass
                </div>
                
                <div className="flex items-center gap-3">
                  <DojoLogo size="sm" showText={false} />
                  <div>
                    <h4 className="font-heading text-lg font-bold uppercase text-white">Lion Mode Karate</h4>
                    <p className="text-[10px] font-heading text-[#D4AF37] tracking-widest uppercase">VIP Member Guest</p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-heading">Student Candidate</span>
                    <strong className="text-white text-base font-heading uppercase">{formData.studentName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-heading">Division</span>
                      <span className="text-white font-medium">{formData.program}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white/40 block text-[10px] uppercase font-heading">Access Duration</span>
                      <span className="text-emerald-400 font-bold font-heading">7 Days Unlimited</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-heading">Assigned Slot</span>
                    <span className="text-[#D4AF37]">{formData.preferredSlot}</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 text-[11px] text-white/60 font-body">
                  📍 <strong>Dojo Mat Address:</strong> Lion Mode Karate Academy, Durban, South Africa. Bring comfortable athletic clothing and a water bottle.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href={`https://wa.me/27820000000?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <GoldButton size="lg" className="w-full flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-black" />
                    Notify Sensei via WhatsApp
                  </GoldButton>
                </a>
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-heading uppercase tracking-wider text-xs font-bold transition-all">
                    Explore Dojo OS Dashboard
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs text-white/40 font-body">
        <p>© 2026 Lion Mode Karate Academy • https://lionmodekarate.com • All Rights Reserved</p>
      </footer>
    </div>
  );
}
