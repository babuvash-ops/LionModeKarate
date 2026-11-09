import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Settings, 
  Users, 
  Baby, 
  LayoutDashboard, 
  TrendingUp, 
  MessageCircle, 
  Tv, 
  CreditCard,
  Zap,
  ChevronRight,
  ArrowLeft,
  Target,
  Flame,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function SystemManual() {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'overview',
      title: 'Platform Overview',
      icon: LayoutDashboard,
      color: 'text-primary',
      description: 'DojoOS is a strategic operating system designed to automate administrative friction and maximize martial arts business growth.',
      benefits: [
        'Centralized Lead Intelligence',
        'Tablet-Optimized Dojo Operations',
        'Parental Engagement & Gamification',
        'AI-Driven Follow-ups'
      ]
    },
    {
      id: 'admin',
      title: 'Admin Protocol',
      icon: Settings,
      color: 'text-rose-500',
      role: 'Full Access',
      description: 'The master control tier for business owners and head instructors.',
      tasks: [
        { name: 'Financial Oversight', detail: 'Monitor Monthly Recurring Revenue (MRR) and outstanding balances.' },
        { name: 'System Branding', detail: 'Configure logo, dojo name, and visual identity settings.' },
        { name: 'Operational Reports', detail: 'Access deep-dive analytics on student growth and drop-off rates.' }
      ]
    },
    {
      id: 'manager',
      title: 'Manager Protocol',
      icon: Users,
      color: 'text-amber-500',
      role: 'Operations Tier',
      description: 'Focused on the "Dojo Floor" and lead pipeline management.',
      tasks: [
        { name: 'CRM Pipeline', detail: 'Move leads through Trial and Conversion stages using Kanban boards.' },
        { name: 'WhatsApp Hub', detail: 'Utilize AI templates for payment and trial attendance reminders.' },
        { name: 'Attendance Matrix', detail: 'Rapid tablet-based check-ins for high-traffic classes.' }
      ]
    },
    {
      id: 'parent',
      title: 'Parent/Student App',
      icon: Baby,
      color: 'text-emerald-500',
      role: 'Client Tier',
      description: 'Simplified mobile experience for the primary customers.',
      tasks: [
        { name: 'Ascension Tracking', detail: 'Visual belt progression timeline and attendance streaks.' },
        { name: 'Video Curriculum', detail: 'Access to technique libraries and requirements from home.' },
        { name: 'Fast Payments', detail: 'Mobile-optimized invoice management and payment history.' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="relative h-64 w-full flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549576490-b0b4831da60a?auto=format&fit=crop&q=80&w=1800" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <Badge className="bg-primary text-black font-black uppercase text-[10px] tracking-[0.3em] mb-4">Operations Manual</Badge>
          <h1 className="section-title italic tracking-tighter mix-blend-difference mb-2">DOJO OS <span className="text-primary italic">PROTOCOLS</span></h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Strategic Training & Navigation Guide</p>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-6 text-white/40 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> EXIT
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20 space-y-8">
        {/* Quick Nav Card */}
        <Card className="premium-card bg-black/60 backdrop-blur-3xl border-white/10">
           <div className="flex flex-wrap gap-2">
              {['System Overview', 'Admin Rules', 'Manager Daily', 'Parent Experience', 'TV Dashboard'].map((tab) => (
                <button key={tab} className="px-4 h-10 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-primary hover:border-primary/40 transition-all">
                  {tab}
                </button>
              ))}
           </div>
        </Card>

        {/* Sections */}
        {sections.map((section, idx) => (
          <motion.section 
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-6 pt-12"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${section.color}`}>
                <section.icon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="section-title italic tracking-tighter">{section.title}</h2>
                  {section.role && <Badge variant="outline" className="border-white/10 text-[8px] font-black text-white/40">{section.role}</Badge>}
                </div>
                <p className="text-sm text-white/40 font-medium max-w-lg mt-1">{section.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {section.benefits && section.benefits.map((benefit, i) => (
                 <div key={i} className="premium-card flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{benefit}</span>
                 </div>
               ))}

               {section.tasks && section.tasks.map((task, i) => (
                 <div key={i} className="premium-card space-y-3 group hover:border-white/20 transition-all">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                       <ChevronRight className="w-4 h-4" /> {task.name}
                    </h4>
                    <p className="text-[11px] font-bold text-white/40 uppercase leading-relaxed tracking-wider">
                       {task.detail}
                    </p>
                 </div>
               ))}
            </div>
          </motion.section>
        ))}

        {/* Global Navigation Training */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="pt-20 pb-20"
        >
          <div className="bg-gradient-to-br from-primary/20 via-black to-black border border-primary/20 rounded-[48px] p-10 md:p-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
             
             <h3 className="section-title italic tracking-tighter mb-8">Navigation <span className="text-primary italic">Protocol</span></h3>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                <div className="space-y-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      <LayoutDashboard className="w-6 h-6" />
                   </div>
                   <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Master Dash</h5>
                   <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                      Your operational nexus. All tactical data (Revenue, Leads, Attendance) streams here.
                   </p>
                </div>

                <div className="space-y-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      <Award className="w-6 h-6" />
                   </div>
                   <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Gamified Ascent</h5>
                   <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                      Student profiles use "Streak" logic to drive retention. Higher streaks = Better conversion.
                   </p>
                </div>

                <div className="space-y-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      <Tv className="w-6 h-6" />
                   </div>
                   <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">TV Mode</h5>
                   <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                      Switch to "Broadcast" mode on dojo floors to display live leaderboards.
                   </p>
                </div>
             </div>

             <div className="mt-16 flex flex-col md:flex-row items-center gap-8 p-8 bg-black/40 rounded-3xl border border-white/5">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-white/10 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=lion${i}`} className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest text-white italic">Operational Ready</p>
                   <p className="text-[10px] font-bold text-white/30 uppercase mt-1">DojoOS powers over 40+ high-intensity elite academies.</p>
                </div>
                <Button className="md:ml-auto h-12 bg-primary text-black font-black uppercase tracking-widest px-8 rounded-xl shadow-xl shadow-primary/20">
                   Contact Support
                </Button>
             </div>
          </div>
        </motion.section>
      </div>

      <footer className="text-center pb-20 opacity-20">
        <p className="text-[9px] font-black uppercase tracking-[1em]">Execution. Discipline. Precision.</p>
      </footer>
    </div>
  );
}
