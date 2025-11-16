const express = require("express");
const User = require("../models/User");
const { auth, admin } = require("../middleware/auth");
const router = express.Router();

// Get all users (admin only)
router.get("/", auth, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user (admin only)
router.post("/", auth, admin, async (req, res) => {
  try {
    const { name, email, password, role, team } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "agent",
      team: team || "general",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      team: user.team,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user (admin only)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user (admin only)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
