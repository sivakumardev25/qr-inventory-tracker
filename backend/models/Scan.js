const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
  qrData: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  scannedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Scan", scanSchema);

