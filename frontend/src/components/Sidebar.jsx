// src/components/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white/70 backdrop-blur-xl border-r shadow-lg flex flex-col">
      
      {/* Logo Section */}
      <div
        className="px-6 py-6 flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
        onClick={() => navigate("/dashboard")}
      >
        <img src={logo} alt="logo" className="w-12 h-12 rounded-xl shadow-md" />
        <div>
          <div className="font-semibold text-xl tracking-tight">HabitTracker</div>
          <div className="text-xs text-gray-500">Build streaks</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-4">
        <ul className="space-y-4">

          {/* Dashboard */}
          <li>
            <button
              onClick={() => navigate("/dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium
                ${isActive("/dashboard")
                  ? "bg-purple-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-700 hover:bg-purple-100"
                }`}
            >
              Dashboard
            </button>
          </li>

          {/* Add Habit */}
          <li>
            <button
              onClick={() => navigate("/add-habit")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium
                ${isActive("/add-habit")
                  ? "bg-purple-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-700 hover:bg-purple-100"
                }`}
            >
              Add Habit
            </button>
          </li>

          {/* Your Habits */}
          <li>
            <button
              onClick={() => navigate("/habits")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium
                ${isActive("/habits")
                  ? "bg-purple-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-700 hover:bg-purple-100"
                }`}
            >
              Your Habits
            </button>
          </li>

          {/* Analytics */}
          <li>
            <button
              onClick={() => navigate("/analytics")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium
                ${isActive("/analytics")
                  ? "bg-purple-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-700 hover:bg-purple-100"
                }`}
            >
              Analytics 📊
            </button>
          </li>

        </ul>
      </nav>

    </aside>
  );
}
