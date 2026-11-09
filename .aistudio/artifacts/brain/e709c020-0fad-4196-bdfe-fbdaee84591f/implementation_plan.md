# Firebase Auth, Firestore Persistence & Gemini Sensei AI Architecture

Add secure Google Authentication via Firebase Auth, robust Firestore data persistence for user accounts and training records, and a multi-turn Gemini 3.8 Flash AI Sensei chatbot accessible across both a persistent floating glass widget and a dedicated full-page AI training workspace.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned during the interactive clarification session:

- **Chatbot Placement & Accessibility**: Both a global floating collapsible widget accessible across all dojo screens and a dedicated full-page AI Dojo Sensei Hub in the main navigation.
- **AI Persona & Specialization**: Specialized as the "Dojo Sensei & Assistant" dedicated to technique breakdowns, belt promotion requirements, training drills, motivation, and schedule guidance.
- **Model Routing**: Defaulting to `gemini-3.8-flash` for general queries, with fast-inference support via `gemini-3.1-flash-lite` and deep-reasoning support via `gemini-4-argon` for complex martial arts curriculum planning.
- **Auth & Access Gate**: Public exploration mode with Google Sign-In prompts when accessing personal student portals, saving belt milestones, and syncing cloud-saved AI chat sessions.

---

## 1. Overview & Core Concept

- **What It Does**: Upgrades DOJO_OS with live Google Firebase Authentication, real-time Firestore synchronization for student profiles and practice history, and an intelligent server-side Gemini AI Sensei assistant capable of maintaining multi-turn conversational context with role-tailored coaching.
- **Target Audience / Persona**: Dojo owners, instructors, and martial arts students (from White Belt beginners to Black Belt candidates) looking for immediate schedule guidance, personalized drill recommendations, and synchronized cloud profiles.
- **Key Value**: Replaces client-side API calls and isolated local mock states with authenticated multi-turn intelligence, secure server-proxied AI generation, and multi-device persistence across sessions.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Seamless Google Sign-In & Profile Sync**:
   - Visitors explore dojo programs, shop items, and class timetables freely.
   - When clicking "Sign In with Google" or entering student/instructor portals, Firebase Auth launches a clean Google popup dialog.
   - Upon successful authentication, user records automatically sync to Firestore (`users/{uid}`), populating their avatar, student rank, and cloud preferences in the top navigation and profile drawer.
   - Sign-out is accessible in 1 click from the profile menu, immediately clearing active tokens.

2. **Global Floating Sensei Chat Widget**:
   - A gold-haloed circular badge in the bottom-right corner provides 1-click access to the floating AI Sensei from any page.
   - Expands smoothly with a glassmorphic container displaying the Sensei persona header, quick prompt chips (e.g. *"Suggest a 15-min warm-up drill"*, *"Tips for Kata testing"*), a scrollable dialogue thread, and an input bar.
   - Minimizes or closes without losing in-session conversation history.

3. **Full-Page AI Sensei Hub & Sparring Coach**:
   - Accessible via the main navigation bar (`/ai-sensei`).
   - Offers an expanded two-column workspace: left column provides curated training categories (Drills & Conditioning, Belt Requirements, Kata Breakdown, Philosophy), while the right column provides an expansive multi-turn conversation canvas with export and session reset capabilities.

### Visual Identity & Theme

- **Aesthetic Direction**: Minimal Luxury, Dark Obsidian (`#0A0A0A`), Cinematic Warm Gold (`#D4AF37` / `#FFB800`).
- **Color Distribution (60-30-10)**:
  - 60% Deep Obsidian Canvas (`#0A0A0A`)
  - 30% Structural Glass Panels (`rgba(255, 255, 255, 0.05)`, border `rgba(255, 255, 255, 0.08)`)
  - 10% Gold Accent Highlights (active buttons, Sensei highlights, focus rings)
- **Typography**: Oswald / Bebas Neue for display headings (uppercase, tracking-wider), Inter for body copy, and tabular numerals for workout timestamps and streak metrics.
- **Anti-Slop Discipline**: Zero unboxed metadata pills, no fake telemetry strings, no pulsing green dots on static cards, and clean hairline borders throughout.

---

## 3. Key Product Decisions & Trade-Offs

- **Server-Side Gemini API Integration**:
  - *Chosen Approach*: Call the `@google/genai` TypeScript SDK exclusively on the Express backend (`server.ts` proxy endpoint `/api/gemini/chat`) with `process.env.GEMINI_API_KEY`. The client communicates via standard JSON HTTP requests.
  - *Why*: Satisfies AI Studio security standards (never exposing API keys in browser bundles) while enabling server-side system instruction injection and error handling.
  - *Alternatives Considered*: Client-side SDK calls (rejected due to API key exposure and CORS/security concerns).

- **Multi-Turn Message Memory**:
  - *Chosen Approach*: Client sends the conversation history array (`role: "user" | "model"`, `parts: [{ text }]`) to the server proxy, which passes the history into `ai.models.generateContent` with the Dojo Sensei system prompt.
  - *Why*: Maintains conversational context seamlessly across client sessions while allowing optional cloud persistence into Firestore under `users/{uid}/chats`.

- **Firebase Google Sign-In with Popup**:
  - *Chosen Approach*: Use `signInWithPopup(auth, new GoogleAuthProvider())` with fallback graceful handling and synchronization into Firestore `users` collection.
  - *Why*: Popup authentication avoids iframe parent redirect restrictions in AI Studio preview environments while providing an instant, native sign-in flow.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          DOJO_OS FRONTEND                              │
│                                                                        │
│   ┌─────────────────────┐   ┌──────────────────┐   ┌───────────────┐   │
│   │   Top Navigation    │   │ Global Floating  │   │  Full-Page    │   │
│   │ Google Sign-In/Out  │   │ Sensei AI Bubble │   │ Sensei AI Hub │   │
│   └──────────┬──────────┘   └────────┬─────────┘   └───────┬───────┘   │
│              │                       │                     │           │
│              ▼                       └───────────┬─────────┘           │
│   ┌─────────────────────┐                        │                     │
│   │   AuthContext.tsx   │                        ▼                     │
│   │ (Firebase Auth SDK) │          ┌───────────────────────────┐       │
│   └──────────┬──────────┘          │  fetch('/api/gemini/chat')│       │
│              │                     └─────────────┬─────────────┘       │
└──────────────┼───────────────────────────────────┼─────────────────────┘
               │                                   │
               │ Google OAuth                      │ POST (messages, model)
               ▼                                   ▼
┌─────────────────────────────┐     ┌────────────────────────────────────┐
│      FIREBASE BACKEND       │     │        EXPRESS API SERVER          │
│                             │     │            (server.ts)             │
│  - Firebase Auth            │     │                                    │
│    (Google Provider)        │     │  - @google/genai SDK (Server-Side) │
│  - Cloud Firestore          │     │  - System Prompt: Dojo Sensei      │
│    (Database: ai-studio-*)  │     │  - Model: gemini-3.8-flash         │
│    • users/{uid}            │     │  - Error formatting & telemetry    │
│    • students/{studentId}   │     └────────────────────────────────────┘
│    • chats/{chatId}         │
└─────────────────────────────┘
```

### Data Models & State

1. **User Profile Document (`users/{uid}`)**:
   ```typescript
   interface UserProfile {
     uid: string;
     email: string;
     displayName: string;
     photoURL?: string;
     role: 'student' | 'instructor' | 'admin';
     beltRank: string;
     dojoId: string;
     createdDate: string;
     lastLogin: string;
   }
   ```

2. **Chat History Structure**:
   ```typescript
   interface ChatMessage {
     id: string;
     role: 'user' | 'model';
     content: string;
     timestamp: number;
   }
   ```

3. **Server API Endpoint (`POST /api/gemini/chat`)**:
   - Request Body: `{ messages: Array<{ role: 'user'|'model', text: string }>, model?: string, category?: string }`
   - Response: `{ text: string, model: string }`
   - Handles model selection: `gemini-3.8-flash` (default), `gemini-3.1-flash-lite` (quick replies), or `gemini-4-argon` (in-depth curricula).

### Interactive Component & State Mapping

- **Auth Controls**: Placed inside `src/components/layout/Navbar.tsx` and user modals; displays user avatar when logged in, with a one-click dropdown for Profile and Sign Out.
- **Floating Sensei**: Persistent across routes in `src/App.tsx`, with minimize/expand state, automatic scroll pinning, and suggestion triggers.
- **Dedicated AI Hub**: Mounted at route `/ai-sensei` with category filters, prompt templates, and markdown-rendered coaching insights.
- **Error Recovery**: Visual banner and retry toasts when network errors occur, preventing silent failures.
