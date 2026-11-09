import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Lock, Trash2, Mail, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import DojoLogo from "@/components/shared/DojoLogo";
import GoldButton from "@/components/shared/GoldButton";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

export default function PrivacyPolicy() {
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteEmail.trim()) {
      toast.error("Please enter your registered account email");
      return;
    }
    setSubmitting(true);
    try {
      // Record account deletion request for compliance
      await base44.entities.Lead.create({
        name: "Account Deletion Request",
        email: deleteEmail.trim().toLowerCase(),
        notes: `Reason: ${deleteReason || "User requested account removal via Google Play deletion form"}`,
        stage: "account_deletion_requested",
        source: "Privacy Policy / Google Play Data Safety",
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      toast.success("Account deletion request logged. We will verify and purge all records within 48 hours.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request. Please email lionsdentck@gmail.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#D4AF37] selection:text-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group text-white/70 hover:text-white">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-heading uppercase tracking-wider">Back to Academy</span>
          </Link>
          <DojoLogo size="sm" href="/" />
          <Link to="/terms" className="text-xs font-heading uppercase tracking-wider text-[#D4AF37] hover:underline">
            Terms of Service
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10">
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-heading uppercase tracking-widest font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Google Play Store Compliant Policy
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">
            Privacy Policy & Data Safety
          </h1>
          <p className="text-sm text-white/60 font-body">
            Effective Date: October 19, 2026 • Lion Mode Karate Academy (Durban, South Africa)
          </p>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-4 text-sm text-white/80 font-body leading-relaxed">
          <h2 className="font-heading text-xl font-bold uppercase text-[#D4AF37]">
            1. Overview & Commitment to Privacy
          </h2>
          <p>
            Lion Mode Karate Academy ("we," "our," or "the Dojo") provides the Dojo OS mobile and web application to support martial arts students, parents, instructors, and martial arts enthusiasts. This Privacy Policy explains our practices regarding the collection, use, and disclosure of your personal data when you use our services, in strict compliance with the Google Play Developer Distribution Agreement and User Data Policy.
          </p>
        </section>

        {/* Section 2: Data Collection & Permissions */}
        <section className="space-y-4 text-sm text-white/80 font-body leading-relaxed bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
          <h2 className="font-heading text-xl font-bold uppercase text-[#D4AF37]">
            2. Information We Collect & Why
          </h2>
          <ul className="space-y-3 list-disc pl-5 text-white/70">
            <li>
              <strong className="text-white">Account & Authentication Information:</strong> When signing in with Google or registering a student passport, we collect your name, email address, profile avatar, and assigned role (Parent, Student, Coach, Administrator) to personalize the martial arts portal.
            </li>
            <li>
              <strong className="text-white">Student Progress Records:</strong> Belt ranks, Kata evaluations, Kumite readiness ratings, class attendance tallies, and training streaks recorded by accredited Senseis on the tatami.
            </li>
            <li>
              <strong className="text-white">Camera & Photo Library Access:</strong> The app requests camera or photo storage permission solely when you choose to capture or upload a student portrait for the official Digital Belt Passport. Camera data is never used for advertising, surveillance, or background tracking.
            </li>
            <li>
              <strong className="text-white">Pro Shop & Tuition Data:</strong> Products ordered, billing transaction references, and payment receipt status. We do not store full credit card numbers on our servers; payments are processed securely through certified gateways.
            </li>
          </ul>
        </section>

        {/* Section 3: Data Safety & Storage */}
        <section className="space-y-4 text-sm text-white/80 font-body leading-relaxed">
          <h2 className="font-heading text-xl font-bold uppercase text-[#D4AF37]">
            3. Google Play Data Safety Declaration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <Lock className="w-5 h-5 text-[#D4AF37] mb-2" />
              <h4 className="font-heading text-sm font-bold uppercase text-white">Encrypted in Transit</h4>
              <p className="text-xs text-white/50">All network requests utilize industry-standard TLS 1.3 / HTTPS encryption.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="font-heading text-sm font-bold uppercase text-white">No Data Sold</h4>
              <p className="text-xs text-white/50">We do not sell personal data, photos, or student logs to third-party brokers.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <Trash2 className="w-5 h-5 text-rose-400 mb-2" />
              <h4 className="font-heading text-sm font-bold uppercase text-white">Deletion Available</h4>
              <p className="text-xs text-white/50">Users can request complete data and account removal at any time.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Children's Privacy */}
        <section className="space-y-4 text-sm text-white/80 font-body leading-relaxed">
          <h2 className="font-heading text-xl font-bold uppercase text-[#D4AF37]">
            4. Children's Privacy (Google Play Families Policy)
          </h2>
          <p>
            Lion Mode Karate trains children ages 3 and above. Student accounts for minors under 13 must be created and supervised by a parent or legal guardian. We do not engage in behavioral advertising, third-party analytics trackers targeting children, or non-essential data collection for young martial artists.
          </p>
        </section>

        {/* Section 5: Mandatory Account & Data Deletion Mechanism */}
        <section id="deletion" className="space-y-6 bg-rose-500/[0.03] border border-rose-500/20 p-6 md:p-8 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold uppercase text-white">
                5. Account & Data Deletion Request (Google Play Mandate)
              </h2>
              <p className="text-xs text-white/60 font-body">
                In compliance with Google Play requirements, you may submit a request to permanently delete your account, student profile, attendance logs, and uploaded photos.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2">
              <div className="flex items-center gap-2 font-heading text-lg font-bold uppercase">
                <CheckCircle2 className="w-5 h-5" /> Deletion Request Received
              </div>
              <p className="text-xs text-white/80 font-body">
                We have recorded your deletion request for <strong>{deleteEmail}</strong>. All associated profile images, credentials, and student database entries will be wiped from Firestore within 48 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleDeleteRequest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                  Registered Account Email *
                </label>
                <input
                  type="email"
                  required
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/70">
                  Reason for Deletion (Optional)
                </label>
                <textarea
                  rows={2}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="e.g. Relocated / No longer training"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-heading text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>{submitting ? "Submitting Request..." : "Submit Permanent Deletion Request"}</span>
              </button>
            </form>
          )}

          <p className="text-xs text-white/50 font-body">
            You can also email your deletion request with your student name directly to <a href="mailto:lionsdentck@gmail.com" className="text-[#D4AF37] underline">lionsdentck@gmail.com</a>.
          </p>
        </section>

        {/* Section 6: Contact */}
        <section className="space-y-3 text-sm text-white/80 font-body border-t border-white/10 pt-6">
          <h2 className="font-heading text-xl font-bold uppercase text-[#D4AF37]">
            6. Contact Academy Administration
          </h2>
          <p className="text-white/70">
            <strong>Lion Mode Karate Academy (Samurai Kimura Karate Do)</strong><br />
            Head Master: Sensei Babu (5th Dan Shihan)<br />
            Email: <a href="mailto:lionsdentck@gmail.com" className="text-[#D4AF37]">lionsdentck@gmail.com</a><br />
            Website: <a href="https://lionmodekarate.com" target="_blank" rel="noreferrer" className="text-[#D4AF37]">https://lionmodekarate.com</a><br />
            Location: Durban, KwaZulu-Natal, South Africa
          </p>
        </section>
      </main>

      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs text-white/40 font-body">
        <p>© 2026 Lion Mode Karate Academy • Dojo OS • All Rights Reserved</p>
      </footer>
    </div>
  );
}
