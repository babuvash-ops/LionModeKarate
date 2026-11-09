import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Camera, 
  Edit3, 
  Award, 
  Calendar, 
  Phone, 
  Mail, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Target, 
  ShieldCheck, 
  Plus, 
  FileText, 
  Sparkles, 
  Home, 
  AlertCircle,
  Zap,
  Trash2,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import BeltBadge from "./shared/BeltBadge";
import GoldButton from "./shared/GoldButton";
import PhotoCaptureModal from "./students/PhotoCaptureModal";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/lib/AuthContext";

interface StudentProfileProps {
  studentId: string;
  onBack: () => void;
  branding?: any;
}

const BELT_OPTIONS = [
  { value: "white", label: "White Belt (8th Kyu)" },
  { value: "yellow", label: "Yellow Belt (7th Kyu)" },
  { value: "orange", label: "Orange Belt (6th Kyu)" },
  { value: "green", label: "Green Belt (5th Kyu)" },
  { value: "blue", label: "Blue Belt (4th Kyu)" },
  { value: "purple", label: "Purple Belt (3rd Kyu)" },
  { value: "brown", label: "Brown Belt (1st - 2nd Kyu)" },
  { value: "black_1", label: "Black Belt 1st Dan (Shodan)" },
  { value: "black_2", label: "Black Belt 2nd Dan (Nidan)" },
  { value: "black_3", label: "Black Belt 3rd Dan (Sandan)" },
];

const DEFAULT_REPORTS = [
  {
    id: "rep-1",
    title: "Quarterly Kata Assessment (Bassai Dai & Heian Yondan)",
    category: "Kata Forms",
    grade: "A+ (Mastery)",
    instructor: "Sensei Babu",
    date: "2026-06-20",
    content: "Outstanding power generation and hip snap on reverse punch sequences. Stances remain rooted with excellent low gravity center. Ready for senior bar evaluation."
  },
  {
    id: "rep-2",
    title: "Kumite Distance & Counter-Punching Drill Review",
    category: "Kumite Sparring",
    grade: "A (Excellent)",
    instructor: "Sensei Babu",
    date: "2026-05-15",
    content: "Quick evasion off the center line and explosive gyaku-zuki counters. Advised to maintain high guard when retreating from blitz attacks."
  },
  {
    id: "rep-3",
    title: "Dojo Discipline & Attendance Recognition",
    category: "Discipline & Etiquette",
    grade: "Distinction",
    instructor: "Coach Sarah",
    date: "2026-04-10",
    content: "Displays exemplary martial arts etiquette, bowing properly upon entering the tatami and assisting junior belts with obi knot tying."
  }
];

export default function StudentProfile({ studentId, onBack }: StudentProfileProps) {
  const navigate = useNavigate();
  const { isParent, authorizedStudentId } = useAuth();

  // Strict Privacy: Parent can only view their own registered child
  if (isParent && authorizedStudentId && studentId !== authorizedStudentId) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-2xl uppercase font-bold text-white tracking-wider">
              Student Dossier Restricted
            </h2>
            <p className="text-sm text-white/70 leading-relaxed font-body">
              Strict Student Privacy Policy: Parents may only view the training evaluations and confidential progress records for their own registered child.
            </p>
          </div>
          <div className="pt-2">
            <GoldButton onClick={() => navigate(`/students/${authorizedStudentId}`)} className="w-full justify-center">
              View My Child's Training Passport →
            </GoldButton>
          </div>
        </div>
      </div>
    );
  }

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reports" | "roadmap" | "dossier">("reports");

  // Modals state
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [editRankOpen, setEditRankOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);

  // Form states
  const [detailsForm, setDetailsForm] = useState<any>({});
  const [rankForm, setRankForm] = useState<any>({ belt_rank: "white", rank_level: "8th Kyu", promotion_date: "" });
  const [reportForm, setReportForm] = useState<any>({
    title: "",
    category: "Kata Forms",
    grade: "A+ (Mastery)",
    instructor: "Sensei Babu",
    date: new Date().toISOString().split("T")[0],
    content: ""
  });

  const [reportsList, setReportsList] = useState<any[]>(DEFAULT_REPORTS);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const data = await base44.entities.Student.get(studentId);
        if (data) {
          setStudent(data);
          setDetailsForm({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            emergency_contact: data.emergency_contact || "",
            program: data.program || "junior_fighters",
            status: data.status || "active",
            date_of_birth: data.date_of_birth || "",
            notes: data.notes || ""
          });
          setRankForm({
            belt_rank: data.belt_rank || "white",
            rank_level: data.rank_level || "Beginner",
            promotion_date: data.join_date || "2024-02-15"
          });
          if (data.reports && Array.isArray(data.reports) && data.reports.length > 0) {
            setReportsList(data.reports);
          }
        }
      } catch (err) {
        console.error("Error fetching student profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [studentId]);

  const handlePhotoUpdate = async (photoUrl: string) => {
    if (!student) return;
    const updated = { ...student, avatar_url: photoUrl };
    setStudent(updated);
    await base44.entities.Student.update(student.id, { avatar_url: photoUrl });
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    const updated = { ...student, ...detailsForm };
    setStudent(updated);
    await base44.entities.Student.update(student.id, detailsForm);
    toast.success("Student details updated successfully!");
    setEditDetailsOpen(false);
  };

  const handleSaveRank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    const updated = { ...student, belt_rank: rankForm.belt_rank, rank_level: rankForm.rank_level };
    setStudent(updated);
    await base44.entities.Student.update(student.id, {
      belt_rank: rankForm.belt_rank,
      rank_level: rankForm.rank_level
    });
    toast.success(`Promoted ${student.first_name} to ${rankForm.belt_rank.toUpperCase()} BELT!`);
    setEditRankOpen(false);
  };

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.title || !reportForm.content) {
      toast.error("Please enter a report title and evaluation notes");
      return;
    }

    let updatedReports: any[];
    if (editingReport) {
      updatedReports = reportsList.map(r => r.id === editingReport.id ? { ...editingReport, ...reportForm } : r);
      toast.success("Report updated successfully");
    } else {
      const newRep = {
        id: `rep-${Date.now()}`,
        ...reportForm
      };
      updatedReports = [newRep, ...reportsList];
      toast.success("New Sensei report added to student record");
    }

    setReportsList(updatedReports);
    if (student) {
      await base44.entities.Student.update(student.id, { reports: updatedReports });
    }
    setReportModalOpen(false);
    setEditingReport(null);
  };

  const openNewReport = () => {
    setEditingReport(null);
    setReportForm({
      title: "",
      category: "Kata Forms",
      grade: "A+ (Mastery)",
      instructor: "Sensei Babu",
      date: new Date().toISOString().split("T")[0],
      content: ""
    });
    setReportModalOpen(true);
  };

  const openEditReport = (rep: any) => {
    setEditingReport(rep);
    setReportForm({
      title: rep.title,
      category: rep.category,
      grade: rep.grade,
      instructor: rep.instructor,
      date: rep.date,
      content: rep.content
    });
    setReportModalOpen(true);
  };

  const handleDeleteReport = async (repId: string) => {
    const filtered = reportsList.filter(r => r.id !== repId);
    setReportsList(filtered);
    if (student) {
      await base44.entities.Student.update(student.id, { reports: filtered });
    }
    toast.info("Report removed");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#FFB800] animate-pulse flex items-center justify-center">
          <Award className="w-6 h-6 text-black" />
        </div>
        <p className="font-heading text-sm uppercase tracking-widest text-white/50">Loading Student Dossier...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4 text-white p-6 text-center">
        <AlertCircle className="w-12 h-12 text-[#D4AF37]" />
        <h3 className="font-heading text-2xl uppercase">Student Record Not Found</h3>
        <GoldButton onClick={onBack}>Return to Personnel Roster</GoldButton>
      </div>
    );
  }

  const fullName = `${student.first_name || ""} ${student.last_name || ""}`;
  const initials = `${student.first_name?.[0] || ""}${student.last_name?.[0] || "S"}`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">
      {/* Top Breadcrumb & Return Bar */}
      <div className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-white/70 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Personnel Roster</span>
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading uppercase text-white/70 hover:text-white transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Command Center</span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading uppercase text-white/70 hover:text-white transition-all"
            >
              <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Home Website</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-8">
        {/* STUDENT HERO CARD */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Ambient Gold Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 justify-between">
            {/* Student Photo with Camera / Upload Trigger */}
            <div className="relative group shrink-0">
              <div
                onClick={() => setPhotoModalOpen(true)}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden bg-black/60 border-2 border-[#D4AF37]/50 shadow-2xl relative cursor-pointer group hover:border-[#D4AF37] transition-all flex items-center justify-center"
              >
                {student.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt={fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="font-heading font-black text-3xl sm:text-4xl text-[#D4AF37] uppercase">
                    {initials}
                  </div>
                )}

                {/* Camera Click Overlay */}
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center">
                  <Camera className="w-6 h-6 text-[#D4AF37]" />
                  <span className="text-[10px] font-heading uppercase tracking-wider text-white font-bold">
                    Change / Take Photo
                  </span>
                </div>
              </div>

              <button
                onClick={() => setPhotoModalOpen(true)}
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer border-2 border-black"
                title="Capture with Camera or Upload"
              >
                <Camera className="w-4 h-4 fill-black" />
              </button>
            </div>

            {/* Student Details & Status */}
            <div className="flex-1 space-y-3 text-center md:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="text-xs font-heading uppercase tracking-widest text-[#D4AF37] px-3 py-1 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                  {student.program?.replace(/_/g, " ").toUpperCase() || "LIONMODE KARATE"}
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-heading uppercase tracking-wider font-bold ${
                    student.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {student.status || "Active Student"}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono font-bold">
                  Student ID: {student.student_id_code || student.id}
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl font-bold uppercase text-white tracking-wide">
                {fullName}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
                <BeltBadge belt={student.belt_rank || "white"} rank={student.rank_level} size="lg" />
                <span className="text-sm text-white/60 font-body">
                  Rank Level: <strong className="text-white">{student.rank_level || "Beginner"}</strong>
                </span>
              </div>
            </div>

            {/* Header Action Buttons - Hidden for parents to prevent unauthorized modifications */}
            {isParent ? (
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                <a
                  href={`https://wa.me/27820000000?text=${encodeURIComponent(
                    `Osu Sensei Babu! Inquiry regarding my child ${fullName} (Student ID: ${student.student_id_code || student.id}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-heading uppercase tracking-wider text-emerald-400 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Sensei Babu</span>
                </a>
                <Link
                  to="/sensei"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-heading uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sensei AI Assistant</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                <GoldButton onClick={() => setEditDetailsOpen(true)} className="w-full">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Details
                </GoldButton>
                <button
                  onClick={() => setEditRankOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-heading uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>Promote / Rank</span>
                </button>
                <button
                  onClick={openNewReport}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-heading uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Report</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8 pt-6 border-t border-white/10 text-center">
            <div className="bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-center gap-1.5 text-orange-400 mb-1">
                <Flame className="w-4 h-4 fill-orange-400" />
                <span className="text-[10px] font-heading uppercase tracking-widest text-white/50">Current Streak</span>
              </div>
              <p className="font-heading text-2xl font-bold text-white">{student.current_streak || 0} Days</p>
            </div>

            <div className="bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-heading uppercase tracking-widest text-white/50">Attendance</span>
              </div>
              <p className="font-heading text-2xl font-bold text-white">{student.attendance_rate || 90}%</p>
            </div>

            <div className="bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                <Target className="w-4 h-4" />
                <span className="text-[10px] font-heading uppercase tracking-widest text-white/50">Classes Taken</span>
              </div>
              <p className="font-heading text-2xl font-bold text-white">{student.total_classes || 30} Sessions</p>
            </div>

            <div className="bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-center gap-1.5 text-purple-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-heading uppercase tracking-widest text-white/50">Enrolled Since</span>
              </div>
              <p className="font-heading text-lg font-bold text-white mt-1">{student.join_date || "Feb 2024"}</p>
            </div>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          {[
            { id: "reports", label: `Technical Reports & Evaluations (${reportsList.length})`, icon: FileText },
            { id: "roadmap", label: "Belt Progression Roadmap", icon: Award },
            { id: "dossier", label: "Student Details & Contact", icon: Phone }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-heading uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  active 
                    ? "bg-[#D4AF37] text-black font-bold shadow-lg shadow-[#D4AF37]/20" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: REPORTS & EVALUATIONS */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
                  Instructor Evaluations & Reports
                </h3>
                <p className="text-xs text-white/60 font-body">
                  Detailed kata assessment scores, kumite performance notes, and grading examination reviews.
                </p>
              </div>

              <GoldButton onClick={openNewReport}>
                <Plus className="w-4 h-4 mr-2" />
                Add Progress Report
              </GoldButton>
            </div>

            <div className="space-y-4">
              {reportsList.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/30 rounded-3xl p-6 backdrop-blur-xl transition-all shadow-lg space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-[10px] font-heading uppercase px-2.5 py-0.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-bold">
                          {rep.category}
                        </span>
                        <span className="text-[10px] font-heading uppercase px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          Grade: {rep.grade}
                        </span>
                        <span className="text-xs text-white/40 font-body">
                          {rep.date}
                        </span>
                      </div>
                      <h4 className="font-heading text-xl font-bold uppercase text-white mt-2">
                        {rep.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => openEditReport(rep)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                        title="Edit Report"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(rep.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/50 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-white/80 font-body leading-relaxed">
                    {rep.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-white/50 pt-2 font-body">
                    <span>Evaluator: <strong className="text-white">{rep.instructor}</strong></span>
                    <span className="flex items-center gap-1 text-[#D4AF37]">
                      <ShieldCheck className="w-3.5 h-3.5" /> Official Academy Record
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BELT PROGRESSION ROADMAP */}
        {activeTab === "roadmap" && (
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
                  Shotokan Belt Progression Roadmap
                </h3>
                <p className="text-xs text-white/60 font-body">
                  Official grading trajectory from White Belt to Shodan Black Belt.
                </p>
              </div>

              <GoldButton onClick={() => setEditRankOpen(true)}>
                <Award className="w-4 h-4 mr-2" />
                Update Belt Rank
              </GoldButton>
            </div>

            {/* Belt Progression Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-4">
              {[
                { belt: "white", label: "White", kyu: "8th Kyu", active: true },
                { belt: "yellow", label: "Yellow", kyu: "7th Kyu", active: ["yellow", "orange", "green", "blue", "purple", "brown", "black_1", "black_2", "black_3"].includes(student.belt_rank) },
                { belt: "orange", label: "Orange", kyu: "6th Kyu", active: ["orange", "green", "blue", "purple", "brown", "black_1", "black_2", "black_3"].includes(student.belt_rank) },
                { belt: "green", label: "Green", kyu: "5th Kyu", active: ["green", "blue", "purple", "brown", "black_1", "black_2", "black_3"].includes(student.belt_rank) },
                { belt: "blue", label: "Blue", kyu: "4th Kyu", active: ["blue", "purple", "brown", "black_1", "black_2", "black_3"].includes(student.belt_rank) },
                { belt: "purple", label: "Purple", kyu: "3rd Kyu", active: ["purple", "brown", "black_1", "black_2", "black_3"].includes(student.belt_rank) },
                { belt: "brown", label: "Brown", kyu: "1st - 2nd", active: ["brown", "black_1", "black_2", "black_3"].includes(student.belt_rank) },
                { belt: "black", label: "Black", kyu: "1st Dan", active: ["black_1", "black_2", "black_3"].includes(student.belt_rank) },
              ].map((b, idx) => {
                const isCurrent = student.belt_rank?.toLowerCase().includes(b.belt);
                return (
                  <div
                    key={b.belt}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      isCurrent
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105"
                        : b.active
                        ? "bg-white/[0.04] border-white/20 text-white"
                        : "bg-white/[0.01] border-white/5 opacity-40 text-white/50"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-xs bg-white/10">
                      {idx + 1}
                    </div>
                    <h5 className="font-heading text-sm font-bold uppercase">{b.label}</h5>
                    <p className="text-[10px] text-white/60 font-body">{b.kyu}</p>
                    {isCurrent && (
                      <span className="inline-block mt-2 text-[9px] font-heading uppercase text-black font-bold bg-[#D4AF37] px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Next Belt Criteria */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <h4 className="font-heading text-lg font-bold uppercase text-white">
                Next Rank Examination Checklist
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Kihon (Basic Strikes & Blocks) Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Prescribed Kata Form Mastered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Required Mat Hours (88%+ Attendance)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT DETAILS & CONTACT */}
        {activeTab === "dossier" && (
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
                  Student Record & Contact Dossier
                </h3>
                <p className="text-xs text-white/60 font-body">
                  Contact details, emergency telephone, and internal sensei notes.
                </p>
              </div>

              <GoldButton onClick={() => setEditDetailsOpen(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Record
              </GoldButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-heading uppercase text-white/40">Full Legal Name</span>
                  <p className="font-heading text-lg font-bold text-white uppercase">{fullName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-heading uppercase text-white/40">Primary Contact Phone</span>
                  <p className="text-sm font-body text-white flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {student.phone || "No phone recorded"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-heading uppercase text-white/40">Email Address</span>
                  <p className="text-sm font-body text-white flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {student.email || "No email recorded"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-heading uppercase text-white/40">Emergency Contact / Guardian</span>
                  <p className="text-sm font-body text-white flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {student.emergency_contact || "Parent Guardian"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-heading uppercase text-white/40">Date of Birth</span>
                  <p className="text-sm font-body text-white flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {student.date_of_birth || "14 May 2013"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-heading uppercase text-white/40">Sensei Training Notes</span>
                  <p className="text-xs font-body text-white/70 leading-relaxed">
                    "{student.notes || "Demonstrates strong work ethic and enthusiasm during training."}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PHOTO CAPTURE MODAL */}
      <PhotoCaptureModal
        open={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        onPhotoSelected={handlePhotoUpdate}
        studentName={fullName}
        currentPhoto={student.avatar_url}
      />

      {/* EDIT DETAILS DIALOG */}
      <Dialog open={editDetailsOpen} onOpenChange={setEditDetailsOpen}>
        <DialogContent className="max-w-xl bg-[#0A0A0A] border border-white/10 text-white rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold uppercase text-white">
              Edit Student Details
            </DialogTitle>
            <DialogDescription className="text-white/60 font-body text-xs">
              Update personal information, guardian contacts, and enrollment status.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveDetails} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">First Name *</label>
                <input
                  type="text"
                  value={detailsForm.first_name || ""}
                  onChange={(e) => setDetailsForm({ ...detailsForm, first_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Last Name *</label>
                <input
                  type="text"
                  value={detailsForm.last_name || ""}
                  onChange={(e) => setDetailsForm({ ...detailsForm, last_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Email Address</label>
                <input
                  type="email"
                  value={detailsForm.email || ""}
                  onChange={(e) => setDetailsForm({ ...detailsForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Phone</label>
                <input
                  type="text"
                  value={detailsForm.phone || ""}
                  onChange={(e) => setDetailsForm({ ...detailsForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Emergency Contact / Guardian</label>
              <input
                type="text"
                value={detailsForm.emergency_contact || ""}
                onChange={(e) => setDetailsForm({ ...detailsForm, emergency_contact: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Program</label>
                <select
                  value={detailsForm.program || "junior_fighters"}
                  onChange={(e) => setDetailsForm({ ...detailsForm, program: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="little_warriors">Lionmode Kids (Ages 3–8)</option>
                  <option value="junior_fighters">Little Lions (Ages 8–12)</option>
                  <option value="teen_warriors">Lionmode Teens (Ages 13–18)</option>
                  <option value="adult_martial_arts">Adult Traditional & Defense</option>
                  <option value="competition_team">Black Belt Elite Squad</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Status</label>
                <select
                  value={detailsForm.status || "active"}
                  onChange={(e) => setDetailsForm({ ...detailsForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Sensei Notes</label>
              <textarea
                rows={3}
                value={detailsForm.notes || ""}
                onChange={(e) => setDetailsForm({ ...detailsForm, notes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <GoldButton type="submit" className="w-full mt-2">
              Save Student Record
            </GoldButton>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT / PROMOTE RANK DIALOG */}
      <Dialog open={editRankOpen} onOpenChange={setEditRankOpen}>
        <DialogContent className="max-w-md bg-[#0A0A0A] border border-white/10 text-white rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold uppercase text-white">
              Promote / Change Rank
            </DialogTitle>
            <DialogDescription className="text-white/60 font-body text-xs">
              Update {fullName}'s official Shotokan karate belt and kyu rank.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveRank} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Belt Rank</label>
              <select
                value={rankForm.belt_rank}
                onChange={(e) => setRankForm({ ...rankForm, belt_rank: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {BELT_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Rank Level / Label</label>
              <input
                type="text"
                placeholder="e.g. 3rd Kyu or 1st Dan"
                value={rankForm.rank_level}
                onChange={(e) => setRankForm({ ...rankForm, rank_level: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Promotion Award Date</label>
              <input
                type="date"
                value={rankForm.promotion_date || new Date().toISOString().split("T")[0]}
                onChange={(e) => setRankForm({ ...rankForm, promotion_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <GoldButton type="submit" className="w-full mt-2">
              Confirm Rank Promotion
            </GoldButton>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD / EDIT REPORT DIALOG */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="max-w-lg bg-[#0A0A0A] border border-white/10 text-white rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold uppercase text-white">
              {editingReport ? "Edit Evaluation Report" : "Add Sensei Progress Report"}
            </DialogTitle>
            <DialogDescription className="text-white/60 font-body text-xs">
              Record technical feedback and grading readiness for {fullName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveReport} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Report Title *</label>
              <input
                type="text"
                placeholder="e.g. Term 2 Kata Assessment"
                value={reportForm.title}
                onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Category</label>
                <select
                  value={reportForm.category}
                  onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Kata Forms">Kata Forms</option>
                  <option value="Kumite Sparring">Kumite Sparring</option>
                  <option value="Belt Grading Readiness">Belt Grading Readiness</option>
                  <option value="Discipline & Etiquette">Discipline & Etiquette</option>
                  <option value="Physical Conditioning">Physical Conditioning</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Assessment Grade</label>
                <select
                  value={reportForm.grade}
                  onChange={(e) => setReportForm({ ...reportForm, grade: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="A+ (Mastery)">A+ (Mastery)</option>
                  <option value="A (Excellent)">A (Excellent)</option>
                  <option value="B+ (Competent)">B+ (Competent)</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pass with Honors">Pass with Honors</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Evaluator / Sensei</label>
                <input
                  type="text"
                  value={reportForm.instructor}
                  onChange={(e) => setReportForm({ ...reportForm, instructor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Date</label>
                <input
                  type="date"
                  value={reportForm.date}
                  onChange={(e) => setReportForm({ ...reportForm, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Evaluation Feedback & Drill Notes *</label>
              <textarea
                rows={4}
                placeholder="Technical observations, stances, kime, speed, or areas for improvement..."
                value={reportForm.content}
                onChange={(e) => setReportForm({ ...reportForm, content: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <GoldButton type="submit" className="w-full mt-2">
              {editingReport ? "Update Report" : "Save Report to Dossier"}
            </GoldButton>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
