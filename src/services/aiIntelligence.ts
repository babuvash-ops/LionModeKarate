import { GoogleGenAI } from "@google/genai";
import { collection, query, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

let aiClient: GoogleGenAI | null = null;
const getAI = () => {
  if (!aiClient) {
    // In Vite, process.env is replaced at build time via 'define' in vite.config.ts
    // We use a safe check to avoid ReferenceError
    const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '';
    
    if (!apiKey) {
      console.warn("AI Nexus: GEMINI_API_KEY is missing. AI features will be limited.");
      throw new Error("Missing GEMINI_API_KEY");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export async function predictChurn() {
  try {
    const studentsSnap = await getDocs(collection(db, 'students'));
    const attendanceSnap = await getDocs(query(collection(db, 'attendance'), orderBy('date', 'desc')));
    
    const students = studentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const attendance = attendanceSnap.docs.map(d => d.data());

    if (students.length === 0) return [];

    const prompt = `
      Target Audience: Martial Arts Dojo Owner.
      Data Analyzed: 
      - Students: ${JSON.stringify(students.slice(0, 50))}
      - Recent Attendance: ${JSON.stringify(attendance.slice(0, 100))}
      
      TASK: Analyze patterns to predict "Churn Risks" (students who haven't attended in 7+ days or show declining frequency).
      Return a list of students with 'riskLevel' (high, medium, low) and 'reason'.
      Format: JSON array of objects { 
        studentId: string, 
        name: string, 
        riskLevel: string, 
        reason: string, 
        suggestedActions: string[] 
      }
      ONLY return the JSON.
    `;

    const response = await getAI().models.generateContent({ 
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });
    
    const text = response.text;
    return JSON.parse(text || '[]');
  } catch (error) {
    console.error("AI Churn Analysis Failure:", error);
    return [];
  }
}

export async function analyzeGradingReadiness() {
  try {
    const studentsSnap = await getDocs(collection(db, 'students'));
    const students = studentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (students.length === 0) return { ready: [], notReady: [] };

    const prompt = `
      Analyze martial arts student readiness for next grade.
      Criteria: 12+ classes since last grade, consistent attendance, and positive technical feedback.
      Data: ${JSON.stringify(students.slice(0, 50))}
      Return: { ready: [{ studentId, name, currentRank, nextRank, reason }], notReady: [] }
      ONLY return the JSON.
    `;

    const response = await getAI().models.generateContent({ 
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    return JSON.parse(text || '{"ready": [], "notReady": []}');
  } catch (error) {
    console.error("AI Readiness Analysis Failure:", error);
    return { ready: [], notReady: [] };
  }
}

export async function generateMarketingCopy(topic: string, platform: 'social' | 'email' | 'ad') {
  try {
    const prompt = `
      Martial Arts Dojo Marketing Expert.
      Goal: Generate high-converting marketing copy for a Dojo.
      Topic: "${topic}"
      Platform: "${platform}"
      Style: Premium, Cinematic, Tactical, Motivational.
      
      Return a JSON object { 
        headline: string, 
        body: string, 
        cta: string 
      }
      ONLY return the JSON.
    `;

    const response = await getAI().models.generateContent({ 
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    return JSON.parse(text || '{}');
  } catch (error) {
    console.error("AI Marketing Gen Failure:", error);
    return null;
  }
}

export async function getDashboardStrategicInsight() {
  try {
    const studentsSnap = await getDocs(collection(db, 'students'));
    const attendanceSnap = await getDocs(query(collection(db, 'attendance'), orderBy('date', 'desc'), orderBy('timestamp', 'desc')));
    const paymentsSnap = await getDocs(collection(db, 'payments'));

    const students = studentsSnap.docs.map(d => d.data());
    const attendance = attendanceSnap.docs.map(d => d.data());
    const payments = paymentsSnap.docs.map(d => d.data());

    const prompt = `
      You are the Dojo_OS Strategic AI.
      Analyze the current Dojo state:
      - Total Students: ${students.length}
      - Recent Attendance (Last 50): ${JSON.stringify(attendance.slice(0, 50))}
      - Recent Revenue Data: ${JSON.stringify(payments.slice(0, 20))}
      
      TASK: Provide a 1-sentence high-level strategic insight and 3 tactical recommendations.
      Style: Tactical, Command-Center, Professional.
      
      Return JSON: { 
        insight: string, 
        recommendations: string[] 
      }
      ONLY return the JSON.
    `;

    const response = await getAI().models.generateContent({ 
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    return JSON.parse(text || '{}');
  } catch (error) {
    console.error("AI Strategic Insight Failure:", error);
    return null;
  }
}

export async function scoreLeads(leads: any[]) {
  try {
    const prompt = `
      You are the Dojo_OS Lead Recon AI.
      Analyze the following leads for conversion potential (martial arts enrollment).
      Leads: ${JSON.stringify(leads.slice(0, 50))}
      
      TASK: Assign a score (0-100) and a brief reason/tactic for each lead.
      Return a JSON array of objects: [{ leadId, score, reason, priorityTactic }].
      ONLY return the JSON.
    `;

    const response = await getAI().models.generateContent({ 
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    return JSON.parse(text || '[]');
  } catch (error) {
    console.error("AI Lead Scoring Failure:", error);
    return [];
  }
}
