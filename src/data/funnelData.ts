// Lion Mode Karate Academy Marketing Funnels
// Controlled in Admin Section & Integrated with CRM Pipeline

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface FunnelConfig {
  id: string;
  name: string;
  slug: string;
  badge: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  description: string;
  heroImage: string;
  targetProgram: string;
  isActive: boolean;
  totalViews: number;
  totalLeads: number;
  conversionRate: number;
  highlights: string[];
}

export const DEFAULT_FUNNELS: FunnelConfig[] = [
  {
    id: "funnel-vip-trial",
    name: "1-Week Free VIP Dojo Trial",
    slug: "trial",
    badge: "Most Popular Funnel",
    headline: "Claim Your 1-Week Free VIP Martial Arts Pass",
    subheadline: "Have you always wanted to learn Karate, Self Defense, or become a Champion Fighter? Lionmode Karate brings this to you.",
    ctaText: "Claim My Free VIP Pass",
    description: "Multi-step conversion funnel offering 7 days of unlimited beginner karate classes, complimentary uniform fitting, and a 1-on-1 Sensei assessment.",
    heroImage: "https://content.app-sources.com/s/09941769835917864/uploads/Images/Samurai-Kimura-Karate-Do-Durban-1-8349753.jpg",
    targetProgram: "All Age Divisions (Cubs, Lions, Teens, Adults)",
    isActive: true,
    totalViews: 842,
    totalLeads: 168,
    conversionRate: 19.9,
    highlights: [
      "7 Days of Tatami Access",
      "Free Gi Uniform Loaner",
      "1-on-1 Performance Assessment with Sensei",
      "Zero Contract or Obligation"
    ]
  },
  {
    id: "funnel-anti-bully",
    name: "Anti-Bully & Self-Defense Workshop",
    slug: "anti-bully",
    badge: "Empowerment Funnel",
    headline: "Bully-Proof Your Child With Unshakable Confidence",
    subheadline: "Empower your child with non-violent boundary setting, assertive body language, voice projection, and real martial arts defense.",
    ctaText: "Reserve Workshop Seat",
    description: "Specialized conversion funnel targeting parents looking to boost their children's resilience, social courage, and anti-bullying awareness.",
    heroImage: "https://content.app-sources.com/s/09941769835917864/uploads/Images/stop-bullying-8502586.png",
    targetProgram: "Lionmode Kids (3–8) & Little Lions (8–12)",
    isActive: true,
    totalViews: 524,
    totalLeads: 94,
    conversionRate: 17.9,
    highlights: [
      "De-escalation & Verbal Boundary Training",
      "Escaping Grabs & Wrist Holds",
      "Eye Contact & Voice Projection Drills",
      "Official Anti-Bully Certificate"
    ]
  },
  {
    id: "funnel-birthday-party",
    name: "Black Belt Birthday Party Experience",
    slug: "birthday-party",
    badge: "Event Funnel",
    headline: "The Ultimate Karate Birthday Party in Durban",
    subheadline: "Give your child an action-packed, unforgettable 2-hour martial arts celebration filled with ninja games, board breaking, and samurai sword cake cutting!",
    ctaText: "Check Party Availability",
    description: "High-margin event booking funnel for weekend birthday parties hosted at the Lion Mode dojo.",
    heroImage: "https://content.app-sources.com/s/09941769835917864/uploads/Images/469533008_18125826691393050_7552599873704125080_n-4431896.jpg",
    targetProgram: "Kids & Teens (Ages 4–14)",
    isActive: true,
    totalViews: 310,
    totalLeads: 51,
    conversionRate: 16.5,
    highlights: [
      "Real Wooden Board Breaking by Birthday Child",
      "Samurai Sword Birthday Cake Cutting",
      "Ninja Warrior Obstacle Course",
      "VIP Passes for Every Guest"
    ]
  }
];

const LOCAL_FUNNELS_KEY = "lionmode_marketing_funnels_v2";
const FIRESTORE_FUNNELS_PATH = "site_settings/funnels";

export function getInitialFunnels(): FunnelConfig[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_FUNNELS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read funnels from localStorage", e);
    }
  }
  return DEFAULT_FUNNELS;
}

export function saveFunnelsLocal(funnels: FunnelConfig[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_FUNNELS_KEY, JSON.stringify(funnels));
    window.dispatchEvent(new Event("lionmode_funnels_updated"));
  }
  try {
    const docRef = doc(db, FIRESTORE_FUNNELS_PATH);
    setDoc(docRef, { funnels }, { merge: true }).catch(err => {
      console.warn("Could not save funnels to firestore:", err);
    });
  } catch (e) {}
}
