import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Users, Trophy, Clock, Star, MapPin, Phone, Mail, Flame, 
  RefreshCw, Smartphone, X, Copy, Check, ExternalLink, Menu, Calendar, 
  Shield, Award, Sparkles, Send, Facebook, Instagram, Twitter, ShieldCheck, 
  Dumbbell, Compass, GraduationCap, Zap, ArrowRight, Heart 
} from "lucide-react";
import { toast } from "sonner";
import GoldButton from "./shared/GoldButton";

// Direct image URL loader without failing wsrv.nl proxies
const proxyUrl = (url: string) => {
  if (!url) return '';
  return url;
};

const programs = [
  { 
    title: "Little Dragons", 
    age: "Ages 4-7", 
    image: "https://content.app-sources.com/s/09941769835917864/uploads/Images/IMG-20210610-WA0134-8490785.jpg", 
    desc: "Instilling focus, balance, coordination, and basic listening skills through engaging karate games and drills.",
    highlights: ["Basic Coordination", "Listening & Discipline", "Confidence Building"]
  },
  { 
    title: "Junior Warriors", 
    age: "Ages 8-12", 
    image: "https://content.app-sources.com/s/09941769835917864/uploads/Images/20210909_175558-7415561.jpg", 
    desc: "Building self-esteem, physical fitness, respectful manners, and critical anti-bullying self-defense strategies.",
    highlights: ["Manners & Respect", "Fitness & Strength", "Anti-Bullying Prep"]
  },
  { 
    title: "Teen Elite", 
    age: "Ages 13-17", 
    image: "https://content.app-sources.com/s/09941769835917864/uploads/Images/241426277_229185769151696_3286067128154972950_n-7424218.jpg", 
    desc: "Developing advanced techniques, cardiovascular health, coordination, and critical peer-leadership qualities.",
    highlights: ["Advanced Kata & Sparring", "Mental Resilience", "Leadership Skills"]
  },
  { 
    title: "Adult Karate", 
    age: "Ages 18+", 
    image: "https://content.app-sources.com/s/40806072080313136/uploads/Images/rawpixel-com-395554-unsplash-4348288.jpg", 
    desc: "Achieve functional peak fitness, situational self-defense capability, and profound stress-relief.",
    highlights: ["Functional Workout", "Practical Self-Defense", "Focus & Stress Relief"]
  },
  { 
    title: "Women's Self-Defence", 
    age: "All Ages", 
    image: "https://content.app-sources.com/s/09941769835917864/uploads/Images/Samurai-Kimura-Karate-Do-Durban-1-8349753.jpg", 
    desc: "Empowering training based on real-world scenarios, situational awareness, and leveraged physical techniques.",
    highlights: ["Situational Awareness", "Leverage-Based Escape", "Confidence Booster"]
  },
  { 
    title: "Black Belt Academy", 
    age: "Advanced Program", 
    image: "https://content.app-sources.com/s/09941769835917864/uploads/Images/stop-bullying-8502586.png", 
    desc: "Rigorous high-level traditional kata, heavy sparring focus, combat philosophy, and certified instructor coaching path.",
    highlights: ["Weapon Kata Training", "Championship Sparring", "Instructor Pathways"]
  },
];

const senseis = [
  {
    name: "Sensei Kenji Tanaka",
    rank: "8th Dan Black Belt",
    role: "Founder & Head Instructor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    bio: "Over 35 years of martial arts experience. Former national kata and kumite champion dedicated to cultivating authentic traditional dojo values.",
    highlights: ["Over 35 Years Active", "8th Dan certified in Okinawa", "National Grand Champion"]
  },
  {
    name: "Sensei Sarah Jenkins",
    rank: "5th Dan Black Belt",
    role: "Youth Program Director",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    bio: "Specializes in child psychology and development through physical training. Has trained over 400 youth to black belt rank.",
    highlights: ["15 Years Youth Coaching", "5th Dan certified", "B.S. in Child Development"]
  },
  {
    name: "Sensei Michael Vance",
    rank: "4th Dan Black Belt",
    role: "Self-Defense Lead Specialist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    bio: "Expert in tactical combat and modern law-enforcement restraint models. Directs all situational women's self-defense clinics.",
    highlights: ["Tactical Scenario Expert", "4th Dan certified", "Former Defensive Tactics Advisor"]
  }
];

const differenceFeatures = [
  { icon: ShieldCheck, title: "Certified Instructors", desc: "Every single coach has passed exhaustive background checks, holds verified black belt dan ranking, and is fully certified." },
  { icon: Users, title: "Small Class Sizes", desc: "We strictly limit pupil-to-coach ratios so that your child receives immediate feedback, encouragement, and instruction." },
  { icon: Trophy, title: "Championship Pedigree", desc: "Our coaching staff includes active state, national, and international champions who practice what they teach daily." },
  { icon: Heart, title: "Character-First Focus", desc: "Martial arts is about building outstanding human beings. Respect, focus, discipline, and humbleness are taught at every session." },
  { icon: Dumbbell, title: "Modern Premium Facility", desc: "Train on sanitized Olympic-standard tatami mats with advanced training equipment, parent lounge, and viewing bays." },
  { icon: Calendar, title: "Highly Flexible Schedule", desc: "With multiple daily slots spanning morning, afternoon, and evening, we easily fit into any busy household schedule." }
];

const scheduleData: Record<string, Array<{ time: string; className: string; ageGroup: string; instructor: string; level: 'Beginner' | 'Intermediate' | 'Advanced' }>> = {
  "Monday": [
    { time: "16:00 - 16:45", className: "Little Dragons", ageGroup: "Ages 4-7", instructor: "Sensei Jenkins", level: "Beginner" },
    { time: "17:00 - 18:00", className: "Junior Warriors", ageGroup: "Ages 8-12", instructor: "Sensei Vance", level: "Beginner" },
    { time: "18:15 - 19:15", className: "Teen Elite", ageGroup: "Ages 13-17", instructor: "Sensei Tanaka", level: "Intermediate" },
    { time: "19:30 - 20:45", className: "Adult Karate", ageGroup: "Ages 18+", instructor: "Sensei Tanaka", level: "Advanced" }
  ],
  "Tuesday": [
    { time: "16:00 - 16:45", className: "Little Dragons", ageGroup: "Ages 4-7", instructor: "Sensei Jenkins", level: "Beginner" },
    { time: "17:00 - 18:00", className: "Junior Warriors", ageGroup: "Ages 8-12", instructor: "Sensei Tanaka", level: "Intermediate" },
    { time: "18:15 - 19:15", className: "Women's Self-Defence", ageGroup: "All Ages", instructor: "Sensei Vance", level: "Beginner" },
    { time: "19:30 - 20:45", className: "Black Belt Academy", ageGroup: "Advanced", instructor: "Sensei Tanaka", level: "Advanced" }
  ],
  "Wednesday": [
    { time: "16:00 - 16:45", className: "Little Dragons", ageGroup: "Ages 4-7", instructor: "Sensei Jenkins", level: "Beginner" },
    { time: "17:00 - 18:00", className: "Junior Warriors", ageGroup: "Ages 8-12", instructor: "Sensei Vance", level: "Beginner" },
    { time: "18:15 - 19:15", className: "Teen Elite", ageGroup: "Ages 13-17", instructor: "Sensei Tanaka", level: "Intermediate" },
    { time: "19:30 - 20:45", className: "Adult Karate", ageGroup: "Ages 18+", instructor: "Sensei Tanaka", level: "Advanced" }
  ],
  "Thursday": [
    { time: "16:00 - 16:45", className: "Little Dragons", ageGroup: "Ages 4-7", instructor: "Sensei Jenkins", level: "Beginner" },
    { time: "17:00 - 18:00", className: "Junior Warriors", ageGroup: "Ages 8-12", instructor: "Sensei Tanaka", level: "Intermediate" },
    { time: "18:15 - 19:15", className: "Women's Self-Defence", ageGroup: "All Ages", instructor: "Sensei Vance", level: "Beginner" },
    { time: "19:30 - 20:45", className: "Black Belt Academy", ageGroup: "Advanced", instructor: "Sensei Tanaka", level: "Advanced" }
  ],
  "Friday": [
    { time: "16:00 - 16:45", className: "Little Dragons", ageGroup: "Ages 4-7", instructor: "Sensei Jenkins", level: "Beginner" },
    { time: "17:00 - 18:00", className: "Junior Warriors", ageGroup: "Ages 8-12", instructor: "Sensei Vance", level: "Beginner" },
    { time: "18:15 - 19:15", className: "Teen Elite", ageGroup: "Ages 13-17", instructor: "Sensei Tanaka", level: "Intermediate" },
    { time: "19:30 - 20:45", className: "Adult Sparring Class", ageGroup: "Ages 18+", instructor: "Sensei Vance", level: "Advanced" }
  ],
  "Saturday": [
    { time: "09:00 - 10:00", className: "Little Dragons Extra", ageGroup: "Ages 4-7", instructor: "Sensei Jenkins", level: "Beginner" },
    { time: "10:15 - 11:30", className: "Family Karate Practice", ageGroup: "All Ages", instructor: "Sensei Tanaka", level: "Beginner" },
    { time: "11:45 - 13:00", className: "Championship Prep", ageGroup: "Invitational", instructor: "Sensei Vance", level: "Advanced" }
  ]
};

const testimonials = [
  {
    quote: "Joining this dojo changed our son's life completely. He went from being quiet and bullied to an confident, positive leader who respects his peers and excels in his studies.",
    author: "Eleanor & Mark Davis",
    relation: "Parents of Ethan (Aged 9)",
    rating: 5,
  },
  {
    quote: "The adult karate program is world class. It's a grueling functional physical workout combined with genuine, highly practical situational defense. Outstanding culture!",
    author: "Richard Henderson",
    relation: "Adult Class Student, 2nd Dan",
    rating: 5,
  },
  {
    quote: "Sensei Tanaka and his coaches are world-class mentors. They care deeply about genuine character growth, persistent focus, and honor. It's truly our home away from home.",
    author: "Clara Jenkins",
    relation: "Parent of Maya (Aged 14)",
    rating: 5,
  }
];

const galleryImages = [
  "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
  "https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&q=80",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
  "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?w=800&q=80",
  "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=800&q=80",
  "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&q=80",
  "https://images.unsplash.com/photo-1544117519-31a4b7192233?w=800&q=80",
  "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&q=80"
];

interface DojoHomeProps {
  branding: any;
  onNavigate: (path: string) => void;
  profile?: any;
  onTVMode?: () => void;
}

export default function DojoHome({ branding, onNavigate, profile, onTVMode }: DojoHomeProps) {
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Weekly Schedule State
  const [activeScheduleDay, setActiveScheduleDay] = useState("Monday");

  // Testimonials Carousel State
  const [currentTestimonialIdx, setCurrentTestimonialIdx] = useState(0);

  // Gallery Preview Lightbox State
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  // Lead / Claim Free Pass Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'Little Dragons',
    message: ''
  });

  const sharedUrl = "https://ais-pre-ewbbhnjy7r46x2t4tqhfx5-242851762102.europe-west2.run.app";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsNavScrolled(true);
      } else {
        setIsNavScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Testimonial Autoplay Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Please supply your name and contact phone number.");
      return;
    }
    toast.success("Free Pass Claimed Successfully!", {
      description: `Welcome ${formData.name}! Our Sensei team will contact you at ${formData.phone} within 2 hours to finalize your first session.`,
      duration: 5000
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      program: 'Little Dragons',
      message: ''
    });
  };

  const smoothScrollTo = (elementId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased selection:bg-gold selection:text-black">
      
      {/* SECTION 1: Sticky Navigation Bar with Google Play Safe Area tolerances */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-[max(env(safe-area-inset-top,0px),26px)] ${
        isNavScrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-md pb-3 shadow-2xl border-b border-white/5' : 'bg-gradient-to-b from-black/95 via-black/85 to-transparent pb-3.5 sm:pb-4 border-b border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8">
          
          {/* Logo & Brand: Lion Mode Logo at TWICE the size with high-contrast luxury styling */}
          <div className="flex items-center gap-3 sm:gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative group shrink-0 flex items-center justify-center">
              <img 
                src="/gold-logo-icon.png" 
                alt="Lion Mode Karate" 
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_4px_20px_rgba(212,175,55,0.45)] transition-transform group-hover:scale-105" 
                onError={(e) => {
                  e.currentTarget.src = "/gold-logo-icon.png";
                }}
              />
            </div>
            <div className="flex flex-col text-left justify-center">
              <span className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider text-white leading-none">
                {branding.dojoName || "LION MODE"}
              </span>
              <span className="text-[10px] sm:text-xs font-heading font-bold uppercase tracking-[0.25em] text-gold mt-1 leading-none">
                KARATE & MARTIAL ARTS
              </span>
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
            <button onClick={() => smoothScrollTo('about')} className="hover:text-gold transition-colors duration-300 cursor-pointer">About</button>
            <button onClick={() => smoothScrollTo('programs')} className="hover:text-gold transition-colors duration-300 cursor-pointer">Programs</button>
            <button onClick={() => smoothScrollTo('difference')} className="hover:text-gold transition-colors duration-300 cursor-pointer">Why Us</button>
            <button onClick={() => smoothScrollTo('instructors')} className="hover:text-gold transition-colors duration-300 cursor-pointer">Instructors</button>
            <button onClick={() => smoothScrollTo('schedule')} className="hover:text-gold transition-colors duration-300 cursor-pointer">Timetable</button>
            <button onClick={() => smoothScrollTo('gallery')} className="hover:text-gold transition-colors duration-300 cursor-pointer">Gallery</button>
            <button onClick={() => smoothScrollTo('contact-us')} className="hover:text-gold transition-colors duration-300 cursor-pointer">Contact</button>
          </div>

          {/* Action CTA: Redesigned ENTER DOJO Pill Button (Single line, readable, perfectly integrated) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link to={profile ? "/dashboard" : "/login"}>
              <button className="px-5 sm:px-7 h-11 sm:h-12 bg-gradient-to-r from-gold via-[#FFB800] to-gold hover:brightness-110 text-black font-display font-black uppercase tracking-wider text-xs sm:text-sm rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap min-h-[44px] sm:min-h-[48px] flex items-center justify-center">
                ENTER DOJO
              </button>
            </Link>

            {/* Hamburger Toggler (Mobile) - 48dp touch compliant */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:border-gold/40 rounded-xl text-gold active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px]"
                aria-label="Toggle Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 bg-[#0A0A0A] border-b border-white/5 overflow-hidden shadow-2xl z-40 lg:hidden"
            >
              <div className="flex flex-col p-6 space-y-4 text-sm font-bold uppercase tracking-wider text-gray-300">
                <button onClick={() => smoothScrollTo('about')} className="text-left py-2 border-b border-white/5 hover:text-gold transition-all">About Our Dojo</button>
                <button onClick={() => smoothScrollTo('programs')} className="text-left py-2 border-b border-white/5 hover:text-gold transition-all">Training Programs</button>
                <button onClick={() => smoothScrollTo('difference')} className="text-left py-2 border-b border-white/5 hover:text-gold transition-all">Why Choose Us</button>
                <button onClick={() => smoothScrollTo('instructors')} className="text-left py-2 border-b border-white/5 hover:text-gold transition-all">Meet Our Instructors</button>
                <button onClick={() => smoothScrollTo('schedule')} className="text-left py-2 border-b border-white/5 hover:text-gold transition-all">Weekly Timetable</button>
                <button onClick={() => smoothScrollTo('gallery')} className="text-left py-2 border-b border-white/5 hover:text-gold transition-all">Photo Gallery</button>
                <button onClick={() => smoothScrollTo('contact-us')} className="text-left py-2 border-b border-white/5 hover:text-gold transition-all">Contact Us</button>
                
                <div className="pt-4 flex flex-col gap-3">
                  <Link to={profile ? "/dashboard" : "/login"} className="w-full">
                    <button className="w-full h-12 bg-gradient-to-r from-gold to-[#FFB800] text-black rounded-full font-display font-black tracking-widest text-xs uppercase shadow-md flex items-center justify-center">
                      ENTER DOJO
                    </button>
                  </Link>
                  <button 
                    onClick={() => smoothScrollTo('claim-trial')}
                    className="w-full h-12 border border-gold/40 text-gold rounded-full font-bold tracking-widest text-[11px] uppercase flex items-center justify-center"
                  >
                    Claim Free Pass
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* SECTION 2: Professional Hero Section with Large Full-Bleed Hero Stance Image */}
      <section className="relative min-h-[100dvh] pt-36 sm:pt-44 md:pt-48 pb-20 sm:pb-28 flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
        
        {/* Full-Bleed Hero Background Image: Stance scaled & centered across screen, clearly visible with rich contrast */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={branding.heroImageBase64 || branding.heroImageUrl || "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=2000&q=85"}
            alt="Martial Arts Sunset Stance"
            className="w-full h-full object-cover object-[55%_30%] sm:object-[60%_35%] filter brightness-95 contrast-[1.15]"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=2000&q=85";
            }}
            referrerPolicy="no-referrer"
          />
          {/* Subtle vignette gradients so text is razor-sharp while martial arts stance remains vibrant & clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 sm:via-black/35" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
        </div>

        {/* Dynamic Athletic Corner Slashes (Inspired by PrimeAthletica & Karate Posters) */}
        <div className="absolute top-0 right-0 w-72 md:w-96 h-72 md:h-96 pointer-events-none overflow-hidden opacity-30 sm:opacity-40 z-10">
          <div className="absolute -top-10 -right-20 w-[420px] h-10 bg-gold transform -rotate-45" />
          <div className="absolute top-12 -right-20 w-[420px] h-6 bg-[#FFB800] transform -rotate-45" />
          <div className="absolute top-26 -right-20 w-[420px] h-3 bg-white/30 transform -rotate-45" />
        </div>
        <div className="absolute bottom-0 left-0 w-64 md:w-80 h-64 md:h-80 pointer-events-none overflow-hidden opacity-20 sm:opacity-30 z-10">
          <div className="absolute -bottom-10 -left-20 w-[380px] h-8 bg-gold transform -rotate-45" />
          <div className="absolute bottom-10 -left-20 w-[380px] h-4 bg-[#FFB800] transform -rotate-45" />
        </div>

        {/* Ambient Center Warm Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gold/10 blur-[120px] pointer-events-none rounded-full z-0" />

        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (Content & CTAs directly over faded hero image) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col justify-center text-left"
            >
              {/* Eyebrow Accent with glowing pulse dot */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-gold/15 border border-gold/40 rounded-full w-fit mb-4 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                </span>
                <span className="text-[11px] sm:text-xs font-heading font-bold tracking-[0.25em] text-gold uppercase">
                  WELCOME TO THE DOJO
                </span>
              </div>

              {/* Massive Display Title (Hero Headline with Gold Accent) */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tight text-white leading-[0.94] mb-5 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                FORGE YOUR <br />
                <span className="inline-block bg-gradient-to-r from-gold via-[#FFB800] to-gold text-black px-3.5 sm:px-5 py-0.5 sm:py-1 rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(212,175,55,0.4)] my-1">
                  WARRIOR
                </span>{" "}
                SPIRIT
              </h1>

              {/* Mobile-Only Dedicated Martial Arts Stance Card (Features stance directly beneath headline on phones) */}
              <div className="block lg:hidden my-4 relative w-full aspect-[16/10] sm:aspect-video rounded-3xl overflow-hidden border-2 border-gold/40 shadow-[0_15px_40px_rgba(0,0,0,0.85)] group">
                <img
                  src={branding.heroImageBase64 || branding.heroImageUrl || "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=2000&q=85"}
                  alt="Martial Arts Sunset Stance"
                  className="w-full h-full object-cover object-[55%_35%] transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=2000&q=85";
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 pointer-events-none" />
                
                {/* Diagonal athletic stripes on mobile card */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                  <div className="absolute top-3 -right-6 w-24 h-2 bg-gold rotate-45" />
                  <div className="absolute top-6 -right-6 w-24 h-1 bg-[#FFB800] rotate-45" />
                </div>

                {/* Badge inside mobile card */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/15 rounded-full">
                    <Shield className="w-3.5 h-3.5 text-gold" />
                    <span className="text-[10px] font-bold tracking-widest text-white uppercase">OKINAWA HERITAGE</span>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-gold to-[#FFB800] text-black rounded-full font-bold text-[10px] tracking-wider uppercase shadow-md">
                    EST. 2005
                  </div>
                </div>
              </div>

              {/* Paragraph Description with drop-shadow for pristine contrast */}
              <p className="text-sm sm:text-base md:text-lg text-gray-200 font-sans max-w-xl leading-relaxed mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Premium martial arts training for all ages. Build discipline, confidence, and strength in our world-class dojo.
              </p>

              {/* Action Buttons (Google Play 48dp minimum touch target compliant) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mb-8 max-w-md sm:max-w-none">
                <button 
                  onClick={() => smoothScrollTo('claim-trial')}
                  className="w-full sm:w-auto px-8 h-14 bg-gradient-to-r from-gold via-[#FFB800] to-gold hover:brightness-110 text-black font-display font-black uppercase tracking-wider text-sm sm:text-base rounded-2xl shadow-[0_6px_25px_rgba(212,175,55,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center cursor-pointer min-h-[48px]"
                >
                  BOOK A FREE TRIAL
                </button>
                
                <button 
                  onClick={() => smoothScrollTo('programs')}
                  className="w-full sm:w-auto px-8 h-14 border-2 border-gold bg-black/40 backdrop-blur-md hover:bg-gold/15 text-gold font-display font-black uppercase tracking-wider text-sm sm:text-base rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center cursor-pointer min-h-[48px]"
                >
                  VIEW PROGRAMS
                </button>
              </div>

              {/* Hashtag & Focus Tags */}
              <div className="flex items-center gap-4 text-xs font-mono font-medium text-gray-300 mb-8 flex-wrap">
                <span className="text-gold font-bold">#LionMode</span>
                <span>#ShotokanKarate</span>
                <span>#MartialArts</span>
                <span>#DisciplineFirst</span>
              </div>

              {/* Stat Cards Grid (Mobile 2-col, Desktop 4-col) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/10 max-w-2xl">
                <div className="bg-[#11141B]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
                  <Users className="w-6 h-6 text-gold mb-1" />
                  <p className="text-3xl font-display font-black text-white leading-none">500+</p>
                  <p className="text-[10px] font-sans font-bold tracking-widest text-gray-400 uppercase mt-1">ACTIVE STUDENTS</p>
                </div>

                <div className="bg-[#11141B]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
                  <Trophy className="w-6 h-6 text-gold mb-1" />
                  <p className="text-3xl font-display font-black text-white leading-none">150+</p>
                  <p className="text-[10px] font-sans font-bold tracking-widest text-gray-400 uppercase mt-1">TOURNAMENT WINS</p>
                </div>

                <div className="hidden sm:flex bg-[#11141B]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex-col items-center justify-center text-center shadow-lg">
                  <Shield className="w-6 h-6 text-gold mb-1" />
                  <p className="text-3xl font-display font-black text-white leading-none">20+</p>
                  <p className="text-[10px] font-sans font-bold tracking-widest text-gray-400 uppercase mt-1">YEARS LEGACY</p>
                </div>

                <div className="hidden sm:flex bg-[#11141B]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex-col items-center justify-center text-center shadow-lg">
                  <Flame className="w-6 h-6 text-gold mb-1" />
                  <p className="text-3xl font-display font-black text-white leading-none">100%</p>
                  <p className="text-[10px] font-sans font-bold tracking-widest text-gray-400 uppercase mt-1">WARRIOR SPIRIT</p>
                </div>
              </div>

            </motion.div>

            {/* Right Column (Desktop Framed Feature Card) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="hidden lg:block lg:col-span-5 relative"
            >
              {/* Outer Decorative Offset Gold Accent Frame */}
              <div className="absolute -inset-4 border-2 border-gold/30 rounded-[32px] translate-x-3 translate-y-3 -z-10" />

              {/* Main Visual Container */}
              <div className="relative rounded-[28px] overflow-hidden border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] aspect-[4/5] bg-[#11141B] group">
                <img
                  src={branding.heroImageBase64 || branding.heroImageUrl || "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=2000&q=85"}
                  alt="Martial Arts Sunset Stance"
                  className="w-full h-full object-cover object-[55%_35%] transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=2000&q=85";
                  }}
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

                {/* Top Corner Athletic Diagonal Slashes */}
                <div className="absolute top-0 right-0 w-36 h-36 overflow-hidden pointer-events-none">
                  <div className="absolute top-5 -right-8 w-36 h-3.5 bg-gold rotate-45" />
                  <div className="absolute top-11 -right-8 w-36 h-2 bg-[#FFB800] rotate-45" />
                  <div className="absolute top-15 -right-8 w-36 h-1 bg-white/40 rotate-45" />
                </div>

                {/* Floating Top Left Pill */}
                <div className="absolute top-5 left-5 px-3.5 py-1.5 bg-black/75 backdrop-blur-md border border-white/15 rounded-full flex items-center gap-2">
                  <Flame className="w-4 h-4 text-gold" />
                  <span className="text-[11px] font-heading font-bold tracking-widest text-white uppercase">
                    SHOTOKAN EXCELLENCE
                  </span>
                </div>

                {/* Floating Bottom Card Strip */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0A0A0A]/85 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-bold uppercase text-white leading-none">Traditional Mastery</p>
                      <p className="text-[11px] font-sans text-gray-400 mt-1">Okinawan Roots · 4.9 ★ Rating</p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-gold text-black rounded-xl font-display font-black text-xs uppercase tracking-wider">
                    EST. 2005
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 3: Gold Stats Bar */}
      <section className="relative z-20 bg-gradient-to-r from-gold via-[#FFB800] to-[#F59E0B] py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 text-black">
            {[
              { icon: Flame, value: "Founded 2005", label: "Okinawa Heritage" },
              { icon: Shield, value: "1-on-1 Mentoring", label: "Black Belt Coaches" },
              { icon: Trophy, value: "15+ Dojo Titles", label: "Championship Pedigree" },
              { icon: Star, value: "4.9/5 Parent Score", label: "Top Rated in District" }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-black" />
                </div>
                <div className="text-left">
                  <p className="font-heading text-sm md:text-base font-bold uppercase leading-none">{stat.value}</p>
                  <p className="text-[10px] font-sans font-medium text-black/70 uppercase tracking-widest mt-1 leading-none">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: About Us */}
      <section id="about" className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Narrative Column */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full">
              <Compass className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-bold tracking-widest text-gold uppercase">OUR HERITAGE</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-wide leading-tight">
              MORE THAN JUST PHYSICAL TRAINING. <br />
              <span className="text-gold italic">WE FORGE EXCELLENT HUMAN BEINGS.</span>
            </h2>
            
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Established in 2005 under traditional Okinawan instruction, our academy has spent over two decades serving families and developing elite martial artists. We believe that Karate is not purely about throwing punches or kicks—it is a lifelong roadmap for developing pristine character, unwavering focus, and iron resilience.
            </p>

            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Our classes combine modern physical exercise protocols with classical philosophies. Every student who walks onto our tatami is guided to cultivate our core tenets: respect for oneself and others, self-control under pressure, rigorous effort, and an indomitable fighting spirit.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-gold font-bold text-lg font-heading">RESPECT & HONOR</span>
                <p className="text-xs text-gray-400 mt-1">Practiced at every interaction, bow, and greeting.</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-gold font-bold text-lg font-heading">MENTAL TOUGHNESS</span>
                <p className="text-xs text-gray-400 mt-1">Overcoming difficult physical blocks and milestones.</p>
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => smoothScrollTo('claim-trial')}
                className="px-6 h-12 bg-white/5 border border-white/10 hover:border-gold hover:text-gold text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all active:scale-95"
              >
                Join Our Family Legacy
              </button>
            </div>
          </motion.div>

          {/* Graphical Frame Column with High-Contrast Black & White Athletic Image Treatment */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Offset Gold Border Decoration */}
            <div className="absolute -inset-4 border-2 border-gold/30 rounded-[32px] translate-x-3 translate-y-3 -z-10" />
            
            <div className="relative rounded-[28px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] h-[460px] sm:h-[480px] bg-black border border-white/10 group">
              <img 
                src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1000&q=80"
                alt="Dojo Heritage High-Contrast Black and White"
                className="w-full h-full object-cover bw-contrast-image hover:scale-105 transition-transform duration-700"
              />
              {/* Soft black edge fade & ambient shadows around the image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/40 pointer-events-none" />
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)] pointer-events-none" />
              
              {/* Gold Founded Badge matching Screenshot 3 */}
              <div className="absolute bottom-6 left-6 p-4 px-7 bg-gradient-to-r from-gold via-[#FFB800] to-gold text-black rounded-2xl shadow-2xl">
                <p className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-black/90">DOJO ESTABLISHED</p>
                <p className="text-3xl font-display font-black tracking-wider italic text-black leading-none mt-1">2005</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 5: 6 Training Programs */}
      <section id="programs" className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#111111] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full mb-3">
              <GraduationCap className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-bold tracking-widest text-gold uppercase">OUR TRAINING PROGRAMS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-wide">
              TRAIN WITH PURPOSE. <span className="text-gold italic">DEVELOP WITH DISCIPLINE.</span>
            </h2>
            <p className="text-gray-400 mt-4 text-sm font-sans">
              Tailored age-appropriate programs targeting physical growth, neurological focus, and genuine traditional karate competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group bg-[#0A0A0A]/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Program image */}
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={proxyUrl(prog.image)} 
                    alt={prog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  {/* Age Badge */}
                  <span className="absolute bottom-4 left-4 p-1 px-3 bg-gold text-black text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    {prog.age}
                  </span>
                </div>

                {/* Info and points */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-heading font-bold uppercase text-white group-hover:text-gold transition-colors duration-300">
                    {prog.title}
                  </h3>
                  
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    {prog.desc}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    {prog.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-gray-300 font-sans">
                        <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => smoothScrollTo('claim-trial')}
                    className="w-full h-11 border border-white/10 group-hover:bg-gold group-hover:text-black group-hover:border-gold font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all duration-300 mt-4"
                  >
                    Book a Free Trial
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: The Dojo Difference */}
      <section id="difference" className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase">THE DOJO DIFFERENCE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-wide">
            WHY DISCERNING FAMILIES <br />
            <span className="text-gold italic">CHOOSE DOJO OS ACADEMY</span>
          </h2>
          <p className="text-gray-400 mt-4 text-sm font-sans">
            We are dedicated to safety, high physical quality, expert mentors, and a pristine educational environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differenceFeatures.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-left hover:border-gold/20 transition-all shadow-glow hover:bg-white/[0.04]"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 border border-gold/20">
                <feat.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-heading text-xl font-bold uppercase text-white tracking-wide mb-3">
                {feat.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </section>

      {/* SECTION 7: Meet the Sensei */}
      <section id="instructors" className="py-24 bg-gradient-to-b from-[#111111] to-[#0A0A0A] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full mb-3">
              <Award className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-bold tracking-widest text-gold uppercase">WORLD CLASS LEADERSHIP</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-wide">
              MEET OUR SENSEI TEAM. <span className="text-gold italic">DEVOTED MENTORS.</span>
            </h2>
            <p className="text-gray-400 mt-4 text-sm font-sans">
              Learn directly from certified high-degree black belt masters with decades of competition and coaching pedigree.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {senseis.map((sensei, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.7 }}
                className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl hover:border-gold/20 transition-all"
              >
                {/* Photo */}
                <div className="h-72 overflow-hidden relative group">
                  <img 
                    src={proxyUrl(sensei.image)} 
                    alt={sensei.name} 
                    className="w-full h-full object-cover bw-contrast-image group-hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: "50% 15%" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10 pointer-events-none" />
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none" />
                  
                  {/* Rank Badge */}
                  <span className="absolute bottom-4 left-4 p-1.5 px-3 bg-gold text-black text-[10px] font-bold uppercase tracking-widest rounded-lg font-heading">
                    {sensei.rank}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 text-left space-y-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-white">{sensei.name}</h3>
                    <p className="text-xs text-gold font-sans font-bold uppercase tracking-wider mt-1">{sensei.role}</p>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed font-sans">{sensei.bio}</p>

                  <div className="pt-4 border-t border-white/5 space-y-1.5">
                    {sensei.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: Weekly Schedule */}
      <section id="schedule" className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full mb-3">
            <Calendar className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase">CLASS TIMETABLE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-wide">
            WEEKLY TRAINING <span className="text-gold italic">SCHEDULE</span>
          </h2>
          <p className="text-gray-400 mt-4 text-sm font-sans">
            Choose your age-appropriate session and view scheduled times. Click the tabs below to toggle days.
          </p>
        </div>

        {/* Schedule Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {Object.keys(scheduleData).map((day) => (
            <button
              key={day}
              onClick={() => setActiveScheduleDay(day)}
              className={`px-6 py-3 font-heading text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer ${
                activeScheduleDay === day 
                  ? 'bg-gold text-black shadow-glow font-black' 
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Active Day Table */}
        <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl overflow-hidden">
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScheduleDay}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {scheduleData[activeScheduleDay]?.map((slot, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 bg-[#0A0A0A]/85 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-gold/30 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono font-bold text-gold">{slot.time}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest p-0.5 px-2 rounded-full ${
                          slot.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          slot.level === 'Intermediate' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {slot.level}
                        </span>
                      </div>
                      
                      <h4 className="font-heading text-lg font-bold uppercase tracking-wide text-white leading-tight">
                        {slot.className}
                      </h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-sans mt-1">
                        {slot.ageGroup}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-300 font-sans">
                        Instructor: <strong className="text-white font-semibold">{slot.instructor}</strong>
                      </span>
                      <button 
                        onClick={() => smoothScrollTo('claim-trial')}
                        className="p-1 px-2.5 bg-gold/10 hover:bg-gold text-gold hover:text-black rounded-lg text-[10px] font-bold uppercase transition-all"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </section>

      {/* SECTION 9: Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#111111] border-y border-white/5 relative overflow-hidden">
        {/* Subtle decorative quote character */}
        <span className="absolute right-12 bottom-12 text-white/[0.02] font-heading font-black text-[25rem] select-none pointer-events-none leading-none">”</span>
        
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full mb-3">
            <Star className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase">DOJO TESTIMONIALS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-wide mb-16">
            WHAT OUR FAMILIES SAY
          </h2>

          <div className="min-h-[220px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonialIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Stars */}
                <div className="flex items-center justify-center gap-1">
                  {[...Array(testimonials[currentTestimonialIdx].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-lg md:text-2xl font-sans text-gray-200 leading-relaxed max-w-3xl mx-auto italic">
                  "{testimonials[currentTestimonialIdx].quote}"
                </p>

                {/* Author Info */}
                <div>
                  <p className="font-heading text-lg font-bold text-gold uppercase tracking-wider">
                    {testimonials[currentTestimonialIdx].author}
                  </p>
                  <p className="text-[10px] text-gray-400 font-sans uppercase tracking-widest mt-1">
                    {testimonials[currentTestimonialIdx].relation}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Testimonial Nav dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonialIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentTestimonialIdx === i ? 'bg-gold w-6' : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: Photo Gallery */}
      <section id="gallery" className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full mb-3">
            <ExternalLink className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase">DOJO LIFE GALLERY</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-wide">
            EXPLORE THE ACADEMY <span className="text-gold italic">IN ACTION</span>
          </h2>
          <p className="text-gray-400 mt-4 text-sm font-sans">
            A look inside our daily active classes, technical stance practice, and traditional belt promotions.
          </p>
        </div>

        {/* Gallery 8-Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              onClick={() => setSelectedGalleryImage(img)}
              className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer group shadow-lg border border-white/5"
            >
              <img 
                src={proxyUrl(img)} 
                alt={`Dojo active shot ${i + 1}`} 
                className="w-full h-full object-cover bw-contrast-image group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {/* Gold overlay hover halo effect */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-black shadow-lg">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedGalleryImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGalleryImage(null)}
              className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            >
              <button 
                onClick={() => setSelectedGalleryImage(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:text-gold hover:border-gold/30 transition-all active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl max-h-[80vh] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <img 
                  src={proxyUrl(selectedGalleryImage)} 
                  alt="Gallery large preview" 
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      {/* SECTION 11: Free Trial CTA */}
      <section id="claim-trial" className="relative py-32 overflow-hidden border-y border-white/5 flex items-center justify-center">
        {/* Full parallax layout image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={proxyUrl("https://images.unsplash.com/photo-1544117519-31a4b7192233?w=1600&q=80")} 
            alt="Martial Arts meditation stance" 
            className="w-full h-full object-cover filter brightness-[0.25] grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-gold text-black rounded-full text-[10px] font-bold uppercase tracking-widest">
            EXCLUSIVE INVITATION
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-wide text-white uppercase italic">
            YOUR FIRST CLASS IS <span className="text-gold italic">100% FREE.</span>
          </h2>

          <p className="text-gray-300 text-sm max-w-xl mx-auto font-sans leading-relaxed">
            Take the first step on your warrior pathway. No financial commitment, no registration fees, and zero obligations. We will even provide your trial training uniform free of charge.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 text-left">
            {[
              { label: "Free Uniform Provided", desc: "No equipment purchase required." },
              { label: "Absolute Zero Risk", desc: "No payment details needed on sign up." },
              { label: "Immediate Mat Start", desc: "Flexible weekly schedule booking." }
            ].map((b, idx) => (
              <div key={idx} className="p-4 bg-[#0A0A0A]/85 border border-white/5 rounded-2xl">
                <Check className="w-5 h-5 text-gold mb-2" />
                <p className="font-heading text-sm font-bold uppercase text-white">{b.label}</p>
                <p className="text-[10px] text-gray-400 font-sans mt-1 leading-normal">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <button 
              onClick={() => smoothScrollTo('contact-us')}
              className="px-8 h-14 bg-gradient-to-r from-gold to-dojo-gold text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-glow-gold transition-all hover:scale-[1.03] active:scale-95"
            >
              Claim Your Free Trial Pass Now
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 12: Contact + Form */}
      <section id="contact-us" className="py-24 max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Direct contact info Column (5 cols) */}
          <div className="lg:col-span-5 text-left space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full mb-3">
                <Phone className="w-4 h-4 text-gold" />
                <span className="text-[10px] font-bold tracking-widest text-gold uppercase">GET IN TOUCH</span>
              </div>
              <h2 className="text-4xl font-heading font-bold uppercase tracking-wide">
                WE ARE READY TO <br />
                <span className="text-gold italic">START YOUR JOURNEY.</span>
              </h2>
              <p className="text-gray-400 mt-4 text-xs md:text-sm font-sans leading-relaxed">
                Have questions about program placements, private coaching, child developmental needs, or belt requirements? Contact our dojo team directly.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: MapPin, title: "Dojo Location", val: branding.location || "123 Dojo Street, Martial Arts District, CT 06511" },
                { icon: Phone, title: "Support Telephone", val: branding.phone || "+1 (555) 902-1234" },
                { icon: Mail, title: "Electronic Mail", val: branding.email || "admissions@dojo-os.com" },
                { icon: Clock, title: "Training Hours", val: "Mon - Fri: 15:30 - 21:00 | Sat: 08:30 - 14:00" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 text-gold">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-gray-400">{item.title}</h4>
                    <p className="text-sm font-semibold text-white mt-1 font-sans">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social handles */}
            <div className="pt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">FOLLOW THE DOJO</h4>
              <div className="flex gap-3">
                {[Facebook, Instagram, Twitter].map((Social, i) => (
                  <a 
                    key={i} 
                    href="#social" 
                    onClick={(e) => { e.preventDefault(); toast.info("Linked to secure social matrix x5"); }}
                    className="w-11 h-11 bg-white/5 border border-white/5 hover:border-gold hover:text-gold rounded-xl flex items-center justify-center text-white transition-all hover:-translate-y-1"
                  >
                    <Social className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Wired Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
              <Send className="w-32 h-32 text-gold" />
            </div>

            <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-white text-left mb-2">
              CLAIM YOUR FREE TRIAL PASS
            </h3>
            <p className="text-xs text-gray-400 text-left mb-8 font-sans">
              Provide your details below to schedule your complimentary class and reserve your trial uniform.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-12 bg-[#0A0A0A] border border-white/10 rounded-xl px-4 text-sm focus:border-gold focus:outline-none transition-all text-white font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Contact Phone</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full h-12 bg-[#0A0A0A] border border-white/10 rounded-xl px-4 text-sm focus:border-gold focus:outline-none transition-all text-white font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-12 bg-[#0A0A0A] border border-white/10 rounded-xl px-4 text-sm focus:border-gold focus:outline-none transition-all text-white font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Target Program</label>
                  <select 
                    value={formData.program}
                    onChange={(e) => setFormData({...formData, program: e.target.value})}
                    className="w-full h-12 bg-[#0A0A0A] border border-white/10 rounded-xl px-4 text-sm focus:border-gold focus:outline-none transition-all text-white font-sans"
                  >
                    <option value="Little Dragons">Little Dragons (Ages 4-7)</option>
                    <option value="Junior Warriors">Junior Warriors (Ages 8-12)</option>
                    <option value="Teen Elite">Teen Elite (Ages 13-17)</option>
                    <option value="Adult Karate">Adult Karate (Ages 18+)</option>
                    <option value="Women's Self-Defence">Women's Self-Defence</option>
                    <option value="Black Belt Academy">Black Belt Academy (Advanced)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Optional Notes / Physical Goals</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Building confidence, weight management, anti-bullying..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-4 text-sm focus:border-gold focus:outline-none transition-all text-white font-sans"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-gold to-dojo-gold text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-glow-gold hover:scale-[1.01] active:scale-95 transition-all duration-300"
                >
                  CLAIM YOUR SECURE FREE PASS
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* SECTION 13: Footer */}
      <footer className="border-t border-white/5 bg-[#050505] py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left text-sm text-gray-400">
            
            {/* Branding Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src={branding.logoUrl || "/lion-mode-logo.jpg"} 
                  alt="Lion Mode Karate" 
                  className="w-12 h-12 object-contain rounded-xl border border-gold/40 bg-black/80 p-1 shadow-md"
                  onError={(e) => { e.currentTarget.src = "/lion-mode-logo.jpg"; }}
                />
                <div className="flex flex-col">
                  <span className="font-display text-xl font-black uppercase tracking-wider text-white leading-none">
                    {branding.dojoName || "LION MODE"}
                  </span>
                  <span className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-gold mt-0.5">
                    KARATE ACADEMY
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                A premier dedicated Okinawan training center for personal advancement, pristine safety, and deep honor.
              </p>
              <div className="pt-2 text-[10px] uppercase font-bold tracking-widest text-gray-500 font-sans">
                © 2026 {branding.dojoName || "DOJO OS"}. All Rights Reserved.
              </div>
            </div>

            {/* Programs Column */}
            <div className="space-y-4">
              <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white">PROGRAMS</h4>
              <ul className="space-y-2 text-xs font-sans">
                <li><button onClick={() => smoothScrollTo('programs')} className="hover:text-gold transition-colors">Little Dragons (4-7)</button></li>
                <li><button onClick={() => smoothScrollTo('programs')} className="hover:text-gold transition-colors">Junior Warriors (8-12)</button></li>
                <li><button onClick={() => smoothScrollTo('programs')} className="hover:text-gold transition-colors">Teen Elite (13-17)</button></li>
                <li><button onClick={() => smoothScrollTo('programs')} className="hover:text-gold transition-colors">Adult & Women's Self-Defense</button></li>
              </ul>
            </div>

            {/* Timetable Column */}
            <div className="space-y-4">
              <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white">ACADEMY</h4>
              <ul className="space-y-2 text-xs font-sans">
                <li><button onClick={() => smoothScrollTo('about')} className="hover:text-gold transition-colors">About Our Legacy</button></li>
                <li><button onClick={() => smoothScrollTo('instructors')} className="hover:text-gold transition-colors">Dojo Instructors</button></li>
                <li><button onClick={() => smoothScrollTo('schedule')} className="hover:text-gold transition-colors">Training Timetable</button></li>
                <li><button onClick={() => smoothScrollTo('gallery')} className="hover:text-gold transition-colors">Action Gallery</button></li>
              </ul>
            </div>

            {/* Portal Column */}
            <div className="space-y-4">
              <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white">MEMBERS PORTAL</h4>
              <p className="text-xs leading-normal font-sans text-gray-400">
                Authorized operators and parents can access grade progress, invoices, calendars, and resources.
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <button className="px-4 py-2 bg-white/5 border border-white/10 hover:border-gold hover:text-gold text-white rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all">
                    ENTER PORTAL
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* Save to Phone Install Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass max-w-md w-full rounded-[24px] overflow-hidden p-6 md:p-8 animate-in fade-in zoom-in-95 duration-250 relative border border-white/10 text-left">
            <button 
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold uppercase tracking-wide text-white">Save DojoOS App</h3>
                <p className="text-[10px] font-sans text-gray-400 leading-none mt-1">Install as standalone fullscreen mobile app</p>
              </div>
            </div>

            <div className="space-y-4 font-sans text-sm">
              <p className="text-gray-300 leading-relaxed text-xs">
                To launch and run this premium application fullscreen directly from your mobile home screen, copy and visit our secure, dedicated live URL.
              </p>

              {/* Copy URL widget */}
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] font-bold tracking-widest text-gold uppercase block mb-1.5">DojoOS Live URL</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-gray-400 truncate select-all">{sharedUrl}</span>
                  <button 
                    onClick={handleCopy}
                    className="p-1.5 px-3 bg-gold text-black font-semibold text-xs rounded-lg active:scale-95 transition-all outline-none flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gold shrink-0">1</div>
                  <p className="text-xs text-gray-300 leading-normal">
                    Copy the URL, open your mobile browser (<strong className="text-white">Safari</strong> on iPhone or <strong className="text-white">Chrome</strong> on Android), and paste/visit the address.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gold shrink-0">2</div>
                  <div className="text-xs text-gray-300 leading-normal">
                    <p className="font-semibold text-white mb-0.5">Safari (iPhone):</p>
                    <p>Tap the <span className="text-gold font-bold">Share Button</span> (square with arrow up box) in Safari's bottom panel.</p>
                    <p className="font-semibold text-white mt-1.5 mb-0.5">Chrome (Android):</p>
                    <p>Tap the <span className="text-gold font-bold">Menu Options</span> (3-dots vertical) in the upper right.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gold shrink-0">3</div>
                  <p className="text-xs text-gray-300 leading-normal">
                    Scroll down, tap <strong className="text-white">"Add to Home Screen"</strong>, and press Add in the top-right corner.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-3">
                <a 
                  href={sharedUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 font-heading font-bold text-xs uppercase tracking-wider text-white rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>Launch Live Link</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gold" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Nexus Live Testing Button with Pulsing Green Dot (Positioned bottom-left to prevent overlap with AI Chat Assistant) */}
      <div className="fixed bottom-6 left-4 sm:bottom-8 sm:left-8 z-40">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2.5 px-3.5 py-2 bg-[#0A0A0A]/95 border border-emerald-500/40 hover:border-emerald-400 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          title="Testing button: Click to copy live deployment link"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-gray-300 group-hover:text-white transition-colors">
            {copied ? "URL COPIED!" : "NEXUS LIVE"}
          </span>
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${copied ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
        </button>
      </div>

    </div>
  );
}
