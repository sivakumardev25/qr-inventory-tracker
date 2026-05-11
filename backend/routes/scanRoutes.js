const express = require("express");
const router = express.Router();

const Scan = require("../models/Scan");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {

   const { qrData, item } = req.body;

   const scan = new Scan({
      qrData,
      item,
      scannedBy: req.user.id
   });

   await scan.save();

   res.json(scan);
});

router.get("/", auth, async (req, res) => {

   if(req.user.role !== "admin"){
      return res.status(403).json({
         message: "Access denied"
      });
   }

   const scans = await Scan.find()
   .populate("scannedBy", "name email");

   res.json(scans);
});

router.get("/item/:item", auth, async (req, res) => {

   if(req.user.role !== "admin"){
      return res.status(403).json({
         message: "Access denied"
      });
   }

   const scans = await Scan.find({
      item: req.params.item
   }).populate("scannedBy", "name email");

   res.json(scans);
});

module.exports = router;