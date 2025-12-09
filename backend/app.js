// backend/app.js
const express = require("express");
const cors = require("cors");
const app = express();
const analyticsRoutes = require("./routes/analyticsRoutes");


app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/habits", require("./routes/habitRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
// app.use("/api/analytics", analyticsRoutes);
app.use("/api/analytics", require("./routes/analyticsRoutes"));







module.exports = app;
