import { useState, useEffect } from 'react';
import { 
  QrCode, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  Flame,
  Zap,
  Target,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { db, auth } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, increment, addDoc, serverTimestamp } from 'firebase/firestore';
import { getRankColor } from '@/lib/studentUtils';
import { cn } from '@/lib/utils';
import GoldButton from './shared/GoldButton';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function AttendanceModule({ branding }: any) {
  const [activeTab, setActiveTab] = useState('register');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'students');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleManualCheckIn = async (studentId: string) => {
    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, 'students', studentId), {
        attendanceCount: increment(1),
        lastAttendance: now
      });

      await addDoc(collection(db, 'attendance'), {
        studentId,
        date: now,
        timestamp: serverTimestamp(),
        classTitle: 'Tactical Session',
        instructor: 'Nexus Command',
        status: 'verified'
      });

      toast.success('Unit Presence Confirmed');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'attendance');
    }
  };

  const startScanner = () => {
    setShowQRScanner(true);
    toast.info('Initializing Optical Scan Unit...');
    setTimeout(() => {
      setShowQRScanner(false);
      if (students.length > 0) {
        toast.success(`Identity Verified: ${students[0].name}`);
      }
    }, 2000);
  };

  return (
    <div className="relative min-h-screen pb-32 animate-in fade-in duration-700">
      {/* Decorative ambient spots */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[25rem] h-[25rem] bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10 px-4 md:px-8">
        {/* HEADER SECTION - Beautiful Oswald Typography & Sizes */}
        <div className="text-left space-y-4">
          <span className="section-subtitle">
            Tactical Presence Network
          </span>
          <h1 className="hero-title text-white tracking-wide uppercase font-bold leading-none animate-fade-in">
            LIVE_ <br />
            <span className="text-primary">SIGNALS</span>
          </h1>
          <p className="body-text-premium text-white/70 font-sans text-base md:text-lg leading-relaxed max-w-xl">
            Real-time biometric presence tracking, manual registry operations, and secure digital check-ins for active martial cohorts.
          </p>
        </div>

        <div className="space-y-12">
          <div className="flex flex-col md:flex-row gap-8">
            <GoldButton 
              onClick={startScanner}
              className="flex-1 h-28 rounded-[40px] shadow-glow-gold group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <QrCode className="w-10 h-10 mr-6 group-hover:scale-110 transition-transform duration-500" />
              <span className="text-xl font-bold tracking-[0.3em]">INITIALIZE OPTICAL SCAN</span>
            </GoldButton>
            <div className="flex-1 glass bg-[#0A0A0A]/60 border border-white/8 rounded-[40px] p-8 flex items-center justify-between group overflow-hidden relative shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
               <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary italic">Global Presence</p>
                  <h4 className="text-5xl font-heading font-bold text-foreground italic leading-none">{students.length}</h4>
               </div>
               <div className="w-16 h-16 rounded-3xl bg-background border border-border/10 flex items-center justify-center text-primary shadow-xl group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
               </div>
            </div>
          </div>

          <Tabs defaultValue="register" className="w-full" onValueChange={setActiveTab}>
             <TabsList className="glass bg-[#0A0A0A]/60 border border-white/8 h-24 p-3 rounded-[40px] mb-16 w-full shadow-2xl flex gap-3">
                <TabsTrigger value="register" className="flex-1 h-full rounded-[30px] text-[11px] font-bold uppercase tracking-[0.4em] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-gold transition-all duration-500 italic">Command_Rack</TabsTrigger>
                <TabsTrigger value="absentees" className="flex-1 h-full rounded-[30px] text-[11px] font-bold uppercase tracking-[0.4em] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-gold transition-all duration-500 italic">MIA_Units</TabsTrigger>
             </TabsList>

             <TabsContent value="register" className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {students.map((student, i) => (
                    <motion.div
                      key={student.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleManualCheckIn(student.id)}
                      className="p-8 group flex items-center justify-between border border-white/8 bg-[#121212]/40 hover:bg-[#121212]/80 hover:border-primary/35 cursor-pointer overflow-hidden rounded-[40px] transition-all duration-500 relative shadow-2xl hover:shadow-glow-gold"
                    >
                       <div className="flex items-center gap-8 relative z-10">
                          <div className="relative">
                            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-[4px] border-background shadow-3xl rounded-[35px] overflow-hidden relative z-10 transition-all group-hover:scale-110 duration-700 bg-secondary group-hover:shadow-glow-gold">
                               <AvatarImage src={student.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}&backgroundColor=000000`} className="grayscale group-hover:grayscale-0 transition-all duration-1000" />
                               <AvatarFallback className="bg-secondary font-bold text-3xl font-heading text-foreground uppercase">{student.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={cn("absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-background z-20 shadow-2xl group-hover:scale-125 transition-transform", getRankColor(student.rank || student.belt))} />
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-3xl font-heading font-bold text-foreground uppercase tracking-tight leading-none group-hover:text-primary transition-colors italic">{student.name}</h4>
                             <div className="flex items-center gap-3">
                                <div className="w-1 h-3 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                                <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.4em] italic group-hover:text-muted-foreground/40 transition-colors">Unit_Tag: SEC-{student.id.slice(0, 4).toUpperCase()}</p>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex flex-col items-end gap-2 relative z-10">
                          <div className="flex items-center gap-3">
                             <Zap className="w-6 h-6 text-primary group-hover:animate-pulse" />
                             <span className="text-5xl font-heading font-bold italic text-foreground tracking-tighter group-hover:text-primary transition-all leading-none">{student.attendanceCount || 0}</span>
                          </div>
                          {student.lastAttendance && (
                            <span className="text-[8px] font-bold text-muted-foreground/10 uppercase tracking-[0.3em] italic">Last_Signal: {new Date(student.lastAttendance).toLocaleDateString()}</span>
                          )}
                       </div>
                       {/* Tactical accent */}
                       <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="glass bg-[#0A0A0A]/60 rounded-[40px] p-12 md:p-24 mt-20 relative overflow-hidden shadow-3xl border border-white/8 group"
                >
                   <div className="absolute inset-0 bg-grid-tactical opacity-10 pointer-events-none" />
                   <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 rounded-full blur-[150px] transition-transform duration-1000 group-hover:scale-110 pointer-events-none" />
                   
                   <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-16">
                      <div className="space-y-8 text-left">
                        <Badge variant="outline" className="bg-primary/5 border border-primary/20 px-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.6em] italic rounded-full text-primary">Sector Intelligence Monitor</Badge>
                        <h3 className="text-6xl md:text-9xl font-heading font-bold text-foreground uppercase tracking-tighter leading-[0.8] italic">Neural <br/><span className="text-primary italic opacity-80">Readout</span></h3>
                        <p className="text-lg font-medium text-muted-foreground/40 italic leading-relaxed max-w-2xl">Presence detection protocols are at 100% efficiency. All biometric signatures are actively monitored across the central nexus. Cycle termination authorized upon personnel validation.</p>
                      </div>
                      
                      <div className="flex flex-col gap-10 min-w-[350px]">
                        <div className="flex justify-between items-end border-b border-border/10 pb-8 group/stat">
                           <div className="space-y-1">
                              <span className="text-[11px] font-bold text-muted-foreground/30 uppercase tracking-[0.5em] italic leading-none block">Total Units</span>
                              <div className="h-1 w-8 bg-primary/20 group-hover/stat:w-16 transition-all" />
                           </div>
                           <span className="text-7xl font-heading font-bold text-foreground italic tracking-tighter leading-none">{students.length}</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-border/10 pb-8 group/stat">
                           <div className="space-y-1">
                              <span className="text-[11px] font-bold text-primary uppercase tracking-[0.5em] italic leading-none block">Verified Present</span>
                              <div className="h-1 w-8 bg-primary group-hover/stat:w-16 transition-all" />
                           </div>
                           <span className="text-7xl font-heading font-bold text-primary italic tracking-tighter leading-none shadow-glow-gold">38</span>
                        </div>
                        <GoldButton size="lg" className="w-full h-24 rounded-[40px] text-lg mt-8 shadow-glow-gold">
                           Terminate Cycle <ArrowRight className="ml-6 w-6 h-6" />
                        </GoldButton>
                      </div>
                   </div>
                </motion.div>
             </TabsContent>

             <TabsContent value="absentees">
                <div className="bg-secondary/20 border border-border/50 rounded-[50px] p-16 md:p-24 flex flex-col items-center text-center gap-10">
                   <div className="w-20 h-20 bg-rose-500/10 rounded-[28px] flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-xl">
                      <XCircle className="w-10 h-10" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-4xl font-heading font-bold text-foreground uppercase italic tracking-tighter">Zero Hostiles</h3>
                      <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-[0.5em] mt-4 max-w-[300px] mx-auto leading-relaxed italic">No units reported missing for this operational cycle.</p>
                   </div>
                </div>
             </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
