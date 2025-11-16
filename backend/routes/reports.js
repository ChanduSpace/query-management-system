const express = require("express");
const Query = require("../models/Query");
const User = require("../models/User");
const { auth, admin } = require("../middleware/auth");
const router = express.Router();

// Advanced analytics for admin only
router.get("/advanced", auth, admin, async (req, res) => {
  try {
    const { startDate, endDate, team } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    let teamFilter = {};
    if (team && team !== "all") {
      teamFilter = { assignedTo: team };
    }

    // Response time analysis
    const responseTimeAnalysis = await Query.aggregate([
      { $match: { ...dateFilter, ...teamFilter, status: "resolved" } },
      {
        $group: {
          _id: null,
          avgResponseTime: {
            $avg: { $subtract: ["$updatedAt", "$createdAt"] },
          },
          minResponseTime: {
            $min: { $subtract: ["$updatedAt", "$createdAt"] },
          },
          maxResponseTime: {
            $max: { $subtract: ["$updatedAt", "$createdAt"] },
          },
        },
      },
    ]);

    // Query volume over time (daily for the last 30 days)
    const queryVolume = await Query.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Category trends
    const categoryTrends = await Query.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            category: "$category",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Team performance
    const teamPerformance = await Query.aggregate([
      {
        $match: {
          ...dateFilter,
          status: "resolved",
          assignedTo: { $ne: "" },
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          resolvedCount: { $sum: 1 },
          avgResolutionTime: {
            $avg: { $subtract: ["$updatedAt", "$createdAt"] },
          },
        },
      },
    ]);

    // Channel effectiveness
    const channelEffectiveness = await Query.aggregate([
      {
        $match: dateFilter,
      },
      {
        $group: {
          _id: "$channel",
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $eq: ["$status", "resolved"] },
                { $subtract: ["$updatedAt", "$createdAt"] },
                null,
              ],
            },
          },
        },
      },
    ]);

    // Agent performance
    const agentPerformance = await User.aggregate([
      { $match: { role: { $in: ["admin", "agent"] } } },
      {
        $lookup: {
          from: "queries",
          localField: "name",
          foreignField: "assignedTo",
          as: "assignedQueries",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          team: 1,
          totalAssigned: { $size: "$assignedQueries" },
          resolved: {
            $size: {
              $filter: {
                input: "$assignedQueries",
                as: "query",
                cond: { $eq: ["$$query.status", "resolved"] },
              },
            },
          },
          avgResolutionTime: {
            $avg: {
              $map: {
                input: {
                  $filter: {
                    input: "$assignedQueries",
                    as: "query",
                    cond: { $eq: ["$$query.status", "resolved"] },
                  },
                },
                as: "query",
                in: { $subtract: ["$$query.updatedAt", "$$query.createdAt"] },
              },
            },
          },
        },
      },
    ]);

    res.json({
      responseTimeAnalysis: responseTimeAnalysis[0] || {},
      queryVolume,
      categoryTrends,
      teamPerformance,
      channelEffectiveness,
      agentPerformance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export data for external analysis
router.get("/export", auth, admin, async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });

    // Convert to CSV format
    const csv = [
      [
        "ID",
        "Customer Name",
        "Customer Email",
        "Channel",
        "Category",
        "Priority",
        "Status",
        "Assigned To",
        "Created At",
        "Resolved At",
        "Message",
      ],
      ...queries.map((q) => [
        q._id,
        q.customerName,
        q.customerEmail,
        q.channel,
        q.category,
        q.priority,
        q.status,
        q.assignedTo || "Unassigned",
        q.createdAt.toISOString(),
        q.updatedAt.toISOString(),
        `"${q.message.replace(/"/g, '""')}"`, // Escape quotes for CSV
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=queries-export.csv"
    );
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
