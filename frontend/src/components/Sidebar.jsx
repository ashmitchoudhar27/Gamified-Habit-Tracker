// src/components/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const API = import.meta.env.VITE_BACKEND_URL;

  const isActive = (path) => location.pathname === path;

  // ✅ Download Weekly Report
  const downloadWeeklyReport = async () => {
    try {
      const res = await fetch(`${API}/api/reports/weekly/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Failed to download report");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "weekly-report.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading report");
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white/70 backdrop-blur-xl border-r shadow-lg flex flex-col">
      
      {/* Logo */}
      <div
        className="px-6 py-6 flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <img src={logo} alt="logo" className="w-12 h-12 rounded-xl" />
        <div>
          <div className="font-semibold text-xl">HabitTracker</div>
          <div className="text-xs text-gray-500">Build streaks</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-4">
        <ul className="space-y-4">

          <li>
            <button
              onClick={() => navigate("/dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition
                ${isActive("/dashboard")
                  ? "bg-purple-600 text-white shadow"
                  : "text-gray-700 hover:bg-purple-100"
                }`}
            >
              Dashboard
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/add-habit")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition
                ${isActive("/add-habit")
                  ? "bg-purple-600 text-white shadow"
                  : "text-gray-700 hover:bg-purple-100"
                }`}
            >
              Add Habit
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/habits")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition
                ${isActive("/habits")
                  ? "bg-purple-600 text-white shadow"
                  : "text-gray-700 hover:bg-purple-100"
                }`}
            >
              Your Habits
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/analytics")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition
                ${isActive("/analytics")
                  ? "bg-purple-600 text-white shadow"
                  : "text-gray-700 hover:bg-purple-100"
                }`}
            >
              Analytics 📊
            </button>
          </li>

          {/* ✅ Download Weekly Report (same style) */}
          <li>
            <button
              onClick={downloadWeeklyReport}
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-purple-100 transition"
            >
               Download Weekly Report ⬇
            </button>
          </li>

        </ul>
      </nav>
    </aside>
  );
}
