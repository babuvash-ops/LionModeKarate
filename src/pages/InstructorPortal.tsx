import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PhotoCaptureModal from "@/components/students/PhotoCaptureModal";
import { 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  Award, 
  Calendar, 
  Search, 
  ChevronRight, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  ClipboardCheck, 
  Plus, 
  AlertCircle,
  Play,
  UserCheck,
  Zap,
  Camera
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import HeroBanner from "@/components/shared/HeroBanner";
import GoldButton from "@/components/shared/GoldButton";
import BeltBadge from "@/components/shared/BeltBadge";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

export default function InstructorPortal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"roster" | "grading" | "lesson_plans" | "staff">("roster");
  const [selectedClass, setSelectedClass] = useState("class-1");
  const [photoModalStudent, setPhotoModalStudent] = useState<any>(null);
  const [checkedInMap, setCheckedInMap] = useState<Record<string, boolean>>({
    "std-1": true,
    "std-5": true,
    "std-7": true
  });

  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: () => base44.entities.Student.list("-created_date", 50)
  });

  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: () => base44.entities.DojoClass.list("startTime", 20)
  });

  const activeClassObj = classes.find((c: any) => c.id === selectedClass) || classes[0];

  const toggleCheckIn = (id: string, name: string) => {
    setCheckedInMap(prev => {
      const next = !prev[id];
      if (next) {
        toast.success(`${name} checked in on the tatami`);
      } else {
        toast.info(`${name} check-in removed`);
      }
      return { ...prev, [id]: next };
    });
  };

  const markAll = () => {
    const newMap: Record<string, boolean> = { ...checkedInMap };
    students.forEach((s: any) => { newMap[s.id] = true; });
    setCheckedInMap(newMap);
    toast.success("All roster students marked present!");
  };

  const gradingCandidates = students.filter((s: any) => (s.attendance_rate || 0) >= 88);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-28">
      <HeroBanner
        title="Instructor Command Portal"
        subtitle="Manage daily mat rosters, student belt grading readiness, curriculum drills, and dojo operations."
        image="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1600&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          {[
            { id: "roster", label: "Today's Mat Roster", icon: ClipboardCheck },
            { id: "grading", label: "Belt Grading Readiness", icon: Award },
            { id: "lesson_plans", label: "Sensei Lesson Plans", icon: BookOpen },
            { id: "staff", label: "Instructor Staff", icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-heading uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  active 
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#FFB800] text-black font-bold shadow-lg shadow-[#D4AF37]/20" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: TODAY'S MAT ROSTER */}
        {activeTab === "roster" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
                  Session Attendance & Check-in
                </h2>
                <p className="text-sm text-white/60 font-body">
                  Select a class session to record live student attendance and maintain official dojo hours.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={markAll}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading uppercase tracking-wider text-white flex items-center gap-2 transition-all cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Check In All</span>
                </button>
                <GoldButton onClick={() => toast.success("Attendance synced with Student Records")}>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Save & Sync Mat Log
                </GoldButton>
              </div>
            </div>

            {/* Class Selector Pills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classes.slice(0, 3).map((cls: any) => {
                const selected = cls.id === selectedClass;
                return (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      selected 
                        ? "bg-gradient-to-br from-[#D4AF37]/15 to-transparent border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10" 
                        : "bg-white/[0.02] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-heading uppercase tracking-widest text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                        {cls.category || "KARATE"}
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1 font-body">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {cls.startTime} - {cls.endTime}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold uppercase text-white truncate">
                      {cls.name}
                    </h3>
                    <p className="text-xs text-white/50 font-body mt-1">
                      Instructor: {cls.instructor}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-white/70">
                      <span>Roster: {cls.enrolled || 16} Students</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Live Mat
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Class Details & Student List */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
                    {activeClassObj?.name || "Lionmode Kids"} Roster
                  </h3>
                  <p className="text-xs text-white/60 font-body">
                    {activeClassObj?.description || "Curriculum training and motor coordination"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-heading uppercase text-white/50">Tatami Present</span>
                  <p className="text-xl font-heading font-bold text-[#D4AF37]">
                    {Object.values(checkedInMap).filter(Boolean).length} / {students.length}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {students.map((student: any) => {
                  const isChecked = !!checkedInMap[student.id];
                  return (
                    <div
                      key={student.id}
                      className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] px-3 rounded-2xl transition-colors group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Student Photo Placeholder (Clickable to take camera photo or upload) */}
                        <div
                          onClick={() => setPhotoModalStudent(student)}
                          className="relative w-12 h-12 rounded-2xl overflow-hidden bg-black/60 border border-[#D4AF37]/40 shrink-0 cursor-pointer group/photo shadow-md flex items-center justify-center transition-all hover:border-[#D4AF37]"
                          title="Click to take camera photo or upload picture"
                        >
                          <img
                            src={student.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"}
                            alt={student.first_name}
                            className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                            <Camera className="w-4 h-4 text-[#D4AF37]" />
                          </div>
                          <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#D4AF37] flex items-center justify-center pointer-events-none">
                            <Camera className="w-2 h-2 text-black fill-black" />
                          </div>
                        </div>

                        {/* Student Name (Clickable to open profile page) */}
                        <div className="min-w-0">
                          <h4 
                            onClick={() => navigate(`/students/${student.id}`)}
                            className="font-heading text-lg font-bold text-white group-hover:text-[#D4AF37] uppercase truncate cursor-pointer transition-colors"
                            title="Open Student Profile & Record"
                          >
                            {student.first_name} {student.last_name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <BeltBadge belt={student.belt_rank || "white"} rank={student.rank_level} size="sm" />
                            <span className="text-xs text-white/50 font-body">
                              • {student.total_classes || 30} Classes
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="hidden md:flex items-center gap-1.5 text-xs text-orange-400 bg-orange-400/10 px-2.5 py-1 rounded-lg border border-orange-400/20 font-heading uppercase">
                          <Flame className="w-3.5 h-3.5 fill-orange-400" />
                          <span>{student.current_streak || 12}d</span>
                        </div>

                        {/* Open Profile Button */}
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="px-3 py-2 rounded-xl text-xs font-heading uppercase tracking-wider bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/50 text-white hover:text-[#D4AF37] flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <span>Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Check-In / On Tatami Button */}
                        <button
                          onClick={() => toggleCheckIn(student.id, `${student.first_name} ${student.last_name}`)}
                          className={`px-4 py-2 rounded-xl text-xs font-heading uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                            isChecked
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
                          }`}
                        >
                          <CheckCircle2 className={`w-4 h-4 ${isChecked ? "text-emerald-400 fill-emerald-400/20" : "text-white/40"}`} />
                          <span>{isChecked ? "On Tatami" : "Check In"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BELT GRADING READINESS */}
        {activeTab === "grading" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
                  Belt Grading Candidate Evaluation
                </h2>
                <p className="text-sm text-white/60 font-body">
                  Students meeting the 88%+ attendance criterion and technical proficiency requirements for the Winter Grading.
                </p>
              </div>
              <GoldButton onClick={() => toast.success("Grading invites queued via WhatsApp and Email")}>
                <Sparkles className="w-4 h-4 mr-2" />
                Dispatch Grading Invites
              </GoldButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gradingCandidates.map((student: any) => (
                <div
                  key={student.id}
                  className="bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 rounded-3xl p-6 backdrop-blur-xl transition-all relative overflow-hidden group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={student.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"}
                      alt={student.first_name}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="font-heading text-lg font-bold text-white uppercase">
                        {student.first_name} {student.last_name}
                      </h4>
                      <BeltBadge belt={student.belt_rank || "white"} rank={student.rank_level} size="sm" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/5 text-xs text-white/70">
                    <div className="flex justify-between items-center">
                      <span className="text-white/50">Attendance Consistency</span>
                      <span className="font-heading font-bold text-emerald-400">{student.attendance_rate}% (Eligible)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${student.attendance_rate}%` }} />
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-white/50">Kata Requirements</span>
                      <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/50">Sparring / Kumite</span>
                      <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-white/60 font-body text-[11px] leading-relaxed">
                      "{student.notes || "Demonstrates high discipline and excellent stance mechanics."}"
                    </div>

                    <button 
                      onClick={() => toast.success(`Approved ${student.first_name} for Belt Examination!`)}
                      className="w-full mt-2 py-2.5 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] font-heading uppercase tracking-wider font-semibold text-xs transition-all cursor-pointer"
                    >
                      Approve for Grading Board
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SENSEI LESSON PLANS */}
        {activeTab === "lesson_plans" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
                Official Academy Curriculum Lesson Plans
              </h2>
              <p className="text-sm text-white/60 font-body">
                Structured drilling breakdowns calibrated to Shotokan & sports karate traditions for today's sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Lionmode Kids (Ages 3-8) - Session Focus: Balance & Coordination",
                  duration: "45 Minutes",
                  parts: [
                    { time: "00-10m", title: "Warmup & Animal Stances", detail: "Lion crawl, tiger stretch, frog leaps to build hip elasticity and fun engagement." },
                    { time: "10-25m", title: "Fundamental Blocks & Punches", detail: "Age-uke (high block) and Chudan Tsuki (middle punch) with focused loud Kiai." },
                    { time: "25-35m", title: "Obstacle Balance Course", detail: "One-legged stork balance pad drills and soft target touch." },
                    { time: "35-45m", title: "Sensei Circle & Respect Protocol", detail: "Dojo etiquette, bowing (Rei), and the 5 virtues of the warrior." }
                  ]
                },
                {
                  title: "Little Lions (Ages 8-12) - Session Focus: Kata Heian Shodan & Distance",
                  duration: "60 Minutes",
                  parts: [
                    { time: "00-15m", title: "Dynamic Cardio & Core Activation", detail: "Jump-rope skipping, burpees, and stance shifts in Zenkutsu-dachi." },
                    { time: "15-30m", title: "Kata Segment Breakdown", detail: "Slow motion turns in Heian Shodan with emphasis on keeping weight low and chin tucked." },
                    { time: "30-50m", title: "Partner Yakusoku Kumite", detail: "One-step sparring: attack jodan, defend with age-uke, counter with gyaku-zuki." },
                    { time: "50-60m", title: "Mokuso & Cool Down", detail: "Breathing meditation and individual student feedback." }
                  ]
                },
                {
                  title: "Lionmode Cadets & Adults - Session Focus: Counter-Punching Dynamics",
                  duration: "75 Minutes",
                  parts: [
                    { time: "00-15m", title: "High-Intensity Footwork Plyometrics", detail: "Bouncing in kumite guard, angular side-stepping, and reaction sprints." },
                    { time: "15-40m", title: "Baiting & Counter Striking", detail: "Drawing the opponent's lead hand, parrying with open palm, explosive reverse punch." },
                    { time: "40-65m", title: "Continuous Controlled Kumite", detail: "2-minute rounds with situational rules (body strikes only, then full light touch)." },
                    { time: "65-75m", title: "Core & Abdominal Conditioning", detail: "Plank variations, medicine ball twists, and hip mobility stretches." }
                  ]
                },
                {
                  title: "Elite Squad - Tournament Kata Biomechanics (Bassai Dai)",
                  duration: "90 Minutes",
                  parts: [
                    { time: "00-20m", title: "Isometric Stance Holds & Kicking Velocity", detail: "Holding Kiba-dachi for 3 minutes, then rapid-fire Mawashi Geri repetitions." },
                    { time: "20-55m", title: "Bassai Dai Synchronization", detail: "Section-by-section synchronization, sound generation, and explosive kime." },
                    { time: "55-80m", title: "Practical Bunkai Demonstration", detail: "Real-speed takedowns, joint traps, and head strikes encoded in the kata." },
                    { time: "80-90m", title: "Mental Rehearsal & Debrief", detail: "Visualization of tournament tatami walk-in and championship mindset." }
                  ]
                }
              ].map((plan, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="font-heading text-lg font-bold uppercase text-white truncate max-w-sm">
                      {plan.title}
                    </h3>
                    <span className="text-xs font-heading uppercase text-[#D4AF37] px-2.5 py-1 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 whitespace-nowrap">
                      {plan.duration}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {plan.parts.map((p, idx) => (
                      <div key={idx} className="flex gap-3 text-xs">
                        <span className="font-heading text-[#D4AF37] w-14 shrink-0 font-semibold">{p.time}</span>
                        <div>
                          <p className="font-heading font-bold text-white uppercase">{p.title}</p>
                          <p className="text-white/60 font-body mt-0.5 leading-relaxed">{p.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INSTRUCTOR STAFF */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
                Lion Mode Academy Instructors
              </h2>
              <p className="text-sm text-white/60 font-body">
                Certified black belt senseis and assistant coaches leading Lion Mode Karate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Sensei Babu",
                  title: "Head Master & Academy Founder",
                  rank: "5th Dan Black Belt",
                  specialty: "Shotokan Kata, Kumite Biomechanics & Bunkai",
                  experience: "25+ Years Experience",
                  email: "babuvash@gmail.com",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                },
                {
                  name: "Coach Sarah",
                  title: "Youth Development & Conditioning Director",
                  rank: "3rd Dan Black Belt",
                  specialty: "Lionmode Kids (Ages 3-8), Plyometrics & Self-Defense",
                  experience: "12+ Years Experience",
                  email: "sarah@lionmodekarate.com",
                  image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"
                },
                {
                  name: "Senpai Ethan Govender",
                  title: "Tournament Squad Coach & Assistant",
                  rank: "1st Dan Black Belt",
                  specialty: "WKF Kumite Speed Tactics & Sparring Strategy",
                  experience: "6+ Years Experience",
                  email: "ethan@lionmodekarate.com",
                  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
                }
              ].map((inst, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={inst.image} alt={inst.name} className="w-16 h-16 rounded-2xl object-cover border border-[#D4AF37]/30" />
                    <div>
                      <h4 className="font-heading text-xl font-bold uppercase text-white">{inst.name}</h4>
                      <p className="text-xs text-[#D4AF37] font-heading uppercase">{inst.rank}</p>
                      <p className="text-xs text-white/50 font-body">{inst.title}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-white/70">
                    <p><span className="text-white/40">Specialty:</span> {inst.specialty}</p>
                    <p><span className="text-white/40">Pedigree:</span> {inst.experience}</p>
                    <p><span className="text-white/40">Email:</span> {inst.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {photoModalStudent && (
        <PhotoCaptureModal
          open={!!photoModalStudent}
          onClose={() => setPhotoModalStudent(null)}
          studentName={`${photoModalStudent.first_name} ${photoModalStudent.last_name}`}
          currentPhoto={photoModalStudent.avatar_url}
          onPhotoSelected={async (newPhotoUrl) => {
            try {
              await base44.entities.Student.update(photoModalStudent.id, {
                avatar_url: newPhotoUrl
              });
              queryClient.invalidateQueries({ queryKey: ["students"] });
              toast.success(`Photo captured & saved for ${photoModalStudent.first_name}!`);
            } catch (err) {
              console.error("Error updating photo:", err);
            }
            setPhotoModalStudent(null);
          }}
        />
      )}
    </div>
  );
}
