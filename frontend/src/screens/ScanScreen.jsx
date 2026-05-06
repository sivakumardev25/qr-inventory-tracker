// ─────────────────────────────────────────────────────────────────────────────
// src/screens/ScanScreen.jsx
// QR Camera Scanner screen — uses rear camera + jsQR for real-time decoding.
// Also includes a demo section for testing without physical QR codes.
//
// Props:
//   onScan         — function(rawString) called when QR detected
//   installReady   — boolean
//   triggerInstall — function
//
// PACKAGES USED (loaded via CDN in index.html):
//   jsQR v1.4.0  → window.jsQR
//
// HOOK USED:
//   useQRScanner (src/hooks/useQRScanner.js)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useQRScanner } from '../hooks/useQRScanner';
import InstallBanner from '../components/InstallBanner';
import { QR_PRODUCT_DB, DEMO_QR_IDS } from '../data/products';

export default function ScanScreen({ onScan, installReady, triggerInstall }) {
  const [showDemo, setShowDemo] = useState(false);
  const { videoRef, canvasRef, scanning, error, startCamera, stopCamera } =
    useQRScanner(onScan);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>

      {/* ── Camera Viewport ─────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        background: '#000',
        width: '100%',
        aspectRatio: '4/3',
        maxHeight: 340,
        overflow: 'hidden',
      }}>
        {/* Live video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: scanning ? 'block' : 'none',
          }}
        />
        {/* Hidden canvas for jsQR pixel extraction */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Placeholder when camera is off */}
        {!scanning && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 8, color: 'var(--muted)',
            background: 'linear-gradient(180deg, #000 0%, #0a0e1a 100%)',
          }}>
            <div style={{ fontSize: 64, opacity: 0.12 }}>⬛</div>
            <div style={{ fontSize: 13 }}>Camera inactive</div>
            <div style={{ fontSize: 11, opacity: 0.5 }}>Tap Start Scan below</div>
          </div>
        )}

        {/* Scan frame + animated line */}
        {scanning && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              {/* Four corner brackets */}
              {[
                { top: 0,    left: 0,    borderTop: '2px solid', borderLeft: '2px solid',   borderRadius: '4px 0 0 0' },
                { top: 0,    right: 0,   borderTop: '2px solid', borderRight: '2px solid',  borderRadius: '0 4px 0 0' },
                { bottom: 0, left: 0,    borderBottom: '2px solid', borderLeft: '2px solid', borderRadius: '0 0 0 4px' },
                { bottom: 0, right: 0,   borderBottom: '2px solid', borderRight: '2px solid',borderRadius: '0 0 4px 0' },
              ].map((s, i) => (
                <div key={i} style={{
                  position: 'absolute', width: 28, height: 28,
                  borderColor: 'var(--acc)', ...s,
                }} />
              ))}
              {/* Moving scan line */}
              <div style={{
                position: 'absolute', left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, transparent, var(--acc), transparent)',
                boxShadow: '0 0 8px rgba(0,212,170,0.6)',
                animation: 'scanLine 2s ease-in-out infinite',
              }} />
            </div>
          </div>
        )}

        {/* Status badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: scanning ? 'rgba(0,212,170,0.2)' : 'rgba(0,0,0,0.6)',
          border: `1px solid ${scanning ? 'var(--acc)' : 'var(--brd)'}`,
          borderRadius: 20, padding: '4px 12px',
          fontSize: 10, fontFamily: "'Space Mono', monospace",
          color: scanning ? 'var(--acc)' : 'var(--muted)',
        }}>
          {scanning ? '● LIVE' : '○ OFF'}
        </div>
      </div>

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Camera error */}
        {error && (
          <div style={{
            padding: '12px 14px', borderRadius: 10, fontSize: 13,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            color: 'var(--err)',
          }}>
            {error}
          </div>
        )}

        {/* Start / Stop button */}
        {!scanning ? (
          <button onClick={startCamera} style={{
            padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 700,
            background: 'linear-gradient(135deg, var(--acc), #00b894)',
            color: '#0a0e1a', letterSpacing: 0.5,
            boxShadow: '0 4px 20px rgba(0,212,170,0.25)',
          }}>
            📷  Start Camera Scan
          </button>
        ) : (
          <button onClick={stopCamera} style={{
            padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 700,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.4)',
            color: 'var(--err)',
          }}>
            ■  Stop Camera
          </button>
        )}

        {/* Demo QR toggle */}
        <button
          onClick={() => setShowDemo((p) => !p)}
          style={{
            padding: 11, borderRadius: 10,
            background: 'var(--surf2)', border: '1px solid var(--brd)',
            color: 'var(--muted)', fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <span>🧪</span> Demo QR Codes {showDemo ? '▲' : '▼'}
        </button>

        {/* Demo grid */}
        {showDemo && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {DEMO_QR_IDS.map((id) => (
              <button
                key={id}
                onClick={() => { onScan(id); setShowDemo(false); }}
                style={{
                  padding: '10px 12px', borderRadius: 10, textAlign: 'left',
                  background: 'var(--surf2)', border: '1px solid var(--brd)',
                }}
              >
                <div style={{
                  fontSize: 9, color: 'var(--blue)',
                  fontFamily: "'Space Mono', monospace", marginBottom: 3,
                }}>
                  {id}
                </div>
                <div style={{ fontSize: 12, color: 'var(--txt)', lineHeight: 1.3 }}>
                  {QR_PRODUCT_DB[id].productName}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* PWA Install Banner */}
        <InstallBanner installReady={installReady} triggerInstall={triggerInstall} />
      </div>

      <style>{`
        @keyframes scanLine { 0%{top:0} 50%{top:198px} 100%{top:0} }
      `}</style>
    </div>
  );
}