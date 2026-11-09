import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Users, 
  Shield, 
  User, 
  Bell, 
  History, 
  Megaphone, 
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Zap,
  Filter,
  MoreVertical,
  X,
  Target,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, getDocs } from 'firebase/firestore';

const beltRanks = [
  'White Belt', 'Yellow Belt', 'Orange Belt', 'Green Belt', 'Blue Belt', 'Purple Belt', 'Brown Belt', 'Black Belt'
];

export default function CommunicationHub({ branding }: any) {
  const [activeTab, setActiveTab] = useState<'announcements' | 'targeted' | 'history'>('announcements');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  // Form States
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [includePush, setIncludePush] = useState(true);
  const [targetType, setTargetType] = useState<'all' | 'group' | 'individual'>('all');
  const [targetGroup, setTargetGroup] = useState('');
  const [targetIndividual, setTargetIndividual] = useState('');

  useEffect(() => {
    // Fetch students for targeting
    const qStudents = query(collection(db, 'students'), orderBy('name', 'asc'));
    const unsubStudents = onSnapshot(qStudents, (snap) => {
      setStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Communication Hub Students Sync Error:", error);
      toast.error("Failed to sync student data for targeting.");
    });

    // Fetch message history
    const qHistory = query(collection(db, 'communications'), orderBy('timestamp', 'desc'));
    const unsubHistory = onSnapshot(qHistory, (snap) => {
      setHistory(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Communication Hub History Sync Error:", error);
      toast.error("Failed to sync communication history.");
    });

    return () => {
      unsubStudents();
      unsubHistory();
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || (activeTab === 'announcements' && !title)) {
      toast.error('Title and message are required');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        type: activeTab,
        title: activeTab === 'announcements' ? title : `Direct Message: ${targetType}`,
        message,
        timestamp: Timestamp.now(),
        sender: 'Head Instructor',
        targetType,
        pushSent: includePush
      };

      if (targetType === 'group') payload.targetGroup = targetGroup;
      if (targetType === 'individual') payload.targetIndividualId = targetIndividual;

      await addDoc(collection(db, 'communications'), payload);
      
      // If it's an announcement, also add to global announcements collection for easier retrieval
      if (activeTab === 'announcements') {
        await addDoc(collection(db, 'announcements'), {
          title: title,
          content: message,
          type: 'normal',
          createdAt: Timestamp.now(),
          author: 'Command Node'
        });
      }
      
      toast.success(includePush ? 'Message and Push Notification deployed' : 'Message archived in hub');
      
      // Reset
      setTitle('');
      setMessage('');
      setTargetGroup('');
      setTargetIndividual('');
      
    } catch (error) {
      console.error('Comms Error:', error);
      toast.error('Strategic communication failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-24 text-white">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-4xl font-heading font-black text-white uppercase tracking-wider italic">Tactical Communication Hub_</h2>
          <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.4em] mt-1">Global Broadcast & Targeted Intercept</p>
        </div>
        <div className="flex bg-white/5 border border-white/5 p-1.5 rounded-[24px] shadow-2xl">
           {(['announcements', 'targeted', 'history'] as const).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={cn(
                 "px-6 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all",
                 activeTab === tab 
                   ? "bg-yellow-400 text-black shadow-glow font-bold" 
                   : "text-white/40 hover:text-white"
               )}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left Column: Form */}
        <div className="md:col-span-12 lg:col-span-7">
          <AnimatePresence mode="wait">
            {activeTab !== 'history' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-10 border-white/5 rounded-[32px] shadow-glow"
              >
                <form onSubmit={handleSendMessage} className="space-y-8">
                  {activeTab === 'announcements' ? (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <Megaphone className="w-3.5 h-3.5 text-yellow-400" /> Broadcast Title
                      </Label>
                      <Input 
                        placeholder="Operation: Summer Grading 2024"
                        className="h-14 bg-white/5 border-white/10 text-white rounded-2xl text-base font-bold placeholder:text-white/20 focus:ring-yellow-400/25 focus:border-yellow-400"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                          <Target className="w-3.5 h-3.5 text-yellow-400" /> Target Sector
                        </Label>
                        <Select value={targetType} onValueChange={(v: any) => setTargetType(v)}>
                          <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-2xl text-sm font-bold focus:ring-yellow-400/25">
                            <SelectValue placeholder="Select Target" />
                          </SelectTrigger>
                          <SelectContent className="premium-card bg-black border border-white/10 text-white overflow-hidden">
                            <SelectItem value="all" className="rounded-xl">All Active Units</SelectItem>
                            <SelectItem value="group" className="rounded-xl">Specific Belt Group</SelectItem>
                            <SelectItem value="individual" className="rounded-xl">Specific Individual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {targetType === 'group' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Select Belt Rank</Label>
                           <Select value={targetGroup} onValueChange={setTargetGroup}>
                             <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-2xl text-sm font-bold">
                               <SelectValue placeholder="Select Rank..." />
                             </SelectTrigger>
                             <SelectContent className="premium-card bg-black border border-white/10 text-white overflow-hidden">
                               {beltRanks.map(rank => (
                                 <SelectItem key={rank} value={rank} className="rounded-xl">{rank}</SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                        </div>
                      )}

                      {targetType === 'individual' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Select Student Unit</Label>
                           <Select value={targetIndividual} onValueChange={setTargetIndividual}>
                             <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-2xl text-sm font-bold">
                               <SelectValue placeholder="Select Member..." />
                             </SelectTrigger>
                             <SelectContent className="premium-card bg-black border border-white/10 text-white overflow-hidden">
                               {students.map(s => (
                                 <SelectItem key={s.id} value={s.id} className="rounded-xl">{s.name}</SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white">Signal Content</Label>
                    <Textarea 
                      placeholder="Enter the tactical intelligence to transmit..."
                      className="min-h-[160px] bg-white/5 border-white/10 rounded-3xl p-6 text-sm font-medium resize-none text-white placeholder:text-white/20 focus:ring-yellow-400/25 focus:border-yellow-400"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-yellow-400 shadow-lg">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Push Notification</p>
                        <p className="text-[9px] text-white/40 font-bold uppercase mt-0.5 tracking-tighter">Instant mobile delivery</p>
                      </div>
                    </div>
                    <Switch 
                      checked={includePush} 
                      onCheckedChange={setIncludePush}
                      className="data-[state=checked]:bg-yellow-400"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 bg-yellow-400 text-black hover:bg-yellow-500 rounded-[28px] text-xs font-bold uppercase tracking-[0.4em] shadow-glow active:scale-95 transition-all group"
                  >
                    {loading ? (
                      <span className="animate-pulse">Transmitting Signal...</span>
                    ) : (
                      <>Deploy Intelligence <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {history.length === 0 ? (
                  <div className="h-64 border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-center p-12 text-white/40 opacity-40">
                    <History className="w-12 h-12 mb-4 text-yellow-400" />
                    <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">No communications logged in tactical history</p>
                  </div>
                ) : (
                  history.map((msg, i) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass p-6 border-white/5 hover:border-yellow-400/30 transition-all rounded-[32px] group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-yellow-400 bg-white/5 border border-white/10">
                            {msg.type === 'announcements' ? <Megaphone className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-tight">{msg.title}</h4>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                              {msg.type === 'announcements' ? 'Broadcast' : `Targeted: ${msg.targetType}`} • {msg.timestamp?.toDate().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {msg.pushSent && (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                            Push Sent
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs font-medium text-white/80 leading-relaxed pl-[52px]">
                        {msg.message}
                      </p>
                      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5 pl-[52px]">
                         <div className="flex items-center gap-1.5 opacity-60">
                           <User className="w-3.5 h-3.5 text-yellow-400" />
                           <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{msg.sender}</span>
                         </div>
                         <div className="flex items-center gap-1.5 opacity-60">
                           <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                           <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Delivered</span>
                         </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Insights & Stats */}
        <div className="md:col-span-12 lg:col-span-5 space-y-6">
           <div className="glass p-8 border-white/5 rounded-[32px] shadow-glow">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-yellow-400 shadow-lg">
                    <Zap className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-tight leading-none">Signal Intel</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Engagement Overview</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Weekly Reach</p>
                    <p className="text-2xl font-heading font-black text-white uppercase italic">842 Units</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Push Success</p>
                    <p className="text-2xl font-heading font-black text-emerald-400 uppercase italic">98.4%</p>
                 </div>
              </div>
           </div>

           <div className="glass p-8 border-white/5 rounded-[32px] relative overflow-hidden shadow-glow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl" />
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-yellow-400" /> Tactical Reminders
              </h4>
              <div className="space-y-4">
                 {[
                   { label: 'Upcoming Grading', count: '4 Days Away', color: 'bg-rose-500' },
                   { label: 'Membership Cycle', count: '12 Expiring', color: 'bg-yellow-500' },
                   { label: 'Mat Maintenance', count: 'Completed', color: 'bg-emerald-500' },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-yellow-400/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className={cn("w-2 h-2 rounded-full", item.color)} />
                         <span className="text-[11px] font-bold text-white/60 group-hover:text-white transition-colors">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-white italic">{item.count}</span>
                   </div>
                 ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-yellow-400">
                 View Operations Calendar <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
           </div>

           <div className="p-8 bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 text-white rounded-[32px] relative overflow-hidden shadow-glow-gold">
              <div className="relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400 mb-3 italic">Command Alert</h4>
                 <p className="text-base font-bold leading-relaxed italic">
                   "Communication is the nervous system of discipline. Without clear signals, the mission falters."
                 </p>
                 <div className="h-1 w-12 bg-yellow-400 mt-6 opacity-40 rounded-full" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
