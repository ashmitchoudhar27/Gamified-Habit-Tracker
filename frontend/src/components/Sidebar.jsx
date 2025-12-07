// src/components/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png"; // your monkey logo

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Add Habit", path: "/add-habit" },
    { name: "Your Habits", path: "/habits" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="
        fixed left-0 top-0 h-full w-64
        bg-white shadow-lg border-r border-gray-200
        flex flex-col items-start px-6 py-8
      "
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 mb-10 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <img
          src={logo}
          alt="Logo"
          className="w-12 h-12 rounded-xl shadow-sm object-cover"
        />
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
          HabitTracker
        </h1>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col gap-3 w-full">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`
              text-left px-4 py-3 rounded-xl font-medium text-sm
              transition-all duration-200 w-full

              ${
                isActive(item.path)
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
              }
            `}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
