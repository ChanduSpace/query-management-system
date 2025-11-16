const express = require("express");
const router = express.Router();
const Query = require("../models/Query");
const {
  sendQueryAcknowledgement,
  sendQueryUpdate,
  sendQueryResolution,
} = require("../utils/emailService");

// In the create query endpoint
router.post("/", async (req, res) => {
  try {
    // ... existing code ...

    await query.save();

    // Send acknowledgement email
    if (query.customerEmail) {
      await sendQueryAcknowledgement(query);
    }

    res.status(201).json(query);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// In the update query endpoint
router.put("/:id", async (req, res) => {
  try {
    const oldQuery = await Query.findById(req.params.id);
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        $push: {
          history: {
            action: `Updated: ${Object.keys(req.body).join(", ")}`,
            user: "Admin",
          },
        },
      },
      { new: true }
    );

    // Send email notifications for important updates
    if (query.customerEmail) {
      if (req.body.status === "resolved" && oldQuery.status !== "resolved") {
        await sendQueryResolution(query);
      } else if (req.body.status && req.body.status !== oldQuery.status) {
        await sendQueryUpdate(query, `Status changed to ${req.body.status}`);
      } else if (
        req.body.assignedTo &&
        req.body.assignedTo !== oldQuery.assignedTo
      ) {
        await sendQueryUpdate(query, `Assigned to ${req.body.assignedTo}`);
      }
    }

    // Emit update notification

    res.json(query);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Auto-tagging function
const autoTagQuery = (message) => {
  const msg = message.toLowerCase();
  if (
    msg.includes("complaint") ||
    msg.includes("issue") ||
    msg.includes("problem") ||
    msg.includes("broken")
  ) {
    return "complaint";
  } else if (
    msg.includes("request") ||
    msg.includes("need") ||
    msg.includes("want") ||
    msg.includes("require")
  ) {
    return "request";
  } else if (
    msg.includes("feedback") ||
    msg.includes("review") ||
    msg.includes("rating")
  ) {
    return "feedback";
  }
  return "question";
};

// Priority detection
const detectPriority = (message, category) => {
  const msg = message.toLowerCase();
  if (
    msg.includes("urgent") ||
    category === "complaint" ||
    msg.includes("emergency") ||
    msg.includes("critical")
  ) {
    return "high";
  } else if (
    msg.includes("asap") ||
    msg.includes("important") ||
    msg.includes("priority")
  ) {
    return "medium";
  }
  return "low";
};

// Get all queries with filters
router.get("/", async (req, res) => {
  try {
    const { status, priority, category } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const queries = await Query.find(filter).sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new query
router.post("/", async (req, res) => {
  try {
    const { message, channel, customerEmail, customerName } = req.body;

    const category = autoTagQuery(message);
    const priority = detectPriority(message, category);

    const query = new Query({
      message,
      channel,
      category,
      priority,
      customerEmail,
      customerName,
      history: [
        {
          action: "Query received",
          user: "System",
        },
      ],
    });

    await query.save();
    res.status(201).json(query);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update query
router.put("/:id", async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        $push: {
          history: {
            action: `Updated: ${Object.keys(req.body).join(", ")}`,
            user: "Admin",
          },
        },
      },
      { new: true }
    );
    res.json(query);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete query
router.delete("/:id", async (req, res) => {
  try {
    await Query.findByIdAndDelete(req.params.id);
    res.json({ message: "Query deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add to create query endpoint
router.post("/", async (req, res) => {
  try {
    const { message, channel, customerEmail, customerName } = req.body;

    const category = autoTagQuery(message);
    const priority = detectPriority(message, category);

    const query = new Query({
      message,
      channel,
      category,
      priority,
      customerEmail,
      customerName,
      history: [
        {
          action: "Query received",
          user: "System",
        },
      ],
    });

    await query.save();

    // Emit real-time notification
    req.io.emit("newQuery", {
      type: "NEW_QUERY",
      message: `New ${category} from ${customerName}`,
      query: query,
      timestamp: new Date(),
    });

    res.status(201).json(query);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add to update query endpoint
router.put("/:id", async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        $push: {
          history: {
            action: `Updated: ${Object.keys(req.body).join(", ")}`,
            user: "Admin",
          },
        },
      },
      { new: true }
    );

    // Emit update notification
    req.io.emit("queryUpdated", {
      type: "QUERY_UPDATED",
      message: `Query ${req.params.id} was updated`,
      query: query,
      timestamp: new Date(),
    });

    res.json(query);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
