const express = require("express");
const User = require("../models/User");
const { auth, admin } = require("../middleware/auth");
const router = express.Router();

// Get all teams and their members
router.get("/", auth, admin, async (req, res) => {
  try {
    const teams = await User.aggregate([
      {
        $group: {
          _id: "$team",
          members: {
            $push: {
              id: "$_id",
              name: "$name",
              email: "$email",
              role: "$role",
              lastLogin: "$lastLogin",
              isActive: "$isActive",
            },
          },
          memberCount: { $sum: 1 },
        },
      },
    ]);

    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user team assignment
router.put("/:userId/team", auth, admin, async (req, res) => {
  try {
    const { team } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { team },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user role
router.put("/:userId/role", auth, admin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get team performance metrics
router.get("/performance", auth, admin, async (req, res) => {
  try {
    const teamPerformance = await User.aggregate([
      {
        $group: {
          _id: "$team",
          totalMembers: { $sum: 1 },
          activeMembers: {
            $sum: { $cond: ["$isActive", 1, 0] },
          },
          admins: {
            $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] },
          },
          agents: {
            $sum: { $cond: [{ $eq: ["$role", "agent"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json(teamPerformance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
