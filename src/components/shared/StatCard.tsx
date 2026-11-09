import React from 'react';
import { motion } from "motion/react";
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  color?: string;
}

export default function StatCard({ icon: Icon, label, value, trend, color = "text-yellow-400" }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="premium-card relative overflow-hidden group text-left overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-sm font-medium tracking-wide">{label}</span>
        <div className="w-9 h-9 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 font-heading tracking-wide">
          {value}
        </h2>
        {trend && (
          <p className="text-xs text-yellow-400/80 mt-2 font-sans tracking-wide">
            {trend}
          </p>
        )}
      </div>
    </motion.div>
  );
}
