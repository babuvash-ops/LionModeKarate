// Lion Mode Karate Academy (https://lionmodekarate.com)
// Dynamic Site Image Assets with Admin Customization, Photo Uploading, and Cloud Sync

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface SiteImageSlot {
  key: string;
  label: string;
  category: "Home & Landing" | "Dojo Action & Programs" | "App Heroes" | "Branding";
  defaultUrl: string;
  description: string;
}

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  // Home & Landing
  {
    key: "hero_background",
    label: "Main Website Hero",
    category: "Home & Landing",
    defaultUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=2000&q=85",
    description: "Karate student practicing kata on the beach with open sky and ocean."
  },
  {
    key: "about_background",
    label: "About Dojo Banner",
    category: "Home & Landing",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/Samurai-Kimura-Karate-Do-Durban-1-8349753.jpg",
    description: "Full academy background featured in the About section."
  },

  // Dojo Action & Programs
  {
    key: "kids_training",
    label: "Lionmode Kids (Ages 3–8)",
    category: "Dojo Action & Programs",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/20210909_175558-7415561.jpg",
    description: "Young students practicing fundamentals, discipline and balance in Gi."
  },
  {
    key: "sparring_action",
    label: "Kumite Sparring & Teens",
    category: "Dojo Action & Programs",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/241426277_229185769151696_3286067128154972950_n-7424218.jpg",
    description: "Dynamic martial arts sparring and self defense action."
  },
  {
    key: "tournaments_grading",
    label: "Belt Grading & Tournaments",
    category: "Dojo Action & Programs",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/IMG-20210610-WA0134-8490785.jpg",
    description: "Lion Mode students at official grading ceremonies and championship competitions."
  },
  {
    key: "stop_bullying",
    label: "Stop Bullying Defense Emblem",
    category: "Dojo Action & Programs",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/stop-bullying-8502586.png",
    description: "Lion Mode Anti-Bullying and youth empowerment initiative."
  },
  {
    key: "junior_kata",
    label: "Junior Kata Form & Discipline",
    category: "Dojo Action & Programs",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/467284781_18123799843393050_739399674060152822_n-4431799.jpg",
    description: "Lion Mode student performing traditional kata stance."
  },
  {
    key: "focus_discipline",
    label: "Cadet Training & Coordination",
    category: "Dojo Action & Programs",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/467588742_18123900670393050_4337579697534259852_n-4429136.jpg",
    description: "Speed, agility and coordination drills."
  },
  {
    key: "champion_medals",
    label: "Championship Gold Medals",
    category: "Dojo Action & Programs",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/469533008_18125826691393050_7552599873704125080_n-4431896.jpg",
    description: "Lion Mode fighters holding inter-dojo trophies and championship medals."
  },
  {
    key: "dojo_mat",
    label: "Main Tatami Training Hall",
    category: "Dojo Action & Programs",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/469792457_18125825893393050_8897779621407359848_n-4429205.jpg",
    description: "Full dojo floor with junior and senior students training."
  },

  // App Heroes
  {
    key: "hero_dashboard",
    label: "Dashboard Banner",
    category: "App Heroes",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/Samurai-Kimura-Karate-Do-Durban-1-8349753.jpg",
    description: "Banner displayed at the top of the main Member and Master Dashboard."
  },
  {
    key: "hero_students",
    label: "Personnel Roster Banner",
    category: "App Heroes",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/206802829_430961915005326_7596257423417036361_n-9069420.jpg",
    description: "Banner displayed on the Student Directory and Personnel Roster."
  },
  {
    key: "hero_classes",
    label: "Class Schedule Banner",
    category: "App Heroes",
    defaultUrl: "https://content.app-sources.com/s/86675599773308165/uploads/Images/241526155_384689529935597_8744745017801485911_n-7678910.jpg",
    description: "Banner displayed on the Classes and Dojo Schedule module."
  },
  {
    key: "hero_shop",
    label: "Pro Shop Hero",
    category: "App Heroes",
    defaultUrl: "https://content.app-sources.com/s/86675599773308165/uploads/Images/241536732_337176311431173_3131033743625564655_n-7678978.jpg",
    description: "Banner displayed at the top of the Lion Mode Pro Shop gear catalogue."
  },
  {
    key: "hero_leads",
    label: "CRM / Leads Funnel Banner",
    category: "App Heroes",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/244978175_1291394757958017_5405755766808601345_n-7678728.jpg",
    description: "Banner displayed on the CRM and Leads pipeline management page."
  },
  {
    key: "hero_instructor",
    label: "Instructor Portal Banner",
    category: "App Heroes",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/Samurai-Kimura-Karate-Do-Durban-1-8349753.jpg",
    description: "Banner on the Instructor and Sensei Command Portal."
  },
  {
    key: "hero_videos",
    label: "Video Curriculum Banner",
    category: "App Heroes",
    defaultUrl: "https://content.app-sources.com/s/86675599773308165/uploads/Images/241426277_229185769151696_3286067128154972950_n-7679141.jpg",
    description: "Banner displayed on the Sensei Video Library and Training Masterclasses."
  },
  {
    key: "hero_events",
    label: "Events & Tournaments Banner",
    category: "App Heroes",
    defaultUrl: "https://content.app-sources.com/s/09941769835917864/uploads/Images/IMG-20210610-WA0134-8490785.jpg",
    description: "Banner displayed on the Dojo Tournaments and Seminars calendar."
  }
];

const LOCAL_STORAGE_KEY = "lionmode_site_images_v2";
const LOCAL_META_KEY = "lionmode_site_images_meta_v2";
const FIRESTORE_DOC_PATH = "site_settings/images";
const FIRESTORE_META_DOC_PATH = "site_settings/images_meta";

/**
 * Resizes and compresses an uploaded image file into an optimized JPEG Data URL.
 * Prevents exceeding Firestore and browser storage quotas while preserving high visual fidelity.
 */
export async function processImageFile(file: File, maxDimension = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Unable to parse image file"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export function getInitialSiteImages(): Record<string, string> {
  const result: Record<string, string> = {};
  SITE_IMAGE_SLOTS.forEach(slot => {
    result[slot.key] = slot.defaultUrl;
  });

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.hero_background && parsed.hero_background.includes("Samurai-Kimura-Karate-Do-Durban")) {
          parsed.hero_background = "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=2000&q=85";
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
        Object.assign(result, parsed);
      }
    } catch (e) {
      console.warn("Could not read site images from localStorage", e);
    }
  }

  return result;
}

export function getInitialSiteImagesMeta(): Record<string, { label: string; description: string }> {
  const result: Record<string, { label: string; description: string }> = {};
  SITE_IMAGE_SLOTS.forEach(slot => {
    result[slot.key] = { label: slot.label, description: slot.description };
  });

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_META_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.assign(result, parsed);
      }
    } catch (e) {
      console.warn("Could not read image meta from localStorage", e);
    }
  }

  return result;
}

export function useSiteImages() {
  const [images, setImages] = useState<Record<string, string>>(getInitialSiteImages);

  useEffect(() => {
    const handleStorageChange = () => {
      setImages(getInitialSiteImages());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("lionmode_images_updated", handleStorageChange);

    const fetchRemote = async () => {
      try {
        const docRef = doc(db, FIRESTORE_DOC_PATH);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const remoteData = snap.data();
          if (remoteData && typeof remoteData === "object") {
            const merged = { ...getInitialSiteImages(), ...remoteData };
            if (merged.hero_background && merged.hero_background.includes("Samurai-Kimura-Karate-Do-Durban")) {
              merged.hero_background = "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=2000&q=85";
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
            setImages(merged);
          }
        }
      } catch (err) {
        // Fallback silently to localStorage
      }
    };
    fetchRemote();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("lionmode_images_updated", handleStorageChange);
    };
  }, []);

  return images;
}

export function useSiteImageDetails() {
  const [images, setImages] = useState<Record<string, string>>(getInitialSiteImages);
  const [meta, setMeta] = useState<Record<string, { label: string; description: string }>>(getInitialSiteImagesMeta);

  useEffect(() => {
    const handleUpdate = () => {
      setImages(getInitialSiteImages());
      setMeta(getInitialSiteImagesMeta());
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("lionmode_images_updated", handleUpdate);

    const fetchRemote = async () => {
      try {
        const snap = await getDoc(doc(db, FIRESTORE_DOC_PATH));
        if (snap.exists()) {
          const remoteData = snap.data();
          if (remoteData && typeof remoteData === "object") {
            const merged = { ...getInitialSiteImages(), ...remoteData };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
            setImages(merged);
          }
        }

        const metaSnap = await getDoc(doc(db, FIRESTORE_META_DOC_PATH));
        if (metaSnap.exists()) {
          const remoteMeta = metaSnap.data();
          if (remoteMeta && typeof remoteMeta === "object") {
            const mergedMeta = { ...getInitialSiteImagesMeta(), ...remoteMeta };
            localStorage.setItem(LOCAL_META_KEY, JSON.stringify(mergedMeta));
            setMeta(mergedMeta as any);
          }
        }
      } catch (err) {
        // Fallback silently
      }
    };
    fetchRemote();

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("lionmode_images_updated", handleUpdate);
    };
  }, []);

  return { images, meta };
}

export async function saveSiteImage(
  key: string,
  url: string,
  customMeta?: { label?: string; description?: string }
): Promise<void> {
  try {
    const current = getInitialSiteImages();
    current[key] = url;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));

    if (customMeta) {
      const currentMeta = getInitialSiteImagesMeta();
      currentMeta[key] = {
        label: customMeta.label || currentMeta[key]?.label || key,
        description: customMeta.description !== undefined ? customMeta.description : currentMeta[key]?.description || ""
      };
      localStorage.setItem(LOCAL_META_KEY, JSON.stringify(currentMeta));
    }

    window.dispatchEvent(new Event("lionmode_images_updated"));

    // Save to Firestore
    try {
      const docRef = doc(db, FIRESTORE_DOC_PATH);
      await setDoc(docRef, current, { merge: true });

      if (customMeta) {
        const metaDocRef = doc(db, FIRESTORE_META_DOC_PATH);
        const currentMeta = getInitialSiteImagesMeta();
        await setDoc(metaDocRef, currentMeta, { merge: true });
      }
    } catch (firestoreErr) {
      console.warn("Could not persist to Firestore, cached in localStorage", firestoreErr);
    }
  } catch (err) {
    console.error("Failed to save site image:", err);
    throw err;
  }
}

export async function removeSiteImage(key: string): Promise<void> {
  // Clear the image URL or set to placeholder
  await saveSiteImage(key, "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23111111'/><text x='50%' y='50%' font-family='sans-serif' font-size='16' fill='%23666666' text-anchor='middle' dominant-baseline='middle'>No Image Uploaded</text></svg>");
}

export async function resetAllSiteImages(): Promise<void> {
  const freshDefaults: Record<string, string> = {};
  const freshMeta: Record<string, { label: string; description: string }> = {};

  SITE_IMAGE_SLOTS.forEach(slot => {
    freshDefaults[slot.key] = slot.defaultUrl;
    freshMeta[slot.key] = { label: slot.label, description: slot.description };
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(freshDefaults));
  localStorage.setItem(LOCAL_META_KEY, JSON.stringify(freshMeta));
  window.dispatchEvent(new Event("lionmode_images_updated"));

  try {
    await setDoc(doc(db, FIRESTORE_DOC_PATH), freshDefaults);
    await setDoc(doc(db, FIRESTORE_META_DOC_PATH), freshMeta);
  } catch (err) {
    console.warn("Failed to reset Firestore images doc:", err);
  }
}
