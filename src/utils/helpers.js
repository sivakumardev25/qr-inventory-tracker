// ─────────────────────────────────────────────────────────────────────────────
// src/utils/helpers.js
// Pure utility functions — ID generation, date formatting, CSV export.
//
// NO extra packages needed.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a unique Entry ID for each master file row.
 * Format: ENT-LJK3F2 (prefix + base36 timestamp)
 * Example: "ENT-LJK3F2"
 */
export function generateEntryId() {
  return 'ENT-' + Date.now().toString(36).toUpperCase();
}

/**
 * Format a timestamp as HH:MM AM/PM
 * Example: "02:45 PM"
 */
export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a timestamp as "Apr 30, 2026"
 */
export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a timestamp as "Apr 30, 02:45 PM"
 */
export function formatDateTime(timestamp) {
  return `${formatDate(timestamp)}, ${formatTime(timestamp)}`;
}

/**
 * Convert masterData array → CSV string and trigger download.
 *
 * @param {Array} masterData  - Array of entry objects from master state
 * @param {string} filename   - e.g. "qrtrack_master_20260430.csv"
 */
export function exportToCSV(masterData, filename) {
  const headers = [
    'Entry ID',
    'QR ID',
    'Product Name',
    'Category',
    'Count',
    'Scanned By',
    'Email',
    'Date',
    'Time',
  ];

  const rows = masterData.map((r) => [
    r.entryId,
    r.qrId,
    `"${r.productName}"`,   // wrap in quotes to handle commas in names
    `"${r.category || ''}"`,
    r.count,
    `"${r.scannedBy}"`,
    r.email,
    formatDate(r.timestamp),
    formatTime(r.timestamp),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(','))
    .join('\n');

  // Create a temporary download link and click it
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = filename || `qrtrack_${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Compute master file summary stats from entries array.
 * Returns { totalScans, totalUnits, uniqueProducts }
 */
export function computeStats(masterData) {
  return {
    totalScans:     masterData.length,
    totalUnits:     masterData.reduce((sum, r) => sum + r.count, 0),
    uniqueProducts: new Set(masterData.map((r) => r.qrId)).size,
  };
}