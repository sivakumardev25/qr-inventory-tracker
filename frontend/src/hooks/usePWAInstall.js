// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/usePWAInstall.js
// Hook that listens for Android Chrome's "beforeinstallprompt" event
// and exposes a trigger function for your Install button.
//
// HOW IT WORKS:
//   - index.html captures the event and fires a custom 'pwaInstallReady' event
//   - This hook listens for that event and sets installReady = true
//   - When user taps Install, call triggerInstall() → shows native Android dialog
//
// NO extra packages needed.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

/**
 * @returns {{ installReady: boolean, triggerInstall: function, isInstalled: boolean }}
 */
export function usePWAInstall() {
  const [installReady, setInstallReady] = useState(false);
  const [isInstalled,  setIsInstalled]  = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const onReady     = () => setInstallReady(true);
    const onInstalled = () => { setInstallReady(false); setIsInstalled(true); };

    window.addEventListener('pwaInstallReady', onReady);
    window.addEventListener('pwaInstalled',    onInstalled);

    return () => {
      window.removeEventListener('pwaInstallReady', onReady);
      window.removeEventListener('pwaInstalled',    onInstalled);
    };
  }, []);

  // Triggers the native Android "Add to Home Screen" dialog
  const triggerInstall = async () => {
    if (typeof window.triggerInstall === 'function') {
      const accepted = await window.triggerInstall();
      if (accepted) setIsInstalled(true);
    }
  };

  return { installReady, triggerInstall, isInstalled };
}