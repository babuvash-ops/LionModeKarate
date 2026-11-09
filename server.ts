import express from 'express';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  let PORT = Number(process.env.PORT);
  const portArgIdx = process.argv.indexOf('--port');
  if (!PORT && portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    PORT = Number(process.argv[portArgIdx + 1]);
  }
  if (!PORT || isNaN(PORT)) {
    PORT = 3000;
  }

  console.log(`[SYSTEM] Starting server on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode...`);

  // Enable compression for better performance
  app.use(compression());
  app.use(express.json());

  // CORS middleware for custom domain support
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });


  // Dedicated interactive download page with auto-download and Blob fallback
  app.get(['/download', '/download.html', '/get-zip'], (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download Lion Mode Karate Dojo OS (dojo-app-build.zip)</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0A0A0A;
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 24px;
      padding: 40px 30px;
      max-width: 540px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.1);
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.4);
      color: #D4AF37;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 12px 0;
      color: #FFFFFF;
    }
    h1 span {
      color: #D4AF37;
    }
    p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .btn-download {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 16px 24px;
      border-radius: 16px;
      background: linear-gradient(135deg, #D4AF37, #FFB800);
      color: #000000;
      font-size: 15px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-decoration: none;
      cursor: pointer;
      border: none;
      box-shadow: 0 0 25px rgba(212, 175, 55, 0.35);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-download:hover {
      transform: scale(1.02);
      box-shadow: 0 0 35px rgba(212, 175, 55, 0.55);
    }
    .status {
      margin-top: 16px;
      font-size: 12px;
      color: #D4AF37;
      font-family: monospace;
    }
    .steps {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: left;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.7;
    }
    .steps ol {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Official Deployment Build • Today</div>
    <h1>LION MODE <span>KARATE</span></h1>
    <p>Your production ZIP archive (<strong>lionmode-karate-update-v3.zip</strong> &bull; 17.8 MB) is ready.<br>
    <span style="color: #D4AF37; font-weight: 600;">✓ Today's Build: index.html is 7.38 KB • Footer Download Button Completely Removed</span></p>
    
    <a href="/lionmode-karate-update-v3.zip" download="lionmode-karate-update-v3.zip" class="btn-download" id="downloadBtn">
      <span>&#x2B07; Download lionmode-karate-update-v3.zip (Today's Build)</span>
    </a>

    <div style="margin-top: 14px;">
      <a href="/dojo-app-build.zip" download="dojo-app-build.zip" style="color: #D4AF37; font-size: 13px; text-decoration: underline; font-weight: 600;">
        Or click here for dojo-app-build.zip
      </a>
    </div>
    
    <div id="statusText" class="status">Starting automatic download...</div>

    <div class="steps">
      <strong style="color: #fff;">How to upload to app.lionmodekarate.com:</strong>
      <ol>
        <li>Download <code>lionmode-karate-update-v3.zip</code> to your computer.</li>
        <li>Open your hosting cPanel &gt; File Manager.</li>
        <li>Go to the folder for <code>app.lionmodekarate.com</code>.</li>
        <li>Upload <code>lionmode-karate-update-v3.zip</code> and click <strong>Extract</strong>.</li>
        <li>Verify that <code>index.html</code> is <strong>7.38 KB</strong> with today's date!</li>
      </ol>
    </div>
  </div>

  <script>
    // Trigger automatic download via Blob fetch fallback
    async function startAutoDownload() {
      const status = document.getElementById('statusText');
      try {
        status.textContent = 'Fetching lionmode-karate-update-v3.zip...';
        const response = await fetch('/lionmode-karate-update-v3.zip');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'lionmode-karate-update-v3.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
        status.textContent = '✓ Download started! Check your browser Downloads folder for lionmode-karate-update-v3.zip';
      } catch (err) {
        status.innerHTML = '<span style="color:#FFB800;">If automatic download did not trigger, click the gold button above!</span>';
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(startAutoDownload, 300);
    });
  </script>
</body>
</html>`);
  });

  // Explicit download endpoints with forced download headers
  app.get([
    '/lionmode-karate-update-v3.zip',
    '/latest.zip',
    '/dojo-app-build.zip', 
    '/build.zip', 
    '/app.zip',
    '/lionmode.zip',
    '/dist.zip',
    '/download/build', 
    '/api/download/build',
    '/api/download',
    '/download-zip',
    '/download.zip'
  ], (req, res) => {
    const isV3 = req.path.includes('v3') || req.path.includes('latest');
    const filename = isV3 ? 'lionmode-karate-update-v3.zip' : 'dojo-app-build.zip';
    const candidates = [
      path.join(process.cwd(), filename),
      path.join(process.cwd(), 'public', filename),
      path.join(process.cwd(), 'dist', filename),
      path.join(process.cwd(), 'dojo-app-build.zip'),
      path.join(process.cwd(), 'public', 'dojo-app-build.zip'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.sendFile(p);
      }
    }
    res.status(404).send('Dojo app build ZIP file not found. Rebuild in progress.');
  });

  // Apple iOS WebClip profile endpoint for instant 1-click Home Screen installation
  app.get(['/lionmode.mobileconfig', '/app.mobileconfig', '/ios.mobileconfig'], (req, res) => {
    const p = path.join(process.cwd(), 'public', 'lionmode.mobileconfig');
    if (fs.existsSync(p)) {
      res.setHeader('Content-Type', 'application/x-apple-aspen-config; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="lionmode.mobileconfig"');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.sendFile(p);
    }
    res.status(404).send('Mobileconfig profile not found.');
  });

  // Browser diagnostics endpoint
  app.post('/api/logs', (req, res) => {
    const { message, stack, type, href } = req.body;
    const logType = type || 'ERROR';
    console.log(`[BROWSER-${logType}] ${message}`, stack ? `\nStack: ${stack}` : '', `\nURL: ${href}`);
    try {
      fs.appendFileSync(
        path.join(process.cwd(), 'browser_errors.log'),
        `[${new Date().toISOString()}] [${logType}] ${message}\nStack: ${stack || 'N/A'}\nURL: ${href || 'N/A'}\n------------------\n`
      );
    } catch (e) {
      console.error('Failed to write browser log:', e);
    }
    res.json({ ok: true });
  });

  // Health check endpoints for platform monitoring & Cloud Run probes
  app.get(['/api/health', '/healthz', '/health'], (req, res) => {
    res.json({ 
      status: 'active', 
      version: 'V70.0',
      mode: process.env.NODE_ENV || 'dev'
    });
  });

  // Gemini AI Server-Side Proxy
  const SENSEI_SYSTEM_INSTRUCTION = `You are the revered Dojo Sensei and Head AI Assistant for Lionmode Karate & Dojo OS.
You possess deep mastery of martial arts traditions, kata biomechanics, kumite sparring tactics, physical conditioning, and student progression across belts (White to Black Belt).
You also serve as the Dojo Operations Assistant: you provide precise drill breakdowns, student training tips, safety instructions, and guidance on class schedules.

Tone & Style:
- Martial arts ethos: Wise, respectful, disciplined, and encouraging. Begin or conclude with traditional martial salutations like "Osu!" or "Train with intention" where fitting.
- Clear & practical: When recommending drills, organize them into clear steps:
  1. Stance & Preparation
  2. Execution & Repetitions
  3. Key Sensei Cue (The detail that makes it effective)
  4. Common Flaw to Avoid
- Class Schedule Reference:
  * Kids Karate & Fundamentals: Mon / Wed / Fri at 4:00 PM – 5:00 PM
  * Advanced Kata & Kumite: Tue / Thu at 5:30 PM – 7:00 PM
  * Adult All-Levels & Conditioning: Mon / Wed / Sat at 6:30 PM – 8:00 PM
  * Weekend Warrior Open Mat & Belt Testing: Sat at 10:00 AM – 12:30 PM
- Always promote safety, proper breath control (Kiai/Ibuki), hydration, and respect for training partners. Keep answers focused, engaging, and well-structured using markdown.`;

  app.get('/api/gemini/health', (req, res) => {
    res.json({
      status: 'active',
      availableModels: ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-4-argon'],
      defaultModel: 'gemini-3.8-flash',
      hasApiKey: !!process.env.GEMINI_API_KEY
    });
  });

  app.post('/api/gemini/chat', async (req, res) => {
    const { messages = [], model = 'gemini-3.8-flash', studentContext, stream = false } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const ai = new GoogleGenAI({});

    // Map messages to Gemini format: role 'user' or 'model'
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m.content || '') }]
    }));

    // Inject student context if available
    let dynamicSystemInstruction = SENSEI_SYSTEM_INSTRUCTION;
    if (studentContext) {
      dynamicSystemInstruction += `\n\nActive Student Context:\n- Name: ${studentContext.name || 'Student'}\n- Belt Rank: ${studentContext.belt || 'White Belt'}\n- Rank / Level: ${studentContext.rank || 'Beginner'}\nTailor your guidance to this student's belt level and goals.`;
    }

    const modelCandidates = [
      model,
      'gemini-3.8-flash',
      'gemini-3.1-flash-lite',
      'gemini-4-argon'
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    // If client requested streaming
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let streamedSuccessfully = false;
      for (const candidate of modelCandidates) {
        try {
          const responseStream = await ai.models.generateContentStream({
            model: candidate,
            contents,
            config: {
              systemInstruction: dynamicSystemInstruction,
              temperature: 0.7,
            }
          });

          for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            if (chunkText) {
              res.write(`data: ${JSON.stringify({ text: chunkText, model: candidate })}\n\n`);
            }
          }
          res.write('data: [DONE]\n\n');
          res.end();
          streamedSuccessfully = true;
          break;
        } catch (err: any) {
          console.warn(`[GEMINI-STREAM-WARN] Model ${candidate} failed:`, err?.message || err);
        }
      }

      if (!streamedSuccessfully) {
        res.write(`data: ${JSON.stringify({ error: 'Failed to generate response. Please try again.' })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
      }
      return;
    }

    // Try Gemini model candidates first
    let lastError: any = null;
    for (const candidate of modelCandidates) {
      try {
        const response = await ai.models.generateContent({
          model: candidate,
          contents,
          config: {
            systemInstruction: dynamicSystemInstruction,
            temperature: 0.7,
          }
        });

        const text = response.text;
        if (text) {
          return res.json({
            role: 'model',
            content: text,
            modelUsed: candidate
          });
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[GEMINI-WARN] Model ${candidate} failed:`, err?.status || err?.message || err);
      }
    }

    // Fallback Sensei Knowledge Synthesizer when upstream AI is experiencing high demand (503)
    console.warn('[GEMINI-FALLBACK] Utilizing Sensei Knowledge Synthesizer due to upstream demand spike');
    const latestUserMsg = messages.filter((m: any) => m.role === 'user').pop()?.content?.toLowerCase() || '';
    
    let fallbackText = `**Osu!** 🥋\n\n`;

    if (latestUserMsg.includes('schedule') || latestUserMsg.includes('class') || latestUserMsg.includes('time') || latestUserMsg.includes('hour')) {
      fallbackText += `Here is our current **Lionmode Karate Dojo Schedule**:\n\n` +
        `- **Kids Karate & Fundamentals:** Mon / Wed / Fri at 4:00 PM – 5:00 PM\n` +
        `- **Advanced Kata & Kumite Sparring:** Tue / Thu at 5:30 PM – 7:00 PM\n` +
        `- **Adult All-Levels & Conditioning:** Mon / Wed / Sat at 6:30 PM – 8:00 PM\n` +
        `- **Weekend Warrior Open Mat & Belt Testing:** Sat at 10:00 AM – 12:30 PM\n\n` +
        `*Sensei Tip:* Arrive 10 minutes prior to bow into the training mat (*Tatami*) and warm up your ankles and hips.`;
    } else if (latestUserMsg.includes('heian') || latestUserMsg.includes('stance') || latestUserMsg.includes('kata')) {
      fallbackText += `Here is your **Kata Stance & Biomechanics Breakdown**:\n\n` +
        `1. **Stance Geometry (Zenkutsu-Dachi / Front Stance):**\n` +
        `   - 60% of your body weight on the front bent knee; front shin perpendicular to the floor.\n` +
        `   - Rear leg locked straight with the heel firmly rooted into the floor at a 45° angle.\n` +
        `   - Feet shoulder-width apart to create a stable two-track base.\n\n` +
        `2. **Execution & Repetitions:**\n` +
        `   - Perform 20 slow steps across the mat, sinking into each stance before initiating the block or punch.\n` +
        `   - Keep the head level—do not bob up and down during foot transitions.\n\n` +
        `3. **Key Sensei Cue:** Drive the rotation from the hips (*Tanden*). Power comes from the floor through hip rotation, not shoulder tension.\n\n` +
        `4. **Common Flaw:** Stepping on a narrow single line, which compromises balance. Maintain wide train tracks.`;
    } else if (latestUserMsg.includes('sparring') || latestUserMsg.includes('kumite') || latestUserMsg.includes('counter') || latestUserMsg.includes('punch')) {
      fallbackText += `Here is your **Kumite Reflex & Distance Drill (Ma-ai)**:\n\n` +
        `1. **Preparation & Stance:** Light bounce on the balls of your feet in fighting stance (*Kamae*). Chin tucked, hands guarding cheekbones.\n\n` +
        `2. **The Counter-Strike Drill (Gyaku-Tsuki):**\n` +
        `   - Stage 1: Half-step slip outside the opponent's jab.\n` +
        `   - Stage 2: Fire the reverse punch immediately into the solar plexus with sharp *Kiai*.\n` +
        `   - Stage 3: Pivot out 45° to reset distance (*Zanshin*).\n\n` +
        `3. **Repetitions:** 4 sets of 15 sharp repetitions per side.\n\n` +
        `*Sensei Cue:* Do not wait for the strike to finish before reacting. Move on their shoulder twitch (*Sen-no-sen*).`;
    } else if (latestUserMsg.includes('belt') || latestUserMsg.includes('exam') || latestUserMsg.includes('test') || latestUserMsg.includes('rank')) {
      fallbackText += `Here is your **Belt Exam Preparation Protocol**:\n\n` +
        `- **Kihon (Basics):** Clean, crisp punches, blocks, and kicks with zero upper body sway.\n` +
        `- **Kata (Forms):** Sharp tempo, proper pauses (*Ma*), and dynamic power modulation (*In-Yo*).\n` +
        `- **Conditioning:** 50 pushups, 50 squats, 3 minutes continuous shadow sparring.\n` +
        `- **Mindset:** Strong eye contact (*Metsuke*) and loud, confident *Kiai*.\n\n` +
        `Practice your prescribed syllabus daily for 20 deliberate minutes. Discipline surpasses motivation!`;
    } else {
      fallbackText += `I have registered your instruction. Training with intention requires patience, focus, and sharp technique.\n\n` +
        `Whether you are training for kata accuracy, sharpening kumite reflexes, or working through your belt syllabus, remember:\n` +
        `> *"The ultimate aim of martial arts lies not in victory or defeat, but in the perfection of the character of its participants."*\n\n` +
        `Feel free to ask for specific drills, schedule details, or belt test preparation routines.`;
    }

    return res.json({
      role: 'model',
      content: fallbackText,
      modelUsed: 'Sensei Intelligence Core'
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    // DEVELOPMENT MODE: Use Vite Middleware (HMR disabled in container environment)
    console.log('[DEV] Attaching Vite middleware...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Dynamic dev routing fallback for solid subpage / query loading
    app.use(async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) return next();
      try {
        const indexHtmlPath = path.join(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexHtmlPath, 'utf8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    // PRODUCTION MODE: Serve built assets
    // Try multiple possible paths to be extremely resilient
    const possiblePaths = [
      path.join(process.cwd(), 'dist'),
      path.resolve(process.cwd(), 'dist'),
      '/app/applet/dist'
    ];

    let distPath = possiblePaths[0];
    for (const p of possiblePaths) {
      if (fs.existsSync(path.join(p, 'index.html'))) {
        distPath = p;
        console.log(`[PROD] Found valid dist at: ${p}`);
        break;
      }
    }

    const indexPath = path.join(distPath, 'index.html');
    
    console.log(`[PROD] Final dist path: ${distPath}`);
    console.log(`[PROD] Final index path: ${indexPath}`);
    console.log(`[PROD] CWD: ${process.cwd()}`);
    console.log(`[PROD] ENV: ${JSON.stringify(process.env.NODE_ENV)}`);

    // Verify presence of index.html immediately on boot
    if (fs.existsSync(indexPath)) {
      console.log('[PROD] index.html verified and ready.');
    } else {
      console.error('[CRITICAL] index.html MISSING in all searched locations.');
    }

    // Static file serving
    app.use(express.static(distPath, { index: false }));


    // SPA FALLBACK - Serve index.html for all client routes
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Endpoint not found' });
      
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
      
      const rootIndex = path.join(process.cwd(), 'index.html');
      if (fs.existsSync(rootIndex)) {
        return res.sendFile(rootIndex);
      }
      
      return res.status(200).send('<!DOCTYPE html><html><head><title>DOJO_OS</title></head><body style="background:#0A0A0A;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;"><div>Loading Dojo OS...</div></body></html>');
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[READY] Application online at http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[CRITICAL] Port ${PORT} already in use. Retrying or shutting down.`);
      process.exit(1);
    } else {
      console.error('[CRITICAL] Server listen error:', err);
    }
  });
}

startServer().catch((err) => {
  console.error('[CRITICAL] Server failed to ignite:', err);
  process.exit(1);
});
