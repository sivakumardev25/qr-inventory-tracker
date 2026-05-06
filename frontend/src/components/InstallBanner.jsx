// ─────────────────────────────────────────────────────────────────────────────
// src/components/InstallBanner.jsx
// Android PWA "Add to Home Screen" install prompt banner.
// Only shown when Chrome fires the beforeinstallprompt event.
//
// Props:
//   installReady   — boolean (from usePWAInstall hook)
//   triggerInstall — function (from usePWAInstall hook)
//
// NO extra packages needed.
// ─────────────────────────────────────────────────────────────────────────────

export default function InstallBanner({ installReady, triggerInstall }) {
  if (!installReady) return null;

  return (
    <div
      style={{
        margin: "0 16px",
        background: "rgba(59,130,246,0.08)",
        border: "1px solid rgba(59,130,246,0.3)",
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        animation: "fadeIn 0.3s ease",
      }}
    >
      <span style={{ fontSize: 28 }}>📲</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
          Install QRTrack
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>
          Add to home screen for the best Android experience — works offline
          too!
        </div>
      </div>
      <button
        onClick={triggerInstall}
        style={{
          padding: "9px 14px",
          borderRadius: 8,
          background: "var(--blue)",
          color: "white",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        Install
      </button>
    </div>
  );
}
