// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/useQRScanner.js
// Custom React hook — handles camera stream + jsQR frame-by-frame decoding.
//
// HOW IT WORKS:
//   1. getUserMedia()  → gets camera stream (rear camera on Android)
//   2. Feeds stream into a <video> element
//   3. Every animation frame: draws video frame onto a hidden <canvas>
//   4. jsQR reads pixel data from canvas → detects QR code
//   5. On detection: calls onScan(rawString) and stops camera
//
// PACKAGES:
//   jsQR is loaded via CDN in index.html (window.jsQR)
//   NPM alternative:
//     npm install jsqr
//     then: import jsQR from 'jsqr'  (remove window.jsQR checks below)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * @param {function} onScan - Called with raw QR string when a code is detected
 * @returns {{ videoRef, canvasRef, scanning, startCamera, stopCamera }}
 */
export function useQRScanner(onScan) {
  const videoRef  = useRef(null);   // Attached to <video> element
  const canvasRef = useRef(null);   // Hidden <canvas> for pixel extraction
  const streamRef = useRef(null);   // MediaStream — kept to stop tracks later
  const rafRef    = useRef(null);   // requestAnimationFrame ID for cleanup

  const [scanning, setScanning] = useState(false);
  const [error,    setError]    = useState(null);

  // ── Stop camera + cancel animation loop ──────────────────────────────────
  const stopCamera = useCallback(() => {
    // Stop all camera tracks (releases camera LED on phone)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    // Cancel the decode loop
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setScanning(false);
  }, []);

  // ── Per-frame decode tick ─────────────────────────────────────────────────
  const tick = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;

    // Wait until video has enough data to read
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame onto canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Extract raw pixel data for jsQR
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // jsQR loaded via CDN: window.jsQR
    // If using npm jsqr, replace window.jsQR with imported jsQR
    if (window.jsQR) {
      const code = window.jsQR(
        imageData.data,
        imageData.width,
        imageData.height,
        { inversionAttempts: 'dontInvert' } // faster — skip inverted QR attempt
      );

      if (code && code.data) {
        // QR detected! Stop scanning and report result
        stopCamera();
        onScan(code.data);
        return; // Don't schedule next frame
      }
    }

    // No QR found yet — check next frame
    rafRef.current = requestAnimationFrame(tick);
  }, [onScan, stopCamera]);

  // ── Start camera ──────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',    // rear camera
          width:  { ideal: 1280 },      // higher res = better QR detection range
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current        = stream;
      videoRef.current.srcObject = stream;
      setScanning(true);

      // Start decode loop
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      const msg = err.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access in your browser settings.'
        : `Camera error: ${err.message}`;
      setError(msg);
      console.error('[useQRScanner]', err);
    }
  }, [tick]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => stopCamera(), [stopCamera]);

  return { videoRef, canvasRef, scanning, error, startCamera, stopCamera };
}