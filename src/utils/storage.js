// ─────────────────────────────────────────────────────────────────────────────
// src/utils/storage.js
// localStorage helpers — persist master data and user session across app opens.
//
// WHY localStorage?
//   PWAs don't have a backend by default. localStorage keeps data on the device
//   even after the browser/app is closed. For a server-synced version, replace
//   these with API calls (fetch / axios).
//
// NO extra packages needed.
// ─────────────────────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  MASTER: 'qrtrack_master', // Array of scan entries
  USER:   'qrtrack_user',   // Logged-in user object
};

/**
 * Load a value from localStorage.
 * Returns `fallback` if key doesn't exist or JSON parse fails.
 */
export function loadFromStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Save a value to localStorage as JSON.
 * Silently fails if storage is full (e.g., private browsing mode).
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[QRTrack] Storage save failed:', e.message);
  }
}

/**
 * Remove a key from localStorage.
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

/**
 * Clear ALL QRTrack storage (used on logout or factory reset).
 */
export function clearAllStorage() {
  Object.values(STORAGE_KEYS).forEach(removeFromStorage);
}