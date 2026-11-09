import React from 'react';
import { motion } from "motion/react";
import { Flame, Pencil, Award, Activity } from "lucide-react";
import BeltBadge from "../shared/BeltBadge";
import BeltProgressTracker from "./BeltProgressTracker";

// Since I don't have a reliable Progress component imported, I'll use a simple div based one if needed, 
// or check components/ui/progress.tsx

interface StudentCardProps {
  student: any;
  onEdit: () => void;
  key?: any;
}

export default function StudentCard({ student, onEdit }: StudentCardProps) {
  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    inactive: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    trial: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    suspended: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass bg-[#121212]/40 border border-white/8 rounded-[40px] overflow-hidden group cursor-pointer shadow-2xl relative transition-all duration-500 hover:border-primary/25"
      onClick={onEdit}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
      
      <div className="p-8 relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center font-heading text-2xl font-black text-primary italic shadow-inner">
              {student.first_name?.[0]}{student.last_name?.[0]}
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-2xl font-bold uppercase italic tracking-tighter text-white group-hover:text-primary transition-colors">
                {student.first_name} {student.last_name}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <BeltBadge belt={student.belt_rank || "white"} />
                <span className={`text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-[0.2em] italic border ${statusColors[student.status] || statusColors.active}`}>
                  {student.status || "active"}
                </span>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all border border-white/10 hover:bg-primary/20 hover:border-primary/40">
            <Pencil className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-primary shadow-glow-gold" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 italic">STREAK</span>
            </div>
            <p className="font-heading text-3xl font-black text-white italic leading-none">
                {student.current_streak || 0} <span className="text-xs text-white/20 ml-1">DAYS</span>
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary shadow-glow-gold" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 italic">LOGS</span>
            </div>
            <p className="font-heading text-3xl font-black text-white italic leading-none">
                {student.attendance_count || 0} <span className="text-xs text-white/20 ml-1">UNITS</span>
            </p>
          </div>
        </div>

        {/* Health & Vitality Indicator */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between text-[9px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span>VITALITY_INDEX</span>
            </div>
            <span className="text-primary">{Math.min(100, (student.attendance_count || 0) * 2 + (student.current_streak || 0) * 5)}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${Math.min(100, (student.attendance_count || 0) * 2 + (student.current_streak || 0) * 5)}%` }}
               transition={{ duration: 2, ease: "circOut" }}
               className="h-full bg-gradient-to-r from-primary to-primary-foreground shadow-glow-gold rounded-full relative"
             >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
             </motion.div>
          </div>
        </div>

        {/* Grading Readiness */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[9px] font-black text-white/30 uppercase tracking-[0.3em] italic">
            <span>READINESS_PROBE</span>
            <span className="text-primary">{student.grading_readiness || 0}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${student.grading_readiness || 0}%` }}
               transition={{ duration: 1.5, ease: "circOut" }}
               className="h-full bg-primary shadow-glow-gold rounded-full"
             />
          </div>
        </div>

        {/* Belt Progression */}
        <BeltProgressTracker student={student} />
      </div>
    </motion.div>
  );
}
