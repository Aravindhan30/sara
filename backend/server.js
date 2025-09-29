// ✅ Only load dotenv in local development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://sarah-app-jet.vercel.app"
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// Database
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fullstack_db";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // ADDED: Increase server selection timeout to 30 seconds (30000ms)
    // to prevent buffering timeout due to slow connections/DNS issues.
    serverSelectionTimeoutMS: 30000, 
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Routes
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend root working 🚀" });
});

// Health check
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Server is running 🚀", env: process.env.NODE_ENV });
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
