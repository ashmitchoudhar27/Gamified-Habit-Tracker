const express = require("express");
const router = express.Router();

// Empty route to avoid router error
router.get("/", (req, res) => {
  res.json({ message: "Rewards route running" });
});

module.exports = router;
