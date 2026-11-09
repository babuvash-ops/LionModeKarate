import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Shield } from "lucide-react";
import DojoLogo from "@/components/shared/DojoLogo";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#D4AF37] selection:text-black">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group text-white/70 hover:text-white">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-heading uppercase tracking-wider">Back to Academy</span>
          </Link>
          <DojoLogo size="sm" href="/" />
          <Link to="/privacy" className="text-xs font-heading uppercase tracking-wider text-[#D4AF37] hover:underline">
            Privacy Policy
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-heading uppercase tracking-widest font-bold">
            <Shield className="w-3.5 h-3.5" />
            Dojo OS Terms
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-white/60 font-body">
            Lion Mode Karate Academy • Durban, South Africa • Last Updated: October 2026
          </p>
        </div>

        <section className="space-y-3 text-sm text-white/80 font-body leading-relaxed">
          <h2 className="font-heading text-xl font-bold uppercase text-[#D4AF37]">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Lion Mode Karate Dojo OS mobile or web application, you agree to comply with these terms, dojo etiquette, and safety guidelines. If you are registering a student under 18 years of age, you confirm that you are the legal parent or guardian.
          </p>
        </section>

        <section className="space-y-3 text-sm text-white/80 font-body leading-relaxed">
          <h2 className="font-heading text-xl font-bold uppercase text-[#D4AF37]">2. Tatami Safety & Physical Activity Disclaimer</h2>
          <p>
            Karate and martial arts training involves physical contact, cardiovascular exertion, and agility drills. Members must disclose pre-existing medical conditions or physical limitations prior to stepping onto the tatami. Lion Mode Karate Academy maintains certified instructors and first aid preparedness at all training sessions.
          </p>
        </section>

        <section className="space-y-3 text-sm text-white/80 font-body leading-relaxed">
          <h2 className="font-heading text-xl font-bold uppercase text-[#D4AF37]">3. Dojo Code of Conduct & Respect (Rei)</h2>
          <p>
            Respect for instructors, training partners, and the dojo environment is paramount. Verbal abuse, bullying, unsportsmanlike behavior, or reckless disregard for sparring safety will result in immediate suspension or termination of dojo membership.
          </p>
        </section>

        <section className="space-y-3 text-sm text-white/80 font-body leading-relaxed">
          <h2 className="font-heading text-xl font-bold uppercase text-[#D4AF37]">4. Pro Shop Orders & Returns</h2>
          <p>
            Uniforms (Gis), belts, protective equipment, and apparel purchased via the Pro Shop may be exchanged for alternative sizing within 14 days of receipt, provided the equipment remains unworn, undamaged, and in original packaging.
          </p>
        </section>

        <section className="space-y-3 text-sm text-white/80 font-body leading-relaxed border-t border-white/10 pt-6">
          <h2 className="font-heading text-xl font-bold uppercase text-[#D4AF37]">5. Inquiries & Governance</h2>
          <p className="text-white/70">
            For queries regarding membership agreements, examinations, or billing, contact Sensei Babu at <a href="mailto:lionsdentck@gmail.com" className="text-[#D4AF37]">lionsdentck@gmail.com</a>.
          </p>
        </section>
      </main>
    </div>
  );
}
