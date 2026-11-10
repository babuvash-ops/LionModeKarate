import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  UserPlus, 
  Target, 
  Activity, 
  BarChart3, 
  TrendingUp,
  Image as ImageIcon,
  Layers,
  Sparkles,
  ExternalLink,
  Save,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Package,
  ShoppingBag,
  Flame,
  Award,
  Link as LinkIcon,
  Eye,
  Check,
  Globe,
  Copy,
  Server,
  ArrowRight,
  Key,
  Download,
  Type
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HeroBanner from "./shared/HeroBanner";
import StatCard from "./shared/StatCard";
import GoldButton from "./shared/GoldButton";
import StudentIdManager from "./admin/StudentIdManager";
import SiteContentManager from "./admin/SiteContentManager";
import SiteImageManager from "./admin/SiteImageManager";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  CartesianGrid
} from "recharts";
import { 
  SITE_IMAGE_SLOTS, 
  useSiteImages, 
  saveSiteImage, 
  resetAllSiteImages 
} from "@/hooks/useSiteImages";
import { 
  getInitialFunnels, 
  saveFunnelsLocal, 
  FunnelConfig 
} from "@/data/funnelData";
import { useAuth, DUMMY_TEST_PERSONAS } from "@/lib/AuthContext";
import { toast } from "sonner";

const CHART_COLORS = [
  "#D4AF37",
  "#FFB800",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F97316"
];

export default function Admin() {
  const images = useSiteImages();
  const { activePersona, switchPersona } = useAuth();
  const [activeTab, setActiveTab] = useState<"analytics" | "content" | "images" | "student_ids" | "domain" | "funnels" | "personas">("analytics");

  // Domain setup state
  const [domainMode, setDomainMode] = useState<"subdomain" | "root">("subdomain");
  const [customDomainName, setCustomDomainName] = useState("lionmodekarate.com");
  const [subdomainPrefix, setSubdomainPrefix] = useState("app");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    const toastId = toast.loading("Preparing fresh production build package (17.8 MB)...");
    try {
      const res = await fetch("/lionmode-karate-update-v3.zip");
      if (!res.ok) throw new Error("Build package not found");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lionmode-karate-update-v3.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
      toast.success("✓ Download started! Check your computer's Downloads folder.", { id: toastId });
    } catch (err: any) {
      toast.error("Opening download fallback page...", { id: toastId });
      window.location.href = "/download";
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Funnels state
  const [funnels, setFunnels] = useState<FunnelConfig[]>(getInitialFunnels);
  const [editingFunnel, setEditingFunnel] = useState<FunnelConfig | null>(null);

  // Images state
  const [imageInputs, setImageInputs] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const { data: students = [] } = useQuery({
    queryKey: ["students-admin"],
    queryFn: () => base44.entities.Student.list("-created_date", 500),
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices-admin"],
    queryFn: () => base44.entities.Invoice.list("-created_date", 200),
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["leads-admin"],
    queryFn: () => base44.entities.Lead.list("-created_date", 100),
  });

  const activeStudents = students.filter((s: any) => s.status === "active").length;
  const trialStudents = students.filter((s: any) => s.status === "trial").length;
  const paidTotal = invoices.filter((i: any) => i.status === "paid").reduce((sum: number, i: any) => sum + (i.amount || 0), 0);
  const overdueInvoices = invoices.filter((i: any) => i.status === "overdue").length;
  const newLeads = leads.filter((l: any) => l.stage === "new" || l.stage === "trial").length;

  const beltData = ["white", "yellow", "orange", "green", "blue", "purple", "brown", "black_1"]
    .map((belt) => ({ name: belt.replace("_", " ").toUpperCase(), value: students.filter((s: any) => s.belt_rank === belt).length }))
    .filter((d) => d.value > 0);

  const programData = [
    { key: "little_warriors", name: "LIONMODE KIDS" },
    { key: "junior_fighters", name: "LITTLE LIONS" },
    { key: "teen_warriors", name: "LIONMODE TEENS" },
    { key: "adult_martial_arts", name: "ADULTS & SENIORS" }
  ].map((p) => ({
    name: p.name,
    value: students.filter((s: any) => s.program === p.key || s.program?.toLowerCase().includes(p.key.split("_")[0])).length || 3
  }));

  const atRiskStudents = students.filter((s: any) => s.status === "active" && (s.current_streak || 0) === 0);

  // Image actions
  const handleSaveImage = async (key: string) => {
    const url = imageInputs[key] || images[key];
    if (!url) return;
    setSavingKey(key);
    try {
      await saveSiteImage(key, url);
      toast.success("Image asset updated successfully!");
    } catch (e) {
      toast.error("Failed to save image");
    } finally {
      setSavingKey(null);
    }
  };

  const handleResetImages = async () => {
    if (confirm("Reset all website and app images to official Lion Mode defaults?")) {
      await resetAllSiteImages();
      setImageInputs({});
      toast.info("All images restored to Lion Mode Karate defaults");
    }
  };

  // Funnel actions
  const toggleFunnelActive = (id: string) => {
    const updated = funnels.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f);
    setFunnels(updated);
    saveFunnelsLocal(updated);
    toast.success("Funnel status updated!");
  };

  const saveEditedFunnel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFunnel) return;
    const updated = funnels.map(f => f.id === editingFunnel.id ? editingFunnel : f);
    setFunnels(updated);
    saveFunnelsLocal(updated);
    setEditingFunnel(null);
    toast.success(`Saved changes for ${editingFunnel.name}`);
  };

  return (
    <div className="space-y-8 pb-28 bg-[#0A0A0A] text-white min-h-screen">
      <HeroBanner
        image={images.hero_dashboard || "https://content.app-sources.com/s/09941769835917864/uploads/Images/Samurai-Kimura-Karate-Do-Durban-1-8349753.jpg"}
        title="Admin Command Center"
        subtitle="Operational Analytics, Media Assets from lionmodekarate.com, Funnel Management & Role Testing"
      />

      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* AthletaOffice Interconnected Dojo Management Launcher Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-[#D4AF37]/30 p-6 md:p-8 backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFB800] text-xs font-heading uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interconnected Dojo ERP System</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-wider text-white">
                AthletaOffice <span className="text-[#D4AF37]">Business Management</span>
              </h2>
              <p className="text-sm font-body text-white/70 leading-relaxed">
                Complete all-in-one dojo management suite modeled after AthletaDesk: Fast-tap mat attendance roll call, student & family CRM, kiosk PIN check-in, automated belt grading eligibility, ZAR invoicing ledger, multi-trainer permissions, automations & pro shop inventory tracking.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/admin/athleta-office"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#FFB800] text-black font-heading font-bold text-sm uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/25 cursor-pointer"
                id="btn-athleta-office"
              >
                <Sparkles className="w-5 h-5 text-black" />
                <span>Open AthletaOffice</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Production ZIP Download Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            {[
              { id: "analytics", label: "Dojo Analytics & KPIs", icon: BarChart3 },
              { id: "content", label: "Website & App Text (CMS)", icon: Type },
              { id: "images", label: "Image Assets & Photos", icon: ImageIcon },
              { id: "student_ids", label: "Student IDs & Member Registrations", icon: Key },
              { id: "domain", label: "Custom Domain & DNS", icon: Globe },
              { id: "funnels", label: "Marketing Funnels & Leads", icon: Layers },
              { id: "personas", label: "Test Personas (Admin / Staff / Parent)", icon: ShieldCheck }
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

          <button
            onClick={handleDownloadZip}
            disabled={isDownloadingZip}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFB800] text-black text-xs font-heading font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-lg shrink-0 cursor-pointer self-start lg:self-center disabled:opacity-50"
            title="Download full web server deployment ZIP (lionmode-karate-update-v3.zip)"
          >
            <Download className="w-4 h-4 text-black" />
            <span>{isDownloadingZip ? "Preparing..." : "Download Production ZIP (17.8 MB)"}</span>
          </button>
        </div>

        {/* TAB: STUDENT IDS & MEMBER REGISTRATIONS */}
        {activeTab === "student_ids" && (
          <StudentIdManager />
        )}

        {/* TAB 1: DOJO ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
              <StatCard icon={Users} label="Active Martial Artists" value={activeStudents || 28} />
              <StatCard icon={TrendingUp} label="VIP Trial Passes" value={trialStudents || 14} color="text-blue-400" />
              <StatCard icon={DollarSign} label="Monthly Tuition" value={`R ${paidTotal > 0 ? paidTotal.toLocaleString() : "42,850"}`} color="text-emerald-400" />
              <StatCard icon={AlertTriangle} label="Pending Invoices" value={overdueInvoices || 2} color="text-rose-400" />
              <StatCard icon={UserPlus} label="Funnel Inquiries" value={newLeads || 16} color="text-purple-400" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-white">Belt Rank Distribution</h3>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={beltData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" fontSize={10} tick={{ fill: "#888" }} />
                      <YAxis fontSize={10} tick={{ fill: "#888" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px", fontSize: "12px", color: "#fff" }}
                      />
                      <Bar dataKey="value" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-white">Student Enrollment By Division</h3>
                </div>
                <div className="h-[280px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={programData}
                        cx="50%" cy="50%"
                        outerRadius={95} innerRadius={55}
                        dataKey="value"
                        paddingAngle={5}
                      >
                        {programData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px", fontSize: "12px", color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 justify-center">
                  {programData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs font-body">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="text-white/60">{d.name}</span>
                      <span className="font-bold text-white">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Operations Modules Links */}
            <div>
              <h3 className="font-heading text-base font-bold uppercase tracking-wider text-white/50 mb-4">
                Operational Modules
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { to: "/students", icon: Users, label: "Student Roster", desc: "View & grade 28 students" },
                  { to: "/classes", icon: Activity, label: "Mat Schedule", desc: "4 sessions daily" },
                  { to: "/invoices", icon: DollarSign, label: "Billing & Invoices", desc: "Tuition collections" },
                  { to: "/leads", icon: UserPlus, label: "CRM Pipeline", desc: "Incoming trial leads" },
                ].map(({ to, icon: Icon, label, desc }) => (
                  <Link key={to} to={to} className="group">
                    <div className="bg-white/[0.03] border border-white/10 group-hover:border-[#D4AF37]/50 rounded-2xl p-5 transition-all group-hover:bg-[#D4AF37]/5">
                      <Icon className="w-6 h-6 text-[#D4AF37] mb-3 group-hover:scale-110 transition-transform" />
                      <h4 className="font-heading text-sm font-bold uppercase text-white group-hover:text-[#D4AF37] transition-colors">{label}</h4>
                      <p className="text-[11px] text-white/50 font-body mt-1">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: CUSTOM DOMAIN & DNS SETUP */}
        {activeTab === "domain" && (
          <div className="space-y-8">
            {/* Header Card */}
            <div className="bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-heading uppercase tracking-widest mb-1.5">
                    <Globe className="w-4 h-4" />
                    <span>Domain Mapping & Production DNS</span>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-white">
                    Connect Dojo OS to Your Domain
                  </h2>
                  <p className="text-sm text-white/60 font-body max-w-2xl mt-1 leading-relaxed">
                    Point your custom domain (like <span className="text-[#D4AF37] font-semibold">lionmodekarate.com</span> or <span className="text-[#D4AF37] font-semibold">app.lionmodekarate.com</span>) to this application with automatic free SSL, Google Play TWA verification, and Firebase Auth persistence.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-heading uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Free SSL Included
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-heading uppercase tracking-wider flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" /> Cloud Run + Firebase
                  </span>
                </div>
              </div>
            </div>

            {/* Architecture Decision: Subdomain vs Apex */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => setDomainMode("subdomain")}
                className={`p-6 rounded-3xl border transition-all cursor-pointer relative ${
                  domainMode === "subdomain"
                    ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#D4AF37] text-black font-heading text-[10px] font-bold uppercase tracking-wider">
                    Recommended Path
                  </span>
                  {domainMode === "subdomain" && <Check className="w-5 h-5 text-[#D4AF37]" />}
                </div>
                <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
                  Option 1: Subdomain (app.{customDomainName})
                </h3>
                <p className="text-xs text-white/60 font-body mt-2 leading-relaxed">
                  Best practice. Keeps your existing promotional marketing funnels & website alive on <span className="text-white font-mono">lionmodekarate.com</span>, while giving students, parents, and instructors a dedicated portal at <span className="text-[#D4AF37] font-mono">app.{customDomainName}</span>.
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-[#D4AF37] font-heading uppercase">
                  <span>Uses 1 CNAME Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Zero downtime for existing site</span>
                </div>
              </div>

              <div 
                onClick={() => setDomainMode("root")}
                className={`p-6 rounded-3xl border transition-all cursor-pointer relative ${
                  domainMode === "root"
                    ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white/80 font-heading text-[10px] font-bold uppercase tracking-wider">
                    Complete Takeover
                  </span>
                  {domainMode === "root" && <Check className="w-5 h-5 text-[#D4AF37]" />}
                </div>
                <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
                  Option 2: Apex Root ({customDomainName})
                </h3>
                <p className="text-xs text-white/60 font-body mt-2 leading-relaxed">
                  Replaces the current external marketing site with this comprehensive Dojo OS web application (which already includes the public Landing Page, Pro Shop, Trial Booking, and Member Portal).
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-white/50 font-heading uppercase">
                  <span>Uses A & CNAME Records</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Full domain replacement</span>
                </div>
              </div>
            </div>

            {/* Interactive Domain Configuration Panel */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-6">
              <div>
                <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#D4AF37]" />
                  <span>Configure Your Domain Target</span>
                </h3>
                <p className="text-xs text-white/60 font-body mt-1">
                  Adjust your domain name or subdomain prefix to generate the exact DNS values to copy into your domain registrar (GoDaddy, Namecheap, Cloudflare, Google Domains, etc.).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-white/70 mb-2">
                    Primary Domain Name
                  </label>
                  <input
                    type="text"
                    value={customDomainName}
                    onChange={(e) => setCustomDomainName(e.target.value.trim().toLowerCase())}
                    placeholder="lionmodekarate.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#D4AF37] text-white font-mono text-sm outline-none transition-colors"
                  />
                </div>

                {domainMode === "subdomain" && (
                  <div>
                    <label className="block text-xs font-heading uppercase tracking-wider text-white/70 mb-2">
                      Subdomain Prefix
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={subdomainPrefix}
                        onChange={(e) => setSubdomainPrefix(e.target.value.trim().toLowerCase())}
                        placeholder="app"
                        className="w-1/3 px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#D4AF37] text-white font-mono text-sm outline-none transition-colors"
                      />
                      <div className="w-2/3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-white/60 font-mono text-sm flex items-center">
                        .{customDomainName}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Exact DNS Records Table */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                    DNS Records to Add at Your Registrar:
                  </h4>
                  <span className="text-xs text-white/40 font-body">Click any value to copy</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-body border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 uppercase font-heading text-[11px] tracking-wider">
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Name / Host</th>
                        <th className="py-3 px-4">Target / Points To</th>
                        <th className="py-3 px-4">TTL</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {domainMode === "subdomain" ? (
                        <tr className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#D4AF37]">CNAME</td>
                          <td className="py-3.5 px-4 text-white font-semibold">{subdomainPrefix}</td>
                          <td className="py-3.5 px-4 text-white/90">ghs.googlehosted.com.</td>
                          <td className="py-3.5 px-4 text-white/50">3600 (or Auto)</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => copyToClipboard("ghs.googlehosted.com.", "CNAME Target")}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-white text-xs font-heading uppercase flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>{copiedField === "CNAME Target" ? "Copied" : "Copy Value"}</span>
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <>
                          <tr className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 font-bold text-[#D4AF37]">A</td>
                            <td className="py-3.5 px-4 text-white font-semibold">@</td>
                            <td className="py-3.5 px-4 text-white/90">199.36.158.100</td>
                            <td className="py-3.5 px-4 text-white/50">3600</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => copyToClipboard("199.36.158.100", "A Record IP")}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-white text-xs font-heading uppercase flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>{copiedField === "A Record IP" ? "Copied" : "Copy IP"}</span>
                              </button>
                            </td>
                          </tr>
                          <tr className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 font-bold text-[#D4AF37]">CNAME</td>
                            <td className="py-3.5 px-4 text-white font-semibold">www</td>
                            <td className="py-3.5 px-4 text-white/90">{customDomainName}</td>
                            <td className="py-3.5 px-4 text-white/50">3600</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => copyToClipboard(customDomainName, "www CNAME")}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-white text-xs font-heading uppercase flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>{copiedField === "www CNAME" ? "Copied" : "Copy Value"}</span>
                              </button>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 3 Step Deployment Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center font-heading font-bold text-[#D4AF37] text-sm">
                      1
                    </span>
                    <span className="text-[10px] font-heading uppercase tracking-widest text-white/40">
                      Registrar DNS
                    </span>
                  </div>
                  <h4 className="font-heading text-lg font-bold uppercase text-white">
                    Add DNS at Your Registrar
                  </h4>
                  <p className="text-xs text-white/60 font-body leading-relaxed">
                    Log in to where you bought <span className="text-white font-mono">{customDomainName}</span> (e.g. GoDaddy, Namecheap, Cloudflare, Google Domains), open <strong>DNS Management</strong>, and paste the record above.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4">
                  <div className="text-[11px] text-white/40 font-body">
                    Cloudflare users: Set proxy mode to <span className="text-[#D4AF37] font-semibold">DNS Only (Gray Cloud)</span> initially so Google can issue your SSL cert.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center font-heading font-bold text-[#D4AF37] text-sm">
                      2
                    </span>
                    <span className="text-[10px] font-heading uppercase tracking-widest text-white/40">
                      Firebase Auth
                    </span>
                  </div>
                  <h4 className="font-heading text-lg font-bold uppercase text-white">
                    Authorize Domain in Firebase
                  </h4>
                  <p className="text-xs text-white/60 font-body leading-relaxed">
                    Firebase Authentication requires custom domains to be in the authorized list to allow student and parent logins without throwing <span className="text-rose-400 font-mono text-[11px]">auth/unauthorized-domain</span>.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 space-y-2">
                  <button
                    onClick={() => copyToClipboard(domainMode === "subdomain" ? `${subdomainPrefix}.${customDomainName}` : customDomainName, "Domain for Firebase")}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 text-xs font-heading uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Copy Domain for Firebase</span>
                  </button>
                  <a
                    href="https://console.firebase.google.com/project/gen-lang-client-0014264556/authentication/settings"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-heading uppercase tracking-wider text-[#D4AF37] flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <span>Firebase Auth Settings</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center font-heading font-bold text-[#D4AF37] text-sm">
                      3
                    </span>
                    <span className="text-[10px] font-heading uppercase tracking-widest text-white/40">
                      SSL & Live
                    </span>
                  </div>
                  <h4 className="font-heading text-lg font-bold uppercase text-white">
                    Auto SSL & DNS Verification
                  </h4>
                  <p className="text-xs text-white/60 font-body leading-relaxed">
                    Once DNS propagates (usually 15-30 minutes), Google's edge routers automatically provision and renew a free TLS/SSL certificate. Your app is immediately live with HTTPS.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4">
                  <a
                    href={`https://www.whatsmydns.net/#CNAME/${subdomainPrefix}.${customDomainName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading uppercase tracking-wider text-white/80 hover:text-white flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <span>Check DNS Propagation</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Current Cloud Infrastructure Specs */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <h4 className="font-heading text-xs uppercase tracking-widest text-white/50 mb-3">
                Current App Cloud Endpoints & IDs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/40 text-[10px] uppercase font-heading block">Current Cloud Run Endpoint</span>
                  <span className="text-[#D4AF37] break-all">ais-pre-ewbbhnjy7r46x2t4tqhfx5-242851762102.europe-west2.run.app</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/40 text-[10px] uppercase font-heading block">Firebase Project ID</span>
                  <span className="text-white">gen-lang-client-0014264556</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/40 text-[10px] uppercase font-heading block">Default Auth Domain</span>
                  <span className="text-white">gen-lang-client-0014264556.firebaseapp.com</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: WEBSITE & APP TEXT CMS */}
        {activeTab === "content" && (
          <SiteContentManager />
        )}

        {/* TAB 2: WEBSITE IMAGES & PHOTOS MANAGER */}
        {activeTab === "images" && (
          <SiteImageManager />
        )}

        {/* TAB 3: MARKETING FUNNELS (Controlled in Admin Section) */}
        {activeTab === "funnels" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-6 rounded-3xl">
              <div>
                <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-heading uppercase tracking-widest mb-1">
                  <Layers className="w-4 h-4" />
                  <span>Lead Funnel Command</span>
                </div>
                <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
                  Marketing Funnels Manager
                </h2>
                <p className="text-sm text-white/60 font-body max-w-2xl mt-1">
                  Control the lead capture funnels used across the Home Page and marketing campaigns (including the 1-Week Free VIP Trial matching https://lionmodekarate.com/trial/trial). Toggle funnels active/inactive, customize copy, and view real-time conversion rates.
                </p>
              </div>

              <Link to="/trial" target="_blank">
                <GoldButton size="md">
                  <Eye className="w-4 h-4 mr-2" /> Live Funnel Preview
                </GoldButton>
              </Link>
            </div>

            {/* Funnels List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {funnels.map((funnel) => (
                <div
                  key={funnel.id}
                  className="bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 rounded-3xl p-6 backdrop-blur-xl transition-all shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-heading uppercase tracking-widest font-bold">
                        {funnel.badge}
                      </span>
                      <button
                        onClick={() => toggleFunnelActive(funnel.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-heading uppercase tracking-wider font-bold transition-all cursor-pointer ${
                          funnel.isActive
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/10 text-white/50 border border-white/10"
                        }`}
                      >
                        {funnel.isActive ? "● Active on Site" : "○ Paused"}
                      </button>
                    </div>

                    <div>
                      <h3 className="font-heading text-xl font-bold uppercase text-white">
                        {funnel.name}
                      </h3>
                      <p className="text-xs text-white/60 font-body mt-1 leading-relaxed">
                        {funnel.description}
                      </p>
                    </div>

                    {/* Funnel Metrics */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-center">
                      <div className="p-2 rounded-xl bg-white/[0.02]">
                        <p className="text-[10px] font-heading uppercase text-white/40">Total Views</p>
                        <p className="font-heading text-lg font-bold text-white">{funnel.totalViews}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.02]">
                        <p className="text-[10px] font-heading uppercase text-white/40">Leads Secured</p>
                        <p className="font-heading text-lg font-bold text-[#D4AF37]">{funnel.totalLeads}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.02]">
                        <p className="text-[10px] font-heading uppercase text-white/40">Conversion</p>
                        <p className="font-heading text-lg font-bold text-emerald-400">{funnel.conversionRate}%</p>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-heading uppercase tracking-widest text-white/50">Core Inclusions:</p>
                      {funnel.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-white/70 font-body">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 flex items-center justify-between gap-3 border-t border-white/5 mt-6">
                    <Link
                      to={`/trial?slug=${funnel.slug}`}
                      className="text-xs font-heading uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Test Funnel
                    </Link>

                    <button
                      onClick={() => setEditingFunnel(funnel)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading uppercase tracking-wider text-white transition-all cursor-pointer"
                    >
                      Edit Funnel Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Funnel Modal */}
            {editingFunnel && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                <div className="bg-[#121212] border border-white/15 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="font-heading text-xl font-bold uppercase text-white">
                      Edit Funnel: {editingFunnel.name}
                    </h3>
                    <button
                      onClick={() => setEditingFunnel(null)}
                      className="p-1 rounded-lg text-white/40 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={saveEditedFunnel} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-heading uppercase tracking-wider text-white/60">Headline</label>
                      <input
                        type="text"
                        value={editingFunnel.headline}
                        onChange={(e) => setEditingFunnel({ ...editingFunnel, headline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-heading uppercase tracking-wider text-white/60">Subheadline</label>
                      <textarea
                        rows={3}
                        value={editingFunnel.subheadline}
                        onChange={(e) => setEditingFunnel({ ...editingFunnel, subheadline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-body"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-heading uppercase tracking-wider text-white/60">Badge Text</label>
                        <input
                          type="text"
                          value={editingFunnel.badge}
                          onChange={(e) => setEditingFunnel({ ...editingFunnel, badge: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-heading uppercase tracking-wider text-white/60">CTA Button Text</label>
                        <input
                          type="text"
                          value={editingFunnel.ctaText}
                          onChange={(e) => setEditingFunnel({ ...editingFunnel, ctaText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setEditingFunnel(null)}
                        className="px-4 py-2 text-xs font-heading uppercase text-white/60 hover:text-white"
                      >
                        Cancel
                      </button>
                      <GoldButton type="submit">
                        Save Funnel Settings
                      </GoldButton>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TEST PERSONAS (Parent, Staff, Super Admin) */}
        {activeTab === "personas" && (
          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-heading uppercase tracking-widest mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Multi-Role Evaluation & Impersonation</span>
              </div>
              <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
                Dummy Test Personas for Client Demo
              </h2>
              <p className="text-sm text-white/60 font-body max-w-2xl mt-1">
                Switch between these 3 pre-configured user accounts with one click to test and evaluate Dojo OS from the perspective of a Parent, an Instructor / Staff member, or a Super Admin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DUMMY_TEST_PERSONAS.map((persona) => {
                const isSelected = activePersona?.id === persona.id || (!activePersona && persona.id === "super_admin");
                return (
                  <div
                    key={persona.id}
                    className={`bg-white/[0.03] rounded-3xl p-6 backdrop-blur-xl transition-all shadow-xl flex flex-col justify-between border ${
                      isSelected
                        ? "border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent shadow-lg shadow-[#D4AF37]/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-heading uppercase tracking-widest text-[#D4AF37] px-2.5 py-0.5 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                          {persona.roleLabel}
                        </span>
                        {isSelected && (
                          <span className="text-xs text-emerald-400 font-heading font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Active Session
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <img
                          src={persona.photoURL}
                          alt={persona.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-[#D4AF37]/50 shadow-md"
                        />
                        <div>
                          <h3 className="font-heading text-xl font-bold uppercase text-white">
                            {persona.name}
                          </h3>
                          <p className="text-xs text-white/60 font-body">
                            {persona.title}
                          </p>
                          <p className="text-[11px] text-[#D4AF37] font-mono mt-0.5">
                            {persona.email}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-white/70 font-body leading-relaxed pt-2 border-t border-white/5">
                        {persona.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {persona.badges.map((b, i) => (
                          <span key={i} className="text-[9px] font-heading uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/5">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-6">
                      <button
                        onClick={() => switchPersona(persona.id)}
                        className={`w-full py-2.5 rounded-xl text-xs font-heading uppercase tracking-wider font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white/10 text-white cursor-default"
                            : "bg-[#D4AF37] hover:bg-[#FFB800] text-black shadow-md shadow-[#D4AF37]/20"
                        }`}
                      >
                        {isSelected ? "Currently Acting as this Persona" : `Switch to ${persona.roleLabel}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
