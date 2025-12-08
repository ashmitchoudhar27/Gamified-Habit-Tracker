import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { badgeDetails } from "../utils/badgeDetails";
import Heatmap from "../components/Heatmap";

export default function Dashboard() {
  const { token, user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_BACKEND_URL;

  const [habitsList, setHabitsList] = useState([]);
  const [selectedHabitId, setSelectedHabitId] = useState("");

  // Fetch user + habits
  useEffect(() => {
    if (!token) {
      navigate("/login");
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
          loadHabits();
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }

      setLoading(false);
    };

    const loadHabits = async () => {
      try {
        const res = await fetch(`${API}/api/habits/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();

        if (json.success) setHabitsList(json.habits);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unauthorized.
      </div>
    );
  }

  // XP Logic
  const xp = user.xp ?? 0;
  const level = user.level ?? 1;
  const xpRequired = level * 100;
  const progressPercent = Math.min((xp / xpRequired) * 100, 100);

  return (
    <div className="min-h-screen bg-[#eef1f6] flex overflow-hidden">
      <Sidebar />

      {/* PAGE CONTENT */}
      <div className="flex-1 px-10 py-10 lg:px-16 max-w-[1400px] ml-56">

        {/* Header */}
        <div className="flex justify-between mb-12 items-center">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">
              {user.username} • Level {level}
            </span>

            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="px-5 py-2 bg-red-500 text-white rounded-xl shadow-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="glass-card mb-10 fade-in">
          <h2 className="text-2xl font-semibold">Welcome back 🎉</h2>
          <p className="text-gray-500 mt-1">
            Keep building great habits — you're doing amazing.
          </p>
        </div>

        {/* XP Progress */}
        <div className="glass-card mb-10 fade-in">
          <h2 className="text-xl font-semibold mb-4">XP Progress</h2>

          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-500"
            ></div>
          </div>

          <p className="text-gray-600 mt-3">
            XP: <b>{xp}</b> / {xpRequired} • Level <b>{level}</b>
          </p>
        </div>

        {/* HEATMAP SECTION */}
        <div className="glass-card mb-10 fade-in">
          <h2 className="text-xl font-semibold mb-4">Habit Heatmap</h2>

          <select
            className="border px-4 py-2 rounded-lg mb-5 bg-white shadow-sm"
            value={selectedHabitId}
            onChange={(e) => setSelectedHabitId(e.target.value)}
          >
            <option value="">Select a habit...</option>
            {habitsList.map((h) => (
              <option key={h._id} value={h._id}>
                {h.title}
              </option>
            ))}
          </select>

          {selectedHabitId ? (
            <Heatmap habitId={selectedHabitId} />
          ) : (
            <p className="text-gray-400">Select a habit to view progress.</p>
          )}
        </div>

        {/* BADGES */}
        <div className="glass-card mb-12 fade-in">
          <h2 className="text-xl font-semibold mb-6">Badges</h2>

          {(!user.badges || user.badges.length === 0) && (
            <p className="text-gray-400">No badges yet. Complete habits to earn them!</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.badges?.map((badge, i) => {
              const info = badgeDetails[badge];
              if (!info) return null;

              return (
                <div
                  key={i}
                  className="flex items-center gap-4 glass-inner p-5 rounded-2xl border border-white/30 shadow-md hover:shadow-xl transition-all fade-in-up"
                >
                  <span className="text-4xl">{info.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{info.title}</h3>
                    <p className="text-gray-500 text-sm">{info.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          <button
            onClick={() => navigate("/add-habit")}
            className="glass-button-purple fade-scale"
          >
            <h3 className="text-xl font-semibold">+ Add New Habit</h3>
            <p className="text-gray-100 text-sm mt-1">Create a new habit today.</p>
          </button>

          <button
            onClick={() => navigate("/habits")}
            className="glass-button-blue fade-scale"
          >
            <h3 className="text-xl font-semibold">View Habits</h3>
            <p className="text-gray-100 text-sm mt-1">Review your tracked habits.</p>
          </button>

        </div>
      </div>

      {/* GLASS UI & ANIMATIONS */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(20px);
          padding: 28px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.45);
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          animation: fadeIn 0.6s ease-out forwards;
        }

        .glass-inner {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(15px);
        }

        .glass-button-purple {
          background: linear-gradient(135deg, #a855f7, #9333ea);
          color: white;
          padding: 40px;
          border-radius: 22px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(147, 51, 234, 0.35);
          transition: 0.25s;
        }

        .glass-button-purple:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(147, 51, 234, 0.5);
        }

        .glass-button-blue {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          padding: 40px;
          border-radius: 22px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(37, 99, 235, 0.35);
          transition: 0.25s;
        }

        .glass-button-blue:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.5);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .fade-in-up {
          animation: fadeIn 0.7s ease-out;
        }

        .fade-scale {
          animation: fadeInScale 0.8s ease-out;
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
