import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { badgeDetails } from "../utils/badges";

export default function Dashboard() {
  const { token, user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_BACKEND_URL;

  // -----------------------------------------------------
  // LOAD USER ONLY IF TOKEN EXISTS
  // -----------------------------------------------------
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.log("Error loading user:", err);
      }

      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // -----------------------------------------------------
  // AUTO-REDIRECT ON LOGOUT / NO TOKEN
  // -----------------------------------------------------
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D10] text-gray-300">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D10] text-white">
        Unauthorized. Please Login.
      </div>
    );
  }

  // -----------------------------------------------
  // XP + LEVEL LOGIC
  // -----------------------------------------------
  const xp = user.xp ?? 0;
  const level = user.level ?? 1;
  const xpRequired = level * 100;
  const progressPercent = Math.min((xp / xpRequired) * 100, 100);

  const badges = user.badges || [];

  return (
    <div className="min-h-screen bg-[#0D0D10] text-white px-6 py-10 overflow-x-hidden">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-wide">Dashboard</h1>

        <button
          onClick={logout}
          className="
            bg-red-600 hover:bg-red-700 
            px-5 py-2 rounded-xl 
            text-white font-semibold
            shadow-[0_0_12px_rgba(255,0,0,0.3)]
            hover:shadow-[0_0_18px_rgba(255,0,0,0.5)]
            transition-all duration-300
          "
        >
          Logout
        </button>
      </div>

      {/* Welcome */}
      <div
        className="
          bg-white/5 backdrop-blur-xl border border-white/10
          rounded-2xl p-6 shadow-[0_0_20px_rgba(80,0,200,0.15)]
          mb-8
        "
      >
        <h2 className="text-2xl font-semibold">Welcome back! 🎉</h2>
        <p className="text-gray-300 mt-1">Keep building streaks & leveling up.</p>
      </div>

      {/* XP Progress */}
      <div
        className="
          bg-white/5 backdrop-blur-xl border border-white/10
          rounded-2xl p-6 shadow-[0_0_20px_rgba(80,0,200,0.15)]
          mb-8
        "
      >
        <h2 className="text-xl font-semibold mb-4">Your XP Progress</h2>

        <div className="w-full h-4 bg-black/30 rounded-xl overflow-hidden border border-white/10">
          <div
            className="h-full bg-purple-500 transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <p className="mt-3 text-gray-300">
          XP: <b>{xp}</b> / {xpRequired}
        </p>
        <p className="text-gray-300">
          Level: <b>{level}</b>
        </p>
      </div>

      {/* Badges Section */}
      <div
        className="
          bg-white/5 backdrop-blur-xl border border-white/10
          rounded-2xl p-6 shadow-[0_0_20px_rgba(80,0,200,0.15)]
          mb-10
        "
      >
        <h2 className="text-xl font-semibold mb-4">Your Badges</h2>

        {badges.length === 0 && (
          <p className="text-gray-400">No badges yet. Keep going! ⭐</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badgeKey, idx) => {
            const info = badgeDetails[badgeKey];
            if (!info) return null;

            return (
              <div
                key={idx}
                className="
                  p-4 rounded-xl border border-white/10 bg-white/5
                  flex items-center gap-4 shadow-md
                "
              >
                <span className="text-3xl">{info.icon}</span>
                <div>
                  <h3 className="font-bold">{info.title}</h3>
                  <p className="text-gray-400 text-sm">{info.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate("/add-habit")}
          className="
            bg-purple-600 hover:bg-purple-700 
            p-6 rounded-2xl text-left shadow-lg
            hover:shadow-purple-500/30 transition-all duration-300
          "
        >
          <h3 className="text-xl font-bold">+ Add New Habit</h3>
          <p className="text-gray-300">Create a new habit today.</p>
        </button>

        <button
          onClick={() => navigate("/habits")}
          className="
            bg-blue-600 hover:bg-blue-700 
            p-6 rounded-2xl text-left shadow-lg
            hover:shadow-blue-500/30 transition-all duration-300
          "
        >
          <h3 className="text-xl font-bold">View Habits</h3>
          <p className="text-gray-300">Track progress & streaks.</p>
        </button>
      </div>
    </div>
  );
}
