// ─────────────────────────────────────────────────────────────────────────────
// src/screens/PreviewScreen.jsx
// Shows the scanned product details for review before adding to master.
// Operator can adjust quantity and then Accept or Discard.
//
// Props:
//   scannedData — { qrId, productName, category } | null
//   user        — { name, email }
//   count       — number (quantity)
//   setCount    — setState function
//   onAccept    — called when operator taps Accept
//   onDiscard   — called when operator taps Discard
//
// NO extra packages needed.
// ─────────────────────────────────────────────────────────────────────────────

import { formatDateTime } from '../utils/helpers';

function InfoRow({ label, value, mono = false }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '11px 0', borderBottom: '1px solid var(--brd)',
    }}>
      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</span>
      <span style={{
        fontSize: 13, fontWeight: 600,
        fontFamily: mono ? "'Space Mono', monospace" : "'Sora', sans-serif",
        color: mono ? 'var(--blue)' : 'var(--txt)',
        textAlign: 'right', maxWidth: '60%',
      }}>
        {value}
      </span>
    </div>
  );
}

export default function PreviewScreen({
  scannedData, user, count, setCount, onAccept, onDiscard,
}) {
  if (!scannedData) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '60vh', gap: 12,
        color: 'var(--muted)', padding: 24,
      }}>
        <div style={{ fontSize: 56, opacity: 0.2 }}>📭</div>
        <div style={{ fontSize: 14 }}>No product scanned yet</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          Go to the Scan tab and scan a QR code first
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: 16, paddingBottom: 100,
      display: 'flex', flexDirection: 'column', gap: 14,
      animation: 'fadeIn 0.3s ease',
    }}>

      {/* Product Card */}
      <div style={{
        background: 'var(--surf)',
        border: '1px solid rgba(0,212,170,0.35)',
        borderRadius: 16, padding: 20,
        boxShadow: '0 0 32px rgba(0,212,170,0.04)',
      }}>
        <div style={{
          fontSize: 10, color: 'var(--acc)',
          fontFamily: "'Space Mono', monospace",
          letterSpacing: 2, marginBottom: 12,
        }}>
          ● SCANNED PRODUCT
        </div>

        <InfoRow label="QR Code ID"    value={scannedData.qrId}         mono />
        <InfoRow label="Product Name"  value={scannedData.productName}       />
        <InfoRow label="Category"      value={scannedData.category || '—'}   />
        <InfoRow label="Operator"      value={user.name}                     />
        <InfoRow label="Email"         value={user.email}                    />
        <InfoRow label="Scan Time"     value={formatDateTime(Date.now())}    />

        {/* Quantity adjuster */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', paddingTop: 14,
        }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Quantity / Count</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              style={{
                width: 38, height: 38, borderRadius: 8,
                background: 'var(--surf2)', border: '1px solid var(--brd)',
                color: 'var(--txt)', fontSize: 22, display: 'grid', placeItems: 'center',
              }}
            >−</button>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 24, fontWeight: 700,
              minWidth: 36, textAlign: 'center',
            }}>
              {count}
            </span>
            <button
              onClick={() => setCount((c) => c + 1)}
              style={{
                width: 38, height: 38, borderRadius: 8,
                background: 'var(--surf2)', border: '1px solid var(--brd)',
                color: 'var(--txt)', fontSize: 22, display: 'grid', placeItems: 'center',
              }}
            >+</button>
          </div>
        </div>
      </div>

      {/* Accept */}
      <button onClick={onAccept} style={{
        padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 700,
        background: 'linear-gradient(135deg, var(--acc), var(--blue))',
        color: 'white', letterSpacing: 0.5,
        boxShadow: '0 4px 24px rgba(0,212,170,0.2)',
      }}>
        ✔  Accept &amp; Add to Master
      </button>

      {/* Discard */}
      <button onClick={onDiscard} style={{
        padding: 14, borderRadius: 12, fontSize: 14,
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.25)',
        color: 'var(--err)',
      }}>
        ✕  Discard Scan
      </button>
    </div>
  );
}