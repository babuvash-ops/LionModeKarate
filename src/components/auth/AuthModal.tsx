import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Key, 
  UserPlus, 
  LogIn, 
  Send, 
  Check, 
  Lock, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import GoldButton from '@/components/shared/GoldButton';
import DojoLogo from '@/components/shared/DojoLogo';
import { submitMemberRegistration } from '@/data/memberRegistrations';
import { toast } from 'sonner';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, signInWithStudentId, authModalReason } = useAuth();
  
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [studentIdInput, setStudentIdInput] = useState('');
  const [isSubmittingId, setIsSubmittingId] = useState(false);

  // Registration Form State
  const [regParentName, setRegParentName] = useState('');
  const [regParentPhone, setRegParentPhone] = useState('');
  const [regParentEmail, setRegParentEmail] = useState('');
  const [regStudentName, setRegStudentName] = useState('');
  const [regPassportId, setRegPassportId] = useState('');
  const [regProgram, setRegProgram] = useState('little_warriors');
  const [regSubmitted, setRegSubmitted] = useState<any | null>(null);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleStudentIdLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdInput.trim()) {
      toast.error('Please enter your allocated Student ID');
      return;
    }
    setIsSubmittingId(true);
    try {
      const ok = await signInWithStudentId(studentIdInput.trim());
      if (ok) {
        closeAuthModal();
      }
    } finally {
      setIsSubmittingId(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regParentName.trim() || !regParentPhone.trim() || !regParentEmail.trim() || !regStudentName.trim() || !regPassportId.trim()) {
      toast.error('Please fill in all required parent and student registration fields');
      return;
    }

    setIsSubmittingReg(true);
    try {
      const result = submitMemberRegistration({
        parentName: regParentName,
        parentPhone: regParentPhone,
        parentEmail: regParentEmail,
        studentName: regStudentName,
        passportId: regPassportId,
        program: regProgram
      });
      setRegSubmitted(result);
      toast.success('Registration submitted to Sensei Babu!', {
        description: 'Sensei has received your details and will email/WhatsApp your Student ID.'
      });
    } catch (err: any) {
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmittingReg(false);
    }
  };

  const resetForm = () => {
    setRegSubmitted(null);
    setRegParentName('');
    setRegParentPhone('');
    setRegParentEmail('');
    setRegStudentName('');
    setRegPassportId('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window - Approved Template 01 Obsidian Glass */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-8"
        >
          {/* Subtle gold glow aura in background */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dojo Logo & Brand */}
          <div className="mb-4 flex justify-start">
            <DojoLogo size="md" glowing />
          </div>

          {/* Privacy & Member Access Notice */}
          <div className="mb-5 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/70 text-xs">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>Strict Privacy: Parents can only view their child's allocated student records.</span>
          </div>

          {/* Tabs: Sign-In vs Register */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => { setTab('signin'); setRegSubmitted(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-heading uppercase tracking-wider transition-all cursor-pointer ${
                tab === 'signin'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFB800] text-black font-bold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Member Sign-In</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-heading uppercase tracking-wider transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFB800] text-black font-bold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Member</span>
            </button>
          </div>

          {/* TAB 1: SIGN IN */}
          {tab === 'signin' && (
            <div className="space-y-5">
              {/* Student ID Direct Form */}
              <form onSubmit={handleStudentIdLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-heading uppercase tracking-wider text-white/80 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Student ID Number
                    </span>
                    <span className="text-[10px] text-white/40 lowercase">allocated by sensei</span>
                  </label>
                  <input
                    type="text"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="e.g. LMK-2024-001"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white font-mono text-sm uppercase placeholder:normal-case placeholder:text-white/30 transition-all"
                    required
                  />
                </div>

                {/* Quick Hint / Demo Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/50">
                  <span>Sample Student IDs:</span>
                  <button
                    type="button"
                    onClick={() => setStudentIdInput('LMK-2024-001')}
                    className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-[#D4AF37] font-mono transition-all"
                  >
                    LMK-2024-001 (Liam)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentIdInput('LMK-2024-002')}
                    className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-[#D4AF37] font-mono transition-all"
                  >
                    LMK-2024-002 (Sipho)
                  </button>
                </div>

                <GoldButton
                  type="submit"
                  size="md"
                  disabled={isSubmittingId}
                  className="w-full justify-center"
                >
                  {isSubmittingId ? 'Verifying Student ID...' : 'Enter Member Portal (Osu!)'}
                </GoldButton>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0A0A0A] px-3 text-[10px] uppercase tracking-widest text-white/40 font-heading">
                  Or Continue With Google
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>

              {/* Google Sign-in Button */}
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white text-black font-medium text-sm hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-xs text-[#D4AF37] hover:underline font-heading tracking-wider uppercase cursor-pointer"
                >
                  Need a Student ID? Click here to register your child →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER MEMBER FORM */}
          {tab === 'register' && (
            <div>
              {regSubmitted ? (
                <div className="space-y-5 text-center py-4">
                  <div className="w-16 h-16 rounded-3xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
                      Registration Received, Osu!
                    </h3>
                    <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
                      Your child <strong className="text-white">{regSubmitted.studentName}</strong>'s details have been securely logged and dispatched to Sensei Babu (<span className="text-[#D4AF37]">babuvash@gmail.com</span>).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-white/50">Parent Name:</span>
                      <span className="text-white font-medium">{regSubmitted.parentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Contact Number:</span>
                      <span className="text-white font-medium">{regSubmitted.parentPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Student Passport ID:</span>
                      <span className="text-white font-mono">{regSubmitted.passportId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Status:</span>
                      <span className="text-amber-400 font-heading uppercase tracking-wider">Awaiting Sensei ID Allocation</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-white/60">
                    Sensei Babu will review the registration and email / WhatsApp your official <strong>Student ID</strong>. You will then use that Student ID to enter your private student passport area.
                  </p>

                  <div className="flex flex-col gap-2.5 pt-2">
                    <a
                      href={`https://wa.me/27820000000?text=${encodeURIComponent(
                        `Osu Sensei Babu! I have registered my child ${regSubmitted.studentName} (Passport: ${regSubmitted.passportId}) on Dojo OS and am awaiting my official Student ID.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-heading uppercase tracking-wider transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Sensei Babu for Quick ID</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => { setTab('signin'); setRegSubmitted(null); }}
                      className="w-full py-2.5 text-xs text-white/60 hover:text-white uppercase font-heading tracking-wider"
                    >
                      Return to Member Sign-In
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <p className="text-xs text-white/60 leading-relaxed">
                    Register below to submit your parent and child credentials. Sensei will allocate your official Student ID and email it back to you.
                  </p>

                  {/* Parent Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading uppercase tracking-wider text-white/80">
                      Parent / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      value={regParentName}
                      onChange={(e) => setRegParentName(e.target.value)}
                      placeholder="e.g. Priya Naidoo"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white text-xs"
                    />
                  </div>

                  {/* Parent Phone / WhatsApp & Email in 2 cols */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-heading uppercase tracking-wider text-white/80">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        value={regParentPhone}
                        onChange={(e) => setRegParentPhone(e.target.value)}
                        placeholder="e.g. +27 82 345 6780"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-heading uppercase tracking-wider text-white/80">
                        Parent Email Address *
                      </label>
                      <input
                        type="email"
                        value={regParentEmail}
                        onChange={(e) => setRegParentEmail(e.target.value)}
                        placeholder="e.g. parent@gmail.com"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Student Full Name & Passport ID in 2 cols */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-heading uppercase tracking-wider text-white/80">
                        Student Full Name (Child) *
                      </label>
                      <input
                        type="text"
                        value={regStudentName}
                        onChange={(e) => setRegStudentName(e.target.value)}
                        placeholder="e.g. Liam Naidoo"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-heading uppercase tracking-wider text-white/80">
                        Student Passport / ID No. *
                      </label>
                      <input
                        type="text"
                        value={regPassportId}
                        onChange={(e) => setRegPassportId(e.target.value)}
                        placeholder="e.g. ZA-2013-0514-N"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white text-xs font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Training Program */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-heading uppercase tracking-wider text-white/80">
                      Training Program
                    </label>
                    <select
                      value={regProgram}
                      onChange={(e) => setRegProgram(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white text-xs font-heading uppercase"
                    >
                      <option value="little_warriors">Lionmode Kids (Ages 4 - 7)</option>
                      <option value="junior_fighters">Little Lions & Juniors (Ages 8 - 12)</option>
                      <option value="teen_warriors">Cadet Teens (Ages 13 - 17)</option>
                      <option value="adult_martial_arts">Adults & Senior Martial Arts</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <GoldButton
                      type="submit"
                      size="md"
                      disabled={isSubmittingReg}
                      className="w-full justify-center"
                    >
                      {isSubmittingReg ? 'Submitting to Sensei...' : 'Submit Registration to Sensei Babu'}
                    </GoldButton>
                  </div>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
