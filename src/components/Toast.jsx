// ─────────────────────────────────────────────────────────────────────────────
// src/components/Toast.jsx
// Animated notification that appears at the bottom of the screen.
// Auto-dismisses after 3 seconds (managed by App.jsx).
//
// Props:
//   toast — { message: string, type: 'success' | 'error' | 'warn' } | null
//
// NO extra packages needed.
// ─────────────────────────────────────────────────────────────────────────────

const ICONS = { success: '✅', warn: '⚠️', error: '❌' };
const COLORS = {
  success: 'var(--ok)',
  warn:    'var(--warn)',
  error:   'var(--err)',
};

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(72px + env(safe-area-inset-bottom) + 12px)', // above BottomNav
      left: 16,
      right: 16,
      zIndex: 999,
      background: 'var(--surf2)',
      border: `1px solid ${COLORS[toast.type] || COLORS.success}`,
      borderRadius: 12,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 13,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      animation: 'toastIn 0.25s ease',
    }}>
      <span style={{ fontSize: 18 }}>{ICONS[toast.type] || ICONS.success}</span>
      <span>{toast.message}</span>
    </div>
  );
}