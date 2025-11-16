const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    channel: {
      type: String,
      required: true,
      enum: ["email", "social", "chat", "community"],
    },
    category: {
      type: String,
      enum: ["question", "request", "complaint", "feedback"],
      default: "question",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["new", "assigned", "in-progress", "resolved"],
      default: "new",
    },
    assignedTo: { type: String, default: "" },
    customerEmail: String,
    customerName: String,
    history: [
      {
        action: String,
        timestamp: { type: Date, default: Date.now },
        user: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", querySchema);
