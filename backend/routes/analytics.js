const express = require("express");
const router = express.Router();
const Query = require("../models/Query");

router.get("/", async (req, res) => {
  try {
    const totalQueries = await Query.countDocuments();
    const byCategory = await Query.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const byStatus = await Query.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const byPriority = await Query.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);
    const byChannel = await Query.aggregate([
      { $group: { _id: "$channel", count: { $sum: 1 } } },
    ]);

    // Response time analytics (average time from creation to resolution)
    const responseTime = await Query.aggregate([
      { $match: { status: "resolved" } },
      {
        $group: {
          _id: null,
          avgResponseTime: {
            $avg: { $subtract: ["$updatedAt", "$createdAt"] },
          },
        },
      },
    ]);

    res.json({
      totalQueries,
      byCategory,
      byStatus,
      byPriority,
      byChannel,
      avgResponseTime: responseTime[0]?.avgResponseTime || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
