import { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  X, 
  Share2, 
  PlusSquare, 
  Check, 
  Sparkles, 
  Monitor, 
  Apple, 
  Laptop,
  FolderCheck,
  FileCode,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  AlertCircle,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { toast } from 'sonner';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallModal({ isOpen, onClose }: InstallModalProps) {
  const { deferredPrompt, isInstalled, isIOS, isAndroid, isDesktop, promptInstall, markAsInstalled } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [shortcutDownloaded, setShortcutDownloaded] = useState(false);
  const [desktopTab, setDesktopTab] = useState<'status' | 'shortcut' | 'guide'>('status');

  const handleNativeInstall = async () => {
    setIsInstalling(true);
    try {
      const res = await promptInstall();
      if (res.success && res.outcome === 'accepted') {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDownloadDesktopShortcut = () => {
    const isMac = typeof window !== 'undefined' && /macintosh|mac os x/i.test(navigator.userAgent);
    const targetUrl = window.location.origin || 'https://app.lionmodekarate.com/';
    
    if (isMac) {
      // macOS .webloc internet shortcut
      const weblocContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>URL</key>
\t<string>${targetUrl}</string>
</dict>
</plist>`;
      const blob = new Blob([weblocContent], { type: 'application/x-apple-webloc' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Lion Mode Karate.webloc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Windows .url internet shortcut
      const urlContent = `[InternetShortcut]
URL=${targetUrl}
IconIndex=0
IconFile=${targetUrl}favicon.ico
HotKey=0
IDList=
[{000214A0-0000-0000-C000-000000000046}]
Prop3=19,11
[InternetShortcut.W]
IconFile=${targetUrl}favicon.ico
`;
      const blob = new Blob([urlContent], { type: 'application/internet-shortcut' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Lion Mode Karate.url';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setShortcutDownloaded(true);
    setTimeout(() => setShortcutDownloaded(false), 3500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md rounded-3xl bg-[#0A0A0A] border border-white/10 p-6 md:p-8 shadow-2xl text-white overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Subtle gold glow halo */}
          <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#FFB800]/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
              {isIOS ? (
                <Apple className="w-6 h-6 text-[#FFB800]" />
              ) : isAndroid ? (
                <Smartphone className="w-6 h-6 text-[#FFB800]" />
              ) : (
                <Monitor className="w-6 h-6 text-[#FFB800]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFB800] bg-[#FFB800]/10 px-2.5 py-0.5 rounded-full border border-[#FFB800]/20">
                  {isIOS ? 'iPhone & iPad iOS' : isAndroid ? 'Android Phone & Tablet' : 'Desktop Computer / Tablet'}
                </span>
              </div>
              <h3 className="font-heading text-xl uppercase tracking-wider text-white mt-1">
                Install Dojo OS App
              </h3>
            </div>
          </div>

          {/* Guaranteed Automatic Placement Badge */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-gray-200 mb-4 font-sans">
            <FolderCheck className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white">Automatic Home Screen & App Placement:</strong>
              <div className="text-gray-300 mt-0.5">
                {isIOS && "Adds directly to your iPhone / iPad Home Screen and iOS App Library."}
                {isAndroid && "Installs directly to your Android Home Screen and App Drawer / Gallery."}
                {isDesktop && "Installs directly into your Applications Folder, Start Menu, and Desktop."}
              </div>
            </div>
          </div>

          {/* Icon Preview Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 mb-5">
            <img
              src="/icons/icon-192x192.png"
              alt="Lion Mode Karate"
              className="w-12 h-12 rounded-xl object-contain bg-black border border-[#D4AF37]/40 p-1 shadow-md"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-heading font-bold uppercase tracking-wider text-white truncate">
                Lion Mode Karate | Dojo OS
              </div>
              <div className="text-xs text-gray-400 font-sans">
                Official Academy PWA • Fast & Secure Offline Access
              </div>
            </div>
          </div>

          {/* CASE 1: App is Already Installed on this Device */}
          {(isInstalled || installSuccess) ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-heading uppercase text-sm font-bold text-white tracking-wide">
                    App Installed on this Device
                  </h4>
                  <p className="text-xs text-gray-300 font-sans mt-1 leading-relaxed">
                    Lion Mode Karate | Dojo OS is installed in your Applications folder and Home Screen. You can launch it directly anytime.
                  </p>
                </div>
              </div>

              {isDesktop && (
                <button
                  onClick={handleDownloadDesktopShortcut}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-heading uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FileCode className="w-4 h-4 text-[#FFB800]" />
                  <span>{shortcutDownloaded ? '✓ Shortcut Saved to Downloads!' : 'Re-download Desktop Shortcut Icon'}</span>
                </button>
              )}
            </div>
          ) : deferredPrompt ? (
            /* CASE 2: Native 1-Click Install Available (Chrome / Edge / Android) */
            <div className="space-y-3">
              <button
                onClick={handleNativeInstall}
                disabled={isInstalling}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FFB800] to-[#D4AF37] text-black font-heading uppercase tracking-wider text-sm font-bold flex items-center justify-center gap-2.5 shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                <Download className="w-5 h-5" />
                <span>{isInstalling ? 'Launching Install...' : 'Install Dojo OS Now (1-Click)'}</span>
              </button>
              
              {isDesktop && (
                <button
                  onClick={handleDownloadDesktopShortcut}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-heading uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>{shortcutDownloaded ? '✓ Desktop Shortcut Saved!' : 'Also Download Desktop Shortcut Icon (.url)'}</span>
                </button>
              )}

              <p className="text-center text-[11px] text-gray-400">
                Installs directly into your {isAndroid ? 'Home Screen & App Gallery' : 'Applications folder & Desktop'}.
              </p>
            </div>
          ) : isIOS ? (
            /* CASE 3: iPhone / iPad (iOS WebClip Profile + Safari Guide + Shortcuts) */
            <div className="space-y-3.5">
              {/* Primary 1-Click Action for iPhone: Download Profile */}
              <a
                href="/lionmode.mobileconfig"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FFB800] to-[#D4AF37] text-black font-heading uppercase tracking-wider text-xs font-bold flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-center"
              >
                <Download className="w-4 h-4 text-black shrink-0" />
                <span>Install iPhone Home Screen Profile (Direct)</span>
              </a>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 font-sans space-y-1.5">
                <div className="text-[#FFB800] font-heading uppercase tracking-wider font-bold text-[11px]">
                  How Profile Installation Works:
                </div>
                <ol className="list-decimal list-inside space-y-1 text-gray-300 text-[11px] leading-relaxed">
                  <li>Tap the gold button above &rarr; tap <strong>"Allow"</strong> when prompted to download the profile.</li>
                  <li>Open your iPhone <strong>Settings</strong> app. Right at the top, tap <strong className="text-white">"Profile Downloaded"</strong>.</li>
                  <li>Tap <strong className="text-[#FFB800]">Install</strong> in top-right (enter your iPhone passcode) &rarr; tap <strong>Install</strong>.</li>
                  <li>iOS permanently drops the <strong>Lion Mode</strong> icon directly onto your Home Screen!</li>
                </ol>
              </div>

              {/* Standard Safari Method */}
              <div className="space-y-2.5 rounded-2xl bg-white/5 border border-white/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFB800] uppercase tracking-wider font-heading">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Alternative: Safari "Add to Home Screen"</span>
                </div>
                <div className="space-y-2 text-xs text-gray-300 font-sans">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <span>Tap the <strong className="text-white inline-flex items-center gap-1 font-semibold">Share button <Share2 className="w-3 h-3 inline text-[#FFB800]" /></strong> in Safari's bottom toolbar.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <span>Scroll down and select <strong className="text-white inline-flex items-center gap-1 font-semibold"><PlusSquare className="w-3 h-3 inline text-[#FFB800]" /> Add to Home Screen</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <span>Tap <strong className="text-[#FFB800] font-semibold">Add</strong> in top-right.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : isAndroid ? (
            /* CASE 4: Android Chrome (without pending deferredPrompt) */
            <div className="space-y-3.5 rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FFB800] uppercase tracking-wider font-heading">
                <Sparkles className="w-4 h-4" />
                <span>Install on Android Phone & Tablet</span>
              </div>
              <div className="space-y-2.5 text-xs text-gray-300 font-sans">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <span>Tap the <strong className="text-white font-semibold">three dots (⋮)</strong> menu in Google Chrome at the top right.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <span>Tap <strong className="text-white font-semibold">"Install app"</strong> or <strong className="text-white font-semibold">"Add to Home screen"</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <span>Confirm <strong className="text-[#FFB800] font-semibold">Install</strong>. Chrome automatically places the app in your Home Screen and App Gallery!</span>
                </div>
              </div>
            </div>
          ) : (
            /* CASE 5: Desktop (Chrome / Edge with tabbed guidance for already installed vs shortcut vs guide) */
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-heading uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setDesktopTab('status')}
                  className={`flex-1 py-2 px-2 rounded-lg transition-all text-center cursor-pointer ${
                    desktopTab === 'status'
                      ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Why Icon is Missing?
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopTab('shortcut')}
                  className={`flex-1 py-2 px-2 rounded-lg transition-all text-center cursor-pointer ${
                    desktopTab === 'shortcut'
                      ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Desktop Shortcut
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopTab('guide')}
                  className={`flex-1 py-2 px-2 rounded-lg transition-all text-center cursor-pointer ${
                    desktopTab === 'guide'
                      ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Browser Steps
                </button>
              </div>

              {/* TAB 1: Why Icon is Missing & How to Open Already Installed App */}
              {desktopTab === 'status' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#FFB800] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading uppercase text-sm font-bold text-white tracking-wide">
                        App is Already Installed in Google Chrome!
                      </h4>
                      <p className="text-xs text-gray-300 font-sans mt-1 leading-relaxed">
                        In your Chrome App Settings, <strong>"Lion Mode Karate | Dojo OS"</strong> is already installed with an <strong>Uninstall</strong> button. 
                        Because it is already installed, <strong>Google Chrome automatically removes the "Install" icon from the address bar</strong> to prevent installing twice!
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#FFB800] uppercase tracking-wider font-heading">
                      <Search className="w-4 h-4" />
                      <span>How to Open Your Installed App Right Now:</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-gray-300 font-sans">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                        <div>
                          <strong className="text-white">Computer Spotlight / Search:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-[10px] text-white font-mono">Cmd + Space</kbd> (Mac) or <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-[10px] text-white font-mono">Win</kbd> (Windows) and type <em>Lion Mode Karate</em>. It launches directly as a desktop app!
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                        <div>
                          <strong className="text-white">Chrome Address Bar:</strong> Look at the right side of your address bar for the <strong className="text-[#FFB800] inline-flex items-center gap-1 font-semibold">"Open in App" <ArrowUpRight className="w-3.5 h-3.5 inline" /></strong> button, or click Chrome's 3-dot menu (⋮) &rarr; <strong className="text-white">"Open in Lion Mode Karate"</strong>.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                        <div>
                          <strong className="text-white">Chrome Apps Dashboard:</strong> Open a new tab in Chrome, type <code className="text-[#FFB800] font-mono text-[11px]">chrome://apps</code>, and click <strong>Lion Mode Karate | Dojo OS</strong>.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* How to Reset / Re-install */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-gray-300 font-sans">
                    <div className="flex items-center gap-2 text-[#FFB800] font-heading uppercase tracking-wider text-[11px] font-bold">
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Want to Re-install or See the Install Icon Again?</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-gray-400 text-[11px]">
                      <li>Open a new tab and type <code className="text-white font-mono">chrome://apps</code> (or your Chrome App Settings).</li>
                      <li>Right-click <strong>Lion Mode Karate</strong> and click <strong className="text-red-400">"Remove from Chrome"</strong> (Uninstall).</li>
                      <li>Refresh <code className="text-white font-mono">app.lionmodekarate.com</code>. The <strong>Install Icon (monitor with down arrow)</strong> will immediately reappear in the address bar!</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* TAB 2: Instant 1-Click Desktop Shortcut */}
              {desktopTab === 'shortcut' && (
                <div className="space-y-3">
                  <button
                    onClick={handleDownloadDesktopShortcut}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FFB800] to-[#D4AF37] text-black font-heading uppercase tracking-wider text-sm font-bold flex items-center justify-center gap-2.5 shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <FileCode className="w-5 h-5 text-black" />
                    <span>{shortcutDownloaded ? '✓ Shortcut Saved to Downloads!' : 'Download Desktop Shortcut File (.url / .webloc)'}</span>
                  </button>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-2">
                    <div className="text-[#FFB800] font-heading uppercase tracking-wider font-bold">
                      How to Place on Your Desktop:
                    </div>
                    <p className="leading-relaxed">
                      1. Click the gold button above to download the file.<br />
                      2. Open your <strong>Downloads folder</strong>.<br />
                      3. Drag <strong>"Lion Mode Karate"</strong> directly onto your computer's <strong>Desktop</strong>, <strong>Applications folder</strong>, or <strong>Dock</strong> for instant 1-click access!
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: First-Time Browser Steps */}
              {desktopTab === 'guide' && (
                <div className="space-y-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#FFB800] uppercase tracking-wider font-heading">
                    <Sparkles className="w-4 h-4" />
                    <span>First-Time Installation (Chrome / Edge)</span>
                  </div>
                  
                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    If Lion Mode Karate is not yet installed on this browser:
                  </p>

                  <div className="space-y-2.5 text-xs text-gray-300 font-sans">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                      <span>Look at the right side of your Chrome or Edge address bar.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                      <span>Click the small <strong className="text-[#FFB800] font-semibold">Install Icon</strong> (computer monitor with a down arrow).</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#FFB800] font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                      <span>Click <strong className="text-white font-semibold">Install</strong>. Chrome will safely add Dojo OS into your Applications folder.</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[11px] text-gray-400 font-sans">
                    <em>Important: If this icon is not visible, it means the app is already installed on your computer. Switch to the "Why Icon is Missing?" tab above to launch it or reinstall.</em>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Direct Server ZIP Download */}
          <div className="mt-4 pt-3 border-t border-white/10 text-center">
            <button
              onClick={async () => {
                const toastId = toast.loading("Downloading lionmode-karate-update-v3.zip...");
                try {
                  const res = await fetch("/lionmode-karate-update-v3.zip");
                  if (!res.ok) throw new Error("File not found");
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "lionmode-karate-update-v3.zip";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  setTimeout(() => window.URL.revokeObjectURL(url), 10000);
                  toast.success("✓ Download started! Check your Downloads folder.", { id: toastId });
                } catch {
                  window.location.href = "/download";
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#FFB800] hover:text-white font-heading uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download cPanel ZIP Package (lionmode-karate-update-v3.zip)</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-gray-400">
            <span>Lion Mode Karate • Dojo OS PWA</span>
            <button
              onClick={onClose}
              className="text-[#FFB800] hover:text-white transition-colors uppercase font-heading tracking-wider cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
