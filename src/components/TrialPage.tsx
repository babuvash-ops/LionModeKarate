import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Target, Zap, Clock, Calendar, CheckCircle2, ArrowRight, User, Phone, Mail, Flame, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import GoldButton from "./shared/GoldButton";
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

export default function TrialPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [track, setTrack] = useState('Adult Operational (16+)');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const benefits = [
    { title: 'TACTICAL ASSESSMENT', desc: '1-on-1 performance mapping session with our lead instructor.', icon: Target },
    { title: 'CURRICULUM SESSION', desc: 'Jump into any open operational class from our active schedule.', icon: Zap },
    { title: 'PORTAL ONBOARDING', desc: 'Introduction to our Digital Student Passport systems.', icon: ShieldCheck },
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      toast.error('Identity protocol required. Please fill in all fields.', {
        description: 'Synchronizing systems requires complete candidate telemetry.'
      });
      return;
    }

    setSubmitting(true);
    try {
      // Create lead in Firestore
      const namesList = name.trim().split(' ');
      const firstName = namesList[0];
      const lastName = namesList.slice(1).join(' ') || '';

      await addDoc(collection(db, 'leads'), {
        firstName,
        lastName,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        track,
        source: 'Free Trial Website Form',
        status: 'new',
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      toast.success('TRAINING PROTOCOL SECURED', {
        description: 'Your trial credential is synchronized. A Command Unit will query soon.'
      });
    } catch (err: any) {
      console.error('Error booking trial:', err);
      toast.error('SYSTEM CONFLICT', {
        description: err.message || 'Identity synchronization failed. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32 pt-28">
      {/* Decorative top background elements */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[25rem] h-[25rem] bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        
        {/* HEADER SECTION - Matching Home Page Typography & Sizes */}
        <div className="text-left space-y-4">
          <span className="section-subtitle">
            Secure Your Roster Spot
          </span>
          <h1 className="hero-title text-white tracking-wide uppercase font-bold leading-none">
            INJECT_ <br />
            <span className="text-primary">FREE_TRIAL</span>
          </h1>
          <p className="body-text-premium text-white/70 font-sans text-base md:text-lg leading-relaxed max-w-xl">
            Every master was once a candidate. Initialize your credential parameters below to synchronize your tracking identity.
          </p>
        </div>

        {/* BOOKING SECTION (ON TOP) - Beautiful Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Booking Form Card on Top / Prominent */}
          <div className="lg:col-span-7">
            <div className="premium-card relative overflow-hidden group overflow-hidden">
              {/* Subtle design element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.03] rounded-bl-[40px] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key="booking-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    <div className="space-y-1.5 text-left">
                      <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">
                        CANDIDATE_PROFILE
                      </h3>
                      <p className="font-sans text-xs text-white/40 italic">
                        Configure physical details to sync with our session pipeline.
                      </p>
                    </div>

                    <form onSubmit={handleBooking} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 text-left">
                          <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-white/55">
                            FULL IDENTITY
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              required
                              placeholder="e.g. Kenji Tanaka"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="h-12 bg-white/5 border border-white/10 rounded-xl text-white font-sans text-sm pl-11 pr-4 focus:border-primary/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-white/20 transition-all font-semibold"
                            />
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
                          </div>
                        </div>

                        <div className="space-y-2 text-left">
                          <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-white/55">
                            SIGNAL FREQUENCY (PHONE)
                          </label>
                          <div className="relative">
                            <Input
                              type="tel"
                              required
                              placeholder="e.g. +27 82 555 8192"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="h-12 bg-white/5 border border-white/10 rounded-xl text-white font-sans text-sm pl-11 pr-4 focus:border-primary/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-white/20 transition-all font-semibold"
                            />
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-left">
                        <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-white/55">
                          SECURE COMMUNICATION (EMAIL)
                        </label>
                        <div className="relative">
                          <Input
                            type="email"
                            required
                            placeholder="e.g. warrior@dojo.os"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 bg-white/5 border border-white/10 rounded-xl text-white font-sans text-sm pl-11 pr-4 focus:border-primary/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-white/20 transition-all font-semibold"
                          />
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
                        </div>
                      </div>

                      <div className="space-y-2 text-left">
                        <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-white/55">
                          INDUCTION LEVEL (TRAINING TRACK)
                        </label>
                        <div className="relative">
                          <select
                            value={track}
                            onChange={(e) => setTrack(e.target.value)}
                            className="w-full h-12 bg-neutral-900 border border-white/10 rounded-xl text-white font-sans text-sm px-4 focus:border-primary/40 focus:outline-none appearance-none cursor-pointer transition-all font-semibold"
                          >
                            <option className="bg-neutral-950 text-white" value="Little Lions (4-7)">Little Lions (Ages 4-7)</option>
                            <option className="bg-neutral-950 text-white" value="Youth Elite (8-15)">Youth Elite (Ages 8-15)</option>
                            <option className="bg-neutral-950 text-white" value="Adult Operational (16+)">Adult Operational (Ages 16+)</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ArrowRight className="w-4 h-4 text-primary rotate-90" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest font-heading italic leading-none">
                          FREE ASSESSMENT INCLUDED • ZERO FINANCIAL OBLIGATION
                        </span>
                      </div>

                      {/* Precise, compact and polished booking button with the word explicit */}
                      <div className="pt-2">
                        <GoldButton
                          type="submit"
                          size="lg"
                          isLoading={submitting}
                          className="w-full h-14 text-xs font-heading font-bold tracking-widest uppercase italic rounded-xl shadow-glow-gold hover:scale-[1.01] active:scale-[0.98] transition-all"
                        >
                          VERIFY_AND_SUBMIT_TRIAL
                        </GoldButton>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="booking-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto shadow-glow">
                      <Flame className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-3xl font-black text-white uppercase tracking-wider italic leading-none">
                        TELEMETRY_SYNCED
                      </h3>
                      <p className="font-sans text-sm text-white/50 max-w-md mx-auto italic leading-relaxed">
                        Excellent work, candidate <span className="text-primary font-bold">{name}</span>. The Dojo Command Unit is reviewing your orientation schedule. We will contact you at <span className="text-white font-bold">{email}</span> within the next hour.
                      </p>
                    </div>

                    <div className="pt-4 max-w-sm mx-auto">
                      <GoldButton
                        onClick={() => {
                          setSuccess(false);
                          setName('');
                          setPhone('');
                          setEmail('');
                        }}
                        variant="outline"
                        size="md"
                        className="w-full h-12 text-xs font-heading tracking-widest text-primary hover:text-white uppercase font-bold italic rounded-xl"
                      >
                        RESET_REGISTRAR
                      </GoldButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sibling benefits grid - Column aligned alongside on desktop for maximum high-density elegance */}
          <div className="lg:col-span-5 space-y-6">
            <div className="premium-card text-left space-y-6 overflow-hidden">
              <div className="space-y-1">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase font-black tracking-widest text-[9px] px-3.5 py-1 italic rounded-full">
                  ROTATION_RECON
                </Badge>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-white leading-none">
                  BENEFITS_OF_DOJO
                </h3>
              </div>

              <div className="space-y-5">
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-5 items-start p-4 hover:bg-white/[0.02] border border-transparent hover:border-white/5 rounded-2xl transition-all duration-300">
                    <div className="w-11 h-11 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 relative mt-0.5">
                      <b.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider italic">
                        {b.title}
                      </h4>
                      <p className="font-sans text-xs text-white/50 italic leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick telemetry indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="premium-card flex items-center gap-3.5 border border-white/5 text-left overflow-hidden">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] block leading-none">RESPONSE RATE</span>
                  <span className="text-sm font-heading font-bold text-white uppercase tracking-wider italic leading-none block mt-1">{"< 1 HOUR"}</span>
                </div>
              </div>
              <div className="premium-card flex items-center gap-3.5 border border-white/5 text-left overflow-hidden">
                <Award className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] block leading-none">RATING</span>
                  <span className="text-sm font-heading font-bold text-white uppercase tracking-wider italic leading-none block mt-1">4.9 / 5 STARS</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COMPREHENSIVE SHORT SUPPORT / FAQS (SHORTENED AT BOTTOM) */}
        <div className="space-y-8 pt-6 border-t border-white/5">
          <div className="text-left space-y-1">
            <span className="section-subtitle">FAQ MANUAL</span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">SYSTEM_RECON_QUESTIONS</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: 'WHAT SHOULD I WEAR?', a: 'Loose, comfortable athletic wear. Footwear is strictly prohibited on premium training mats.' },
              { q: 'IS IT SUITABLE FOR BEGINNERS?', a: '90% of our active candidates start with zero military or tactical martial arts experience.' },
              { q: 'CAN I BRING A TRAINING PARTNER?', a: 'Absolutely, partner activations are highly encouraged for synchronization and morale.' }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-primary/20 rounded-[24px] text-left space-y-3 transition-all duration-300">
                <h5 className="font-heading text-base font-bold text-primary uppercase tracking-wide italic">{faq.q}</h5>
                <p className="text-white/50 text-xs italic font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
