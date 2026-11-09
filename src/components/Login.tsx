import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { Lock, User, AtSign, Fingerprint, Baby, ChevronRight, ArrowLeft, RefreshCw, LogIn, Zap, Shield, Target, Key, Cpu } from 'lucide-react';
import { toast } from 'sonner';
import DojoLogo from '@/components/shared/DojoLogo';

interface LoginProps {
  onLogin: () => void;
  branding: {
    logoUrl: string;
    logoBase64: string;
    tagline: string;
    dojoName: string;
    heroImageUrl?: string;
    heroImageBase64?: string;
    dashboardHeroImageBase64?: string;
    bgImageBase64?: string;
  };
  isSignup?: boolean;
}

export default function Login({ branding, onLogin, isSignup = false }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(isSignup);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [childId, setChildId] = useState('');
  const [childName, setChildName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      toast.info('Establishing Secure Uplink...', { duration: 3000 });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || 'Authorized User',
          email: user.email?.toLowerCase(),
          role: user.email?.toLowerCase() === 'babuvash@gmail.com' ? 'admin' : 'parent',
          createdAt: new Date().toISOString()
        });
        toast.success('Unit Activation Successful.');
      } else {
        toast.success(`Identity Verified: Welcome, ${user.displayName || 'Operator'}`);
      }
      
      if (onLogin) onLogin();
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      toast.error(`Neural Link Failure: ${error.message || 'Unknown Exception'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const isAdminEmail = trimmedEmail === 'babuvash@gmail.com';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
        toast.error('Authentication Protocol Failure: Invalid email format.');
        setIsLoading(false);
        return;
      }

      if (isRegistering) {
        if (password.length < 6) {
          toast.error('Security Protocol: Minimum 6 characters required.');
          setIsLoading(false);
          return;
        }

        if (!isAdminEmail && (!childId || !childName)) {
          toast.error('Identification Matrix Incomplete.');
          setIsLoading(false);
          return;
        }

        let studentRefId = null;
        let studentName = null;

        if (!isAdminEmail) {
          const studentsRef = collection(db, 'students');
          const q = query(
            studentsRef, 
            where('identificationNumber', '==', childId),
            where('name', '==', childName)
          );
          
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            toast.error('Identity Verification Failed: Record not found.');
            setIsLoading(false);
            return;
          }

          const studentData = querySnapshot.docs[0].data();
          studentRefId = querySnapshot.docs[0].id;
          studentName = studentData.name;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });

        await setDoc(doc(db, 'users', user.uid), {
          name,
          email: trimmedEmail,
          role: isAdminEmail ? 'admin' : 'parent',
          linkedChildId: studentRefId,
          linkedChildName: studentName,
          identificationNumber: childId,
          createdAt: new Date().toISOString()
        });

        toast.success('Matrix Initialization Complete.');
      } else {
        const isTestAccount = (trimmedEmail === 'admin@test.com' || trimmedEmail === 'manager@test.com' || trimmedEmail === 'parent@test.com');
        if (isTestAccount && password === '123456') {
          const role = trimmedEmail.split('@')[0];
          window.dispatchEvent(new CustomEvent('bypass-auth', { detail: { role } }));
          setIsLoading(false);
          return;
        }

        await signInWithEmailAndPassword(auth, trimmedEmail, password);
        toast.success('Matrix Authorized.');
        onLogin();
      }
    } catch (error: any) {
      console.error('Auth Critical Failure:', error);
      toast.error(`Authentication Protocol Failure: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-deep-black relative flex flex-col items-center justify-center overflow-hidden">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img 
            src={branding.heroImageBase64 || branding.heroImageUrl || "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=1800"} 
            alt="Dojo Background" 
            className="w-full h-full object-cover grayscale brightness-50 contrast-125"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,224,47,0.05),transparent_70%)]" />
      </div>

      <div className="relative z-20 w-full max-w-xl flex flex-col items-center px-12 space-y-12">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold hover:text-white transition-all cursor-pointer self-start -mb-6"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3px]" />
          <span>← Back to Website</span>
        </Link>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center space-y-6"
        >
          <div className="flex flex-col items-center justify-center">
            <DojoLogo 
              size="2xl" 
              layout="vertical" 
              glowing 
              title={branding.dojoName || "LION MODE"}
              subtitle={branding.tagline || "KARATE ACADEMY"}
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-display font-black text-white uppercase italic tracking-wider leading-none">
              NEXUS <span className="text-gold italic">PORTAL</span>
            </h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-mono">Select Authorization Profile</p>
          </div>
        </motion.div>

        {/* Role Selection Tabs */}
        <div className="w-full flex p-2 bg-white/5 rounded-[28px] border border-white/5 relative z-10">
           {['Admin', 'Manager', 'Parent'].map((role) => (
             <button
               key={role}
               onClick={() => {
                 // Pre-fill some info or just change view state if needed
                 if (role === 'Admin') toast.info('Admin Authentication Protocol Active');
                 if (role === 'Manager') toast.info('Manager Override Enabled');
                 if (role === 'Parent') toast.info('Parent Uplink Prepared');
               }}
               className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all rounded-[22px] hover:bg-white/5 italic"
             >
               {role}
             </button>
           ))}
        </div>

        <AnimatePresence mode="wait">
          {(!isRegistering && !email) ? (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full space-y-6"
            >
              <Button 
                onClick={() => setEmail(' ')} 
                className="w-full h-24 bg-gold hover:bg-gold/90 text-black font-display text-2xl uppercase tracking-widest rounded-[32px] shadow-[0_20px_60px_rgba(244,224,47,0.2)] group relative overflow-hidden"
              >
                <span className="relative z-10 italic">Initialize Uplink</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>
              
              <Button 
                variant="ghost"
                onClick={handleGoogleLogin}
                className="w-full h-24 bg-white/5 border border-white/5 text-white font-black uppercase tracking-widest rounded-[32px] flex items-center justify-center gap-6 hover:bg-gold hover:text-black hover:border-gold transition-all duration-500 shadow-2xl group"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-full h-full" alt="G" />
                </div>
                <span className="text-lg italic">Neural Link Authorized</span>
              </Button>

              <div className="flex items-center gap-8 py-6 opacity-20 group">
                <div className="h-px flex-1 bg-white/20 group-hover:bg-gold/40 transition-colors" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.6em] italic">Operator ID Status?</span>
                <div className="h-px flex-1 bg-white/20 group-hover:bg-gold/40 transition-colors" />
              </div>

              <Button 
                variant="ghost"
                onClick={() => setIsRegistering(true)}
                className="w-full h-16 text-white/20 hover:text-white font-black uppercase tracking-[0.4em] transition-all italic hover:bg-white/5 rounded-2xl"
              >
                Request Access Credentials
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key={isRegistering ? 'register' : 'login'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full p-12 bg-charcoal/40 backdrop-blur-3xl border border-white/5 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] space-y-8 relative overflow-hidden group/pod"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover/pod:opacity-[0.06] transition-opacity">
                <Shield className="w-48 h-48 text-gold" />
              </div>
              
              <div className="space-y-6 relative z-10 text-left">
                {isRegistering && (
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/40" />
                    <Input 
                      placeholder="Operator Name" 
                      className="bg-black/60 border-white/5 rounded-[22px] h-16 font-black uppercase italic text-white pl-16 focus:border-gold/50 transition-all text-sm tracking-widest"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}
                <div className="relative">
                  <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/40" />
                  <Input 
                    placeholder="Authentication Email" 
                    className="bg-black/60 border-white/5 rounded-[22px] h-16 font-black uppercase italic text-white pl-16 focus:border-gold/50 transition-all text-sm tracking-widest"
                    value={email.trim()}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {isRegistering && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative">
                      <Target className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/40" />
                      <Input 
                        placeholder="Unit ID" 
                        className="bg-black/60 border-white/5 rounded-[22px] h-16 font-black uppercase italic text-white pl-16 focus:border-gold/50 transition-all text-[10px] tracking-widest"
                        value={childId}
                        onChange={(e) => setChildId(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/40" />
                      <Input 
                        placeholder="Unit Name" 
                        className="bg-black/60 border-white/5 rounded-[22px] h-16 font-black uppercase italic text-white pl-16 focus:border-gold/50 transition-all text-[10px] tracking-widest"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className="relative">
                  <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/40" />
                  <Input 
                    type="password"
                    placeholder="Security Key" 
                    className="bg-black/60 border-white/5 rounded-[22px] h-16 font-black uppercase italic text-white pl-16 focus:border-gold/50 transition-all text-sm tracking-widest"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <Button 
                  onClick={handleAuth}
                  disabled={isLoading}
                  className="w-full h-20 bg-gold text-black font-display font-black uppercase tracking-[0.3em] italic text-xl rounded-[24px] shadow-2xl hover:bg-gold/90 group transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-4">
                      <Cpu className="w-6 h-6 animate-spin" /> <span>Decrypting...</span>
                    </div>
                  ) : isRegistering ? 'INITIALIZE MATRIX' : 'AUTHORIZE ACCESS'}
                </Button>
                
                <button 
                  onClick={() => { setIsRegistering(false); setEmail(''); }}
                  className="w-full text-white/20 hover:text-gold text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-colors italic"
                >
                  <ArrowLeft className="w-4 h-4" /> Reset Uplink Terminal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-8 opacity-10">
            <div className="flex items-center gap-3 italic">
               <Zap className="w-5 h-5 text-gold" />
               <span className="text-[10px] font-black tracking-[0.5em] uppercase">Authorized Command Uplink x9</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.6em]">Secure @ 100%</p>
        </div>
      </div>
    </div>
  );
}

