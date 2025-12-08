// src/components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // keep logo.png in src/assets

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-white shadow-lg border-r">
      <div
        className="px-6 py-6 flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <img src={logo} alt="logo" className="w-12 h-12 rounded-lg" />
        <div>
          <div className="font-semibold text-lg">HabitTracker</div>
          <div className="text-xs text-gray-500">Build streaks</div>
        </div>
      </div>

      <nav className="mt-6 px-4">
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full text-left bg-purple-600 text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition"
            >
              Dashboard
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/add-habit")}
              className="w-full text-left text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Add Habit
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/habits")}
              className="w-full text-left text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Your Habits
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
