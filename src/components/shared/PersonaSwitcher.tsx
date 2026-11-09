import React, { useState } from "react";
import { useAuth, DUMMY_TEST_PERSONAS, TestPersona } from "@/lib/AuthContext";
import { ShieldCheck, Users, User, ChevronDown, ChevronUp, Check, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonaSwitcher() {
  const { activePersona, switchPersona, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);

  // If user minimized the pill, keep a tiny gold toggle icon
  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 left-4 z-50 p-2.5 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/50 text-[#D4AF37] shadow-xl hover:scale-105 transition-all flex items-center gap-1.5 font-heading text-[10px] uppercase tracking-wider"
        title="Open Role Tester (Super Admin, Staff, Parent)"
      >
        <ShieldCheck className="w-4 h-4" />
        <span className="hidden sm:inline">Role Tester</span>
      </button>
    );
  }

  const currentRole = activePersona ? activePersona.roleLabel : (user ? "Logged In User" : "Super Admin (Default)");

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <div className="bg-[#121212]/95 border border-[#D4AF37]/40 backdrop-blur-2xl rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] overflow-hidden transition-all text-white">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-black/60 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[10px] font-heading uppercase tracking-widest text-[#D4AF37] font-bold">
              Test Personas:
            </span>
            <span className="text-xs font-heading uppercase font-bold text-white truncate max-w-[130px]">
              {activePersona?.name || "Sensei Babu"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Toggle role menu"
            >
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setMinimized(true)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
              title="Minimize"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Role Buttons (always visible) */}
        <div className="p-2 grid grid-cols-3 gap-1.5 bg-[#0D0D0D]">
          {DUMMY_TEST_PERSONAS.map((persona) => {
            const isSelected = activePersona?.id === persona.id || (!activePersona && persona.id === "super_admin");
            return (
              <button
                key={persona.id}
                onClick={() => switchPersona(persona.id)}
                className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 border ${
                  isSelected
                    ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-md shadow-[#D4AF37]/20"
                    : "bg-white/[0.03] text-white/60 border-white/5 hover:border-[#D4AF37]/40 hover:text-white"
                }`}
              >
                <span className="text-[10px] font-heading uppercase tracking-wider leading-tight truncate w-full">
                  {persona.id === "super_admin" ? "Super Admin" : persona.id === "staff" ? "Staff / Coach" : "Parent"}
                </span>
                <span className="text-[9px] opacity-75 truncate w-full font-body">
                  {persona.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expandable Details Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5 p-3 space-y-2.5 bg-black/40 text-xs"
            >
              <p className="text-[11px] text-white/50 font-body">
                Switch between these 3 test accounts to evaluate Dojo OS from each role's perspective:
              </p>

              {DUMMY_TEST_PERSONAS.map((p) => {
                const isSelected = activePersona?.id === p.id || (!activePersona && p.id === "super_admin");
                return (
                  <div
                    key={p.id}
                    onClick={() => switchPersona(p.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#D4AF37]/10 border-[#D4AF37]/50 text-white"
                        : "bg-white/[0.02] border-white/5 hover:border-white/20 text-white/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.photoURL}
                        alt={p.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading font-bold text-xs uppercase text-white truncate">
                            {p.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#D4AF37] uppercase font-heading">
                            {p.roleLabel}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/50 truncate font-body">
                          {p.title}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0 stroke-[3]" />
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
