import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Flame, 
  Calendar, 
  ChevronRight, 
  Activity, 
  ShieldCheck, 
  Award, 
  Clock, 
  Key, 
  Lock, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroBanner from "../components/shared/HeroBanner";
import GoldButton from "../components/shared/GoldButton";
import BeltBadge from "../components/shared/BeltBadge";
import { useAuth } from "@/lib/AuthContext";
import { DUMMY_STUDENTS } from "@/data/dummyData";

export default function Dashboard() {
  const { isParent, authorizedStudentId, profile, user } = useAuth();

  const { data: students = [] } = useQuery({ 
    queryKey: ["students"], 
    queryFn: () => base44.entities.Student.list("-created_date", 50) 
  });
  
  const { data: events = [] } = useQuery({ 
    queryKey: ["events-upcoming"], 
    queryFn: () => base44.entities.Event.filter({ status: "upcoming" }, "-date", 5) 
  });

  const { data: invoices = [] } = useQuery({ 
    queryKey: ["invoices-recent"], 
    queryFn: () => base44.entities.Invoice.list("-created_date", 20) 
  });

  // If Parent Member View: Show strictly child's isolated performance portal
  if (isParent) {
    const targetStudentId = authorizedStudentId || profile?.studentId || "std-1";
    const childStudent = students.find((s: any) => s.id === targetStudentId) || 
      DUMMY_STUDENTS.find((s: any) => s.id === targetStudentId) || 
      DUMMY_STUDENTS[0];

    const childName = `${childStudent.first_name || ""} ${childStudent.last_name || ""}`.trim() || profile?.childName || "Your Student";
    const studentIdCode = childStudent.student_id_code || profile?.studentIdCode || "LMK-2024-001";

    return (
      <div className="bg-[#0A0A0A] text-white min-h-screen pb-24">
        <HeroBanner
          slot="hero_dashboard"
          title="Member Portal"
          subtitle={`Confidential Student Dossier for ${childName} • Allocated ID: ${studentIdCode}`}
        />

        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
          {/* Privacy & Student ID Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-heading uppercase tracking-widest text-[#D4AF37]">
                    Allocated Student ID:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-white font-mono text-xs font-bold">
                    {studentIdCode}
                  </span>
                </div>
                <h2 className="text-lg font-heading font-bold uppercase text-white mt-0.5">
                  {childName} • {childStudent.rank_level || "Junior Division"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to={`/students/${childStudent.id}`}>
                <GoldButton size="sm">
                  View Full Student Passport →
                </GoldButton>
              </Link>
            </div>
          </div>

          {/* Child KPI Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <StatCard 
              icon={Award} 
              label="Current Rank" 
              value={childStudent.rank_level || "3rd Kyu"} 
              trend={childStudent.belt_rank?.toUpperCase()} 
            />
            <StatCard 
              icon={Flame} 
              label="Training Streak" 
              value={`${childStudent.current_streak || 28} Classes`} 
              trend="Consistency Record" 
            />
            <StatCard 
              icon={Clock} 
              label="Attendance Rate" 
              value={`${childStudent.attendance_rate || 96}%`} 
              trend="Eligible for Belt Test" 
            />
            <StatCard 
              icon={Calendar} 
              label="Total Sessions" 
              value={childStudent.total_classes || 142} 
              trend="Active Cadet" 
            />
          </div>

          {/* Main Grid: Belt Progression & Sensei Evaluations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Belt Rank Progression */}
            <div className="lg:col-span-1 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-heading text-base font-semibold uppercase tracking-wider flex items-center gap-2 text-white">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                  Belt Standing
                </h3>
                <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-mono">
                  {childStudent.belt_rank || "Brown"}
                </span>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <BeltBadge belt={childStudent.belt_rank || "brown"} size="lg" showLabel />
                <p className="text-xs text-white/60 font-body leading-relaxed max-w-xs">
                  {childStudent.notes || "Demonstrates exceptional technical discipline in Kata forms and Kumite footwork."}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-heading uppercase text-white/70">
                  <span>Next Grading Threshold</span>
                  <span className="text-[#D4AF37]">85% Ready</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFB800] rounded-full w-[85%]" />
                </div>
                <p className="text-[11px] text-white/40">
                  Requirements: 3 more recorded dojo sessions + Bassai Dai bunkai review with Sensei Babu.
                </p>
              </div>
            </div>

            {/* Recent Sensei Notes & Evaluations */}
            <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-heading text-base font-semibold uppercase tracking-wider flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  Sensei Babu's Recent Evaluations
                </h3>
                <Link to={`/students/${childStudent.id}`} className="text-xs text-[#D4AF37] hover:underline font-heading uppercase tracking-wider">
                  All Reports →
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Quarterly Kata Assessment (Bassai Dai & Heian Yondan)",
                    grade: "A+ (Mastery)",
                    date: "June 2026",
                    note: "Outstanding hip torque on reverse punch sequences. Low root stance maintained throughout turnings."
                  },
                  {
                    title: "Kumite Distance & Counter-Punching Review",
                    grade: "A (Excellent)",
                    date: "May 2026",
                    note: "Quick evasion off the center line and explosive gyaku-zuki counters. Advised to keep high guard."
                  },
                  {
                    title: "Dojo Etiquette & Attendance Recognition",
                    grade: "Distinction",
                    date: "April 2026",
                    note: "Exemplary martial arts discipline, showing respect to senior belts and assisting newcomers."
                  }
                ].map((rep, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 transition-all space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-heading uppercase text-white font-semibold">
                        {rep.title}
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-heading">
                        {rep.grade}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 font-body leading-relaxed">
                      "{rep.note}"
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest pt-1">
                      <span>Evaluated by Sensei Babu</span>
                      <span>•</span>
                      <span>{rep.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Member Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/classes" className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all flex items-center gap-4">
              <Calendar className="w-8 h-8 text-[#D4AF37]" />
              <div>
                <p className="font-heading text-sm uppercase text-white font-bold">Class Schedule</p>
                <p className="text-xs text-white/50">View upcoming weekly dojo sessions</p>
              </div>
            </Link>

            <Link to="/sensei" className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-[#FFB800]" />
              <div>
                <p className="font-heading text-sm uppercase text-white font-bold">Sensei AI Coach</p>
                <p className="text-xs text-white/50">Custom home practice drills & forms</p>
              </div>
            </Link>

            <a
              href={`https://wa.me/27820000000?text=${encodeURIComponent(
                `Osu Sensei Babu! Inquiry from parent of ${childName} (Student ID: ${studentIdCode}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center gap-4"
            >
              <MessageSquare className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="font-heading text-sm uppercase text-white font-bold">WhatsApp Sensei Babu</p>
                <p className="text-xs text-white/50">Direct message regarding student progress</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Admin / Staff Command Center View
  const activeStudents = students.filter((s: any) => s.status === "active").length;
  const totalRevenue = invoices.filter((i: any) => i.status === "paid").reduce((sum: number, i: any) => sum + (i.amount || 0), 0);
  const pendingPayments = invoices.filter((i: any) => i.status === "pending").length;
  const topStudents = [...students].sort((a: any, b: any) => (b.current_streak || 0) - (a.current_streak || 0)).slice(0, 5);

  return (
    <div>
      <HeroBanner slot="hero_dashboard" title="Command Center" subtitle="Your dojo operations at a glance" />
      <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon={Users} label="Active Students" value={activeStudents} trend="+12% this month" />
          <StatCard icon={DollarSign} label="Revenue" value={`R ${totalRevenue.toLocaleString()}`} />
          <StatCard icon={TrendingUp} label="Pending Payments" value={pendingPayments} />
          <StatCard icon={Flame} label="Avg Streak" value={students.length > 0 ? Math.round(students.reduce((s: number, st: any) => s + (st.current_streak || 0), 0) / students.length) : 0} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-heading text-base font-semibold uppercase tracking-wider flex items-center gap-2"><Flame className="w-5 h-5 text-primary" /> Top Streaks</h3>
              <Link to="/students" className="text-sm text-primary font-body flex items-center gap-1 hover:underline">View All <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="divide-y divide-border">
              {topStudents.length > 0 ? topStudents.map((student: any, i: number) => (
                <Link key={student.id} to={`/students/${student.id}`} className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-heading font-bold text-primary group-hover:scale-110 transition-transform">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-base font-medium truncate text-foreground group-hover:text-primary transition-colors">{student.first_name} {student.last_name}</p>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{student.belt_rank || "White Belt"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-400"><Flame className="w-4 h-4" /><span className="font-heading font-bold text-base">{student.current_streak || 0}</span></div>
                </Link>
              )) : <p className="p-6 text-sm text-muted-foreground text-center font-body">No students yet</p>}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-heading text-base font-semibold uppercase tracking-wider flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Upcoming Events</h3>
              <Link to="/events" className="text-sm text-primary font-body flex items-center gap-1 hover:underline">View All <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {events.length > 0 ? events.map((event: any) => (
                <Link key={event.id} to="/events" className="group relative h-44 rounded-xl overflow-hidden cursor-pointer block">
                  <img src={event.image_url || "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80"} alt={event.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <span className="text-xs uppercase tracking-widest text-primary font-heading">{event.event_type?.replace(/_/g, " ")}</span>
                    <h4 className="font-heading text-base font-bold uppercase text-white group-hover:text-primary transition-colors">{event.title}</h4>
                    <p className="text-sm text-muted-foreground font-body mt-1">{event.date} • {event.location}</p>
                  </div>
                </Link>
              )) : <p className="p-6 text-sm text-muted-foreground text-center font-body col-span-2">No upcoming events</p>}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: "/students", icon: Users, label: "Manage Students", color: "from-blue-600/20 to-blue-600/5" },
            { to: "/classes", icon: Activity, label: "Class Schedule", color: "from-green-600/20 to-green-600/5" },
            { to: "/invoices", icon: DollarSign, label: "Invoices", color: "from-primary/20 to-primary/5" },
            { to: "/leads", icon: TrendingUp, label: "CRM / Leads", color: "from-purple-600/20 to-purple-600/5" },
          ].map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={`bg-gradient-to-br ${color} border border-border rounded-2xl p-5 flex flex-col items-center gap-3 text-center cursor-pointer hover:border-primary/30 transition-colors`}>
                <Icon className="w-8 h-8 text-foreground" />
                <span className="font-heading text-sm uppercase tracking-wider">{label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <p className="font-heading text-3xl font-bold text-foreground">{value}</p>
      {trend && <p className="text-[10px] text-green-400 font-body">{trend}</p>}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-primary/10 transition-colors" />
    </div>
  );
}
