// ─────────────────────────────────────────────────────────────────────────────
// src/components/BottomNav.jsx
// Android-style bottom navigation bar with Scan and Master tabs.
// NO extra packages needed.
// ─────────────────────────────────────────────────────────────────────────────

const ALL_TABS = [
  { id: "scan", icon: "⬛", label: "Scan", roles: ["user"] },
  { id: "master", icon: "📋", label: "Master", roles: ["admin"] },
];

export default function BottomNav({
  screen,
  setScreen,
  masterCount,
  userRole,
}) {
  
  const visibleTabs = ALL_TABS.filter((tab) => tab.roles.includes(userRole));

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(17,24,39,0.97)",
        borderTop: "1px solid var(--brd)",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom)", // Android gesture bar
        backdropFilter: "blur(12px)",
        zIndex: 100,
      }}
    >
      {visibleTabs.map((tab) => {
        const isActive = screen === tab.id;

        const label =
          tab.id === "master" && masterCount > 0
            ? `Master (${masterCount})`
            : tab.label;

        return (
          <button
            key={tab.id}
            onClick={() => setScreen(tab.id)}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: isActive ? "var(--acc)" : "var(--muted)",
              fontSize: 10,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              transition: "color 0.2s",
              borderTop: isActive
                ? "2px solid var(--acc)"
                : "2px solid transparent",
              cursor: "pointer",
              border: "none",
              outline: "none",
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            {label}
          </button>
        );
      })}
    </nav>
  );
}
