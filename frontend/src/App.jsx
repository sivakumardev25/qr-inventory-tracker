// ─────────────────────────────────────────────────────────────────────────────
// src/App.jsx
// Root component — owns all global state and wires every screen together.
//
// STATE MANAGED HERE:
//   user        — logged-in operator ({ name, email })
//   screen      — current view: 'scan' | 'preview' | 'master'
//   scannedData — product from last QR scan
//   count       — adjustable quantity on preview screen
//   masterData  — array of all accepted entries (persisted to localStorage)
//   toast       — current notification message
//
// NO extra packages needed.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

// ── Utilities & Data ─────────────────────────────────────────────────────────
import { GLOBAL_STYLES } from "./utils/styles";
import {
  loadFromStorage,
  saveToStorage,
  clearAllStorage,
  STORAGE_KEYS,
} from "./utils/storage";
import { generateEntryId, exportToCSV, formatDate } from "./utils/helpers";
import { lookupProduct } from "./data/products";
import { usePWAInstall } from "./hooks/usePWAInstall";

// ── Components ────────────────────────────────────────────────────────────────
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";

// ── Screens ──────────────────────────────────────────────────────────────────
import LoginScreen from "./screens/LoginScreen";
import ScanScreen from "./screens/ScanScreen";
import PreviewScreen from "./screens/PreviewScreen";
import MasterScreen from "./screens/MasterScreen";

export default function App() {
  // ── Persistent state (loaded from localStorage on first render) ───────────
  const [user, setUser] = useState(() =>
    loadFromStorage(STORAGE_KEYS.USER, null),
  );
  const [masterData, setMasterData] = useState(() =>
    loadFromStorage(STORAGE_KEYS.MASTER, []),
  );

  // ── Ephemeral state ───────────────────────────────────────────────────────
  const [screen, setScreen] = useState("scan");
  const [scannedData, setScannedData] = useState(null);
  const [count, setCount] = useState(1);
  const [toast, setToast] = useState(null);

  // ── PWA install prompt ────────────────────────────────────────────────────
  const { installReady, triggerInstall } = usePWAInstall();

  // ── Persist to localStorage whenever data changes ─────────────────────────
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MASTER, masterData);
  }, [masterData]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER, user);
  }, [user]);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── AUTH ──────────────────────────────────────────────────────────────────
  const handleLogin = (userData) => {
    setUser(userData);
    showToast(`Welcome, ${userData.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setScannedData(null);
    setScreen("scan");
    clearAllStorage();
  };

  // ── SCAN ──────────────────────────────────────────────────────────────────
  const handleScan = (rawString) => {
    const product = lookupProduct(rawString);
    if (product) {
      setScannedData(product);
      setCount(product.unitCount || 1);
      setScreen("preview");
      showToast(`Scanned: ${product.productName}`, "success");
    } else {
      showToast(`Unknown QR code: "${rawString}"`, "error");
    }
  };

  // ── ACCEPT ────────────────────────────────────────────────────────────────
  const handleAccept = () => {
    if (!scannedData || !user) return;
    const entry = {
      entryId: generateEntryId(),
      qrId: scannedData.qrId,
      productName: scannedData.productName,
      category: scannedData.category || "",
      count,
      scannedBy: user.name,
      email: user.email,
      timestamp: Date.now(),
    };
    setMasterData((prev) => {
      const existing = prev.find((p) => p.qrId === scannedData.qrId);

      if (existing) {
        return prev.map((p) =>
          p.qrId === scannedData.qrId ? { ...p, count: p.count + count } : p,
        );
      }

      return [entry, ...prev];
    });
    setScannedData(null);
    setCount(1);
    setScreen("master");
    showToast(`Added "${entry.productName}" x${count} to master`);
  };

  // ── DISCARD ───────────────────────────────────────────────────────────────
  const handleDiscard = () => {
    setScannedData(null);
    setCount(1);
    setScreen("scan");
    showToast("Scan discarded", "warn");
  };

  // ── EXPORT CSV ────────────────────────────────────────────────────────────
  const handleExport = () => {
    exportToCSV(
      masterData,
      `qrtrack_${formatDate(Date.now()).replace(/ /g, "_")}.csv`,
    );
    showToast("Master file exported as CSV!");
  };

  // ── CLEAR ─────────────────────────────────────────────────────────────────
  const handleClear = () => {
    if (window.confirm("Clear all entries? This cannot be undone.")) {
      setMasterData([]);
      saveToStorage(STORAGE_KEYS.MASTER, []);
      showToast("Master file cleared", "warn");
    }
  };

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <div style={{ height: "100%", overflowY: "auto" }}>
          <LoginScreen onLogin={handleLogin} />
        </div>
        <Toast toast={toast} />
      </>
    );
  }

  // ── Main app shell ────────────────────────────────────────────────────────
  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Header user={user} onLogout={handleLogout} />
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {screen === "scan" && (
            <ScanScreen
              onScan={handleScan}
              installReady={installReady}
              triggerInstall={triggerInstall}
            />
          )}
          {screen === "preview" && (
            <PreviewScreen
              scannedData={scannedData}
              user={user}
              count={count}
              setCount={setCount}
              onAccept={handleAccept}
              onDiscard={handleDiscard}
            />
          )}
          {screen === "master" && (
            <MasterScreen
              masterData={masterData}
              onExport={handleExport}
              onClear={handleClear}
            />
          )}
        </div>
        <BottomNav
          screen={screen === "preview" ? "scan" : screen}
          setScreen={setScreen}
          masterCount={masterData.length}
        />
      </div>
      <Toast toast={toast} />
    </>
  );
}
