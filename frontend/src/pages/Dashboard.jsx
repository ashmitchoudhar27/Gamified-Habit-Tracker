// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { badgeDetails } from "../utils/badgeDetails";

export default function Dashboard() {
  const { token, user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_BACKEND_URL;

  // Load user data
  useEffect(() => {
    if (!token) return navigate("/login", { replace: true });

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.user) setUser(data.user);
        else navigate("/login", { replace: true });
      } catch (err) {
        navigate("/login", { replace: true });
      }

      setLoading(false);
    };

    fetchUser();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading...
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unauthorized. Please login.
      </div>
    );

  // XP / Level values
  const xp = user.xp ?? 0;
  const level = user.level ?? 1;
  const xpRequired = level * 100;
  const progressPercent = Math.min((xp / xpRequired) * 100, 100);

  const badges = user.badges || [];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">
      <Sidebar />

      <div className="flex-1 ml-[260px] pt-24 px-10 pb-10 max-w-7xl">


        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>

          <button
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
            className="
              bg-red-500 hover:bg-red-600 
              text-white px-5 py-2 rounded-lg 
              shadow-sm hover:shadow-md transition-all
            "
          >
            Logout
          </button>
        </div>

        {/* Welcome Section */}
        <div
          className="
            bg-white/80 backdrop-blur-xl 
            rounded-2xl p-6 mb-8 
            border border-gray-200 
            shadow-[0_8px_20px_rgba(0,0,0,0.05)]
          "
        >
          <h2 className="text-2xl font-semibold">Welcome back 🎉</h2>
          <p className="text-gray-500 mt-1">Keep up the great habits!</p>
        </div>

        {/* XP Progress */}
        <div
          className="
            bg-white/80 backdrop-blur-xl 
            rounded-2xl p-6 mb-8 
            border border-gray-200 
            shadow-[0_8px_20px_rgba(0,0,0,0.05)]
          "
        >
          <h2 className="text-xl font-semibold mb-4">Your XP Progress</h2>

          <div className="w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-3 text-gray-700">
            XP: <b>{xp}</b> / {xpRequired}
          </p>
          <p className="text-gray-700">
            Level: <b>{level}</b>
          </p>
        </div>

        {/* Badges */}
        <div
          className="
            bg-white/80 backdrop-blur-xl 
            rounded-2xl p-6 mb-10 
            border border-gray-200 
            shadow-[0_8px_20px_rgba(0,0,0,0.05)]
          "
        >
          <h2 className="text-xl font-semibold mb-4">Your Badges</h2>

          {badges.length === 0 && (
            <p className="text-gray-400">You haven’t earned any badges yet.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((key, i) => {
              const info = badgeDetails[key];
              if (!info) return null;

              return (
                <div
                  key={i}
                  className="
                    p-4 bg-white 
                    border border-gray-200 
                    rounded-xl shadow-sm 
                    hover:shadow-md transition-all 
                    flex gap-4 items-center
                  "
                >
                  <span className="text-3xl">{info.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{info.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {info.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
          <button
            onClick={() => navigate("/add-habit")}
            className="
              bg-gradient-to-r from-purple-500 to-purple-400 
              hover:shadow-lg hover:brightness-105 
              text-white p-6 rounded-xl 
              shadow-md transition-all
            "
          >
            <h3 className="text-xl font-semibold">+ Add New Habit</h3>
            <p className="text-white/90">Create a new habit today.</p>
          </button>

          <button
            onClick={() => navigate("/habits")}
            className="
              bg-gradient-to-r from-blue-500 to-blue-400 
              hover:shadow-lg hover:brightness-105 
              text-white p-6 rounded-xl 
              shadow-md transition-all
            "
          >
            <h3 className="text-xl font-semibold">View Habits</h3>
            <p className="text-white/90">See your tracked habits.</p>
          </button>
        </div>
      </div>
    </div>
    
  );
}
