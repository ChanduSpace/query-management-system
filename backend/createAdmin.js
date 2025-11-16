const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// User model (same as your existing one)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "agent", "user"],
      default: "user",
    },
    team: {
      type: String,
      default: "general",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@helpdesk.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: "System Administrator",
      email: "admin@helpdesk.com",
      password: "admin123", // This will be hashed by the pre-save hook
      role: "admin",
      team: "general",
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@helpdesk.com");
    console.log("Password: admin123");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdminUser();
