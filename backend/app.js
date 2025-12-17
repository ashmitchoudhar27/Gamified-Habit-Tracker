const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes); // ✅ VERY IMPORTANT

module.exports = app;
