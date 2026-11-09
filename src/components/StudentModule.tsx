import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "../api/base44Client";
import { 
  Search, 
  Plus, 
  Flame, 
  Users, 
  Shield, 
  Activity, 
  LayoutGrid, 
  List, 
  Camera, 
  ChevronRight, 
  UserCheck, 
  CheckCircle2, 
  Eye, 
  ExternalLink 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import BeltBadge from "./shared/BeltBadge";
import GoldButton from "./shared/GoldButton";
import StudentCard from "./students/StudentCard";
import StudentForm from "./students/StudentForm";
import PhotoCaptureModal from "./students/PhotoCaptureModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

export default function StudentModule({ branding }: { branding?: any }) {
  const navigate = useNavigate();
  const { isParent, authorizedStudentId } = useAuth();
  const [search, setSearch] = useState("");
  const [beltFilter, setBeltFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [photoModalStudent, setPhotoModalStudent] = useState<any>(null);

  const queryClient = useQueryClient();

  // Strict Privacy: Parents cannot browse other students' files
  if (isParent) {
    const targetChildId = authorizedStudentId || 'std-1';
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-2xl uppercase font-bold text-white tracking-wider">
              Private Member Access
            </h2>
            <p className="text-sm text-white/70 leading-relaxed font-body">
              Strict Student Privacy: Parents are only authorized to view their own registered child's dossier and performance reports.
            </p>
          </div>
          <div className="pt-2">
            <GoldButton onClick={() => navigate(`/students/${targetChildId}`)} className="w-full justify-center">
              View My Child's Dossier →
            </GoldButton>
          </div>
        </div>
      </div>
    );
  }

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => base44.entities.Student.list("-created_date", 200),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => (base44.entities as any).Student.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setShowForm(false);
      toast.success("Student enrolled in roster");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => (base44.entities as any).Student.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setShowForm(false);
      setEditingStudent(null);
    },
  });

  const handleSubmit = (data: any) => {
    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handlePhotoUpdate = (photoUrl: string) => {
    if (!photoModalStudent) return;
    updateMutation.mutate({
      id: photoModalStudent.id,
      data: { avatar_url: photoUrl }
    });
    queryClient.invalidateQueries({ queryKey: ["students"] });
  };

  const filtered = students.filter((s: any) => {
    const fullName = `${s.first_name || ""} ${s.last_name || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesBelt = beltFilter === "all" || (s.belt_rank || "").toLowerCase().includes(beltFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || (s.status || "active").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesBelt && matchesStatus;
  });

  const belts = ["all", "white", "yellow", "orange", "green", "blue", "purple", "brown", "black"];

  return (
    <div className="relative min-h-screen pb-32 animate-in fade-in duration-700 bg-[#0A0A0A] text-white">
      {/* Decorative ambient spots */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[25rem] h-[25rem] bg-[#D4AF37]/2 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10 px-4 md:px-8 pt-8">
        {/* HEADER SECTION - Approved Template 01 (Minimal Luxury, Dark Obsidian, Cinematic Gold) */}
        <div className="text-left space-y-3">
          <span className="text-xs font-heading uppercase tracking-[0.3em] text-[#D4AF37]">
            Member Directory Database
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white leading-none">
            PERSONNEL_ <br />
            <span className="text-[#D4AF37]">ROSTER</span>
          </h1>
          <p className="text-sm md:text-base text-white/70 font-body leading-relaxed max-w-xl">
            Central synchronization database for dojo students, belt rank credentials, attendance streaks, and official unit dossiers.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between bg-white/[0.03] p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="space-y-1.5 flex-1 max-w-xl">
            <Label className="text-[10px] font-heading text-white/40 uppercase tracking-widest ml-1">
              Search Student Roll
            </Label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/60 group-focus-within:text-[#D4AF37] transition-colors" />
              <Input
                placeholder="Search by student name or rank..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pl-11 bg-white/5 border-white/10 rounded-2xl text-xs font-body text-white placeholder:text-white/20 focus:ring-1 focus:ring-[#D4AF37]/40"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            {/* View Mode Toggle */}
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
              <button 
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading uppercase tracking-wider transition-all cursor-pointer",
                  viewMode === "list" ? "bg-[#D4AF37] text-black font-bold shadow-md" : "text-white/50 hover:text-white"
                )}
                title="List View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List Form</span>
              </button>
              <button 
                onClick={() => setViewMode("cards")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading uppercase tracking-wider transition-all cursor-pointer",
                  viewMode === "cards" ? "bg-[#D4AF37] text-black font-bold shadow-md" : "text-white/50 hover:text-white"
                )}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards View</span>
              </button>
            </div>

            <GoldButton 
              size="md" 
              onClick={() => { setEditingStudent(null); setShowForm(true); }}
            >
              <Plus className="w-4 h-4 mr-2" /> Enroll Student
            </GoldButton>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider">
                    Belt Rank Filter
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {belts.map((belt) => (
                    <button
                      key={belt}
                      onClick={() => setBeltFilter(belt)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-[10px] font-heading uppercase tracking-wider transition-all border text-center cursor-pointer",
                        beltFilter === belt
                          ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-md shadow-[#D4AF37]/20"
                          : "bg-white/5 border-white/5 text-white/50 hover:border-[#D4AF37]/40 hover:text-white"
                      )}
                    >
                      {belt === "all" ? "All Belts" : `${belt} Belt`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider">
                    Status Matrix
                  </h3>
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: "all", label: "All Students" },
                    { id: "active", label: "Active Roll" },
                    { id: "trial", label: "Trial Status" },
                    { id: "inactive", label: "Inactive" },
                    { id: "suspended", label: "Suspended" }
                  ].map((status) => (
                    <button
                      key={status.id}
                      onClick={() => setStatusFilter(status.id)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-xs font-heading uppercase tracking-wider transition-all border flex items-center justify-between cursor-pointer",
                        statusFilter === status.id
                          ? "bg-white/10 text-white border-[#D4AF37]/40 shadow-lg"
                          : "text-white/40 border-transparent hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span>{status.label}</span>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        status.id === 'active' ? 'bg-emerald-400' : 
                        status.id === 'trial' ? 'bg-blue-400' :
                        status.id === 'suspended' ? 'bg-orange-400' :
                        status.id === 'inactive' ? 'bg-rose-400' : 'bg-[#D4AF37]'
                      )} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Roster Count Card */}
            <div className="bg-white/[0.03] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              <div className="relative z-10 space-y-1">
                <p className="text-[10px] font-heading uppercase tracking-widest text-[#D4AF37]">Active Force Roll</p>
                <h4 className="font-heading text-5xl font-bold text-white">
                  {filtered.length}
                </h4>
                <p className="text-[10px] text-white/50 uppercase font-body tracking-wider">Enrolled Martial Artists</p>
              </div>
              <Users className="absolute -right-3 -bottom-3 w-28 h-28 text-[#D4AF37] opacity-[0.05]" />
            </div>
          </div>

          {/* Student Content Area */}
          <div className="xl:col-span-3">
            {isLoading ? (
              <div className="space-y-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-2xl h-24 animate-pulse" />
                ))}
              </div>
            ) : viewMode === "list" ? (
              /* LIST FORM VIEW (Default requested by user) */
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((student: any) => {
                    const initials = `${student.first_name?.[0] || ""}${student.last_name?.[0] || "S"}`;
                    const hasPhoto = !!student.avatar_url;

                    return (
                      <motion.div
                        key={student.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="group bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 rounded-2xl p-4 md:p-5 backdrop-blur-xl transition-all shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        {/* Photo placeholder + Name & Rank */}
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Photo Placeholder (Clickable to take camera photo or upload) */}
                          <div
                            onClick={() => setPhotoModalStudent(student)}
                            className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-black/60 border border-[#D4AF37]/40 shrink-0 cursor-pointer group/photo shadow-md flex items-center justify-center transition-all hover:border-[#D4AF37]"
                            title="Click to take camera photo or upload image"
                          >
                            {hasPhoto ? (
                              <img
                                src={student.avatar_url}
                                alt={`${student.first_name} ${student.last_name}`}
                                className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="font-heading font-black text-xl text-[#D4AF37] uppercase">
                                {initials}
                              </div>
                            )}

                            {/* Camera Hover Overlay */}
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                              <Camera className="w-5 h-5 text-[#D4AF37]" />
                            </div>

                            {/* Camera Small Badge */}
                            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black flex items-center justify-center pointer-events-none">
                              <Camera className="w-2.5 h-2.5 fill-black" />
                            </div>
                          </div>

                          {/* Student Name (Clickable to open profile page) */}
                          <div className="min-w-0">
                            <h3
                              onClick={() => navigate(`/students/${student.id}`)}
                              className="font-heading text-xl md:text-2xl font-bold uppercase text-white group-hover:text-[#D4AF37] transition-colors cursor-pointer truncate tracking-wide"
                            >
                              {student.first_name} {student.last_name}
                            </h3>

                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <BeltBadge belt={student.belt_rank || "white"} rank={student.rank_level} size="sm" />
                              <span className="text-[11px] text-white/50 font-body truncate">
                                {student.program?.replace(/_/g, " ") || "Little Lions"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Metrics: Streak, Attendance, Status & Open Profile Button */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          {/* Streak */}
                          <div className="flex items-center gap-1.5 text-xs text-orange-400 bg-orange-400/10 px-2.5 py-1 rounded-xl border border-orange-400/20 font-heading">
                            <Flame className="w-3.5 h-3.5 fill-orange-400" />
                            <span>{student.current_streak || 0}d</span>
                          </div>

                          {/* Attendance */}
                          <div className="hidden md:flex items-center gap-1.5 text-xs text-white/70 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10 font-body">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{student.attendance_rate || 92}%</span>
                          </div>

                          {/* Status */}
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[10px] font-heading uppercase tracking-wider font-bold border",
                              student.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                              student.status === "trial" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                              "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            )}
                          >
                            {student.status || "active"}
                          </span>

                          {/* Action Button: View Profile */}
                          <button
                            onClick={() => navigate(`/students/${student.id}`)}
                            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/50 text-white hover:text-[#D4AF37] text-xs font-heading uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <span>Profile</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              /* CARDS VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filtered.map((student: any) => (
                    <div
                      key={student.id}
                      className="bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 rounded-3xl p-6 backdrop-blur-xl transition-all shadow-xl space-y-5 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Photo Placeholder with click handler */}
                          <div
                            onClick={() => setPhotoModalStudent(student)}
                            className="relative w-16 h-16 rounded-2xl overflow-hidden bg-black/60 border-2 border-[#D4AF37]/50 shrink-0 cursor-pointer shadow-md flex items-center justify-center group/cardPhoto hover:border-[#D4AF37] transition-all"
                            title="Take photo with camera or upload"
                          >
                            {student.avatar_url ? (
                              <img
                                src={student.avatar_url}
                                alt={student.first_name}
                                className="w-full h-full object-cover group-hover/cardPhoto:scale-110 transition-transform"
                              />
                            ) : (
                              <span className="font-heading font-black text-2xl text-[#D4AF37]">
                                {student.first_name?.[0]}{student.last_name?.[0]}
                              </span>
                            )}
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover/cardPhoto:opacity-100 transition-opacity">
                              <Camera className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <h3
                              onClick={() => navigate(`/students/${student.id}`)}
                              className="font-heading text-2xl font-bold uppercase text-white group-hover:text-[#D4AF37] transition-colors cursor-pointer truncate"
                            >
                              {student.first_name} {student.last_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <BeltBadge belt={student.belt_rank || "white"} size="sm" />
                              <span className="text-xs text-white/50 font-body">{student.rank_level}</span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-heading uppercase tracking-wider font-bold border",
                            student.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            student.status === "trial" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                            "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          )}
                        >
                          {student.status || "active"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center justify-center gap-1 text-orange-400 mb-0.5">
                            <Flame className="w-3.5 h-3.5 fill-orange-400" />
                            <span className="text-[10px] font-heading uppercase text-white/50">Streak</span>
                          </div>
                          <p className="font-heading text-xl font-bold text-white">{student.current_streak || 0} Days</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-heading uppercase text-white/50">Attendance</span>
                          </div>
                          <p className="font-heading text-xl font-bold text-white">{student.attendance_rate || 90}%</p>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5">
                        <button
                          onClick={() => setPhotoModalStudent(student)}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-heading uppercase text-white/70 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Photo</span>
                        </button>

                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="flex-1 py-2 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-heading uppercase tracking-wider text-[#D4AF37] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Open Profile</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-28 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed"
              >
                <Users className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <h4 className="font-heading text-xl uppercase tracking-wider text-white/50">No Students Found</h4>
                <p className="text-xs text-white/30 font-body mt-1">Try resetting your search or rank filters</p>
                <button 
                  onClick={() => { setSearch(""); setBeltFilter("all"); setStatusFilter("all"); }}
                  className="mt-6 px-4 py-2 rounded-xl bg-white/5 text-[#D4AF37] text-xs font-heading uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ENROLL STUDENT DIALOG */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <StudentForm
            student={editingStudent}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingStudent(null); }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* PHOTO CAPTURE & UPLOAD MODAL */}
      <PhotoCaptureModal
        open={!!photoModalStudent}
        onClose={() => setPhotoModalStudent(null)}
        onPhotoSelected={handlePhotoUpdate}
        studentName={photoModalStudent ? `${photoModalStudent.first_name} ${photoModalStudent.last_name}` : ""}
        currentPhoto={photoModalStudent?.avatar_url}
      />
    </div>
  );
}
