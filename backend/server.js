const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

// ------------------------------
// ⭐ CONNECT DATABASE
// ------------------------------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    // ------------------------------
    // ⭐ START SERVER
    // ------------------------------
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB", err);
    process.exit(1);
  });
