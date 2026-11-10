// Lion Mode Karate Academy (https://lionmodekarate.com)
// Centralized Site & App CMS Hook - Headings, Paragraphs, Buttons, Badges & App Banners
// Persistent in Firestore (`site_settings/content`) + localStorage with Instant Reactivity

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ProgramItem {
  id: string;
  title: string;
  age: string;
  badge: string;
  desc: string;
  features: string[];
  buttonText: string;
}

export interface SiteContent {
  // Website: Hero Section
  hero: {
    eyebrow: string;
    headingLine1: string;
    headingHighlight: string;
    headingLine2: string;
    subtitle: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    shopButtonText: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
  };

  // Website: Sensei AI Interactive Hub Block
  senseiAi: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    buttonText: string;
  };

  // Website: Curriculum Programs
  programs: {
    eyebrow: string;
    heading: string;
    highlight: string;
    description: string;
    list: ProgramItem[];
  };

  // Website: Pro Shop Showcase
  shopShowcase: {
    eyebrow: string;
    heading: string;
    highlight: string;
    description: string;
    buttonText: string;
  };

  // Website: About Dojo Section
  about: {
    eyebrow: string;
    heading: string;
    highlight: string;
    storyParagraph1: string;
    storyParagraph2: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };

  // Website: Contact & Free Trial Section
  contact: {
    eyebrow: string;
    heading: string;
    highlight: string;
    subtitle: string;
    dojoName: string;
    dojoSubtitle: string;
    email: string;
    headMaster: string;
    trainingHours: string;
    formButtonText: string;
  };

  // Website: Footer
  footer: {
    brandName: string;
    brandSubtitle: string;
    email: string;
    copyrightText: string;
  };

  // App & Dashboard Sections
  app: {
    dashboardTitle: string;
    dashboardSubtitle: string;
    senseiQuote: string;
    classesTitle: string;
    classesSubtitle: string;
    studentsTitle: string;
    studentsSubtitle: string;
    videosTitle: string;
    videosSubtitle: string;
    shopTitle: string;
    shopSubtitle: string;
    leadsTitle: string;
    leadsSubtitle: string;
    eventsTitle: string;
    eventsSubtitle: string;
  };
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    eyebrow: "LION MODE KARATE ACADEMY",
    headingLine1: "Forge Your",
    headingHighlight: "Warrior",
    headingLine2: "Spirit",
    subtitle: "Premium martial arts training for all ages. Build discipline, confidence, and strength in our world-class dojo.",
    primaryButtonText: "Book 1-Week Free Trial Pass",
    secondaryButtonText: "View Programs",
    shopButtonText: "Shop Pro Gear",
    stat1Value: "500+",
    stat1Label: "Active Members",
    stat2Value: "150+",
    stat2Label: "Trophies Won"
  },
  senseiAi: {
    badge: "Interactive AI Advisor",
    title: "Sensei",
    highlight: "AI Hub",
    description: "Have questions on kata geometry, sparring counter-punches, belt test syllabus, or class schedules? Consult your dedicated digital Sensei.",
    buttonText: "Consult Sensei AI"
  },
  programs: {
    eyebrow: "Curriculum Programs",
    heading: "Martial Arts For",
    highlight: "Every Age",
    description: "From our play-based Lionmode Kids to tournament-tested champions, our curriculum builds lifelong discipline, confidence, and respect.",
    list: [
      {
        id: "kids",
        title: "Lionmode Kids",
        age: "Ages 3 – 8",
        badge: "Foundational",
        desc: "Play-based martial arts learning to increase attention span, build motor and hand-eye coordination, and foster deep respect.",
        features: ["Balance & Stances", "Focus Drills", "Confidence & Discipline", "Play-Based Coordination"],
        buttonText: "Book Free VIP Trial Pass"
      },
      {
        id: "little-lions",
        title: "Little Lions",
        age: "Ages 8 – 12",
        badge: "Most Popular",
        desc: "Action-packed karate classes emphasizing focus, self-control, and determination while sharpening agility and kata fundamentals.",
        features: ["Kata Forms (Heian)", "Basic Kumite Sparring", "Anti-Bully Confidence", "Belt Progression"],
        buttonText: "Book Free VIP Trial Pass"
      },
      {
        id: "teens",
        title: "Lionmode Teens",
        age: "Ages 13 – 18",
        badge: "Cadet Squad",
        desc: "Develop martial arts foundation, mental toughness, practical self-defense, conflict resolution, strength, conditioning, and stamina.",
        features: ["Advanced Kumite", "Street Self-Defense", "Athletic Conditioning", "Leadership & Integrity"],
        buttonText: "Book Free VIP Trial Pass"
      },
      {
        id: "adults",
        title: "Adult & Senior Class",
        age: "Ages 18+",
        badge: "All Levels",
        desc: "Traditional Shotokan and sports karate, practical street self-defense, flexibility, core conditioning, and black belt excellence.",
        features: ["Traditional Bunkai", "Full Body Conditioning", "Stress Relief & Focus", "Black Belt Progression"],
        buttonText: "Book Free VIP Trial Pass"
      }
    ]
  },
  shopShowcase: {
    eyebrow: "Official Dojo Store",
    heading: "Lion Mode",
    highlight: "Pro Shop",
    description: "Shop official Kimura Dojo uniforms, WKF-approved protective sparring equipment, student training gear, and apparel. Open to both members and the public.",
    buttonText: "Visit Full Pro Shop"
  },
  about: {
    eyebrow: "About Lionmode",
    heading: "More Than a",
    highlight: "Dojo",
    storyParagraph1: "For over 25 years, Lionmode Karate Academy has built champions on a foundation of traditional and sports karate in Durban, South Africa.",
    storyParagraph2: "We believe martial arts is more than fighting — it's about building character, discipline, and a community that supports each other on and off the mat.",
    primaryButtonText: "Book a Free Trial",
    secondaryButtonText: "View Class Schedule"
  },
  contact: {
    eyebrow: "Start Your Journey",
    heading: "Book Your",
    highlight: "Free Trial",
    subtitle: "Step onto the tatami at Lion Mode Karate Academy. Experience our high-energy training with zero obligation.",
    dojoName: "Lion Mode Karate Academy",
    dojoSubtitle: "Durban's premier martial arts center for children, teenagers, and adult athletes.",
    email: "lionsdentck@gmail.com",
    headMaster: "Sensei Babu (5th Dan Black Belt)",
    trainingHours: "Mon – Fri: 15:30 – 20:00 • Sat: 08:30 – 13:00",
    formButtonText: "Confirm Free Trial Lesson"
  },
  footer: {
    brandName: "Lionmode Karate",
    brandSubtitle: "Karate Academy",
    email: "lionsdentck@gmail.com",
    copyrightText: "© 2026 Lionmode Karate. All rights reserved."
  },
  app: {
    dashboardTitle: "Command Center",
    dashboardSubtitle: "Your dojo operations at a glance",
    senseiQuote: "Discipline is the bridge between goals and accomplishment. Train with honor and precision today!",
    classesTitle: "Class Schedule",
    classesSubtitle: "Daily dojo training sessions and belt-specific classes",
    studentsTitle: "Personnel Roster",
    studentsSubtitle: "Active martial artists, belt levels and attendance records",
    videosTitle: "Video Curriculum",
    videosSubtitle: "Kata masterclasses, sparring breakdown and belt testing syllabus",
    shopTitle: "Pro Shop",
    shopSubtitle: "Official Kimura uniforms, sparring pads, gear and apparel",
    leadsTitle: "CRM & Leads Funnel",
    leadsSubtitle: "Prospective students, trial passes and conversions",
    eventsTitle: "Events & Tournaments",
    eventsSubtitle: "Upcoming championships, belt gradings and seminars"
  }
};

const LOCAL_STORAGE_KEY = "lionmode_site_content_v2";
const FIRESTORE_DOC_PATH = "site_settings/content";

export function getInitialSiteContent(): SiteContent {
  if (typeof window === "undefined") {
    return DEFAULT_SITE_CONTENT;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return deepMerge(DEFAULT_SITE_CONTENT, parsed);
    }
  } catch (e) {
    console.warn("Could not read site content from localStorage", e);
  }
  return DEFAULT_SITE_CONTENT;
}

function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== "object") return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(getInitialSiteContent);

  useEffect(() => {
    const handleUpdate = () => {
      setContent(getInitialSiteContent());
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("lionmode_content_updated", handleUpdate);

    // Fetch from Firestore
    const fetchRemote = async () => {
      try {
        const docRef = doc(db, FIRESTORE_DOC_PATH);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const remoteData = snap.data();
          if (remoteData && typeof remoteData === "object") {
            const merged = deepMerge(DEFAULT_SITE_CONTENT, remoteData);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
            setContent(merged);
          }
        }
      } catch (err) {
        // Fallback silently to localStorage
      }
    };
    fetchRemote();

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("lionmode_content_updated", handleUpdate);
    };
  }, []);

  return content;
}

export async function saveSiteContent(updatedContent: Partial<SiteContent>): Promise<void> {
  try {
    const current = getInitialSiteContent();
    const merged = deepMerge(current, updatedContent);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event("lionmode_content_updated"));

    try {
      const docRef = doc(db, FIRESTORE_DOC_PATH);
      await setDoc(docRef, merged, { merge: true });
    } catch (firestoreErr) {
      console.warn("Could not persist content to Firestore, saved to local cache", firestoreErr);
    }
  } catch (err) {
    console.error("Failed to save site content:", err);
    throw err;
  }
}

export async function resetSiteContent(): Promise<void> {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_CONTENT));
    window.dispatchEvent(new Event("lionmode_content_updated"));

    try {
      const docRef = doc(db, FIRESTORE_DOC_PATH);
      await setDoc(docRef, DEFAULT_SITE_CONTENT);
    } catch (err) {
      console.warn("Failed to reset Firestore site content:", err);
    }
  } catch (err) {
    console.error("Failed to reset site content:", err);
    throw err;
  }
}
