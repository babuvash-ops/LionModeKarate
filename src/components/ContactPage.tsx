import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Target, Shield, User, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import GoldButton from './shared/GoldButton';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Identity sync error. Form parameters incomplete.');
      return;
    }
    
    setSubmitting(true);
    setTimeout(() => {
      toast.success('TRANSMISSION SUCCESSFUL', {
        description: 'Frequency synchronized. Command Unit will respond soon.'
      });
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background pb-32 pt-28 relative overflow-hidden">
      {/* Dynamic light halos */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[25rem] h-[25rem] bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

      {/* HEADER SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-8 mb-20 animate-fade-in">
        <div className="text-left space-y-4 max-w-3xl">
          <span className="section-subtitle">
            Direct Uplink
          </span>
          <h1 className="hero-title text-white tracking-wide uppercase font-bold leading-none">
            COMMS_ <br />
            <span className="text-primary">FREQUENCY_HUB</span>
          </h1>
          <p className="body-text-premium text-white/70 font-sans text-base md:text-lg leading-relaxed max-w-2xl">
            Maintain operational silence or establish a direct encrypted connection for recruitment, media, or technical orientation inquiries.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Coordinates Block */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="premium-card space-y-6 overflow-hidden">
              <span className="section-subtitle">HQ Location Parameters</span>
              <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-white leading-none">
                TACTICAL_COORDS
              </h3>
              <p className="font-sans text-xs md:text-sm text-white/50 leading-relaxed italic">
                Our Physical Base of Operations sits securely in Gauteng. Visitor protocol requires pre-approved trial registration or active student clearance credentials.
              </p>

              {/* Coordinates details */}
              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-2xl transition-all">
                  <div className="w-10 h-10 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] block leading-none">COMMUNICATION RADAR</span>
                    <span className="text-sm font-heading font-medium text-white uppercase tracking-wider block mt-1">+27 82 123 4567</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-2xl transition-all">
                  <div className="w-10 h-10 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] block leading-none">DIGITAL INBOX</span>
                    <span className="text-sm font-heading font-medium text-primary uppercase tracking-wider block mt-1">ops@dojo-os.com</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-2xl transition-all">
                  <div className="w-10 h-10 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] block leading-none">PHYSICAL Outpost</span>
                    <span className="text-xs font-sans text-white/60 block mt-1 leading-relaxed">
                      123 Warrior Lane, Tactical District, Gauteng
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Frame */}
            <div className="h-64 w-full rounded-[24px] overflow-hidden border border-white/5 grayscale saturate-50 opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14332.186419736412!2d28.0536!3d-26.1075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA2JzI3LjAiUyAyOMKwMDMnMTMuMCJF!5e0!3m2!1sen!2sza!4v1620000000000!5m2!1sen!2sza" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
              />
            </div>
          </div>

          {/* Form Uplink Block */}
          <div className="lg:col-span-7">
            <div className="premium-card space-y-8 shadow-2xl relative text-left overflow-hidden">
              <div className="space-y-1">
                <span className="section-subtitle">Secure Comms Protocol</span>
                <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">
                  TRANSMISSION_FORM
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-white/55">
                      IDENT CLEARANCE (NAME)
                    </label>
                    <div className="relative">
                      <Input 
                        placeholder="e.g. Kenji Tanaka" 
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        required
                        className="h-12 bg-white/5 border border-white/10 rounded-xl text-white font-sans text-sm pl-4 pr-4 focus:border-primary/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-white/20 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-white/55">
                      SIGNAL ADDRESS (EMAIL)
                    </label>
                    <div className="relative">
                      <Input 
                        placeholder="e.g. warrior@dojo.os" 
                        type="email"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        required
                        className="h-12 bg-white/5 border border-white/10 rounded-xl text-white font-sans text-sm pl-4 pr-4 focus:border-primary/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-white/20 transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-white/55">
                    CLASSIFICATION SUBJECT
                  </label>
                  <Input 
                    placeholder="e.g. Tactical Enrollment Query" 
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                    required
                    className="h-12 bg-white/5 border border-white/10 rounded-xl text-white font-sans text-sm pl-4 pr-4 focus:border-primary/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-white/20 transition-all font-semibold" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-white/55">
                    CLASSIFIED MESSAGE DETAILS
                  </label>
                  <textarea 
                    placeholder="Provide your mission parameters or briefing here..." 
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    required
                    className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white font-sans text-sm outline-none focus:border-primary/40 transition-all resize-none placeholder-white/20 font-semibold"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                  <Shield className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest font-heading italic leading-none">
                    UPLINK CHANNELS SECURE • DIRECT ROUTING ENABLED
                  </span>
                </div>

                <div className="pt-2">
                  <GoldButton 
                    type="submit" 
                    size="lg"
                    isLoading={submitting}
                    className="w-full h-14 text-xs font-heading font-bold tracking-widest uppercase italic rounded-xl shadow-glow-gold"
                  >
                    INITIATE_UPLINK_TRANSMISSION
                  </GoldButton>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
