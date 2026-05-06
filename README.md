## 📦 QRTrack — QR Code Product Scanner (PWA + Android Ready)

QRTrack is a mobile-first Progressive Web App (PWA) built with React that allows users to scan QR codes, track products, and generate a master inventory file — all in real time.

Designed for warehouse teams, inventory managers, and field operators, QRTrack works offline and can be installed on Android devices.

## 🚀 Features

📷 QR Code Scanning
Uses device camera (getUserMedia) + jsQR
Real-time detection with scan overlay

🔍 Preview Before Save
View scanned product details
Adjust quantity before adding

📋 Master Inventory Tracking
Maintain list of all scanned products
Shows total scans, units, and unique products

💾 Offline Storage
Uses localStorage to persist data
Works even without internet

📤 Export to CSV
Download inventory data for reporting

📲 PWA Support
Install on Android home screen
Works in standalone app mode

🤖 Android App Ready
Can be converted to APK using Capacitor

## 🛠 Tech Stack
Frontend: React (CRA)
QR Scanning: jsQR (via CDN)
State Management: React Hooks
Storage: localStorage
PWA: Web App Manifest + Service Worker
Android Wrapper: Capacitor
