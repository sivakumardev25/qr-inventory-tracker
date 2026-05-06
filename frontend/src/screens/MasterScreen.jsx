// ─────────────────────────────────────────────────────────────────────────────
// src/screens/MasterScreen.jsx
// Master file screen — shows all accepted scan entries in a list.
// Stats bar + Export CSV + Clear All buttons.
//
// Props:
//   masterData — Array of entry objects
//   onExport   — triggers CSV download
//   onClear    — clears all entries (with confirm)
//
// NO extra packages needed.
// ─────────────────────────────────────────────────────────────────────────────

import { computeStats, formatTime, formatDate } from '../utils/helpers';

function StatBox({ value, label, color }) {
  return (
    <div style={{ background: 'var(--surf)', padding: '14px 0', textAlign: 'center' }}>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 26, fontWeight: 700, color,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 9, color: 'var(--muted)', marginTop: 2,
        textTransform: 'uppercase', letterSpacing: 1,
      }}>
        {label}
      </div>
    </div>
  );
}

export default function MasterScreen({ masterData, onExport, onClear }) {
  const { totalScans, totalUnits, uniqueProducts } = computeStats(masterData);

  return (
    <div style={{ paddingBottom: 80 }}>

      {/* ── Stats Row ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 1, background: 'var(--brd)',
        borderBottom: '1px solid var(--brd)',
      }}>
        <StatBox value={totalScans}     label="Scans"    color="var(--acc)"  />
        <StatBox value={totalUnits}     label="Units"    color="var(--blue)" />
        <StatBox value={uniqueProducts} label="Products" color="var(--warn)" />
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      {masterData.length > 0 && (
        <div style={{
          display: 'flex', gap: 8, padding: '12px 16px',
          borderBottom: '1px solid var(--brd)',
        }}>
          <button onClick={onExport} style={{
            flex: 1, padding: 10, borderRadius: 9,
            fontSize: 13, fontWeight: 600,
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.3)',
            color: 'var(--blue)',
          }}>
            ⬇ Export CSV
          </button>
          <button onClick={onClear} style={{
            padding: '10px 16px', borderRadius: 9, fontSize: 13,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: 'var(--err)',
          }}>
            🗑 Clear
          </button>
        </div>
      )}

      {/* ── Empty State ────────────────────────────────────────────────── */}
      {masterData.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '50vh',
          gap: 12, color: 'var(--muted)', padding: 24,
        }}>
          <div style={{ fontSize: 56, opacity: 0.12 }}>📋</div>
          <div style={{ fontSize: 14 }}>Master file is empty</div>
          <div style={{ fontSize: 12, opacity: 0.6, textAlign: 'center', lineHeight: 1.5 }}>
            Scan QR codes and accept them to build your master file
          </div>
        </div>
      )}

      {/* ── Entry List ─────────────────────────────────────────────────── */}
      {masterData.map((row, i) => (
        <div key={row.entryId} style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--brd)',
          background: i === 0 ? 'rgba(0,212,170,0.02)' : 'transparent',
          display: 'flex', alignItems: 'center', gap: 12,
          animation: i === 0 ? 'fadeIn 0.35s ease' : 'none',
        }}>

          {/* Count badge */}
          <div style={{
            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
            background: 'var(--surf2)', border: '1px solid var(--brd)',
            display: 'grid', placeItems: 'center',
            fontFamily: "'Space Mono', monospace",
            fontSize: 16, fontWeight: 700, color: 'var(--acc)',
          }}>
            {row.count}
          </div>

          {/* Product info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, marginBottom: 3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {row.productName}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 9, color: 'var(--blue)',
                fontFamily: "'Space Mono', monospace",
              }}>
                {row.qrId}
              </span>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>·</span>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{row.scannedBy}</span>
            </div>
          </div>

          {/* Timestamp */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              fontSize: 11, fontFamily: "'Space Mono', monospace",
              color: 'var(--muted)',
            }}>
              {formatTime(row.timestamp)}
            </div>
            <div style={{ fontSize: 9, color: 'var(--muted)', opacity: 0.6 }}>
              {formatDate(row.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}