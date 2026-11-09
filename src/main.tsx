import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';


const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );

    // Dismiss static splash loader once React renders successfully
    requestAnimationFrame(() => {
      setTimeout(() => {
        const initialLoader = document.getElementById('initial-dojo-loader');
        if (initialLoader && !(window as any).__hasFatalScriptError) {
          initialLoader.style.opacity = '0';
          setTimeout(() => {
            try { initialLoader.remove(); } catch (e) {}
          }, 300);
        }
      }, 50);
    });
  } catch (err: any) {
    console.error('[DOJO_OS] Mount initialization failure:', err);
    const initialLoader = document.getElementById('initial-dojo-loader');
    if (initialLoader) {
      initialLoader.style.opacity = '1';
      initialLoader.innerHTML = `
        <div style="max-width:440px;margin:20px;padding:24px;border:1px solid #D4AF37;background:#141414;color:#fff;border-radius:16px;text-align:center;">
          <div style="color:#D4AF37;font-size:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Lion Mode Karate</div>
          <div style="color:#fff;font-size:13px;opacity:0.9;margin-bottom:12px;">App Initialization Notice</div>
          <div style="color:rgba(255,255,255,0.5);font-size:11px;margin-bottom:18px;font-family:monospace;word-break:break-all;">${err?.message || 'Initialization error'}</div>
          <button onclick="localStorage.clear();sessionStorage.clear();window.location.reload();" style="padding:10px 22px;border-radius:10px;background:linear-gradient(135deg,#D4AF37,#FFB800);color:#000;font-weight:bold;border:none;cursor:pointer;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Clear Cache & Reload</button>
        </div>
      `;
    }
  }
}

// Register PWA service worker with immediate update check
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then((reg) => {
      reg.update().catch(() => {});
    }).catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}



