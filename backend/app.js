const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes (these MUST export a router correctly)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/habits", require("./routes/habitRoutes"));
app.use("/api/rewards", require("./routes/rewardRoutes"));

app.get("/", (req, res) => {
  res.send("Habit Tracker API Running...");
});

module.exports = app;
