// ─────────────────────────────────────────────────────────────────────────────
// src/data/products.js
// Central product database — maps QR code IDs → product details.
//
// HOW TO USE IN REAL LIFE:
//   Replace this static object with an API call, e.g.:
//     const res = await fetch('https://your-api.com/products');
//     const QR_PRODUCT_DB = await res.json();
//
// QR CODE FORMAT your physical stickers should encode:
//   Option A — Plain ID string:     "QR-PRD-001"
//   Option B — JSON string:         {"id":"QR-PRD-001","productName":"Keyboard","unitCount":1}
//
// NO extra packages needed for this file.
// ─────────────────────────────────────────────────────────────────────────────

export const QR_PRODUCT_DB = {
  'QR-PRD-001': { productName: 'Wireless Keyboard',      category: 'Input Devices',  unitCount: 1 },
  'QR-PRD-002': { productName: 'USB-C Hub 7-port',       category: 'Connectivity',   unitCount: 1 },
  'QR-PRD-003': { productName: 'Mechanical Mouse',       category: 'Input Devices',  unitCount: 1 },
  'QR-PRD-004': { productName: 'Monitor Stand 27in',     category: 'Accessories',    unitCount: 1 },
  'QR-PRD-005': { productName: 'Webcam HD 1080p',        category: 'Peripherals',    unitCount: 1 },
  'QR-PRD-006': { productName: 'Noise-Cancel Headset',   category: 'Audio',          unitCount: 1 },
  'QR-PRD-007': { productName: 'Laptop Cooling Pad',     category: 'Accessories',    unitCount: 1 },
  'QR-PRD-008': { productName: 'Ethernet Cable 10m',     category: 'Networking',     unitCount: 2 },
  'QR-PRD-009': { productName: 'HDMI Cable 2m',          category: 'Cables',         unitCount: 3 },
  'QR-PRD-010': { productName: 'Portable SSD 1TB',       category: 'Storage',        unitCount: 1 },
};

// All QR IDs as array (used in Demo grid)
export const DEMO_QR_IDS = Object.keys(QR_PRODUCT_DB);

// Lookup a product by raw QR scan value
// Returns product object or null if not found
export function lookupProduct(rawScan) {
  // Option A: plain string ID
  if (QR_PRODUCT_DB[rawScan]) {
    return { qrId: rawScan, ...QR_PRODUCT_DB[rawScan] };
  }
  // Option B: JSON-encoded QR
  try {
    const parsed = JSON.parse(rawScan);
    if (parsed.id && parsed.productName) {
      return {
        qrId:        parsed.id,
        productName: parsed.productName,
        category:    parsed.category   || 'Uncategorized',
        unitCount:   parsed.unitCount  || 1,
      };
    }
  } catch {
    // Not JSON — fall through
  }
  return null; // Unknown QR code
}