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
import axios from "axios";
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

// Change this to your backend URL when you deploy ──────────────────────────
const API_BASE = "http://localhost:5004";

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

  // ── AUTO-REDIRECT after login based on role ────────────────────────────────
  // When user changes (login), set the correct starting screen
  useEffect(() => {
    if (!user) return;
    // Admin always starts on master view, regular user on scan
    if (user.role === "admin") setScreen("master");
    else setScreen("scan");
  }, [user]);

  // ── ROLE GUARD: if wrong screen for role, auto-correct ────────────────────
  useEffect(() => {
    if (!user) return;
    // Regular user trying to see master → push back to scan
    if (screen === "master" && user.role !== "admin") setScreen("scan");
    // Admin trying to use scanner → push to master
    if (screen === "scan" && user.role === "admin") setScreen("master");
  }, [screen, user]);

  // ── AUTH ──────────────────────────────────────────────────────────────────
  // In App.jsx — replace handleLogin
  const handleLogin = async ({ email, password }) => {
  try {
    const res = await axios.post(`${API_BASE}/api/auth/login`, {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    saveToStorage(STORAGE_KEYS.USER, res.data.user);
    showToast(`Welcome, ${res.data.user.name}!`);

  } catch (err) {
    const msg = err.response?.data?.message || "Login failed";
    showToast(msg, "error");
  }
};
  // const handleLogin = async (email, password) => {
  //   try {
  //     const loginRes = await axios.post(`${API_BASE}/api/auth/login`, {
  //       //   method: "POST",
  //       //   headers: { "Content-Type": "application/json" },
  //       //   body: JSON.stringify({ email, password }),
  //       // });
  //       email,
  //       password,
  //     });

      // const data = await loginRes.json();

      // console.log("Status:", loginRes.status);
      // console.log("Response:", data);

      // if (!loginRes.ok) {
      //   showToast(data.message || "Login failed", "error");
      //   return;
      // }
      //Store JWT token
      // localStorage.setItem("token", loginRes.data.token);

      // setUser(loginRes.data.user); // { _id, name, email, role }
      // saveToStorage(STORAGE_KEYS.USER, loginRes.data.user);

      // // // Route by role
      // // if (data.user.role === "admin") setScreen("master");
      // // else setScreen("scan");

      // showToast(`Welcome, ${loginRes.data.user.name}!`);
      //   } catch (err) {
      //     console.error("Login error:", err);
      //     showToast("Connection failed", "error");
      //   }
  //     // };
  //   } catch (err) {
  //     const msg =
  //       err.response?.data?.message || "Login failed. Check your credentials.";
  //     showToast(msg, "error");
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem("token");
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
  const handleAccept = async () => {
    if (!scannedData || !user) return;

    const token = localStorage.getItem("token");

    // let res;
    try {
      // POST to backend
      await axios.post(
        `${API_BASE}/api/scans`,
        {
          qrData: scannedData.qrId,
          item: scannedData.productName,
        },
        {
          headers: { Authorization: token },
        },
      );
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: token,
      //   },
      //   body: JSON.stringify({
      //     qrData: scannedData.qrId,
      //     item: scannedData.productName,
      //   }),
      // });
    } catch (err) {
      //   console.error("Network error:", err);
      //   showToast("Saved locally — backend offline", "warn");
      // }
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      // if (res && !res.ok) {
      //   const err = await res.json();
      // 401 = token expired/invalid → force logout
      if (status === 401) {
        showToast("Session expired. Please log in again.", "error");
        handleLogout();
        return;
      }
      showToast(msg || "Saved locally — backend offline", "warn");
      // Still save locally even if backend failed
    }

    // Still update local state for instant UI
    const entry = {
      entryId: generateEntryId(),
      // ...scannedData,
      qrId: scannedData.qrId,
      productName: scannedData.productName,
      category: scannedData.category || "",
      count,
      scannedBy: user.name,
      email: user.email,
      timestamp: Date.now(),
    };

    setMasterData((prev) => {
      // If same product already exists, add to its count instead of new row
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
    setScreen(user.role === "admin" ? "master" : "scan");
    showToast(`Added "${scannedData.productName}" ×${count}`);
  };
  // const handleAccept = () => {
  //   if (!scannedData || !user) return;
  //   const entry = {
  //     entryId: generateEntryId(),
  //     qrId: scannedData.qrId,
  //     productName: scannedData.productName,
  //     category: scannedData.category || "",
  //     count,
  //     scannedBy: user.name,
  //     email: user.email,
  //     timestamp: Date.now(),
  //   };
  //   setMasterData((prev) => {
  //     const existing = prev.find((p) => p.qrId === scannedData.qrId);

  //     if (existing) {
  //       return prev.map((p) =>
  //         p.qrId === scannedData.qrId ? { ...p, count: p.count + count } : p,
  //       );
  //     }

  //     return [entry, ...prev];
  //   });
  //   setScannedData(null);
  //   setCount(1);
  //   setScreen("master");
  //   showToast(`Added "${entry.productName}" x${count} to master`);
  // };

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
          {screen === "scan" && user.role !== "admin" && (
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
          {screen === "master" && user.role === "admin" && (
            <MasterScreen
              masterData={masterData}
              onExport={handleExport}
              onClear={handleClear}
            />
          )}

          {screen === "master" && user.role !== "admin" && null}
          {screen === "scan" && user.role === "admin" && null}
        </div>
        <BottomNav
          screen={screen === "preview" ? "scan" : screen}
          setScreen={setScreen}
          masterCount={masterData.length}
          userRole={user.role}
        />
      </div>
      <Toast toast={toast} />
    </>
  );
}
