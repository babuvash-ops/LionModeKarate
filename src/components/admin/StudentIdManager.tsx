import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Key, 
  UserCheck, 
  Mail, 
  MessageSquare, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Search, 
  ExternalLink, 
  Plus, 
  Send,
  Sparkles,
  Users,
  Download
} from 'lucide-react';
import { base44 } from "@/api/base44Client";
import GoldButton from "../shared/GoldButton";
import { 
  getMemberRegistrations, 
  allocateStudentId, 
  generateNextStudentId, 
  MemberRegistration 
} from '@/data/memberRegistrations';
import { DUMMY_STUDENTS } from '@/data/dummyData';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function StudentIdManager() {
  const queryClient = useQueryClient();
  const [registrations, setRegistrations] = useState<MemberRegistration[]>(getMemberRegistrations());
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customIds, setCustomIds] = useState<Record<string, string>>({});

  const { data: students = [] } = useQuery({
    queryKey: ["students-admin"],
    queryFn: () => base44.entities.Student.list("-created_date", 200),
  });

  const pendingRegistrations = registrations.filter(r => r.status === 'pending');
  const allocatedRegistrations = registrations.filter(r => r.status === 'allocated');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`Copied ${label} (${text}) to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAllocate = (reg: MemberRegistration) => {
    const assignedId = customIds[reg.id]?.trim() || generateNextStudentId();
    const updated = allocateStudentId(reg.id, assignedId);
    if (updated) {
      setRegistrations(getMemberRegistrations());
      toast.success(`Allocated Student ID ${assignedId} to ${reg.studentName}!`, {
        description: `Sensei can now email or WhatsApp ${reg.parentName} their official ID.`
      });
    }
  };

  const openEmailToParent = (reg: MemberRegistration) => {
    const studentIdCode = reg.allocatedStudentId || customIds[reg.id] || generateNextStudentId();
    const subject = encodeURIComponent(`[Lion Mode Karate] Official Student ID Allocation for ${reg.studentName}`);
    const body = encodeURIComponent(
`Osu ${reg.parentName},

Welcome to Lion Mode Karate Academy!

Your child ${reg.studentName} (Passport / ID: ${reg.passportId}) has been officially registered into our dojo system.

Official Allocated Student ID: ${studentIdCode}

You can now log in to the confidential Member Portal at:
https://app.lionmodekarate.com/

How to log in:
1. Click the "Member Portal" gold button at the top of the app.
2. Select "Member Sign-In".
3. Enter your child's allocated Student ID: ${studentIdCode}
4. Click "Enter Member Portal" to view ${reg.studentName}'s private training passport, attendance streak, and Sensei evaluations.

If you have any questions or require gear from our Pro Shop, please reply to this email or message me on WhatsApp.

Warm regards,
Sensei Babu
Head Master, Lion Mode Karate Academy
WhatsApp / Support: +27 82 000 0000
Official App: https://app.lionmodekarate.com/`
    );

    window.open(`mailto:${reg.parentEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const openWhatsAppToParent = (reg: MemberRegistration) => {
    const studentIdCode = reg.allocatedStudentId || customIds[reg.id] || generateNextStudentId();
    const cleanPhone = (reg.parentPhone || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
`Osu ${reg.parentName}! 🥋

Sensei Babu here from Lion Mode Karate Academy.

Your child ${reg.studentName} has been enrolled into our Dojo OS system.
Official Allocated Student ID: *${studentIdCode}*

You can now enter the private Member Portal to track your child's belt progress, attendance, and evaluation reports:
👉 https://app.lionmodekarate.com/

Enter Student ID: *${studentIdCode}* to log in. Osu!`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  // Combine enrolled students from database/dummy data
  const combinedRoster = students.length > 0 ? students : DUMMY_STUDENTS;

  const filteredRoster = combinedRoster.filter((s: any) => {
    const query = search.toLowerCase();
    const name = `${s.first_name || ""} ${s.last_name || ""}`.toLowerCase();
    const studentCode = (s.student_id_code || s.id || "").toLowerCase();
    const passport = (s.passport_id || "").toLowerCase();
    const parent = (s.parent_name || s.emergency_contact || "").toLowerCase();
    return name.includes(query) || studentCode.includes(query) || passport.includes(query) || parent.includes(query);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner Notice */}
      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#FFB800] text-black flex items-center justify-center font-bold shrink-0 shadow-lg shadow-[#D4AF37]/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
              Student ID Allocation & Member Registrations
            </h2>
            <p className="text-xs text-white/60 font-body">
              All member registrations notify Sensei Babu (<span className="text-[#D4AF37]">babuvash@gmail.com</span>). Allocate official Student IDs and dispatch them to parents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dojo-app-build.zip"
            download="dojo-app-build.zip"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-heading uppercase tracking-wider transition-all"
            title="Download latest deployment ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </a>
          <span className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-[#D4AF37]">
            {pendingRegistrations.length} Pending Allocation
          </span>
        </div>
      </div>

      {/* SECTION 1: PENDING MEMBER REGISTRATIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
              Pending Member Registrations ({pendingRegistrations.length})
            </h3>
          </div>
          <span className="text-xs text-white/50 font-body">
            Parents awaiting Student ID allocation
          </span>
        </div>

        {pendingRegistrations.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center text-white/50 space-y-2">
            <Check className="w-8 h-8 mx-auto text-emerald-400" />
            <p className="font-heading text-sm uppercase tracking-wider text-white">
              All Member Registrations Allocated
            </p>
            <p className="text-xs text-white/40">
              When a parent submits a registration on the Member Portal, it will appear here for Sensei review.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRegistrations.map((reg) => {
              const suggestedId = customIds[reg.id] || generateNextStudentId();
              return (
                <div
                  key={reg.id}
                  className="p-5 rounded-3xl bg-white/[0.03] border border-amber-500/30 hover:border-[#D4AF37] transition-all space-y-4 relative overflow-hidden backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-heading uppercase tracking-widest text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                        New Parent Registration
                      </span>
                      <h4 className="font-heading text-xl font-bold uppercase text-white mt-1">
                        {reg.studentName}
                      </h4>
                      <p className="text-xs text-white/60 font-body">
                        Parent: <strong className="text-white">{reg.parentName}</strong>
                      </p>
                    </div>

                    <span className="text-[11px] text-white/40 font-mono">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Details Card */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs space-y-1.5 font-body">
                    <div className="flex justify-between">
                      <span className="text-white/50">Student Passport / ID:</span>
                      <span className="text-white font-mono font-bold">{reg.passportId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Parent Phone / WhatsApp:</span>
                      <span className="text-white font-mono">{reg.parentPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Parent Email:</span>
                      <span className="text-white font-mono">{reg.parentEmail}</span>
                    </div>
                    {reg.notes && (
                      <div className="pt-1 text-[11px] text-white/60 italic border-t border-white/5">
                        "{reg.notes}"
                      </div>
                    )}
                  </div>

                  {/* Student ID Allocation Input & Buttons */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customIds[reg.id] || suggestedId}
                        onChange={(e) => setCustomIds({ ...customIds, [reg.id]: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-[#D4AF37] text-white font-mono text-xs uppercase"
                        placeholder="Assign Student ID (e.g. LMK-2026-005)"
                      />
                      <button
                        onClick={() => handleAllocate(reg)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFB800] text-black text-xs font-heading font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                      >
                        Allocate ID
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => openEmailToParent(reg)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-heading uppercase tracking-wider transition-all cursor-pointer"
                        title="Open prefilled email with Student ID to parent"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Email Parent ID</span>
                      </button>

                      <button
                        onClick={() => openWhatsAppToParent(reg)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-heading uppercase tracking-wider transition-all cursor-pointer"
                        title="Send Student ID via WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Parent</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: ACTIVE STUDENT ID DIRECTORY */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              Allocated Student ID Directory ({filteredRoster.length})
            </h3>
            <p className="text-xs text-white/50 font-body">
              Master roster of all enrolled students and their assigned Student IDs for parent portal access
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Student, Parent, ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-[#D4AF37] text-white text-xs font-body focus:outline-none"
            />
          </div>
        </div>

        {/* Roster Cards / Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoster.map((s: any) => {
            const studentCode = s.student_id_code || (s.id.startsWith('std-') ? `LMK-2024-${s.id.replace('std-', '00')}` : s.id);
            const parentName = s.parent_name || s.emergency_contact?.split('(')[0]?.trim() || "Registered Parent";
            const parentPhone = s.parent_phone || s.emergency_contact?.match(/\+?[0-9\s-]+/)?.[0] || s.phone || "On File";
            const passportId = s.passport_id || "ZA-ACTIVE-MEMBER";

            return (
              <div
                key={s.id}
                className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/50 transition-all space-y-3.5 backdrop-blur-xl relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {s.avatar_url ? (
                      <img
                        src={s.avatar_url}
                        alt={s.first_name}
                        className="w-11 h-11 rounded-2xl object-cover border border-[#D4AF37]/40"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-heading font-bold text-base flex items-center justify-center">
                        {s.first_name?.[0] || 'S'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-heading text-base font-bold uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                        {s.first_name} {s.last_name}
                      </h4>
                      <p className="text-[11px] text-white/50 font-body">
                        {s.rank_level || s.belt_rank || "Student"}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/students/${s.id}`}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                    title="Open Student Passport"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                {/* Allocated Student ID Badge with 1-Click Copy */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/10">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-heading uppercase tracking-widest text-[#D4AF37] block">
                      Allocated Student ID
                    </span>
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      {studentCode}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(studentCode, `${s.first_name}'s Student ID`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/50 text-white hover:text-[#D4AF37] text-[10px] font-heading uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {copiedId === studentCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Parent & Passport Metadata */}
                <div className="space-y-1 text-[11px] font-body text-white/60">
                  <div className="flex justify-between">
                    <span className="text-white/40">Parent / Guardian:</span>
                    <span className="text-white">{parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Parent Contact:</span>
                    <span className="text-white font-mono">{parentPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Passport / ID:</span>
                    <span className="text-white font-mono">{passportId}</span>
                  </div>
                </div>

                {/* Quick Share Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                  <button
                    onClick={() => {
                      const subject = encodeURIComponent(`[Lion Mode Karate] Student ID for ${s.first_name}`);
                      const body = encodeURIComponent(
`Osu ${parentName},

Here is ${s.first_name}'s official Lion Mode Karate Student ID: ${studentCode}

Log in to the Member Portal at: https://app.lionmodekarate.com/

Sensei Babu`
                      );
                      window.open(`mailto:${s.email || ''}?subject=${subject}&body=${body}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[10px] font-heading uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Mail className="w-3 h-3 text-[#D4AF37]" />
                    <span>Email ID</span>
                  </button>

                  <button
                    onClick={() => {
                      const cleanPhone = (parentPhone || '').replace(/[^0-9]/g, '');
                      const text = encodeURIComponent(
`Osu ${parentName}! Your child ${s.first_name}'s Student ID is: *${studentCode}*. Use this to log in to the Member Portal at https://app.lionmodekarate.com/`
                      );
                      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-heading uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
