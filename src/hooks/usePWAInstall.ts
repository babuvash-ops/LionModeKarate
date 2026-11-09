import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __deferredPrompt?: BeforeInstallPromptEvent | null;
    __isPWAInstalled?: boolean;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.__deferredPrompt) {
      return window.__deferredPrompt;
    }
    return null;
  });

  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://') ||
      Boolean(window.__isPWAInstalled) ||
      localStorage.getItem('lionmode_pwa_installed') === 'true';
    return isStandalone;
  });

  const [isIOS, setIsIOS] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(ua) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    return isApple;
  });

  const [isAndroid, setIsAndroid] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return /android/.test(window.navigator.userAgent.toLowerCase());
  });

  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const ua = window.navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|mobile/.test(ua) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    return !isMobile;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect standalone mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayChange);
    } else {
      mediaQuery.addListener(handleDisplayChange);
    }

    // Check Chrome's getInstalledRelatedApps if supported
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as unknown as { getInstalledRelatedApps: () => Promise<unknown[]> })
        .getInstalledRelatedApps()
        .then((apps) => {
          if (Array.isArray(apps) && apps.length > 0) {
            setIsInstalled(true);
            try { localStorage.setItem('lionmode_pwa_installed', 'true'); } catch (_) {}
          }
        })
        .catch(() => {});
    }

    // Listen for custom event or direct beforeinstallprompt
    const handlePromptEvent = (e: Event) => {
      e.preventDefault();
      const promptEvent = (e as CustomEvent).detail || (e as BeforeInstallPromptEvent);
      window.__deferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleAppInstalled = () => {
      window.__isPWAInstalled = true;
      window.__deferredPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
      try { localStorage.setItem('lionmode_pwa_installed', 'true'); } catch (_) {}
    };

    window.addEventListener('beforeinstallprompt', handlePromptEvent);
    window.addEventListener('pwa-prompt-available', handlePromptEvent);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('pwa-installed', handleAppInstalled);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDisplayChange);
      } else {
        mediaQuery.removeListener(handleDisplayChange);
      }
      window.removeEventListener('beforeinstallprompt', handlePromptEvent);
      window.removeEventListener('pwa-prompt-available', handlePromptEvent);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pwa-installed', handleAppInstalled);
    };
  }, []);

  const markAsInstalled = useCallback((installed: boolean = true) => {
    setIsInstalled(installed);
    if (typeof window !== 'undefined') {
      try {
        if (installed) {
          localStorage.setItem('lionmode_pwa_installed', 'true');
        } else {
          localStorage.removeItem('lionmode_pwa_installed');
        }
      } catch (_) {}
    }
  }, []);

  const promptInstall = useCallback(async (): Promise<{ success: boolean; outcome?: 'accepted' | 'dismissed' }> => {
    const prompt = deferredPrompt || (typeof window !== 'undefined' ? window.__deferredPrompt : null);
    if (!prompt) {
      return { success: false };
    }

    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') {
          window.__deferredPrompt = null;
          window.__isPWAInstalled = true;
          try { localStorage.setItem('lionmode_pwa_installed', 'true'); } catch (_) {}
        }
        return { success: true, outcome: 'accepted' };
      }
      return { success: false, outcome: 'dismissed' };
    } catch (err) {
      console.warn('PWA prompt execution error:', err);
      return { success: false };
    }
  }, [deferredPrompt]);

  return {
    deferredPrompt,
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    isAndroid,
    isDesktop,
    promptInstall,
    markAsInstalled,
  };
}
