const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

// Routes
const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const borrowRoutes = require("./routes/borrow.routes");
const queueRoutes = require("./routes/queue.routes");
const notificationRoutes = require("./routes/notification.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

// Sockets & Jobs
const initSocket = require("./sockets/socket");
const initOverdueJob = require("./jobs/overdueJob");

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true },
});
app.set("io", io);
initSocket(io);

// ── Security Middleware ──
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// ── Parsers ──
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Static Files ──
app.use("/uploads", express.static(__dirname + "/uploads"));

// ── Routes ──
app.use("/auth", authRoutes);
app.use("/book", bookRoutes);
app.use("/borrow", borrowRoutes);
app.use("/queue", queueRoutes);
app.use("/notification", notificationRoutes);
app.use("/dashboard", dashboardRoutes);

// ── Health Check ──
app.get("/health", (req, res) => res.json({ success: true, message: "ReadOra API is running." }));

// ── Global Error Handler (must be last) ──
app.use(errorHandler);

// ── Start ──
const PORT = process.env.PORT || 3600;

connectDB().then(() => {
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    initOverdueJob(io);
  });
});