// Lion Mode Karate Academy (https://lionmodekarate.com)
// AthletaOffice: Complete Dojo Business Management System
// Exact 1:1 Architecture, Layout, Color Palette and Navigation matching AthletaDesk (https://app.athletadesk.com/Teacher/v2/en/home)
// Features: Full-Screen Layout, Dark Slate Sidebar with "Back to Admin", Lime Green (#7BB31A) Brand Accents,
// Top Alert Banner with "Getting Started Guide", 7 Home Stat Cards, Agenda Calendar, Trainers & Staff with Payroll,
// Clients Roster & CRM with Photo Uploads, Month/Week Calendar Grid, Accounts & Invoices, Packages, Expenses & Other Revenue with Charts,
// Mileage Log, Website & Widgets, News & Blog Posts, Business Reports, My Profile Settings, Belt Grading Engine, Reception Mat Kiosk & Bulk Messaging.

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home,
  Users,
  Calendar,
  CreditCard,
  Package,
  Activity,
  Navigation,
  Globe,
  Megaphone,
  FileText,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Bell,
  HelpCircle,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Camera,
  Check,
  X,
  Phone,
  Mail,
  Send,
  Award,
  Smartphone,
  Flame,
  AlertTriangle,
  Clock,
  Printer,
  Sliders,
  DollarSign,
  TrendingUp,
  UserCheck,
  Building,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Trash2,
  Folder,
  File,
  CheckCircle2,
  Shield,
  Layers,
  ArrowRight,
  Pencil,
  Lock,
  ShieldCheck,
  Star,
  Key
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from "recharts";
import { 
  useAthletaOffice, 
  StudentRecord, 
  FamilyRecord, 
  ClassScheduleRecord, 
  InvoiceRecord,
  ExpenseRecord,
  MessageRecord,
  EventTournamentRecord
} from "@/lib/athletaOfficeStore";
import { toast } from "sonner";

export default function AthletaOffice() {
  const navigate = useNavigate();
  const { 
    data, 
    addStudent, 
    updateStudent,
    deleteStudent,
    uploadStudentPhoto,
    addClass,
    recordAttendance, 
    promoteStudentBelt, 
    createInvoice,
    markInvoicePaid, 
    addExpense,
    deleteExpense,
    sendMessage
  } = useAthletaOffice();

  // Navigation state (Matches exact sidebar sequence from screenshot 19)
  const [activePage, setActivePage] = useState<
    | "home"
    | "trainers"
    | "clients"
    | "calendar"
    | "resources"
    | "invoices"
    | "packages"
    | "expenses"
    | "mileage"
    | "website"
    | "news"
    | "reports"
    | "profile"
    | "grading"
    | "kiosk"
    | "messaging"
  >("home");

  // Sidebar collapse toggle
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Top banner dismiss state
  const [showTopBanner, setShowTopBanner] = useState(true);
  const [showGettingStartedModal, setShowGettingStartedModal] = useState(false);

  // User Profile Dropdown
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // User Profile & Preferences state (1:1 with https://app.athletadesk.com/Teacher/v2/en/my-profile#General)
  const [activeProfileTab, setActiveProfileTab] = useState<"General" | "Payroll" | "Booking & Availability" | "Reviews">("General");
  const [showEditBioModal, setShowEditBioModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showAddPayrollModal, setShowAddPayrollModal] = useState(false);
  const [showAddAvailabilityModal, setShowAddAvailabilityModal] = useState(false);
  const [payrollPeriod, setPayrollPeriod] = useState("2026/11/30");
  const [payrollSearch, setPayrollSearch] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [bioInput, setBioInput] = useState(
    "Founder & Chief Instructor at Lion Mode Karate Academy. 5th Dan Shotokan Black Belt with over two decades of coaching youth champions and adult martial artists."
  );

  const [twoFactorCode, setTwoFactorCode] = useState("");

  const [userProfile, setUserProfile] = useState({
    name: "Nirvash Babuall",
    role: "Chief Sensei & Dojo Owner",
    email: "babuvash@gmail.com",
    language: "English",
    bio: "Founder & Chief Instructor at Lion Mode Karate Academy. 5th Dan Shotokan Black Belt with over two decades of coaching youth champions and adult martial artists.",
    avatar: null as string | null,
    twoFactorEnabled: false,
    overdueAttendance: true,
    defaultNotesView: "Client" as "Client" | "Account Contact" | "Private",
    autoCopySessionNotes: true,
    copySessionNotesMode: "recent" as "recent" | "category",
    emailNotifications: {
      clientRegisters: true,
      clientCancels: true,
      anyClientRegisters: true,
      anyClientCancels: true,
      assignedSignUp: true,
      anySignUp: true,
      remindersDisabled: true,
      allowLogEmail: true,
    },
    dailyAgenda: "dayBefore" as "dayBefore" | "sameDay" | "dontEmail",
    pinnedNavigation: {
      resources: true,
      packages: true,
      expenses: true,
      mileage: true,
      website: true,
      news: true,
      reports: true,
    },
    onlineBooking: {
      startTimeIncrements: "15 minutes",
      bufferTimeMinutes: 0,
      limitMaxGap: false,
    },
    weeklyAvailability: [
      { day: "Monday", active: true, start: "08:00", end: "18:00" },
      { day: "Tuesday", active: true, start: "08:00", end: "18:00" },
      { day: "Wednesday", active: true, start: "08:00", end: "18:00" },
      { day: "Thursday", active: true, start: "08:00", end: "18:00" },
      { day: "Friday", active: true, start: "08:00", end: "18:00" },
      { day: "Saturday", active: true, start: "09:00", end: "13:00" },
      { day: "Sunday", active: false, start: "09:00", end: "12:00" },
    ],
    payrollEntries: [] as Array<{
      id: string;
      date: string;
      description: string;
      hours: number;
      rate: number;
      amount: number;
      status: "Pending" | "Paid";
    }>,
    reviews: [
      { id: "rev-1", author: "Sarah Jenkins (Parent of Leo)", rating: 5, date: "2026-11-04", text: "Sensei Nirvash's dedication to the kids is unmatched. Leo has grown so much in confidence and respect!" },
      { id: "rev-2", author: "David Mthembu (Adult Karateka)", rating: 5, date: "2026-10-28", text: "Exceptional training facility. The technical kumite drills and kata precision have taken my martial arts to the national level." },
      { id: "rev-3", author: "Priya Pillay (Parent of Arya)", rating: 5, date: "2026-10-15", text: "Best martial arts academy in Umhlanga. Outstanding coaching and structured belt syllabus." }
    ]
  });

  const [newPayrollForm, setNewPayrollForm] = useState({
    date: "2026-11-10",
    description: "Kata & Kumite Masterclass Coaching",
    hours: 2,
    rate: 350,
  });

  const [newAvailabilityForm, setNewAvailabilityForm] = useState({
    day: "Monday",
    start: "08:00",
    end: "18:00"
  });

  // URL Hash & Path Synchronization for https://app.athletadesk.com/Teacher/v2/en/my-profile#General
  useEffect(() => {
    const handleUrlSync = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (path.includes("my-profile") || hash.includes("profile")) {
        setActivePage("profile");
      }
      if (hash.includes("general")) {
        setActivePage("profile");
        setActiveProfileTab("General");
      } else if (hash.includes("payroll")) {
        setActivePage("profile");
        setActiveProfileTab("Payroll");
      } else if (hash.includes("booking") || hash.includes("availability")) {
        setActivePage("profile");
        setActiveProfileTab("Booking & Availability");
      } else if (hash.includes("review")) {
        setActivePage("profile");
        setActiveProfileTab("Reviews");
      }
    };
    handleUrlSync();
    window.addEventListener("hashchange", handleUrlSync);
    return () => window.removeEventListener("hashchange", handleUrlSync);
  }, []);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day" | "agenda">("month");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // November 2026 (0-indexed: 10 = Nov)

  // Modals & Sliders
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddMileageModal, setShowAddMileageModal] = useState(false);
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState<{ student: StudentRecord; rank: string } | null>(null);

  // Reception Kiosk State
  const [kioskPinInput, setKioskPinInput] = useState("");

  // Hidden File Input for Student Photo Uploads
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [targetStudentForPhoto, setTargetStudentForPhoto] = useState<string | null>(null);

  // Form states
  const [newClientForm, setNewClientForm] = useState({
    firstName: "",
    lastName: "",
    dob: "2016-04-15",
    gender: "Male",
    familyId: "FAM-001",
    trainingProgram: "Little Lions (Ages 8–12)",
    assignedInstructor: "Nirvash Babuall",
    medicalNotes: "None",
    signedWaiver: true
  });

  const [newEventForm, setNewEventForm] = useState({
    title: "",
    category: "Training Session",
    trainer: "Nirvash Babuall",
    date: "2026-11-10",
    startTime: "16:30",
    durationMinutes: 60,
    location: "Umhlanga Main Tatami Hall",
    clientName: "All Enrolled Students"
  });

  const [newMileageForm, setNewMileageForm] = useState({
    date: "2026-11-10",
    purpose: "Dojo Tatami Equipment Delivery",
    km: 24,
    ratePerKm: 4.85
  });

  const [mileageLogs, setMileageLogs] = useState([
    { id: "MIL-01", date: "2026-11-04", purpose: "Tournament Arena Inspection", km: 38, rate: 4.85, totalZAR: 184.30 },
    { id: "MIL-02", date: "2026-11-08", purpose: "Equipment Collection - Durban North", km: 16, rate: 4.85, totalZAR: 77.60 }
  ]);

  const [packagesList, setPackagesList] = useState([
    { id: "PKG-01", name: "10-Session Karate Punch Pass", sessions: 10, priceZAR: 950, activeClientsCount: 4 },
    { id: "PKG-02", name: "Monthly Unlimited Shotokan Tuition", sessions: 999, priceZAR: 850, activeClientsCount: 18 },
    { id: "PKG-03", name: "Championship Kumite Sparring Block", sessions: 12, priceZAR: 1200, activeClientsCount: 6 }
  ]);

  const [newsPosts, setNewsPosts] = useState([
    { id: "POST-01", title: "End-of-Year Official Belt Grading & Showcase", date: "2026-11-09", category: "Dojo Announcements", excerpt: "All students eligible for grading please review required kata and kumite syllabus with Sensei." },
    { id: "POST-02", title: "KZN Open Martial Arts Championship Roster", date: "2026-11-02", category: "Tournaments", excerpt: "Congratulations to our cadet kumite squad on finalizing tournament registration brackets." }
  ]);

  const [broadcastForm, setBroadcastForm] = useState<{
    channel: "email" | "sms" | "whatsapp" | "in_app";
    recipientFilter: string;
    subject: string;
    body: string;
  }>({
    channel: "email",
    recipientFilter: "All Active Clients (28)",
    subject: "AthletaDesk Lion Mode Notification",
    body: "Dear Athletes and Parents,\n\nThis is an official notice from Lion Mode Karate Academy. Please check your schedule in the portal.\n\nOsu,\nNirvash Babuall"
  });

  // Calculate Real-Time Stats
  const activeStudentsCount = data.students.filter(s => s.status === "active").length;
  const totalPaidZAR = data.invoices.filter(i => i.status === "paid").reduce((sum, inv) => sum + inv.totalZAR, 0);
  const overdueInvoicesCount = data.invoices.filter(i => i.status === "overdue").length;
  const eligibleGradingCount = data.students.filter(s => s.isGradingEligible).length;

  // Accrual / P&L Chart Data (May 2026 - Feb 2027) matching Screenshot 16
  const expensesChartData = useMemo(() => [
    { month: "May 2026", training: 32000, other: 3000, expenses: 18000, net: 17000 },
    { month: "Jun 2026", training: 34500, other: 3500, expenses: 18500, net: 19500 },
    { month: "Jul 2026", training: 36000, other: 4000, expenses: 19000, net: 21000 },
    { month: "Aug 2026", training: 38200, other: 4200, expenses: 19500, net: 22900 },
    { month: "Sep 2026", training: 41000, other: 4500, expenses: 20000, net: 25500 },
    { month: "Oct 2026", training: 42850, other: 5100, expenses: 20200, net: 27750 },
    { month: "Nov 2026", training: 44200, other: 5800, expenses: 20200, net: 29800 },
    { month: "Dec 2026", training: 45000, other: 6000, expenses: 21000, net: 30000 },
    { month: "Jan 2027", training: 46500, other: 6200, expenses: 21500, net: 31200 },
    { month: "Feb 2027", training: 48000, other: 6500, expenses: 22000, net: 32500 },
  ], []);

  // Photo Upload Handler
  const handlePhotoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetStudentForPhoto) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          await uploadStudentPhoto(targetStudentForPhoto, reader.result);
          toast.success("Student photo updated successfully!");
          if (selectedStudent && selectedStudent.id === targetStudentForPhoto) {
            setSelectedStudent(prev => prev ? { ...prev, photoURL: reader.result as string } : null);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUploadPhoto = (studentId: string) => {
    setTargetStudentForPhoto(studentId);
    photoInputRef.current?.click();
  };

  // Kiosk PIN Submit
  const handleKioskCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const match = data.students.find(
      s => s.studentIdCode.toLowerCase() === kioskPinInput.trim().toLowerCase() ||
           s.id.toLowerCase() === kioskPinInput.trim().toLowerCase()
    );
    if (match) {
      recordAttendance({
        classId: "CLS-102",
        className: "Little Lions Junior Form (Ages 8–12)",
        date: new Date().toISOString().split("T")[0],
        studentId: match.id,
        studentName: `${match.firstName} ${match.lastName}`,
        beltRank: match.rankLevel,
        status: "present",
        checkInMethod: "pin",
        instructorName: "Nirvash Babuall"
      });
      toast.success(`Welcome to the mat, ${match.firstName}! Osu!`, {
        description: `Checked in for today's session. Current streak: ${match.currentStreak + 1}`
      });
      setKioskPinInput("");
    } else {
      toast.error("Student ID or PIN not recognized. Please see front desk.");
    }
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return data.students.filter(s => {
      const q = searchQuery.toLowerCase();
      return (
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.studentIdCode.toLowerCase().includes(q) ||
        s.rankLevel.toLowerCase().includes(q)
      );
    });
  }, [data.students, searchQuery]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-[#7BB31A] selection:text-white">
      
      {/* Hidden File Input for Real Photo Uploads */}
      <input 
        type="file" 
        ref={photoInputRef} 
        onChange={handlePhotoUploadChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* ============================================================= */}
      {/* ATHLETADESK EXACT DARK SLATE SIDEBAR (#1A232A / #161F26)      */}
      {/* ============================================================= */}
      <aside 
        className={`flex flex-col shrink-0 bg-[#1A232A] text-white transition-all duration-200 select-none border-r border-[#222D35] ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Top: Back to Admin Command Center Button */}
        <div className="p-3 border-b border-[#26343F] bg-[#141C22]">
          <Link
            to="/admin"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer group"
            title="Return to Dojo Admin Command Center"
          >
            <ChevronLeft className="w-4 h-4 text-[#84CC16] group-hover:-translate-x-0.5 transition-transform" />
            {!sidebarCollapsed && <span className="truncate">← Back to Admin</span>}
          </Link>
        </div>

        {/* AthletaDesk Logo Header with Lime Accent (#84CC16) */}
        <div className="p-4 flex items-center gap-3 border-b border-[#26343F]">
          <div className="w-8 h-8 rounded-lg bg-[#84CC16] flex items-center justify-center text-black font-black text-lg tracking-tighter shrink-0 shadow-sm">
            <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </div>
          {!sidebarCollapsed && (
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-widest text-white uppercase font-mono">
                  ATHLETA<span className="text-[#84CC16]">DESK</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block tracking-wider">Lion Mode Dojo ERP</span>
            </div>
          )}
        </div>

        {/* Navigation Items in Exact AthletaDesk Order */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
          {[
            { id: "home", label: "Home", icon: Home },
            { id: "trainers", label: "Trainers & Staff", icon: Users },
            { id: "clients", label: "Clients", icon: Users },
            { id: "calendar", label: "Calendar", icon: Calendar },
            { id: "resources", label: "Online Resources", icon: Folder },
            { id: "invoices", label: "Accounts & Invoices", icon: CreditCard },
            { id: "packages", label: "Packages", icon: Package },
            { id: "expenses", label: "Expenses & Other Revenue", icon: Activity },
            { id: "mileage", label: "Mileage Log", icon: Navigation },
            { id: "website", label: "Website", icon: Globe },
            { id: "news", label: "News & Blog Posts", icon: Megaphone },
            { id: "reports", label: "Business Reports", icon: FileText },
            { id: "profile", label: "My Profile", icon: UserCheck },
          ].map(item => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id as any);
                  if (item.id === "profile") {
                    window.location.hash = activeProfileTab;
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                  active
                    ? "bg-[#283540] text-[#84CC16] font-semibold border-l-3 border-[#84CC16]"
                    : "text-slate-300 hover:text-white hover:bg-[#222D35]"
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#84CC16]" : "text-slate-400"}`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}

          {/* Integrated Dojo Features Section */}
          <div className="pt-2 mt-2 border-t border-[#26343F]">
            {!sidebarCollapsed && (
              <p className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">
                Dojo Operational Extensions
              </p>
            )}
            <button
              onClick={() => setActivePage("grading")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                activePage === "grading" ? "bg-[#283540] text-[#84CC16] font-semibold" : "text-slate-300 hover:text-white hover:bg-[#222D35]"
              }`}
              title="Belts, Grading & Automated Eligibility"
            >
              <Award className="w-4 h-4 text-purple-400 shrink-0" />
              {!sidebarCollapsed && <span>Belts & Grading Engine</span>}
            </button>
            <button
              onClick={() => setActivePage("kiosk")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                activePage === "kiosk" ? "bg-[#283540] text-[#84CC16] font-semibold" : "text-slate-300 hover:text-white hover:bg-[#222D35]"
              }`}
              title="Reception Mat Self-Check-in Tablet Kiosk"
            >
              <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
              {!sidebarCollapsed && <span>Mat Kiosk Check-In</span>}
            </button>
            <button
              onClick={() => setActivePage("messaging")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                activePage === "messaging" ? "bg-[#283540] text-[#84CC16] font-semibold" : "text-slate-300 hover:text-white hover:bg-[#222D35]"
              }`}
              title="Broadcast Email, SMS & WhatsApp"
            >
              <Send className="w-4 h-4 text-blue-400 shrink-0" />
              {!sidebarCollapsed && <span>Broadcast SMS & Email</span>}
            </button>
          </div>
        </nav>

        {/* Bottom Sidebar Collapse Toggle */}
        <div className="p-3 border-t border-[#26343F]">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {sidebarCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ============================================================= */}
      {/* MAIN VIEWPORT WITH ATHLETADESK HEADER & CONTENT               */}
      {/* ============================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
        
        {/* Top Dismissible Getting Started Alert (Matching Screenshot 1) */}
        {showTopBanner && (
          <div className="bg-[#ECFCCB] text-[#365314] px-4 md:px-8 py-2.5 flex items-center justify-between text-xs border-b border-[#D9F99D] shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold bg-[#84CC16] text-black w-4 h-4 rounded-full flex items-center justify-center text-[10px]">!</span>
              <span>Let's get everything ready so you can start using AthletaDesk</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  const toastId = toast.loading("Downloading lionmode-karate-update-v3.zip (17.8 MB)...");
                  try {
                    const res = await fetch("/lionmode-karate-update-v3.zip");
                    if (!res.ok) throw new Error("File not found");
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "lionmode-karate-update-v3.zip";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setTimeout(() => window.URL.revokeObjectURL(url), 10000);
                    toast.success("✓ Download started! Check your Downloads folder.", { id: toastId });
                  } catch {
                    window.location.href = "/download";
                  }
                }}
                className="px-3 py-1 rounded-md bg-[#283540] hover:bg-[#344452] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                title="Download production ZIP archive for cPanel extraction"
              >
                <Download className="w-3.5 h-3.5 text-[#84CC16]" />
                <span className="hidden sm:inline">cPanel Build ZIP (17.8 MB)</span>
              </button>
              <button
                onClick={() => setShowGettingStartedModal(true)}
                className="px-3 py-1 rounded-md bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <span>🚀 Getting Started Guide</span>
              </button>
              <button onClick={() => setShowTopBanner(false)} className="text-[#4D7C0F] hover:text-[#1A2E05] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* AthletaDesk Top Navigation Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          {/* Left: Page Title */}
          <div className="flex items-center gap-2 text-slate-800">
            {activePage === "home" && <Home className="w-4 h-4 text-slate-500" />}
            {activePage === "trainers" && <Users className="w-4 h-4 text-slate-500" />}
            {activePage === "clients" && <Users className="w-4 h-4 text-slate-500" />}
            {activePage === "calendar" && <Calendar className="w-4 h-4 text-slate-500" />}
            {activePage === "resources" && <Folder className="w-4 h-4 text-slate-500" />}
            {activePage === "invoices" && <CreditCard className="w-4 h-4 text-slate-500" />}
            {activePage === "packages" && <Package className="w-4 h-4 text-slate-500" />}
            {activePage === "expenses" && <Activity className="w-4 h-4 text-slate-500" />}
            {activePage === "mileage" && <Navigation className="w-4 h-4 text-slate-500" />}
            {activePage === "website" && <Globe className="w-4 h-4 text-slate-500" />}
            {activePage === "news" && <Megaphone className="w-4 h-4 text-slate-500" />}
            {activePage === "reports" && <FileText className="w-4 h-4 text-slate-500" />}
            {activePage === "profile" && <Users className="w-4 h-4 text-slate-500" />}
            {activePage === "grading" && <Award className="w-4 h-4 text-purple-600" />}
            {activePage === "kiosk" && <Smartphone className="w-4 h-4 text-amber-600" />}
            {activePage === "messaging" && <Send className="w-4 h-4 text-blue-600" />}

            <h1 className="text-base font-bold capitalize text-slate-900 tracking-tight">
              {activePage === "home" ? "Home" :
               activePage === "trainers" ? "Trainers & Staff" :
               activePage === "clients" ? "Clients" :
               activePage === "calendar" ? "Calendar" :
               activePage === "resources" ? "Online Resources" :
               activePage === "invoices" ? "Accounts & Invoices" :
               activePage === "packages" ? "Packages" :
               activePage === "expenses" ? "Expenses & Other Revenue" :
               activePage === "mileage" ? "Mileage Log" :
               activePage === "website" ? "Website" :
               activePage === "news" ? "News & Blog Posts" :
               activePage === "reports" ? "Business Reports" :
               activePage === "profile" ? "My Profile" :
               activePage === "grading" ? "Belts & Grading Engine" :
               activePage === "kiosk" ? "Reception Mat Kiosk" : "Broadcast Communications"}
            </h1>
          </div>

          {/* Right: Notifications, Help & User Profile Dropdown */}
          <div className="flex items-center gap-4 text-slate-600 text-xs">
            {/* Notifications Bell */}
            <button
              onClick={() => toast.info("No unread system alerts.")}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {overdueInvoicesCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* Help Icon */}
            <button
              onClick={() => setShowGettingStartedModal(true)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
              title="Help & Getting Started"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* User Profile Pill Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 hover:bg-slate-100 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold flex items-center justify-center text-xs border border-[#BAE6FD]">
                  NB
                </div>
                <span className="font-semibold text-slate-800 hidden sm:inline">Nirvash Babuall</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-xs">
                  <button
                    onClick={() => {
                      setActivePage("profile");
                      window.location.hash = "General";
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium flex items-center gap-2 text-slate-700 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" /> My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowGettingStartedModal(true);
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium flex items-center gap-2 text-slate-700 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Getting Started Guide
                  </button>
                  <div className="border-t my-1" />
                  <Link
                    to="/admin"
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium flex items-center gap-2 text-rose-600 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Return to Admin
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ============================================================= */}
        {/* PAGE CONTENT CONTAINER (Scrollable Area)                      */}
        {/* ============================================================= */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">

          {/* ----------------------------------------------------------- */}
          {/* 1. HOME SCREEN (Matching Screenshots 1 & 2)                */}
          {/* ----------------------------------------------------------- */}
          {activePage === "home" && (
            <div className="space-y-6">
              
              {/* Header: "Let's get started, Nirvash!" */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Let's get started, Nirvash!</h2>
                  <p className="text-xs text-slate-500">Welcome to your Lion Mode AthletaDesk command dashboard</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActivePage("profile")}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer shadow-xs"
                    title="Profile & Preferences"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 7 Core AthletaDesk Metric Stat Cards (Matching Screenshot 1) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                
                {/* 1. Events left this week for you */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-2 hover:border-[#84CC16] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#ECFCCB] text-[#65A30D] flex items-center justify-center mx-auto">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">4</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Events left this week for you</div>
                </div>

                {/* 2. Total events left this week */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-2 hover:border-[#84CC16] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#ECFCCB] text-[#65A30D] flex items-center justify-center mx-auto">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">{data.classes.length}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Total events left this week</div>
                </div>

                {/* 3. Payments received this month */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-2 hover:border-[#84CC16] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#ECFCCB] text-[#65A30D] flex items-center justify-center mx-auto">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">R {totalPaidZAR.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Payments received this month</div>
                </div>

                {/* 4. Projected revenue this month */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-2 hover:border-[#84CC16] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#ECFCCB] text-[#65A30D] flex items-center justify-center mx-auto">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">R 48,650</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Projected revenue this month</div>
                </div>

                {/* 5. Active Clients */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-2 hover:border-[#84CC16] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#ECFCCB] text-[#65A30D] flex items-center justify-center mx-auto">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">{activeStudentsCount}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Active Clients</div>
                </div>

                {/* 6. Unscheduled clients */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-2 hover:border-[#84CC16] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#ECFCCB] text-[#65A30D] flex items-center justify-center mx-auto">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">0</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Unscheduled clients</div>
                </div>

                {/* 7. Reviews Pending */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-2 hover:border-[#84CC16] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#ECFCCB] text-[#65A30D] flex items-center justify-center mx-auto">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">{eligibleGradingCount}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Belt Reviews Pending</div>
                </div>

              </div>

              {/* Agenda Section: "2026/11/10 Agenda for Nirvash Babuall" */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">2026/11/10 ▼</span>
                    <span className="text-xs text-slate-500">Agenda for <strong>Nirvash Babuall</strong> ▼</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <button className="p-1 rounded hover:bg-slate-100 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="font-semibold px-2">Today</span>
                    <button className="p-1 rounded hover:bg-slate-100 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Today's Active Classes list or empty illustration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.classes.slice(0, 2).map(cls => (
                    <div key={cls.id} className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16]" />
                          <strong className="text-sm text-slate-900">{cls.title}</strong>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{cls.startTime} - {cls.endTime} • {cls.venue}</p>
                        <p className="text-[11px] text-slate-400">Coach: {cls.instructorName} • {cls.enrolledCount} Athletes</p>
                      </div>
                      <button
                        onClick={() => {
                          setActivePage("clients");
                          toast.success(`Opening roll call for ${cls.title}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Roll Call
                      </button>
                    </div>
                  ))}
                </div>

                {/* Calendar Redirect Banner (Matching Screenshot 1) */}
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#ECFCCB] text-[#65A30D] flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Need to Schedule More Dojo Sessions?</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You can view the full month timetable, assign instructors, and add private coaching.
                  </p>
                  <button
                    onClick={() => setActivePage("calendar")}
                    className="px-4 py-2 rounded-xl bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Go To Calendar</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 2. TRAINERS & STAFF (Matching Screenshot 20)                */}
          {/* ----------------------------------------------------------- */}
          {activePage === "trainers" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              {/* Tabs: Trainers | Tags | Reviews */}
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-6 text-sm font-semibold">
                  <button className="text-[#84CC16] border-b-2 border-[#84CC16] pb-3 -mb-3 font-bold cursor-pointer">Trainers</button>
                  <button className="text-slate-500 hover:text-slate-800 pb-3 -mb-3 cursor-pointer">Tags</button>
                  <button className="text-slate-500 hover:text-slate-800 pb-3 -mb-3 cursor-pointer">Reviews</button>
                </div>
                <div className="text-xs text-slate-500">
                  Payroll Balance as of <strong>2026/11/30 ▼</strong>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast.info("Opening New Trainer Registration")}
                    className="px-3.5 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Add New ▼
                  </button>
                  <button
                    onClick={() => setActivePage("messaging")}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                  >
                    ✉️ Messaging ▼
                  </button>
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer">
                    ⚙️ Actions ▼
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Search:</span>
                  <input
                    type="text"
                    placeholder="Search trainers..."
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Trainers Table (Screenshot 20) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F8FAFC] text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-200">
                    <tr>
                      <th className="p-3 w-8"><input type="checkbox" className="accent-[#84CC16]" /></th>
                      <th className="p-3">Name ↑</th>
                      <th className="p-3">Contact Info</th>
                      <th className="p-3">Notes</th>
                      <th className="p-3">Assigned Clients</th>
                      <th className="p-3">Payroll Balance</th>
                      <th className="p-3">Session Category</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Pay Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3"><input type="checkbox" className="accent-[#84CC16]" /></td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold flex items-center justify-center text-xs">
                            NB
                          </div>
                          <div>
                            <strong className="block text-slate-900 font-bold">Nirvash Babuall</strong>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold">Active</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-100 text-blue-800 font-bold">Trainer</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-100 text-rose-800 font-bold">Full Access</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">babuvash@gmail.com</td>
                      <td className="p-3 text-slate-400">-</td>
                      <td className="p-3 font-semibold text-slate-800">28</td>
                      <td className="p-3 font-bold text-slate-900">R 28,000.00</td>
                      <td className="p-3 text-slate-600">Shotokan Karate & Kumite</td>
                      <td className="p-3 text-slate-600">60 minutes</td>
                      <td className="p-3 font-semibold text-slate-800">Monthly Salary</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3"><input type="checkbox" className="accent-[#84CC16]" /></td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                            SJ
                          </div>
                          <div>
                            <strong className="block text-slate-900 font-bold">Coach Sarah Jenkins</strong>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold">Active</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-100 text-blue-800 font-bold">Youth Coach</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">coach.sarah@lionmodekarate.com</td>
                      <td className="p-3 text-slate-400">Little Lions specialist</td>
                      <td className="p-3 font-semibold text-slate-800">14</td>
                      <td className="p-3 font-bold text-slate-900">R 6,160.00</td>
                      <td className="p-3 text-slate-600">Little Lions (Ages 3-8)</td>
                      <td className="p-3 text-slate-600">45 minutes</td>
                      <td className="p-3 font-semibold text-slate-800">R 280 / class</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 3. CLIENTS ROSTER (Matching Screenshot 12 & CRM)           */}
          {/* ----------------------------------------------------------- */}
          {activePage === "clients" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              {/* Header & Tabs */}
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-6 text-sm font-semibold">
                  <button className="text-[#84CC16] border-b-2 border-[#84CC16] pb-3 -mb-3 font-bold cursor-pointer">Clients</button>
                  <button className="text-slate-500 hover:text-slate-800 pb-3 -mb-3 cursor-pointer">Tags</button>
                </div>
                <div className="text-xs text-slate-500">
                  Total Active Clients: <strong>{data.students.length}</strong>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddClientModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Add Client
                  </button>
                  <button
                    onClick={() => setActivePage("messaging")}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                  >
                    ✉️ Messaging ▼
                  </button>
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer">
                    ⚙️ Actions ▼
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none w-48"
                  />
                </div>
              </div>

              {/* Clients Roster Table with Photo Uploads */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F8FAFC] text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-200">
                    <tr>
                      <th className="p-3 w-8"><input type="checkbox" className="accent-[#84CC16]" /></th>
                      <th className="p-3">Photo / Client Name</th>
                      <th className="p-3">Student Number</th>
                      <th className="p-3">Belt Rank</th>
                      <th className="p-3">Program</th>
                      <th className="p-3">Streak</th>
                      <th className="p-3">Status / Tags</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map(student => (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="p-3"><input type="checkbox" className="accent-[#84CC16]" /></td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative group/avatar shrink-0">
                              <img
                                src={student.photoURL}
                                alt={student.firstName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                              />
                              <button
                                onClick={() => triggerUploadPhoto(student.id)}
                                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity text-white cursor-pointer"
                                title="Click to upload client photo"
                              >
                                <Camera className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div>
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className="font-bold text-slate-900 hover:text-[#84CC16] text-left block cursor-pointer"
                              >
                                {student.firstName} {student.lastName}
                              </button>
                              <span className="text-[10px] text-slate-400">DOB: {student.dob}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 font-mono font-semibold text-slate-700">
                          {student.studentIdCode}
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: student.beltColor }} />
                            <span className="font-medium text-slate-800">{student.rankLevel}</span>
                          </div>
                        </td>

                        <td className="p-3 text-slate-600">{student.trainingProgram}</td>

                        <td className="p-3">
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-amber-500" /> {student.currentStreak}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-wrap items-center gap-1">
                            {student.unsignedWaiver && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-100 text-rose-800 font-bold">
                                ⚠️ Waiver
                              </span>
                            )}
                            {student.tags.map((t, idx) => (
                              <span key={idx} className="px-1.5 py-0.2 rounded text-[9px] bg-slate-100 text-slate-700 font-bold">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="px-2.5 py-1 rounded-md bg-[#84CC16]/10 text-[#65A30D] hover:bg-[#84CC16]/20 font-bold text-xs cursor-pointer"
                          >
                            Profile
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 4. CALENDAR (Matching Screenshot 14)                        */}
          {/* ----------------------------------------------------------- */}
          {activePage === "calendar" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              
              {/* Header Navigation */}
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900">November 2026 ▼</span>
                  <div className="flex items-center gap-1 ml-4 text-xs text-slate-600">
                    <button className="p-1 rounded hover:bg-slate-100 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="font-semibold px-2">Today</span>
                    <button className="p-1 rounded hover:bg-slate-100 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setShowAddEventModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Add Event ▼
                  </button>
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer">
                    ⚙️ Options ▼
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer">
                    📅 Month ▼
                  </button>
                </div>
              </div>

              {/* Month Grid View (Sunday to Saturday, Nov 1 to 30) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 bg-[#F8FAFC] text-center text-[11px] font-bold text-slate-500 py-2 border-b border-slate-200">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[500px]">
                  {/* Nov 1 to Nov 30 */}
                  {Array.from({ length: 35 }).map((_, i) => {
                    const dayNum = i + 1;
                    const isToday = dayNum === 10;
                    const isValidDate = dayNum <= 30;

                    return (
                      <div 
                        key={i} 
                        className={`p-2 min-h-[90px] relative transition-colors ${
                          isToday ? "bg-[#ECFCCB]/50" : isValidDate ? "bg-white hover:bg-slate-50/60" : "bg-slate-50/40 text-slate-300"
                        }`}
                      >
                        {isValidDate && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className={`text-[11px] font-bold ${
                                isToday ? "bg-[#84CC16] text-white w-5 h-5 rounded-full flex items-center justify-center font-black" : "text-slate-600"
                              }`}>
                                {dayNum}
                              </span>
                              {dayNum === 1 && <span className="text-[10px] text-slate-400 font-bold">Nov</span>}
                            </div>

                            {/* Scheduled Class Badges */}
                            {dayNum === 9 && (
                              <div className="mt-1.5 p-1 rounded bg-[#84CC16]/20 border border-[#84CC16]/40 text-[10px] text-[#365314] font-semibold truncate">
                                16:30 Little Lions (19)
                              </div>
                            )}
                            {dayNum === 10 && (
                              <div className="mt-1.5 p-1 rounded bg-blue-100 border border-blue-200 text-[10px] text-blue-900 font-semibold truncate">
                                17:45 Cadet Kumite (15)
                              </div>
                            )}
                            {dayNum === 11 && (
                              <div className="mt-1.5 p-1 rounded bg-purple-100 border border-purple-200 text-[10px] text-purple-900 font-semibold truncate">
                                18:30 Adult Shotokan (16)
                              </div>
                            )}
                            {dayNum === 28 && (
                              <div className="mt-1.5 p-1 rounded bg-amber-100 border border-amber-300 text-[10px] text-amber-900 font-bold truncate">
                                🏆 Q4 Belt Grading
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 5. ONLINE RESOURCES (Matching Screenshot 11)                */}
          {/* ----------------------------------------------------------- */}
          {activePage === "resources" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Online Resources & Curriculum Library</h3>
                  <p className="text-xs text-slate-500">Share grading syllabi, kata video links, and parent indemnity files</p>
                </div>
                <button
                  onClick={() => toast.success("Folder created in Shared Space")}
                  className="px-3 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs cursor-pointer"
                >
                  + Add Folder
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => toast.info("Opening Shared Space folder...")}
                  className="p-5 rounded-xl border border-slate-200 hover:border-[#84CC16] bg-slate-50/50 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="w-8 h-8 text-[#84CC16]" />
                    <div>
                      <strong className="block text-slate-900 font-bold text-sm">Shared Space</strong>
                      <span className="text-xs text-slate-400">Folders: 3, Files: 12</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div 
                  onClick={() => toast.info("Opening Nirvash Babuall private trainer folder...")}
                  className="p-5 rounded-xl border border-slate-200 hover:border-[#84CC16] bg-slate-50/50 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="w-8 h-8 text-blue-500" />
                    <div>
                      <strong className="block text-slate-900 font-bold text-sm">Nirvash Babuall</strong>
                      <span className="text-xs text-slate-400">Folders: 2, Files: 5</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 6. ACCOUNTS & INVOICES (Matching Screenshot 10)             */}
          {/* ----------------------------------------------------------- */}
          {activePage === "invoices" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-6 text-sm font-semibold">
                  <button className="text-[#84CC16] border-b-2 border-[#84CC16] pb-3 -mb-3 font-bold cursor-pointer">Invoices</button>
                  <button className="text-slate-500 hover:text-slate-800 pb-3 -mb-3 cursor-pointer">Accounts</button>
                  <button className="text-slate-500 hover:text-slate-800 pb-3 -mb-3 cursor-pointer">Transactions</button>
                </div>
                <button
                  onClick={() => setShowAddInvoiceModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> + Create Invoice
                </button>
              </div>

              {/* Invoices List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F8FAFC] text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-200">
                    <tr>
                      <th className="p-3">Invoice #</th>
                      <th className="p-3">Family Account</th>
                      <th className="p-3">Billing Period</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Amount (ZAR)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-800">{inv.invoiceNumber}</td>
                        <td className="p-3">
                          <strong className="block text-slate-900">{inv.familyName}</strong>
                          <span className="text-[11px] text-slate-400">{inv.studentNames.join(", ")}</span>
                        </td>
                        <td className="p-3 text-slate-600">{inv.billingPeriod}</td>
                        <td className="p-3 text-slate-600">{inv.dueDate}</td>
                        <td className="p-3 font-bold text-slate-900 text-sm">R {inv.totalZAR.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inv.status === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {inv.status !== "paid" ? (
                            <button
                              onClick={() => {
                                markInvoicePaid(inv.id, "eft");
                                toast.success(`Recorded payment for ${inv.invoiceNumber}`);
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                            >
                              Record Payment
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-bold">Paid on {inv.paidDate}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 7. PACKAGES (Matching Screenshot 15)                        */}
          {/* ----------------------------------------------------------- */}
          {activePage === "packages" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-6 text-sm font-semibold">
                  <button className="text-[#84CC16] border-b-2 border-[#84CC16] pb-3 -mb-3 font-bold cursor-pointer">Package Balances</button>
                  <button className="text-slate-500 hover:text-slate-800 pb-3 -mb-3 cursor-pointer">Templates</button>
                </div>
                <button
                  onClick={() => setShowAddPackageModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> + Add Package
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packagesList.map(pkg => (
                  <div key={pkg.id} className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{pkg.id}</span>
                      <span className="text-xs font-bold text-[#84CC16]">Active Plan</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{pkg.name}</h4>
                    <div className="text-xl font-black text-slate-900">R {pkg.priceZAR.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 pt-2 border-t">
                      Enrolled Athletes: <strong>{pkg.activeClientsCount}</strong>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 8. EXPENSES & OTHER REVENUE (Matching Screenshot 16)        */}
          {/* ----------------------------------------------------------- */}
          {activePage === "expenses" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Accrual ▼ summary for <strong className="text-[#84CC16]">November 2026 ▼</strong>
                  </h3>
                  <p className="text-xs text-slate-500">Financial Performance & Dojo Operations</p>
                </div>
                <button
                  onClick={() => setShowAddExpenseModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> + Add New
                </button>
              </div>

              {/* Accrual Financial Metrics & Line Chart (Screenshot 16) */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Summary Figures */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Training Tuition:</span>
                    <strong className="text-slate-900">R 42,850.00</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Other Revenue (Gear & Grading):</span>
                    <strong className="text-slate-900">R 5,800.00</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Expenses:</span>
                    <strong className="text-rose-600">R 20,200.00</strong>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-700">Net Income:</span>
                    <strong className="font-black text-emerald-600">R 28,450.00</strong>
                  </div>
                </div>

                {/* Line Graph (May 2026 - Feb 2027) */}
                <div className="lg:col-span-3 h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={expensesChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: "10px", fontSize: "11px", borderColor: "#CBD5E1" }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="net" name="Net Income" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="training" name="Training" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 9. MILEAGE LOG (Matching Screenshot 13)                     */}
          {/* ----------------------------------------------------------- */}
          {activePage === "mileage" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Mileage Log &gt; <strong className="text-[#84CC16]">Nirvash Babuall ▼</strong>
                  </h3>
                  <p className="text-xs text-slate-500">Track travel and transport expenses for official Dojo business</p>
                </div>
                <button
                  onClick={() => setShowAddMileageModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> + Add Mileage
                </button>
              </div>

              {/* Mileage Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F8FAFC] text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-200">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Distance (km)</th>
                      <th className="p-3">Rate (ZAR/km)</th>
                      <th className="p-3">Total Reimbursable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mileageLogs.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-600">{item.date}</td>
                        <td className="p-3 font-semibold text-slate-800">{item.purpose}</td>
                        <td className="p-3 text-slate-700">{item.km} km</td>
                        <td className="p-3 text-slate-600">R {item.rate.toFixed(2)}</td>
                        <td className="p-3 font-bold text-emerald-600">R {item.totalZAR.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 10. WEBSITE & WIDGETS (Matching Screenshot 8)               */}
          {/* ----------------------------------------------------------- */}
          {activePage === "website" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              <div className="border-b pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Website Setup & Online Widgets</h3>
                <p className="text-xs text-slate-500">Connect to lionmodekarate.com or embed real-time registration widgets</p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:border-[#84CC16] transition-colors cursor-pointer space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Step 1</span>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#84CC16]" />
                    <h4 className="font-bold text-slate-900 text-sm">I want to build a website</h4>
                  </div>
                  <p className="text-xs text-slate-500 pl-7">
                    Choose a template and set up your custom domain (app.lionmodekarate.com).
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:border-[#84CC16] transition-colors cursor-pointer space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Step 2</span>
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Use my existing site</h4>
                  </div>
                  <p className="text-xs text-slate-500 pl-7">
                    Edit your sign-up form and get HTML embed widgets for your existing website (lionmodekarate.com).
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 11. NEWS & BLOG POSTS (Matching Screenshot 17)              */}
          {/* ----------------------------------------------------------- */}
          {activePage === "news" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">News, Announcements & Blog Posts</h3>
                  <p className="text-xs text-slate-500">Publish articles and announcements directly to client portals</p>
                </div>
                <button
                  onClick={() => setShowAddNewsModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> + Add New Post
                </button>
              </div>

              <div className="space-y-3">
                {newsPosts.map(post => (
                  <div key={post.id} className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{post.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{post.title}</h4>
                    <p className="text-xs text-slate-600">{post.excerpt}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 12. BUSINESS REPORTS (Matching Screenshot 7)                */}
          {/* ----------------------------------------------------------- */}
          {activePage === "reports" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Business Reports & Analytics</h3>
                  <p className="text-xs text-slate-500">Customize and download reports to view revenue, attendance & client retention</p>
                </div>
                <button
                  onClick={() => toast.success("Generating Business Report PDF...")}
                  className="px-3.5 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> + Create Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Tuition Revenue & Accounts</h4>
                  <p className="text-xs text-slate-500">Total collected: R {totalPaidZAR.toLocaleString()}</p>
                  <button onClick={() => toast.success("Exported Accounts CSV")} className="text-xs font-bold text-[#84CC16] hover:underline cursor-pointer">
                    Export to Excel / CSV →
                  </button>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Attendance & Roll Call Stats</h4>
                  <p className="text-xs text-slate-500">Mat check-ins this week: {data.attendanceLogs.length}</p>
                  <button onClick={() => toast.success("Exported Attendance CSV")} className="text-xs font-bold text-[#84CC16] hover:underline cursor-pointer">
                    Export to Excel / CSV →
                  </button>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Client Retention (LEG)</h4>
                  <p className="text-xs text-slate-500">Average Engagement: 17.2 Months</p>
                  <button onClick={() => toast.success("Exported Retention CSV")} className="text-xs font-bold text-[#84CC16] hover:underline cursor-pointer">
                    Export to Excel / CSV →
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 13. MY PROFILE (1:1 with https://app.athletadesk.com/Teacher/v2/en/my-profile#General) */}
          {/* ----------------------------------------------------------- */}
          {activePage === "profile" && (
            <div className="space-y-6">
              
              {/* Profile Top Tab Navigation (Screenshot 3, 4, 5, 6) */}
              <div className="bg-white rounded-2xl border border-slate-200 px-6 pt-4 pb-0 shadow-xs">
                <div className="flex items-center gap-8 text-sm font-semibold border-b border-slate-200 overflow-x-auto">
                  {(["General", "Payroll", "Booking & Availability", "Reviews"] as const).map(tab => {
                    const active = activeProfileTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveProfileTab(tab);
                          window.location.hash = tab === "Booking & Availability" ? "Booking" : tab;
                        }}
                        className={`pb-3 border-b-2 font-bold cursor-pointer transition-colors whitespace-nowrap ${
                          active
                            ? "text-[#65A30D] border-[#84CC16]"
                            : "text-slate-500 hover:text-slate-800 border-transparent"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content Layout: Left User Card + Right Tab Panels */}
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                {/* --------------------------------------------------------- */}
                {/* Left Profile Card (Screenshot 9)                          */}
                {/* --------------------------------------------------------- */}
                <div className="w-full lg:w-72 bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4 shrink-0 shadow-xs">
                  {/* Avatar with Edit Badge */}
                  <div className="relative w-20 h-20 mx-auto">
                    {userProfile.avatar ? (
                      <img
                        src={userProfile.avatar}
                        alt="Nirvash Babuall"
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#84CC16] shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#E0F2FE] text-[#0369A1] font-black text-2xl flex items-center justify-center border-2 border-[#BAE6FD] shadow-xs">
                        NB
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setUserProfile(prev => ({ ...prev, avatar: reader.result as string }));
                              toast.success("Profile photo updated!");
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-600 hover:text-[#84CC16] hover:border-[#84CC16] flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                      title="Upload profile photo"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900">{userProfile.name}</h3>
                    <button
                      onClick={() => setShowEditBioModal(true)}
                      className="text-xs text-[#65A30D] hover:underline font-semibold block mx-auto mt-0.5 cursor-pointer"
                    >
                      {userProfile.bio ? "Edit Bio" : "Add Bio"}
                    </button>
                    {userProfile.bio && (
                      <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 px-2 italic">
                        "{userProfile.bio}"
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-center gap-1.5 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-slate-500">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>{userProfile.language}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <button
                      onClick={() => {
                        if (confirm("Log out of all other active sessions and devices?")) {
                          toast.success("All other sessions logged out successfully.");
                        }
                      }}
                      className="w-full py-2 px-3 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer transition-colors"
                    >
                      Log Out of All Devices
                    </button>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer transition-colors"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={() => setShowTwoFactorModal(true)}
                      className={`w-full py-2 px-3 rounded-lg border font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                        userProfile.twoFactorEnabled
                          ? "border-[#84CC16] bg-[#ECFCCB]/50 text-[#3F6212]"
                          : "border-[#84CC16] text-[#65A30D] hover:bg-[#ECFCCB]"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {userProfile.twoFactorEnabled ? "2-Factor Authenticated" : "Enable 2-Factor Authentication"}
                    </button>
                  </div>
                </div>

                {/* --------------------------------------------------------- */}
                {/* Right Tab Content Panels                                  */}
                {/* --------------------------------------------------------- */}
                <div className="flex-1 w-full space-y-6">

                  {/* ======================================================= */}
                  {/* TAB 1: GENERAL (Screenshots 5, 6, 9)                    */}
                  {/* ======================================================= */}
                  {activeProfileTab === "General" && (
                    <div className="space-y-6">
                      
                      {/* 1. Attendance Preferences (Screenshot 9) */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                          Attendance Preferences
                        </h4>

                        <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-700">
                          <input
                            type="checkbox"
                            checked={userProfile.overdueAttendance}
                            onChange={e => setUserProfile(prev => ({ ...prev, overdueAttendance: e.target.checked }))}
                            className="accent-[#84CC16] w-4 h-4 rounded cursor-pointer"
                          />
                          <span className="font-medium">Show overdue attendance on homepage</span>
                        </label>

                        {/* Default Notes View */}
                        <div className="space-y-2 text-xs pt-1">
                          <label className="font-bold text-slate-800 block">Default Notes View</label>
                          <div className="space-y-2 pl-1">
                            {(["Client", "Account Contact", "Private"] as const).map(option => (
                              <label key={option} className="flex items-center gap-2.5 cursor-pointer text-slate-700">
                                <input
                                  type="radio"
                                  name="notesView"
                                  value={option}
                                  checked={userProfile.defaultNotesView === option}
                                  onChange={() => setUserProfile(prev => ({ ...prev, defaultNotesView: option }))}
                                  className="accent-[#84CC16] w-4 h-4 cursor-pointer"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Session Notes */}
                        <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100">
                          <label className="font-bold text-slate-800 block">Session Notes</label>
                          <label className="flex items-center gap-3 cursor-pointer text-slate-700">
                            <input
                              type="checkbox"
                              checked={userProfile.autoCopySessionNotes}
                              onChange={e => setUserProfile(prev => ({ ...prev, autoCopySessionNotes: e.target.checked }))}
                              className="accent-[#84CC16] w-4 h-4 rounded cursor-pointer"
                            />
                            <span>Automatically copy session notes when I take attendance</span>
                          </label>

                          {userProfile.autoCopySessionNotes && (
                            <div className="pl-7 space-y-2 pt-1">
                              <label className="flex items-center gap-2.5 cursor-pointer text-slate-600">
                                <input
                                  type="radio"
                                  name="copyNotesMode"
                                  value="recent"
                                  checked={userProfile.copySessionNotesMode === "recent"}
                                  onChange={() => setUserProfile(prev => ({ ...prev, copySessionNotesMode: "recent" }))}
                                  className="accent-[#84CC16] w-3.5 h-3.5 cursor-pointer"
                                />
                                <span>Copy from most recent event</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer text-slate-600">
                                <input
                                  type="radio"
                                  name="copyNotesMode"
                                  value="category"
                                  checked={userProfile.copySessionNotesMode === "category"}
                                  onChange={() => setUserProfile(prev => ({ ...prev, copySessionNotesMode: "category" }))}
                                  className="accent-[#84CC16] w-3.5 h-3.5 cursor-pointer"
                                />
                                <span>Copy from same category only</span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 2. Email Notification Preferences (Screenshot 5) */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="border-b border-slate-100 pb-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            Email Notification Preferences
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Select which automatic notifications should be delivered to {userProfile.email}
                          </p>
                        </div>

                        <div className="space-y-3 text-xs text-slate-700 pt-1">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userProfile.emailNotifications.clientRegisters}
                              onChange={e => setUserProfile(prev => ({
                                ...prev,
                                emailNotifications: { ...prev.emailNotifications, clientRegisters: e.target.checked }
                              }))}
                              className="accent-[#84CC16] w-4 h-4 rounded mt-0.5 cursor-pointer"
                            />
                            <span>When one of my clients registers for a session/event through the Client Portal</span>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userProfile.emailNotifications.clientCancels}
                              onChange={e => setUserProfile(prev => ({
                                ...prev,
                                emailNotifications: { ...prev.emailNotifications, clientCancels: e.target.checked }
                              }))}
                              className="accent-[#84CC16] w-4 h-4 rounded mt-0.5 cursor-pointer"
                            />
                            <span>When one of my clients cancels a session/event through the Client Portal</span>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userProfile.emailNotifications.anyClientRegisters}
                              onChange={e => setUserProfile(prev => ({
                                ...prev,
                                emailNotifications: { ...prev.emailNotifications, anyClientRegisters: e.target.checked }
                              }))}
                              className="accent-[#84CC16] w-4 h-4 rounded mt-0.5 cursor-pointer"
                            />
                            <span>When any client registers for an open session/event through the Client Portal</span>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userProfile.emailNotifications.anyClientCancels}
                              onChange={e => setUserProfile(prev => ({
                                ...prev,
                                emailNotifications: { ...prev.emailNotifications, anyClientCancels: e.target.checked }
                              }))}
                              className="accent-[#84CC16] w-4 h-4 rounded mt-0.5 cursor-pointer"
                            />
                            <span>When any client cancels an open session/event through the Client Portal</span>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userProfile.emailNotifications.assignedSignUp}
                              onChange={e => setUserProfile(prev => ({
                                ...prev,
                                emailNotifications: { ...prev.emailNotifications, assignedSignUp: e.target.checked }
                              }))}
                              className="accent-[#84CC16] w-4 h-4 rounded mt-0.5 cursor-pointer"
                            />
                            <span>When a client assigned to me completes the sign-up form</span>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userProfile.emailNotifications.anySignUp}
                              onChange={e => setUserProfile(prev => ({
                                ...prev,
                                emailNotifications: { ...prev.emailNotifications, anySignUp: e.target.checked }
                              }))}
                              className="accent-[#84CC16] w-4 h-4 rounded mt-0.5 cursor-pointer"
                            />
                            <span>When any account contact or client completes the sign-up form</span>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userProfile.emailNotifications.remindersDisabled}
                              onChange={e => setUserProfile(prev => ({
                                ...prev,
                                emailNotifications: { ...prev.emailNotifications, remindersDisabled: e.target.checked }
                              }))}
                              className="accent-[#84CC16] w-4 h-4 rounded mt-0.5 cursor-pointer"
                            />
                            <span>When one of my clients disables session/event email reminders</span>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userProfile.emailNotifications.allowLogEmail}
                              onChange={e => setUserProfile(prev => ({
                                ...prev,
                                emailNotifications: { ...prev.emailNotifications, allowLogEmail: e.target.checked }
                              }))}
                              className="accent-[#84CC16] w-4 h-4 rounded mt-0.5 cursor-pointer"
                            />
                            <span>Allow clients to email me from their training log</span>
                          </label>
                        </div>
                      </div>

                      {/* 3. Email Daily Agenda (Screenshot 11.59.08 PM) */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              Email Daily Agenda
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Receive your daily schedule directly in your inbox every morning or the evening before.
                            </p>
                          </div>
                          <button
                            onClick={() => toast.success(`Agenda for Nirvash Babuall successfully sent to ${userProfile.email}!`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#84CC16] text-[#65A30D] hover:bg-[#ECFCCB] font-bold text-xs cursor-pointer self-start transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Send Agenda Now
                          </button>
                        </div>

                        <div className="space-y-2.5 text-xs text-slate-700 pt-1">
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="radio"
                              name="dailyAgenda"
                              value="dayBefore"
                              checked={userProfile.dailyAgenda === "dayBefore"}
                              onChange={() => setUserProfile(prev => ({ ...prev, dailyAgenda: "dayBefore" }))}
                              className="accent-[#84CC16] w-4 h-4 cursor-pointer"
                            />
                            <span>Day before (16:00 - 23:00)</span>
                          </label>
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="radio"
                              name="dailyAgenda"
                              value="sameDay"
                              checked={userProfile.dailyAgenda === "sameDay"}
                              onChange={() => setUserProfile(prev => ({ ...prev, dailyAgenda: "sameDay" }))}
                              className="accent-[#84CC16] w-4 h-4 cursor-pointer"
                            />
                            <span>Same day (00:00 - 15:00)</span>
                          </label>
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="radio"
                              name="dailyAgenda"
                              value="dontEmail"
                              checked={userProfile.dailyAgenda === "dontEmail"}
                              onChange={() => setUserProfile(prev => ({ ...prev, dailyAgenda: "dontEmail" }))}
                              className="accent-[#84CC16] w-4 h-4 cursor-pointer"
                            />
                            <span>Don't email</span>
                          </label>
                        </div>
                      </div>

                      {/* 4. Navigation Preferences (Screenshot 6) */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="border-b border-slate-100 pb-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            Navigation Preferences
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Pinned modules appear directly in your sidebar navigation menu.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-700 pt-1">
                          {[
                            { key: "resources", label: "Online Resources" },
                            { key: "packages", label: "Packages" },
                            { key: "expenses", label: "Expenses & Other Revenue" },
                            { key: "mileage", label: "Mileage Log" },
                            { key: "website", label: "Website" },
                            { key: "news", label: "News & Blog Posts" },
                            { key: "reports", label: "Business Reports" },
                          ].map(navItem => (
                            <label key={navItem.key} className="flex items-center gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(userProfile.pinnedNavigation as any)[navItem.key]}
                                onChange={e => {
                                  const checked = e.target.checked;
                                  setUserProfile(prev => ({
                                    ...prev,
                                    pinnedNavigation: {
                                      ...prev.pinnedNavigation,
                                      [navItem.key]: checked
                                    }
                                  }));
                                }}
                                className="accent-[#84CC16] w-4 h-4 rounded cursor-pointer"
                              />
                              <span className="font-medium">{navItem.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons for General Tab */}
                      <div className="flex justify-end gap-3 text-xs pt-2">
                        <button
                          onClick={() => toast.info("Changes discarded.")}
                          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          Discard
                        </button>
                        <button
                          onClick={() => toast.success("Profile preferences saved successfully!")}
                          className="px-6 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold shadow-xs cursor-pointer transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>

                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* TAB 2: PAYROLL (Screenshot 11.58.49 PM)                 */}
                  {/* ======================================================= */}
                  {activeProfileTab === "Payroll" && (
                    <div className="space-y-6">
                      
                      {/* Payroll Balance Header */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">
                            Balance Remaining:{" "}
                            <span className="text-[#65A30D]">
                              R
                              {userProfile.payrollEntries
                                .filter(e => e.status === "Pending")
                                .reduce((sum, e) => sum + e.amount, 0)
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                          </h3>
                          <span className="text-slate-500 text-sm">as of</span>
                          <select
                            value={payrollPeriod}
                            onChange={e => setPayrollPeriod(e.target.value)}
                            className="text-sm font-bold text-[#65A30D] bg-transparent border-none cursor-pointer focus:outline-none"
                          >
                            <option value="2026/11/30">2026/11/30 ▼</option>
                            <option value="2026/12/31">2026/12/31 ▼</option>
                            <option value="2027/01/31">2027/01/31 ▼</option>
                          </select>
                        </div>

                        {/* Right Action Toolbar (Columns, Sort, Search, Add Entry) */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <button
                            onClick={() => toast.info("Columns view configured.")}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 font-medium cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Columns</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </button>
                          <button
                            onClick={() => toast.info("Sorted by date (latest first).")}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 font-medium cursor-pointer"
                          >
                            <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                            <span>Sort</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </button>
                          <div className="relative">
                            <input
                              type="text"
                              value={payrollSearch}
                              onChange={e => setPayrollSearch(e.target.value)}
                              placeholder="Search..."
                              className="pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs w-32 focus:w-44 transition-all focus:outline-none focus:border-[#84CC16]"
                            />
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                          </div>
                          <button
                            onClick={() => setShowAddPayrollModal(true)}
                            className="px-4 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Payroll Entry
                          </button>
                        </div>
                      </div>

                      {/* Payroll Entries Display */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center min-h-[320px] flex items-center justify-center">
                        {userProfile.payrollEntries.length === 0 ? (
                          /* Exact AthletaDesk Empty State Illustration (Screenshot 11.58.49 PM) */
                          <div className="space-y-4 max-w-sm mx-auto">
                            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                              {/* Soft green abstract background blob */}
                              <div className="absolute inset-0 bg-[#ECFCCB]/70 rounded-3xl -rotate-6 transform scale-95" />
                              <div className="relative w-28 h-28 bg-[#84CC16] rounded-2xl shadow-lg p-3 flex flex-col justify-between">
                                {/* Calendar grid dots */}
                                <div className="grid grid-cols-3 gap-1.5 pt-1">
                                  <div className="w-3 h-3 rounded bg-white/40" />
                                  <div className="w-3 h-3 rounded bg-white/40" />
                                  <div className="w-3 h-3 rounded bg-white/40" />
                                  <div className="w-3 h-3 rounded bg-white/40" />
                                  <div className="w-3 h-3 rounded bg-white/40" />
                                  <div className="w-3 h-3 rounded bg-white/40" />
                                </div>
                                {/* Banknotes badge */}
                                <div className="w-10 h-10 rounded-xl bg-white text-[#65A30D] shadow-md flex items-center justify-center self-end -mr-2 -mb-2 border border-slate-100">
                                  <DollarSign className="w-6 h-6 stroke-[2.5]" />
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                                You haven't added any payroll entries yet
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">
                                Try adjusting the date period above or click Add Payroll Entry to record session coaching hours.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full text-left">
                            <table className="w-full text-xs">
                              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                <tr>
                                  <th className="p-3 text-left">Date</th>
                                  <th className="p-3 text-left">Description</th>
                                  <th className="p-3 text-right">Hours</th>
                                  <th className="p-3 text-right">Hourly Rate</th>
                                  <th className="p-3 text-right">Gross Pay</th>
                                  <th className="p-3 text-center">Status</th>
                                  <th className="p-3 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {userProfile.payrollEntries
                                  .filter(e => e.description.toLowerCase().includes(payrollSearch.toLowerCase()))
                                  .map(entry => (
                                    <tr key={entry.id} className="hover:bg-slate-50">
                                      <td className="p-3 font-semibold text-slate-900">{entry.date}</td>
                                      <td className="p-3 text-slate-700">{entry.description}</td>
                                      <td className="p-3 text-right text-slate-600">{entry.hours} hrs</td>
                                      <td className="p-3 text-right text-slate-600">R{entry.rate.toFixed(2)}</td>
                                      <td className="p-3 text-right font-bold text-slate-900">R{entry.amount.toFixed(2)}</td>
                                      <td className="p-3 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                          entry.status === "Paid"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                        }`}>
                                          {entry.status}
                                        </span>
                                      </td>
                                      <td className="p-3 text-right">
                                        {entry.status === "Pending" ? (
                                          <button
                                            onClick={() => {
                                              setUserProfile(prev => ({
                                                ...prev,
                                                payrollEntries: prev.payrollEntries.map(e => e.id === entry.id ? { ...e, status: "Paid" } : e)
                                              }));
                                              toast.success("Payroll entry marked as paid!");
                                            }}
                                            className="px-2.5 py-1 rounded bg-[#84CC16] text-white font-bold text-[10px] hover:bg-[#6ea017] cursor-pointer"
                                          >
                                            Mark Paid
                                          </button>
                                        ) : (
                                          <span className="text-slate-400 text-[10px] font-medium">Disbursed</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* TAB 3: BOOKING & AVAILABILITY (Screenshot 11.58.39 PM)   */}
                  {/* ======================================================= */}
                  {activeProfileTab === "Booking & Availability" && (
                    <div className="space-y-6">
                      
                      {/* Online Booking Preferences Card (Screenshot 11.58.39 PM) */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                        <div className="border-b border-slate-100 pb-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            Online Booking
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Adjust your scheduling preferences for sessions created through the online booking form
                          </p>
                        </div>

                        {/* Start Time Increments */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">
                            Start Time Increments <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={userProfile.onlineBooking.startTimeIncrements}
                            onChange={e => setUserProfile(prev => ({
                              ...prev,
                              onlineBooking: { ...prev.onlineBooking, startTimeIncrements: e.target.value }
                            }))}
                            className="w-full max-w-md p-2.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-[#84CC16] cursor-pointer"
                          >
                            <option value="15 minutes">15 minutes</option>
                            <option value="30 minutes">30 minutes</option>
                            <option value="45 minutes">45 minutes</option>
                            <option value="60 minutes">60 minutes</option>
                          </select>
                          <span className="text-[11px] text-slate-400 block">
                            Show available times in increments of
                          </span>
                        </div>

                        {/* Buffer Time */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800 block">
                            Buffer Time <span className="text-rose-500">*</span>
                          </label>
                          <div className="flex items-center w-full max-w-md rounded-lg border border-slate-200 overflow-hidden bg-white">
                            <input
                              type="number"
                              min="0"
                              max="120"
                              step="5"
                              value={userProfile.onlineBooking.bufferTimeMinutes}
                              onChange={e => setUserProfile(prev => ({
                                ...prev,
                                onlineBooking: { ...prev.onlineBooking, bufferTimeMinutes: parseInt(e.target.value) || 0 }
                              }))}
                              className="w-full p-2.5 text-xs text-slate-800 focus:outline-none"
                            />
                            <span className="px-3 text-xs text-slate-500 bg-slate-50 border-l border-slate-200">
                              minutes
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block">
                            Add a gap after a booked event between sessions
                          </span>
                        </div>

                        {/* Limit maximum gap checkbox */}
                        <div className="space-y-1 pt-1">
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
                            <input
                              type="checkbox"
                              checked={userProfile.onlineBooking.limitMaxGap}
                              onChange={e => setUserProfile(prev => ({
                                ...prev,
                                onlineBooking: { ...prev.onlineBooking, limitMaxGap: e.target.checked }
                              }))}
                              className="accent-[#84CC16] w-4 h-4 rounded cursor-pointer"
                            />
                            <span className="font-medium">Limit maximum gap between sessions</span>
                          </label>
                          <span className="text-[11px] text-slate-400 block pl-6">
                            Avoid excessive free time between bookings by restricting available slots
                          </span>
                        </div>

                        <div className="flex justify-end gap-3 text-xs pt-3 border-t border-slate-100">
                          <button
                            onClick={() => toast.info("Booking changes discarded.")}
                            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                          >
                            Discard
                          </button>
                          <button
                            onClick={() => toast.success("Online booking preferences saved!")}
                            className="px-5 py-2 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold shadow-xs cursor-pointer"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>

                      {/* Availability Hours Card (Screenshot 11.58.39 PM) */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              Availability
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Training availability can be entered to display on the trainer portal calendar and allow new clients to book their first session online.
                            </p>
                          </div>
                          <button
                            onClick={() => setShowAddAvailabilityModal(true)}
                            className="px-4 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add New
                          </button>
                        </div>

                        {/* Weekly Schedule Grid */}
                        <div className="divide-y divide-slate-100 text-xs">
                          {userProfile.weeklyAvailability.map((slot, idx) => (
                            <div key={slot.day} className="py-3 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 w-32">
                                <input
                                  type="checkbox"
                                  checked={slot.active}
                                  onChange={e => {
                                    const checked = e.target.checked;
                                    setUserProfile(prev => ({
                                      ...prev,
                                      weeklyAvailability: prev.weeklyAvailability.map((s, i) => i === idx ? { ...s, active: checked } : s)
                                    }));
                                  }}
                                  className="accent-[#84CC16] w-4 h-4 rounded cursor-pointer"
                                />
                                <span className={`font-semibold ${slot.active ? "text-slate-900" : "text-slate-400 line-through"}`}>
                                  {slot.day}
                                </span>
                              </div>

                              {slot.active ? (
                                <div className="flex items-center gap-2 text-slate-600">
                                  <input
                                    type="time"
                                    value={slot.start}
                                    onChange={e => {
                                      const val = e.target.value;
                                      setUserProfile(prev => ({
                                        ...prev,
                                        weeklyAvailability: prev.weeklyAvailability.map((s, i) => i === idx ? { ...s, start: val } : s)
                                      }));
                                    }}
                                    className="px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#84CC16]"
                                  />
                                  <span>to</span>
                                  <input
                                    type="time"
                                    value={slot.end}
                                    onChange={e => {
                                      const val = e.target.value;
                                      setUserProfile(prev => ({
                                        ...prev,
                                        weeklyAvailability: prev.weeklyAvailability.map((s, i) => i === idx ? { ...s, end: val } : s)
                                      }));
                                    }}
                                    className="px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#84CC16]"
                                  />
                                </div>
                              ) : (
                                <span className="text-slate-400 italic text-xs">Unavailable / Dojo Closed</span>
                              )}

                              <div className="w-24 text-right">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  slot.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                                }`}>
                                  {slot.active ? "Open for Booking" : "Closed"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* TAB 4: REVIEWS                                          */}
                  {/* ======================================================= */}
                  {activeProfileTab === "Reviews" && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            Client Reviews & Ratings
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Feedback left by enrolled athletes and guardians on the Client Portal
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} className="w-4 h-4 fill-amber-400" />
                            ))}
                          </div>
                          <span className="font-bold text-sm text-slate-900">5.0</span>
                          <span className="text-xs text-slate-400">({userProfile.reviews.length} Verified Reviews)</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {userProfile.reviews.map(review => (
                          <div key={review.id} className="p-4 rounded-xl border border-slate-100 bg-[#F8FAFC] space-y-2">
                            <div className="flex items-center justify-between">
                              <strong className="text-xs font-bold text-slate-900">{review.author}</strong>
                              <span className="text-[10px] text-slate-400">{review.date}</span>
                            </div>
                            <div className="flex text-amber-400">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                              ))}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                              "{review.text}"
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                          <input type="checkbox" defaultChecked className="accent-[#84CC16] w-4 h-4 rounded" />
                          <span>Publish 5-star reviews on public dojo booking website</span>
                        </label>
                        <button
                          onClick={() => toast.success("Review visibility updated!")}
                          className="px-4 py-2 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 14. BELTS & GRADING ENGINE (Dojo Extension)                 */}
          {/* ----------------------------------------------------------- */}
          {activePage === "grading" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Automated Belt Grading & Promotion Engine</h3>
                  <p className="text-xs text-slate-500">Evaluates minimum classes attended and time-in-grade eligibility</p>
                </div>
              </div>

              <div className="space-y-3">
                {data.students.map(student => {
                  const currentRankIdx = data.beltRanks.findIndex(r => r.rank === student.beltRank);
                  const nextRank = data.beltRanks[currentRankIdx + 1];

                  return (
                    <div key={student.id} className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={student.photoURL} alt="" className="w-10 h-10 rounded-full object-cover border" />
                        <div>
                          <strong className="text-slate-900 block font-bold text-sm">{student.firstName} {student.lastName}</strong>
                          <span className="text-slate-500">{student.rankLevel} → Next: {nextRank?.name || "Dan Level"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Attended</span>
                          <strong className="text-slate-800">{student.classesAttendedAtCurrentBelt} / {student.requiredClassesForNextBelt}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            student.isGradingEligible ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {student.isGradingEligible ? "Ready for Promotion" : "Incomplete"}
                          </span>
                        </div>
                      </div>

                      {nextRank && student.isGradingEligible && (
                        <button
                          onClick={async () => {
                            await promoteStudentBelt(student.id, nextRank.rank);
                            setShowCertificateModal({ student, rank: nextRank.name });
                            toast.success(`Promoted ${student.firstName} to ${nextRank.name}!`);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#84CC16] to-[#65A30D] text-white font-bold shadow-xs cursor-pointer uppercase text-xs"
                        >
                          Promote Belt
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 15. RECEPTION MAT KIOSK (Dojo Extension)                    */}
          {/* ----------------------------------------------------------- */}
          {activePage === "kiosk" && (
            <div className="bg-[#1A232A] rounded-3xl p-8 text-white max-w-lg mx-auto text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-[#84CC16] flex items-center justify-center text-black font-black text-2xl mx-auto shadow-md">
                LM
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase tracking-wider text-white">Reception Mat Check-In</h3>
                <p className="text-xs text-slate-400 mt-1">Enter your Member ID or Student PIN to roll call</p>
              </div>

              <form onSubmit={handleKioskCheckIn} className="space-y-4">
                <input
                  type="text"
                  placeholder="e.g. LMK-2024-001"
                  value={kioskPinInput}
                  onChange={e => setKioskPinInput(e.target.value)}
                  className="w-full text-center text-xl font-mono tracking-widest py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-[#84CC16] outline-none"
                />

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#84CC16] hover:bg-[#6ea017] text-white font-black uppercase tracking-wider text-sm shadow-md cursor-pointer transition-colors"
                >
                  Confirm Mat Roll Call
                </button>
              </form>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 16. BROADCAST MESSAGING (Dojo Extension)                    */}
          {/* ----------------------------------------------------------- */}
          {activePage === "messaging" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="border-b pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Multi-Channel Broadcast Composer</h3>
                <p className="text-xs text-slate-500">Dispatch Push Notifications, Email Blasts & SMS to enrolled clients</p>
              </div>

              <div className="space-y-4 max-w-xl text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Delivery Channel</label>
                    <select
                      value={broadcastForm.channel}
                      onChange={e => setBroadcastForm({ ...broadcastForm, channel: e.target.value as any })}
                      className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                    >
                      <option value="email">Email Blast</option>
                      <option value="sms">SMS Text Message</option>
                      <option value="whatsapp">WhatsApp Business</option>
                      <option value="in_app">In-App Push Notification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Recipient Group</label>
                    <select
                      value={broadcastForm.recipientFilter}
                      onChange={e => setBroadcastForm({ ...broadcastForm, recipientFilter: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                    >
                      <option>All Active Clients (28)</option>
                      <option>Parents & Guardians (22)</option>
                      <option>Overdue Accounts (2)</option>
                      <option>Grading Candidates (3)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Subject</label>
                  <input
                    type="text"
                    value={broadcastForm.subject}
                    onChange={e => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Message Body</label>
                  <textarea
                    rows={4}
                    value={broadcastForm.body}
                    onChange={e => setBroadcastForm({ ...broadcastForm, body: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                  />
                </div>

                <button
                  onClick={async () => {
                    await sendMessage({
                      subject: broadcastForm.subject,
                      body: broadcastForm.body,
                      channel: broadcastForm.channel,
                      recipientFilter: broadcastForm.recipientFilter,
                      recipientCount: 28,
                      status: "delivered"
                    });
                    toast.success(`Dispatched ${broadcastForm.channel.toUpperCase()} to ${broadcastForm.recipientFilter}!`);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold uppercase text-xs shadow-xs cursor-pointer"
                >
                  Send Broadcast
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ============================================================= */}
      {/* GETTING STARTED GUIDE MODAL (Matching Screenshot 2)           */}
      {/* ============================================================= */}
      {showGettingStartedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200 text-slate-800">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-xl text-slate-900 tracking-tight">Getting Started Guide</h3>
              <button onClick={() => setShowGettingStartedModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-bold text-slate-800 text-sm">Let's get you set up</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded font-bold">1 of 3 completed</span>
              </div>

              {/* Step 1 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <strong className="block text-slate-900">Create an Account</strong>
                  <span className="text-slate-500">Welcome aboard, Nirvash!</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#84CC16]" />
              </div>

              {/* Step 2 */}
              <div 
                onClick={() => {
                  setShowGettingStartedModal(false);
                  setShowAddClientModal(true);
                }}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-[#84CC16] bg-white flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <strong className="block text-slate-900">Add a Client</strong>
                  <span className="text-slate-500">Add a client so you can start scheduling sessions.</span>
                </div>
                <Users className="w-5 h-5 text-slate-400" />
              </div>

              {/* Step 3 */}
              <div 
                onClick={() => {
                  setShowGettingStartedModal(false);
                  setShowAddEventModal(true);
                }}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-[#84CC16] bg-white flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <strong className="block text-slate-900">Schedule a Session</strong>
                  <span className="text-slate-500">Set up a session and we'll handle the charges for you automatically.</span>
                </div>
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>

              {/* Explore Additional Features (Screenshot 2) */}
              <div className="pt-3 border-t space-y-2">
                <span className="font-bold text-slate-800 block text-xs">Explore Additional Features</span>
                <div className="grid grid-cols-2 gap-2 text-slate-600 font-medium text-[11px]">
                  <button onClick={() => { setShowGettingStartedModal(false); setActivePage("invoices"); }} className="text-left hover:text-[#84CC16] cursor-pointer">
                    • View Account Accounts
                  </button>
                  <button onClick={() => { setShowGettingStartedModal(false); setActivePage("invoices"); }} className="text-left hover:text-[#84CC16] cursor-pointer">
                    • Create an Invoice
                  </button>
                  <button onClick={() => { setShowGettingStartedModal(false); setActivePage("trainers"); }} className="text-left hover:text-[#84CC16] cursor-pointer">
                    • Add a Trainer
                  </button>
                  <button onClick={() => { setShowGettingStartedModal(false); setActivePage("website"); }} className="text-left hover:text-[#84CC16] cursor-pointer">
                    • Create a Website or Widgets
                  </button>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setShowGettingStartedModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD CLIENT FORM                                        */}
      {/* ============================================================= */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Add New Client</h3>
              <button onClick={() => setShowAddClientModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">First Name</label>
                  <input
                    type="text"
                    value={newClientForm.firstName}
                    onChange={e => setNewClientForm({ ...newClientForm, firstName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                    placeholder="Liam"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newClientForm.lastName}
                    onChange={e => setNewClientForm({ ...newClientForm, lastName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                    placeholder="Botha"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newClientForm.dob}
                    onChange={e => setNewClientForm({ ...newClientForm, dob: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Program</label>
                  <select
                    value={newClientForm.trainingProgram}
                    onChange={e => setNewClientForm({ ...newClientForm, trainingProgram: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                  >
                    <option>Little Lions (Ages 8–12)</option>
                    <option>Lionmode Kids (Ages 3–8)</option>
                    <option>Lionmode Teens (Ages 13–18)</option>
                    <option>Adult Traditional Karate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Medical / Physical Notes</label>
                <textarea
                  rows={2}
                  value={newClientForm.medicalNotes}
                  onChange={e => setNewClientForm({ ...newClientForm, medicalNotes: e.target.value })}
                  placeholder="Allergies, chronic conditions, injuries"
                  className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newClientForm.signedWaiver}
                  onChange={e => setNewClientForm({ ...newClientForm, signedWaiver: e.target.checked })}
                  className="accent-[#84CC16] w-4 h-4"
                />
                <span className="text-slate-700 font-medium">Digital Indemnity Waiver On File</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddClientModal(false)} className="px-4 py-2 text-slate-500 font-bold text-xs uppercase cursor-pointer">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newClientForm.firstName || !newClientForm.lastName) {
                    toast.error("Please provide first and last name.");
                    return;
                  }
                  await addStudent({
                    firstName: newClientForm.firstName,
                    lastName: newClientForm.lastName,
                    dob: newClientForm.dob,
                    trainingProgram: newClientForm.trainingProgram,
                    medicalInfo: {
                      conditions: newClientForm.medicalNotes,
                      allergies: "None",
                      injuries: "None",
                      signedWaiver: newClientForm.signedWaiver
                    },
                    unsignedWaiver: !newClientForm.signedWaiver
                  });
                  toast.success(`Added ${newClientForm.firstName} ${newClientForm.lastName}!`);
                  setShowAddClientModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs uppercase cursor-pointer"
              >
                Save Client
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD EVENT / SESSION FORM                               */}
      {/* ============================================================= */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Schedule New Session / Event</h3>
              <button onClick={() => setShowAddEventModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Session Title</label>
                <input
                  type="text"
                  value={newEventForm.title}
                  onChange={e => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  placeholder="e.g. Kata & Kumite Session"
                  className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Trainer</label>
                  <select
                    value={newEventForm.trainer}
                    onChange={e => setNewEventForm({ ...newEventForm, trainer: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                  >
                    <option>Nirvash Babuall</option>
                    <option>Coach Sarah Jenkins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newEventForm.startTime}
                    onChange={e => setNewEventForm({ ...newEventForm, startTime: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Location / Tatami Hall</label>
                <input
                  type="text"
                  value={newEventForm.location}
                  onChange={e => setNewEventForm({ ...newEventForm, location: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAddEventModal(false)} className="px-4 py-2 text-slate-500 font-bold text-xs uppercase cursor-pointer">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newEventForm.title) {
                    toast.error("Please enter a session title.");
                    return;
                  }
                  await addClass({
                    title: newEventForm.title,
                    startTime: newEventForm.startTime,
                    instructorName: newEventForm.trainer,
                    venue: newEventForm.location
                  });
                  toast.success(`Scheduled ${newEventForm.title}!`);
                  setShowAddEventModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs uppercase cursor-pointer"
              >
                Confirm Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* DETAILED CLIENT PROFILE DOSSIER (Matching Wodify screenshot) */}
      {/* ============================================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200 text-slate-800 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img
                    src={selectedStudent.photoURL}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#84CC16] shadow-sm"
                  />
                  <button
                    onClick={() => triggerUploadPhoto(selectedStudent.id)}
                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                    title="Change Photo"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                  <span className="text-xs text-slate-500 font-mono">Member ID: {selectedStudent.studentIdCode}</span>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedStudent.beltColor }} />
                    <span className="font-semibold text-slate-700">{selectedStudent.rankLevel}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedStudent(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Unsigned Waiver Warning Banner (Wodify Adrian Brody style) */}
            {selectedStudent.unsignedWaiver && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span><strong>Unsigned waivers:</strong> Client has not signed digital indemnity form</span>
                </div>
                <button
                  onClick={() => toast.success(`Indemnity waiver sent to client via email`)}
                  className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] cursor-pointer"
                >
                  Email waivers to client
                </button>
              </div>
            )}

            {/* Tags & Physical Notes */}
            <div className="space-y-3 text-xs">
              <div>
                <strong className="block text-slate-500 uppercase text-[10px] font-bold mb-1">Tags</strong>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                      {tag}
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const tag = prompt("Enter tag name (e.g. INJURY, AUTO-PAY, COMPETITOR):");
                      if (tag) {
                        updateStudent(selectedStudent.id, { tags: [...selectedStudent.tags, tag.toUpperCase()] });
                        setSelectedStudent(prev => prev ? { ...prev, tags: [...prev.tags, tag.toUpperCase()] } : null);
                        toast.success("Tag added");
                      }
                    }}
                    className="px-2 py-1 rounded-md border border-dashed border-[#84CC16] text-[#65A30D] font-bold hover:bg-[#ECFCCB]/30 cursor-pointer"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 space-y-1">
                <strong className="block text-slate-700 font-bold text-[11px]">Notes & Physical Scaling</strong>
                <p className="text-slate-600">{selectedStudent.physicalNotes || selectedStudent.medicalInfo.conditions || "Scale all exercises... recent hip surgery"}</p>
              </div>

              {/* Attendance and Streak */}
              <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Streak</span>
                  <strong className="text-base text-amber-600 font-bold">{selectedStudent.currentStreak} Classes</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Classes Attended</span>
                  <strong className="text-base text-slate-800 font-bold">{selectedStudent.classesAttendedAtCurrentBelt}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">For Next Belt</span>
                  <strong className="text-base text-[#84CC16] font-bold">{selectedStudent.requiredClassesForNextBelt}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <button
                onClick={() => {
                  deleteStudent(selectedStudent.id);
                  setSelectedStudent(null);
                  toast.success("Client deleted from system.");
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
              >
                Delete Client
              </button>

              <button
                onClick={() => {
                  updateStudent(selectedStudent.id, selectedStudent);
                  setSelectedStudent(null);
                  toast.success("Client profile updated!");
                }}
                className="px-5 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold text-xs uppercase cursor-pointer"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* PROFILE MODALS: BIO, PASSWORD, 2FA, PAYROLL, AVAILABILITY     */}
      {/* ============================================================= */}

      {/* 1. Edit Bio Modal */}
      {showEditBioModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Trainer Biography</h3>
              <button
                onClick={() => setShowEditBioModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">About Nirvash Babuall</label>
              <textarea
                rows={5}
                value={bioInput}
                onChange={e => setBioInput(e.target.value)}
                placeholder="Write a brief professional overview of your martial arts experience..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#84CC16]"
              />
              <span className="text-[11px] text-slate-400 block">
                This bio is displayed to students and guardians in the Client Portal.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowEditBioModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setUserProfile(prev => ({ ...prev, bio: bioInput }));
                  setShowEditBioModal(false);
                  toast.success("Biography updated successfully!");
                }}
                className="px-5 py-2 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold cursor-pointer"
              >
                Save Bio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#65A30D]" />
                <h3 className="font-bold text-sm text-slate-900">Change Account Password</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#84CC16]"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter minimum 8 characters"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#84CC16]"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#84CC16]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
                    toast.error("New password must be at least 6 characters.");
                    return;
                  }
                  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                    toast.error("Passwords do not match.");
                    return;
                  }
                  setShowPasswordModal(false);
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  toast.success("Password changed successfully!");
                }}
                className="px-5 py-2 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Two-Factor Authentication Modal */}
      {showTwoFactorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#65A30D]" />
                <h3 className="font-bold text-sm text-slate-900">Two-Factor Authentication (2FA)</h3>
              </div>
              <button
                onClick={() => setShowTwoFactorModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p>
                Two-Factor Authentication adds an extra layer of security to your AthletaDesk and Lion Mode account.
              </p>

              {userProfile.twoFactorEnabled ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>2FA is currently active for {userProfile.email}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Your account requires a temporary passcode from your authenticator app on sign in.
                  </p>
                  <button
                    onClick={() => {
                      setUserProfile(prev => ({ ...prev, twoFactorEnabled: false }));
                      setShowTwoFactorModal(false);
                      toast.info("Two-Factor Authentication has been disabled.");
                    }}
                    className="w-full py-2 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs cursor-pointer"
                  >
                    Disable 2-Factor Authentication
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-28 h-28 mx-auto bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white text-[10px] tracking-widest font-mono">
                        [ 2FA QR KEY ]
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 block">
                        Secret: <strong className="text-slate-800">LMKA-NB94-ATHL-DESK</strong>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Enter 6-Digit Authenticator Passcode
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 548921"
                      className="w-full p-2.5 text-center tracking-widest font-mono text-base rounded-lg border border-slate-200 focus:outline-none focus:border-[#84CC16]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => setShowTwoFactorModal(false)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (twoFactorCode.length < 6) {
                          toast.error("Please enter a valid 6-digit passcode.");
                          return;
                        }
                        setUserProfile(prev => ({ ...prev, twoFactorEnabled: true }));
                        setShowTwoFactorModal(false);
                        setTwoFactorCode("");
                        toast.success("Two-Factor Authentication activated!");
                      }}
                      className="px-5 py-2 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold cursor-pointer"
                    >
                      Verify & Activate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Add Payroll Entry Modal */}
      {showAddPayrollModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Add Instructor Payroll Entry</h3>
              <button
                onClick={() => setShowAddPayrollModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={newPayrollForm.date}
                  onChange={e => setNewPayrollForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#84CC16]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Class</label>
                <input
                  type="text"
                  value={newPayrollForm.description}
                  onChange={e => setNewPayrollForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Kata Masterclass, Private Coaching"
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#84CC16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hours</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={newPayrollForm.hours}
                    onChange={e => setNewPayrollForm(prev => ({ ...prev, hours: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hourly Rate (ZAR)</label>
                  <input
                    type="number"
                    value={newPayrollForm.rate}
                    onChange={e => setNewPayrollForm(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Calculated Gross Pay:</span>
                <strong className="text-sm font-bold text-slate-900">
                  R{(newPayrollForm.hours * newPayrollForm.rate).toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowAddPayrollModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const entry = {
                    id: `PAY-${Date.now()}`,
                    date: newPayrollForm.date,
                    description: newPayrollForm.description,
                    hours: newPayrollForm.hours,
                    rate: newPayrollForm.rate,
                    amount: newPayrollForm.hours * newPayrollForm.rate,
                    status: "Pending" as const
                  };
                  setUserProfile(prev => ({
                    ...prev,
                    payrollEntries: [entry, ...prev.payrollEntries]
                  }));
                  setShowAddPayrollModal(false);
                  toast.success("Payroll entry added!");
                }}
                className="px-5 py-2 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold cursor-pointer"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add Availability Slot Modal */}
      {showAddAvailabilityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Add Availability Schedule</h3>
              <button
                onClick={() => setShowAddAvailabilityModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Day of Week</label>
                <select
                  value={newAvailabilityForm.day}
                  onChange={e => setNewAvailabilityForm(prev => ({ ...prev, day: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#84CC16]"
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newAvailabilityForm.start}
                    onChange={e => setNewAvailabilityForm(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={newAvailabilityForm.end}
                    onChange={e => setNewAvailabilityForm(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowAddAvailabilityModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setUserProfile(prev => ({
                    ...prev,
                    weeklyAvailability: prev.weeklyAvailability.map(s =>
                      s.day === newAvailabilityForm.day
                        ? { ...s, active: true, start: newAvailabilityForm.start, end: newAvailabilityForm.end }
                        : s
                    )
                  }));
                  setShowAddAvailabilityModal(false);
                  toast.success(`Availability updated for ${newAvailabilityForm.day}!`);
                }}
                className="px-5 py-2 rounded-lg bg-[#84CC16] hover:bg-[#6ea017] text-white font-bold cursor-pointer"
              >
                Save Availability
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
