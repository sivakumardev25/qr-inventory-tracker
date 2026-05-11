const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Register routes
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await user.save();

  res.json({
    message: "User Registered",
  });
});

// Login routes
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //  console.log("req.body:", req.body);
    //  console.log("email:", email, "| password:", password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;
