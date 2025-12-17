// backend/controllers/reportController.js

const Habit = require("../models/Habit");
const PDFDocument = require("pdfkit");

// 📄 Weekly Report PDF Generator (REAL & WORKING)
exports.getWeeklyReport = async (req, res) => {
  try {
    const Habit = require("../models/Habit");
    const userId = req.user._id;

    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);

    const habits = await Habit.find({ user: userId });

    let total = 0;
    const breakdown = [];

    habits.forEach(habit => {
      let count = 0;

      habit.completions.forEach(c => {
        if (new Date(c.at) >= start) count++;
      });

      if (count > 0) {
        total += count;
        breakdown.push({
          title: habit.title,
          count
        });
      }
    });

    res.json({ totalCompletions: total, breakdown });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Weekly report failed" });
  }
};
exports.getWeeklyReportPDF = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });

    // ✅ MUST be set BEFORE piping
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=weekly-report.pdf"
    );

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    // ---- PDF CONTENT ----
    doc.fontSize(22).text("📊 Weekly Habit Report", { align: "center" });
    doc.moveDown();

    let total = 0;

    habits.forEach((habit) => {
      const count = habit.completions.length;
      total += count;

      doc
        .fontSize(14)
        .text(`${habit.title}`, { continued: true })
        .fontSize(14)
        .text(` — ${count} times`, { align: "right" });
    });

    doc.moveDown();
    doc.fontSize(16).text(`Total Completions: ${total}`, {
      align: "center",
    });

    doc.end(); // ✅ VERY IMPORTANT
  } catch (err) {
    console.error("PDF error:", err);

    // ❌ Do NOT send JSON if headers already sent
    if (!res.headersSent) {
      res.status(500).send("Failed to generate PDF");
    }
  }
};
