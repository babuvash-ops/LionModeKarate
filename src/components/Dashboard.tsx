import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "../api/base44Client";
import { Users, DollarSign, TrendingUp, Flame, Calendar, ChevronRight, Activity, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import StatCard from "./shared/StatCard";
import BeltBadge from "./shared/BeltBadge";
import HeroBanner from "./shared/HeroBanner";
import AttendanceLogger from "./attendance/AttendanceLogger";
import AttendanceTrendChart from "./dashboard/AttendanceTrendChart";

interface DashboardProps {
  onNavigate?: (path: string) => void;
  branding?: any;
  userProfile?: any;
  onTVMode?: () => void;
}

export default function Dashboard({ onNavigate, branding, userProfile, onTVMode }: DashboardProps) {
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: () => base44.entities.Student.list("-created_date", 50),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["events-upcoming"],
    queryFn: () => base44.entities.Event.filter({ status: "upcoming" }, "-date", 5),
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices-recent"],
    queryFn: () => base44.entities.Invoice.list("-created_date", 20),
  });

  const activeStudents = students.filter((s: any) => s.status === "active").length;
  const totalRevenue = invoices.filter((i: any) => i.status === "paid").reduce((sum: number, i: any) => sum + (i.amount || 0), 0);
  const pendingPayments = invoices.filter((i: any) => i.status === "pending").length;
  const topStudents = [...students].sort((a: any, b: any) => (b.current_streak || 0) - (a.current_streak || 0)).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroBanner
        title="Command Center"
        subtitle="Manage your dojo operations, track students, billing, and events with premium precision."
        image={branding?.heroImageUrl || "https://i.ibb.co/6R0DNtxP/IMG-0899.jpg"}
      />

      <div className="p-0 space-y-8 max-w-7xl mx-auto">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon={Users} label="Active Students" value={activeStudents} trend="+12% this month" />
          <StatCard icon={DollarSign} label="Revenue" value={`R ${totalRevenue.toLocaleString()}`} />
          <StatCard icon={TrendingUp} label="Pending Payments" value={pendingPayments} />
          <StatCard
            icon={Flame}
            label="Avg Streak"
            value={
              students.length > 0
                ? Math.round(students.reduce((s: number, st: any) => s + (st.current_streak || 0), 0) / students.length)
                : 0
            }
          />
        </div>

        {/* Attendance Trend Chart */}
        <AttendanceTrendChart students={students} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Top Streaks Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 glass rounded-3xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-heading text-base font-semibold uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-5 h-5 text-yellow-400" /> Top Streaks
              </h3>
              <Link to="/students" className="text-xs text-yellow-400 font-body flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {topStudents.length > 0 ? (
                topStudents.map((student: any, i) => (
                  <div key={student.id} className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center text-sm font-heading font-bold text-yellow-400">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-body text-base font-semibold truncate text-white">
                        {student.first_name} {student.last_name}
                      </p>
                      <div className="flex justify-start">
                        <BeltBadge belt={student.belt_rank || "white"} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Flame className="w-4 h-4" />
                      <span className="font-heading font-bold text-sm">{student.current_streak || 0}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-6 text-sm text-gray-400 text-center font-body">No students yet</p>
              )}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass rounded-3xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-heading text-base font-semibold uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-400" /> Upcoming Events
              </h3>
              <Link to="/events" className="text-xs text-yellow-400 font-body flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-left">
              {events.length > 0 ? (
                events.map((event: any) => (
                  <div key={event.id} className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer" onClick={() => (window.location.hash = '#/events')}>
                    <img
                      src={event.image_url || "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80"}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <span className="text-[10px] uppercase tracking-widest text-yellow-500 font-heading">
                        {event.event_type?.replace(/_/g, " ")}
                      </span>
                      <h4 className="font-heading text-base font-bold uppercase text-white">{event.title}</h4>
                      <p className="text-xs text-gray-300 font-body mt-1">
                        {event.date} {event.location ? `• ${event.location}` : ""}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-6 text-sm text-gray-400 text-center font-body col-span-2">No upcoming events</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Attendance Logger */}
        <AttendanceLogger />

        {/* Quick Navigation */}
        <div className="text-left">
          <h3 className="font-heading text-base font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: "/students",   icon: Users,      label: "Manage Students" },
              { to: "/schedule",   icon: Activity,   label: "Class Schedule" },
              { to: "/reports",    icon: Target,     label: "Reports" },
              { to: "/crm",        icon: TrendingUp, label: "CRM / Leads" },
            ].map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="premium-card flex flex-col items-center gap-3 text-center cursor-pointer hover:border-yellow-400/30 transition-all shadow-glow overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className="font-heading text-base font-bold uppercase tracking-wider text-white">{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
