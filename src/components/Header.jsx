// ─────────────────────────────────────────────────────────────────────────────
// src/components/Header.jsx
// Sticky top header — shows app logo and logged-in user info.
// NO extra packages needed.
// ─────────────────────────────────────────────────────────────────────────────

export default function Header({ user, onLogout }) {
  return (
    <header
      style={{
        padding: "12px 16px",
        paddingTop: "calc(12px + env(safe-area-inset-top))", // respect Android notch
        background: "rgba(17,24,39,0.97)",
        borderBottom: "1px solid var(--brd)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, var(--acc), var(--blue))",
            display: "grid",
            placeItems: "center",
            fontSize: 16,
          }}
        >
          📦
        </div>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          QR<span style={{ color: "var(--acc)" }}>TRACK</span>
        </span>
      </div>

      {/* User info + logout */}
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "var(--err)",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Out
          </button>
        </div>
      )}
    </header>
  );
}
