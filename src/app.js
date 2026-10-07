const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/users.routes");
const courseRoutes = require("./modules/courses/courses.routes");
const attendanceRoutes = require("./modules/attendance/attendance.routes");

const app = express();

// ── Security Headers ──────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Rate Limiting ─────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per 15 min
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 login attempts per 15 min
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes",
  },
});

// Apply global limiter to all routes
app.use(globalLimiter);

app.use(express.json());

// ── Swagger Docs ──────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Routes ────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes); // stricter limit on login
app.use("/api/admin/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/attendance", attendanceRoutes);

// ── Health Check ──────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "LMP Backend is running! 🚀" });
});

// ── 404 Handler ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ──────────────────────────
app.use(errorHandler);

module.exports = app;
