import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Plus, 
  Clock, 
  User, 
  Users, 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Trash2, 
  Bell, 
  BellOff,
  UserCheck, 
  Activity,
  AlertTriangle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import GoldButton from "./shared/GoldButton";
import HeroBanner from "./shared/HeroBanner";
import { db, auth } from "../lib/firebase";
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc,
  deleteDoc, 
  serverTimestamp, 
  getDoc,
  query,
  where
} from "firebase/firestore";
import { toast } from "sonner";
import { notificationService } from "../services/NotificationService";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = { 
  monday: "MON", 
  tuesday: "TUE", 
  wednesday: "WED", 
  thursday: "THU", 
  friday: "FRI", 
  saturday: "SAT", 
  sunday: "SUN" 
};

const PROGRAM_LABELS: Record<string, string> = {
  little_warriors: "LITTLE DRAGONS",
  junior_fighters: "JUNIOR WARRIORS",
  teen_warriors: "TEEN WARRIORS",
  adult_martial_arts: "ADULT CORE",
  competition_team: "ELITE SQUAD",
};

const PROGRAM_COLORS: Record<string, string> = {
  little_warriors: "border-l-yellow-400 bg-yellow-400/5",
  junior_fighters: "border-l-blue-400 bg-blue-400/5",
  teen_warriors: "border-l-purple-400 bg-purple-400/5",
  adult_martial_arts: "border-l-emerald-400 bg-emerald-400/5",
  competition_team: "border-l-primary bg-primary/5",
};

const SEED_CLASSES = [
  {
    id: "class-1",
    name: "Junior Warriors Karate",
    description: "Fundamental striking, blocks, and coordination for young martial artists. Focusing on discipline.",
    program: "junior_fighters",
    instructor: "Master Kenji",
    startTime: "16:00",
    endTime: "17:00",
    days: ["monday", "wednesday"],
    capacity: 20,
    category: "KARATE",
    recurring: true
  },
  {
    id: "class-2",
    name: "Adult BJJ Core Control",
    description: "Ground defense, joint lock submissions, and tactical positioning strategy.",
    program: "adult_martial_arts",
    instructor: "Commander Sarah",
    startTime: "18:30",
    endTime: "19:30",
    days: ["monday", "thursday"],
    capacity: 15,
    category: "BJJ",
    recurring: true
  },
  {
    id: "class-3",
    name: "Elite Squad Sparring Prep",
    description: "Advanced high-intensity combat drilling and situational sparring for competitor combatants.",
    program: "competition_team",
    instructor: "Master Kenji",
    startTime: "17:30",
    endTime: "19:00",
    days: ["tuesday", "friday"],
    capacity: 12,
    category: "SPARRING",
    recurring: true
  },
  {
    id: "class-4",
    name: "Little Dragons Kickboxing",
    description: "Discipline, balance, reflexes, and fun striking games for young children.",
    program: "little_warriors",
    instructor: "Instructor Sarah",
    startTime: "15:30",
    endTime: "16:15",
    days: ["wednesday", "saturday"],
    capacity: 25,
    category: "YOUTH",
    recurring: true
  },
  {
    id: "class-5",
    name: "Advanced Striking Combat Prep",
    description: "Full kickboxing and hand hitting drills with mitts and offensive bag rotations.",
    program: "adult_martial_arts",
    instructor: "Sensei Ryu",
    startTime: "19:30",
    endTime: "20:30",
    days: ["tuesday", "thursday"],
    capacity: 18,
    category: "STRIKING",
    recurring: true
  }
];

interface ClassesProps {
  user?: any;
  profile?: any;
}

export default function Classes({ user, profile }: ClassesProps) {
  // Determine standard auth fallbacks
  const currentUserUid = user?.uid || "anonymous";
  const currentUserName = profile?.name || user?.displayName || "Guest Student";
  const currentUserEmail = user?.email || "anonymous@dojo.os";
  const isAdminUser = profile?.role === "admin" || currentUserEmail === "babuvash@gmail.com";

  const todayRaw = new Date().getDay();
  // 0 is Sunday, 1 is Monday...
  const today = DAYS[todayRaw === 0 ? 6 : todayRaw - 1];

  const [selectedDay, setSelectedDay] = useState(today);
  const [filters, setFilters] = useState({ program: "all", instructor: "all" });
  
  // Real Firestore state
  const [classes, setClasses] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals & Forms
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const hasSeeded = useRef(false);

  // New Class Form State
  const [newClassName, setNewClassName] = useState("");
  const [newClassDesc, setNewClassDesc] = useState("");
  const [newClassInstructor, setNewClassInstructor] = useState("Master Kenji");
  const [newClassStartTime, setNewClassStartTime] = useState("17:00");
  const [newClassEndTime, setNewClassEndTime] = useState("18:00");
  const [newClassCategory, setNewClassCategory] = useState("KARATE");
  const [newClassProgram, setNewClassProgram] = useState("adult_martial_arts");
  const [newClassCapacity, setNewClassCapacity] = useState(15);
  const [newClassDays, setNewClassDays] = useState<string[]>(["monday"]);

  // Set up Firebase triggers
  useEffect(() => {
    setLoading(true);
    // Listen to Classes collection
    const unsubClasses = onSnapshot(collection(db, "classes"), (snap) => {
      const clsList: any[] = [];
      snap.forEach((docSnap) => {
        clsList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setClasses(clsList);

      // Auto-seed if the workspace Firestore database is empty
      if (snap.empty && !hasSeeded.current) {
        hasSeeded.current = true;
        seedDefaultData();
      }
      setLoading(false);
    }, (error) => {
      console.error("Classes snapshot subscription failure:", error);
      setLoading(false);
    });

    // Listen to Bookings collection
    const unsubBookings = onSnapshot(collection(db, "bookings"), (snap) => {
      const bksList: any[] = [];
      snap.forEach((docSnap) => {
        bksList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setBookings(bksList);
    }, (error) => {
      console.error("Bookings snapshot subscription failure:", error);
    });

    // Check notification state
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }

    return () => {
      unsubClasses();
      unsubBookings();
    };
  }, []);

  const seedDefaultData = async () => {
    try {
      console.log("Empty deployment detected. Auto-seeding default robust training operations...");
      for (const item of SEED_CLASSES) {
        await setDoc(doc(db, "classes", item.id), item);
      }
      toast.success("Operational session guidelines successfully seeded to Firebase");
    } catch (err) {
      console.error("Error seeding default classes:", err);
    }
  };

  // Toggle dynamic days in constructor
  const toggleDaySelection = (day: string) => {
    if (newClassDays.includes(day)) {
      setNewClassDays(newClassDays.filter((d) => d !== day));
    } else {
      setNewClassDays([...newClassDays, day]);
    }
  };

  // Create class Firestore handler
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || newClassDays.length === 0) {
      toast.error("Required fields are missing. Initialize protocol failed.");
      return;
    }

    try {
      const classId = "class-" + Date.now();
      const newClassDoc = {
        id: classId,
        name: newClassName.trim(),
        description: newClassDesc.trim() || "Tactical drilling and routine coordination.",
        instructor: newClassInstructor,
        startTime: newClassStartTime,
        endTime: newClassEndTime,
        days: newClassDays,
        capacity: Number(newClassCapacity) || 15,
        category: newClassCategory,
        program: newClassProgram,
        recurring: true,
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, "classes", classId), newClassDoc);
      toast.success(`Protocol Loaded: "${newClassName}" registered perfectly.`);
      setShowAdminDialog(false);

      // Reset form variables
      setNewClassName("");
      setNewClassDesc("");
      setNewClassCapacity(15);
      setNewClassDays(["monday"]);
    } catch (err: any) {
      toast.error(`Session registration failed: ${err.message}`);
    }
  };

  // Delete class Firestore handler
  const handleDeleteClass = async (classId: string, className: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you absolutely sure you want to scrub "${className}" and cancel all active bookings?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "classes", classId));
      toast.success(`Scrubbed class sequence: "${className}" deleted from server.`);
      
      // Delete associated bookings
      const associatedBookings = bookings.filter((b) => b.classId === classId);
      for (const booking of associatedBookings) {
        await deleteDoc(doc(db, "bookings", booking.id));
      }
    } catch (err: any) {
      toast.error(`Purging schedule item failed: ${err.message}`);
    }
  };

  // Turn local notifications on or off to support school notifications
  const handleToggleNotifications = async () => {
    setNotificationsLoading(true);
    const granted = await notificationService.requestPermission();
    setNotificationsEnabled(granted);
    setNotificationsLoading(false);
    
    if (granted) {
      toast.success("Dojo Alerts Enabled", {
        description: "You will now receive upcoming class notifications and mission bulletins."
      });
      notificationService.showLocalNotification(
        "Telemetry Sync Active", 
        "Tactical indicators and class alerts are now active."
      );
    } else {
      toast.error("Alert Authorization Denied", {
        description: "Please enable system notifications inside your browser settings."
      });
    }
  };

  // Book a class session
  const handleBookSession = async (classItem: any) => {
    if (currentUserUid === "anonymous") {
      toast.error("Access Protected", { description: "Please log into Dojo OS to reserve professional training slots." });
      return;
    }

    try {
      const bookingId = `book-${currentUserUid}-${classItem.id}-${selectedDay}`;
      const existingBooking = bookings.find((b) => b.id === bookingId);

      if (existingBooking) {
        toast.info("Already Deployed", { description: "Your training slot is already securely synchronized for this day." });
        return;
      }

      // Check current capacity
      const activeBookings = bookings.filter((b) => b.classId === classItem.id && b.day === selectedDay);
      if (activeBookings.length >= classItem.capacity) {
        toast.error("Operational Peak Exhausted", { description: "Maximum safety capabilities are currently achieved." });
        return;
      }

      await setDoc(doc(db, "bookings", bookingId), {
        id: bookingId,
        classId: classItem.id,
        day: selectedDay,
        studentId: currentUserUid,
        studentName: currentUserName,
        studentEmail: currentUserEmail,
        createdAt: new Date().toISOString()
      });

      toast.success(`Spot Saved!`, {
        description: `Successfully signed up for ${classItem.name} this ${selectedDay.toUpperCase()}.`
      });

      // Notification action
      notificationService.showLocalNotification(
        "Deployment Scheduled", 
        `Class Briefing secured for: ${classItem.name} at ${classItem.startTime}.`
      );

      // Re-trigger visual snapshot for modal
      if (selectedClass?.id === classItem.id) {
        setSelectedClass({ ...classItem });
      }
    } catch (err: any) {
      toast.error(`Booking reservation error: ${err.message}`);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (classItem: any) => {
    try {
      const bookingId = `book-${currentUserUid}-${classItem.id}-${selectedDay}`;
      await deleteDoc(doc(db, "bookings", bookingId));

      toast.success("Reservation Scrubbed", {
        description: "Your training spot is successfully released to general inventory."
      });

      notificationService.showLocalNotification(
        "Reservation scrubbed", 
        `Canceled your booking for ${classItem.name}.`
      );

      // Update modal list
      if (selectedClass?.id === classItem.id) {
        setSelectedClass({ ...classItem });
      }
    } catch (err: any) {
      toast.error(`Cancellation script failed: ${err.message}`);
    }
  };

  // Remove a booking as Admin
  const handleRemoveStudentBooking = async (bookingId: string) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      toast.success("Student removed from class checklist.");
    } catch (err: any) {
      toast.error(`Failed to release slot: ${err.message}`);
    }
  };

  // Memoized filter list of instructors
  const instructors = useMemo(() => {
    return ["all", ...Array.from(new Set(classes.map((c) => c.instructor).filter(Boolean)))];
  }, [classes]);

  // Filter matches
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      // Days array support (match chosen day)
      const dayMatch = c.days?.includes(selectedDay) || c.day_of_week === selectedDay;
      const programMatch = filters.program === "all" || c.program === filters.program;
      const instructorMatch = filters.instructor === "all" || c.instructor === filters.instructor;
      return dayMatch && programMatch && instructorMatch;
    });
  }, [classes, selectedDay, filters]);

  return (
    <div className="space-y-12 pb-32 bg-background min-h-screen">
      <HeroBanner
        image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1400&q=80"
        title="TRAINING_ROTATIONS"
        subtitle="Tactical school calendar and session reservations network"
      />

      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
        
        {/* Alerts & Master control panel */}
        <div className="flex flex-col xl:flex-row gap-8 justify-between items-start">
          <div className="space-y-4 text-left">
            <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary bg-primary/5 border border-primary/20 px-4 py-1.5 italic rounded-full">
              SQUADRON MATRIX
            </Badge>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white tracking-tighter uppercase italic leading-none">
              OPS_<br />
              <span className="text-primary">WINDOWS</span>
            </h2>
            <div className="flex items-center gap-3 pl-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] italic">Tactical Central Nexus Online</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Notification alert request toggle */}
            <Button
              onClick={handleToggleNotifications}
              disabled={notificationsLoading}
              variant="outline"
              className={cn(
                "h-16 px-6 md:px-8 border rounded-[30px] font-display text-[9px] font-black uppercase tracking-[0.2em] italic transition-all duration-300",
                notificationsEnabled 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-white/5 border-white/5 text-white/75 hover:bg-white/10 hover:border-primary/20"
              )}
            >
              {notificationsEnabled ? (
                <>
                  <Bell className="w-5 h-5 mr-3 text-emerald-400 animate-pulse" />
                  ALERTS_ACTIVE
                </>
              ) : (
                <>
                  <BellOff className="w-5 h-5 mr-3 text-white/30" />
                  ENABLE_TELEMETRY
                </>
              )}
            </Button>

            {/* Admin deployment triggers */}
            {isAdminUser && (
              <Button
                onClick={() => setShowAdminDialog(true)}
                className="bg-primary text-black hover:scale-105 active:scale-95 transition-all text-[11px] font-black uppercase tracking-[0.2em] italic h-16 px-8 rounded-[30px] shadow-glow-gold"
              >
                <Plus className="w-5 h-5 mr-3" /> INITIALIZE_ SESSION
              </Button>
            )}
          </div>
        </div>

        {/* Modular Filter Console */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-md">
          {/* Program filter */}
          <div className="space-y-4 text-left">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic block">PROGRAM DIVISION</span>
            <div className="flex flex-wrap gap-2">
              {["all", ...Object.keys(PROGRAM_LABELS)].map((prog) => (
                <button
                  key={prog}
                  onClick={() => setFilters({ ...filters, program: prog })}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all italic",
                    filters.program === prog
                      ? "bg-primary text-black border-primary shadow-glow-gold"
                      : "bg-white/5 border-white/5 text-white/40 hover:border-primary/40 hover:text-white"
                  )}
                >
                  {prog === "all" ? "ALL CLASSES" : PROGRAM_LABELS[prog]}
                </button>
              ))}
            </div>
          </div>

          {/* Instructor selection */}
          <div className="space-y-4 text-left">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic block">COMMAND TEAM</span>
            <select
              value={filters.instructor}
              onChange={(e) => setFilters({ ...filters, instructor: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/40 italic transition-all appearance-none cursor-pointer"
            >
              {instructors.map((ins) => (
                <option key={ins} value={ins} className="bg-neutral-950 text-white">
                  {ins === "all" ? "ALL SENSIS / SYSTEM UNITS" : ins.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Real-time sync tracker */}
          <div className="flex items-center gap-6 p-6 bg-white/[0.01] border border-white/5 rounded-3xl text-left lg:col-span-1">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <span className="text-[8px] font-black tracking-widest uppercase text-white/30 italic block">REAL-TIME TELEMETRY</span>
              <p className="text-sm font-bold text-white uppercase italic tracking-tight">{classes.length} Schedules Synchronized</p>
              <p className="text-[9px] text-white/40 italic">Active Roster: {bookings.length} reservations loaded</p>
            </div>
          </div>
        </div>

        {/* 7-DAY TIMETABLE TAPE */}
        <div className="bg-white/[0.01] border border-white/5 rounded-[45px] overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.01]">
            {DAYS.map((day) => {
              const isToday = day === today;
              const isSelected = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "flex flex-col items-center py-6 gap-2 transition-all relative group overflow-hidden",
                    isSelected ? "bg-primary/5" : "hover:bg-white/[0.03]"
                  )}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId="activeDayBackground"
                      className="absolute inset-0 bg-primary/5 border-b-2 border-primary"
                    />
                  )}
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.3em] italic relative z-10 transition-colors",
                    isSelected ? "text-primary font-bold" : "text-white/20 group-hover:text-white/50"
                  )}>
                    {DAY_LABELS[day]}
                  </span>
                  {isToday && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow-gold relative z-10" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ACTIVE CLASS ROTATIONS */}
          <div className="p-8 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-white/5 border border-white/5 rounded-[40px] animate-pulse" />
                ))}
              </div>
            ) : filteredClasses.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {filteredClasses.map((item, idx) => {
                  const dayBookings = bookings.filter((b) => b.classId === item.id && b.day === selectedDay);
                  const isUserBooked = bookings.some((b) => b.classId === item.id && b.day === selectedDay && b.studentId === currentUserUid);
                  const isFull = dayBookings.length >= item.capacity;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      onClick={() => setSelectedClass(item)}
                      className={cn(
                        "p-6 md:p-8 rounded-[35px] border-l-4 flex flex-col lg:flex-row items-center gap-8 group hover:bg-white/[0.04] border border-white/5 hover:border-primary/20 transition-all cursor-pointer text-left relative",
                        PROGRAM_COLORS[item.program] || "border-l-primary/40 bg-white/5"
                      )}
                    >
                      {/* Class Duration Block */}
                      <div className="w-full lg:w-40 shrink-0 space-y-1">
                        <div className="flex items-center gap-3 text-primary">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-[12px] font-black italic tracking-widest">{item.startTime}</span>
                        </div>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic ml-7">{item.endTime}</p>
                        <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest italic ml-7">WEEKDAY ROTATION</p>
                      </div>

                      {/* Main Title & Description */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-2 h-2 rounded-full animate-pulse", isFull ? "bg-red-500" : "bg-emerald-400")} />
                          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                            {(item.program || "adult_martial_arts").replace(/_/g, " ").toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-2xl md:text-3xl font-heading font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">
                          {item.name}
                        </h4>
                        <p className="text-xs text-white/50 italic font-medium leading-relaxed max-w-xl">
                          {item.description}
                        </p>
                      </div>

                      {/* Right aligned status & Reserve triggers */}
                      <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-4 shrink-0 w-full lg:w-auto mt-4 lg:mt-0">
                        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                          {/* Live booking capacity details */}
                          <div className="flex items-center gap-3 bg-white/5 border border-white/15 px-5 py-2.5 rounded-2xl italic shadow-inner">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">
                              {dayBookings.length}/{item.capacity} reserved
                            </span>
                          </div>

                          {/* Instructor detail bubble */}
                          <div className="flex items-center gap-3 bg-white/5 border border-white/15 px-5 py-2.5 rounded-2xl italic shadow-inner">
                            <User className="w-4 h-4 text-primary/60" />
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{item.instructor?.toUpperCase()}</span>
                          </div>
                        </div>

                        {/* Interactive dynamic enrollment status indicator */}
                        <div className="flex items-center gap-4 w-full justify-between lg:justify-end">
                          <div>
                            {isUserBooked ? (
                              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-display text-[9px] font-black tracking-widest uppercase italic py-1 px-3 rounded-full animate-pulse gap-1.5 flex items-center">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> SECURED_ TRAINING
                              </Badge>
                            ) : isFull ? (
                              <Badge className="bg-red-500/10 text-red-500 border border-red-500/30 font-display text-[9px] font-black tracking-widest uppercase italic py-1 px-3 rounded-full">
                                FULL_EXHAUSTED
                              </Badge>
                            ) : (
                              <Badge className="bg-primary/10 text-primary border border-primary/20 font-display text-[9px] font-black tracking-widest uppercase italic py-1 px-3 rounded-full">
                                OPEN_AVAILABILITY
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Admins item deletion tool */}
                            {isAdminUser && (
                              <button
                                onClick={(e) => handleDeleteClass(item.id, item.name, e)}
                                className="h-10 w-10 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-black rounded-xl flex items-center justify-center border border-rose-500/15 transition-all text-xs"
                                title="Scrub System Session"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] italic hover:translate-x-2 transition-transform">
                              BRIEF_ ROSTER →
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            ) : (
              <div className="py-24 text-center space-y-6">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                  <CalendarIcon className="w-10 h-10 text-white/10 animate-pulse" />
                </div>
                <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.6em] italic">Zero_ Operational_ Session_ Rotations_ Authorized</p>
                {isAdminUser && (
                  <p className="text-xs text-white/40 italic">As administrator, initialize rotation procedures above.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADMIN PROTOCOL DIALOG (CREATE SESSIONS) */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="max-w-xl bg-neutral-950 border border-white/10 rounded-[40px] text-left text-white p-8 overflow-y-auto max-h-[90vh]">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Badge variant="outline" className="bg-primary/5 border border-primary/25 text-primary text-[9px] font-bold uppercase tracking-[0.4em] px-4 py-1.5 italic rounded-full">
                  ADMIN_ DIRECTIVE_ AUTHORIZED
                </Badge>
                <DialogTitle className="text-3xl font-heading font-black italic uppercase text-primary leading-none tracking-tight">INITIALIZE ROTATION</DialogTitle>
                <DialogDescription className="text-[10px] uppercase font-black tracking-widest text-white/30 italic">Registers a recurring operational slot into database archives.</DialogDescription>
              </div>
              <Button onClick={() => setShowAdminDialog(false)} className="h-10 w-10 p-0 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 border border-white/10">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-white/55 tracking-widest block">Session name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Master Sparring Sequence" 
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-xs text-white uppercase tracking-wider rounded-xl px-4 py-3 focus:outline-none focus:border-primary/40 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-white/55 tracking-widest block">Session details / description</label>
                <textarea 
                  placeholder="Details regarding specialized physical training techniques..." 
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/40 h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/55 tracking-widest block">Squad leader / instructor</label>
                  <select 
                    value={newClassInstructor}
                    onChange={(e) => setNewClassInstructor(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/40"
                  >
                    <option value="Master Kenji" className="bg-neutral-950">MASTER KENJI</option>
                    <option value="Commander Sarah" className="bg-neutral-950">COMMANDER SARAH</option>
                    <option value="Instructor Sarah" className="bg-neutral-950">INSTRUCTOR SARAH</option>
                    <option value="Sensei Ryu" className="bg-neutral-950">SENSEI RYU</option>
                    <option value="Sensei Chun" className="bg-neutral-950">SENSEI CHUN</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/55 tracking-widest block">Max tactical slots (capacity)</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={100}
                    required
                    value={newClassCapacity}
                    onChange={(e) => setNewClassCapacity(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/40 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/55 tracking-widest block">Class starting time</label>
                  <input 
                    type="time" 
                    required
                    value={newClassStartTime}
                    onChange={(e) => setNewClassStartTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/40 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/55 tracking-widest block">Class ending time</label>
                  <input 
                    type="time" 
                    required
                    value={newClassEndTime}
                    onChange={(e) => setNewClassEndTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/40 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/55 tracking-widest block">Branch / category</label>
                  <select 
                    value={newClassCategory}
                    onChange={(e) => setNewClassCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/40"
                  >
                    <option value="KARATE" className="bg-neutral-950">KARATE DIVISION</option>
                    <option value="BJJ" className="bg-neutral-950">BJJ TACTICAL</option>
                    <option value="STRIKING" className="bg-neutral-950">STRIKING PREP</option>
                    <option value="SPARRING" className="bg-neutral-950">COMPETITOR COMBAT</option>
                    <option value="YOUTH" className="bg-neutral-950">YOUTH TEAM</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/55 tracking-widest block">Target division (program)</label>
                  <select 
                    value={newClassProgram}
                    onChange={(e) => setNewClassProgram(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/40"
                  >
                    {Object.entries(PROGRAM_LABELS).map(([k, v]) => (
                      <option key={k} value={k} className="bg-neutral-950">{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Day selection badges */}
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase text-white/55 tracking-widest block">Temporal recurrence (select weekdays)</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => {
                    const isSelected = newClassDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDaySelection(day)}
                        className={cn(
                          "px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all italic",
                          isSelected
                            ? "bg-primary text-black border-primary shadow-glow-gold"
                            : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                        )}
                      >
                        {day.substring(0, 3).toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <Button 
                  type="button" 
                  onClick={() => setShowAdminDialog(false)} 
                  variant="outline" 
                  className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/15 text-[10px] text-white/60 hover:bg-white/10 uppercase tracking-widest italic"
                >
                  CANCEL_ROTATION
                </Button>
                <GoldButton 
                  type="submit" 
                  className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                  DEPLOY_ROSTER_SEQUENCE
                </GoldButton>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* SESSION BRIEFING & STUDENT PORTAL ROTATIONS OVERLAY */}
      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent className="max-w-2xl bg-neutral-950 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] p-0 overflow-hidden rounded-[40px] text-left text-white">
          {selectedClass && (() => {
            const dayBookings = bookings.filter((b) => b.classId === selectedClass.id && b.day === selectedDay);
            const isUserBooked = bookings.some((b) => b.classId === selectedClass.id && b.day === selectedDay && b.studentId === currentUserUid);
            const isFull = dayBookings.length >= selectedClass.capacity;
            const utilizationPercentage = Math.min(100, Math.round((dayBookings.length / selectedClass.capacity) * 100));

            return (
              <div className="p-8 md:p-12 space-y-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <Badge variant="outline" className="bg-primary/5 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.4em] px-5 py-2 italic rounded-full">
                      DEPLOYMENT_BRIEF_SECURED
                    </Badge>
                    <DialogTitle className="text-4xl md:text-5xl font-heading font-black text-white uppercase italic tracking-tighter leading-none mb-1">
                      {selectedClass.name}
                    </DialogTitle>
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                        {(selectedClass.program || "adult_martial_arts").replace(/_/g, " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => setSelectedClass(null)} className="h-12 w-12 p-0 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 border border-white/10">
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01] border border-white/5 rounded-3xl p-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl shrink-0">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[8px] text-white/30 font-bold uppercase tracking-[0.4em] italic mb-0.5">TEMPORAL WINDOW</p>
                      <p className="text-sm font-bold text-white uppercase tracking-tight italic leading-none">{selectedDay}, {selectedClass.startTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[8px] text-white/30 font-bold uppercase tracking-[0.4em] italic mb-0.5">COMMANDER UNIT</p>
                      <p className="text-sm font-bold text-white uppercase tracking-tight italic leading-none">{selectedClass.instructor}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.4em] italic block text-left">DIVISION MISSION GUIDELINE</label>
                  <p className="text-sm text-white/60 italic leading-relaxed text-left bg-white/[0.01] border border-white/5 rounded-2xl p-6">
                    {selectedClass.description}
                  </p>
                </div>

                {/* CAPACITY GRAPH */}
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">CAPACITY_UTILIZATION</span>
                    <span className="text-xs font-black text-primary uppercase italic">{dayBookings.length} / {selectedClass.capacity} reserved ({utilizationPercentage}%)</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${utilizationPercentage}%` }}
                      className={cn(
                        "h-full rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]",
                        utilizationPercentage === 100 ? "bg-red-500" : utilizationPercentage >= 75 ? "bg-amber-500" : "bg-primary"
                      )}
                    />
                  </div>
                </div>

                {/* PERSONNEL SCHEDULE ROSTER */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic leading-none">LOGGED TRAINING PERSONNEL</h4>
                    </div>
                    <Badge className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 text-[9px] font-black uppercase italic rounded-full shadow-inner">
                      {dayBookings.length} ENROLLED UNITS
                    </Badge>
                  </div>

                  <div className="space-y-3 max-h-[160px] overflow-y-auto no-scrollbar bg-black/40 border border-white/5 rounded-3xl p-4">
                    {dayBookings.length > 0 ? (
                      dayBookings.map((bk, bIdx) => (
                        <div key={bk.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/15 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary uppercase italic">
                              {bk.studentName.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="text-left space-y-0.5">
                              <span className="text-sm font-bold text-white uppercase italic tracking-tight">{bk.studentName}</span>
                              <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block italic leading-none">ID: SEC-{100 + bIdx} • {bk.studentEmail?.toLowerCase()}</span>
                            </div>
                          </div>

                          {/* Admin remove booking option */}
                          {isAdminUser && (
                            <Button 
                              onClick={() => handleRemoveStudentBooking(bk.id)} 
                              variant="ghost" 
                              className="h-10 w-10 p-0 text-white/30 hover:bg-rose-500/20 hover:text-rose-400 rounded-xl border border-white/10"
                            >
                              <X className="w-4.5 h-4.5" />
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">No students currently deployed for this session window</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* USER INTERACTION ENGINES */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                  <Button 
                    onClick={() => setSelectedClass(null)} 
                    variant="outline" 
                    className="flex-1 h-16 rounded-[30px] border border-white/15 text-[10px] font-black text-white/60 hover:bg-white/5 uppercase tracking-widest italic"
                  >
                    DISMISS_BRIEFING
                  </Button>

                  {isUserBooked ? (
                    <Button 
                      onClick={() => handleCancelBooking(selectedClass)}
                      className="flex-1 h-16 rounded-[30px] bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> SCRUB_ROTATION (CANCEL)
                    </Button>
                  ) : (
                    <GoldButton 
                      onClick={() => handleBookSession(selectedClass)}
                      disabled={isFull}
                      className="flex-1 h-16 rounded-[30px] text-[10px] font-black uppercase tracking-widest"
                    >
                      {isFull ? "DIVISION_CAPACITY_EXHAUSTED" : "RESERVE_TRAINING_SLOT"}
                    </GoldButton>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
