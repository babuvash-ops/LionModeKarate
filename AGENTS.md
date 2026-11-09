# Project Design Guidelines

## Approved Template 01 (Layout & Aesthetics)
This is the locked-in design designator for the DOJO_OS application. It completely replaces any tactical grid overlay styling with a clean, luxury, high-end design pattern.

### 1. Color Palette & Typography
- **Vibe:** Minimal Luxury, Dark Obsidian, Cinematic Gold.
- **Background:** Set physically to deep dark black (`#0A0A0A`) inside `body` directly.
- **Primary Accent:** Warm gold gradient (`linear-gradient(135deg, #D4AF37, #FFB800)`) or `#D4AF37` / `#FFB800`.
- **Typography:**
  - **Display Headings:** Bebas Neue / Oswald (Uppercase, tracking-wider).
  - **Body Texts:** Inter (Clean, legible, white/70 or slate gradients).

### 2. Layout & Structure (The Glassmorphic Code)
- **Glass Panel:** `background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.08);` (defined as `.glass` or custom classes).
- **Cards:** Clean multi-radius containers (`rounded-3xl` or `20px` border-radius offset) with a subtle yellow gold hover halo (`shadow-glow`).
- **Sidebar & Topbar:** Clean `.glass` panels, completely omitting tactical telemetry overlays, port indicator texts, or redundant background scan lines. 

### 3. Key Layout Components
- **HeroBanner:** Pure Unsplash/image backing with minimal dark gradient shadows, big sans/display titles, and sleek subtitles. No scanner animations.
- **StatCard:** `.glass` rounded card structures centering large amber gold values, tracking-wide labels, and clean lucide-react utility icons.
- **Gold Button:** High contrast visual keys with hovering scale animations (`scale-[1.02]`).

## Coding Patterns
- **Responsiveness:** Desktop sidebar (`w-72` fixed) paired with a responsive mobile navigation drawer or bottom rail.
- **Consistency:** Maintain padding patterns seen in `DojoHome.tsx` and `Dashboard.tsx` (`max-w-7xl`, `px-4 md:px-8`).
- **Icons:** Use `lucide-react` exclusively. No raw SVG inclusions.
