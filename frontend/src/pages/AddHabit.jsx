// src/pages/AddHabit.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AddHabit() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Health");
  const [loading, setLoading] = useState(false);

  const createHabit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, category }),
      });

      const data = await res.json();

      if (res.ok) navigate("/habits");
      else alert(data.message || "Failed to create habit.");
    } catch {
      alert("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#e9edf5] relative overflow-hidden">

      {/* 🌈 Animated Apple-style floating gradient lights */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>

      {/* MAIN CONTENT (centered with sidebar space) */}
      <div className="ml-56 min-h-screen flex items-center justify-center px-6">

        <div className="glass-card w-full max-w-[760px] p-12 rounded-3xl relative z-10 fade-in">

          <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center tracking-tight">
            Add New Habit
          </h1>

          <form onSubmit={createHabit} className="space-y-8">

            {/* Title Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Habit Title
              </label>

              <input
                type="text"
                placeholder="e.g., Drink water, meditate…"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input w-full px-5 py-4 rounded-2xl border border-white/40 text-gray-800 text-lg"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input w-full px-5 py-4 rounded-2xl border border-white/40 cursor-pointer text-gray-800 text-lg"
              >
                <option>Health</option>
                <option>Productivity</option>
                <option>Mindfulness</option>
                <option>Fitness</option>
                <option>Learning</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-5 pt-4">

              {/* ✨ iOS 17 GLOW BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 glow-btn"
              >
                {loading ? "Creating…" : "Create Habit"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/habits")}
                className="flex-1 cancel-btn"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* 🌟 STYLES */}
      <style>{`

        /* ------------------------ */
        /*   Apple Floating Blobs   */
        /* ------------------------ */

        .bg-blob {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.55;
          animation: float 12s infinite ease-in-out;
          z-index: 0;
        }

        .blob-1 {
          background: #c084fc;
          top: -100px;
          left: 140px;
        }

        .blob-2 {
          background: #60a5fa;
          bottom: 0;
          right: 0;
        }

        .blob-3 {
          background: #f472b6;
          top: 40%;
          left: 60%;
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-70px) rotate(40deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        /* ------------------------ */
        /*   Glassmorphism Card     */
        /* ------------------------ */

        .glass-card {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255,255,255,0.45);
          box-shadow: 0 20px 70px rgba(0,0,0,0.12);
          animation: fadeIn 0.8s ease-out;
        }

        .glass-input {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(12px);
          transition: 0.25s;
        }

        .glass-input:focus {
          outline: none;
          border-color: #a855f7;
          box-shadow: 0 0 0 5px rgba(168,85,247,0.18);
        }

        /* ------------------------ */
        /*   iOS 17 Glow Button     */
        /* ------------------------ */

        .glow-btn {
          background: linear-gradient(135deg, #a855f7, #9333ea);
          color: white;
          padding: 18px;
          border-radius: 18px;
          font-size: 1.25rem;
          font-weight: 600;
          text-align: center;
          transition: 0.3s;
          box-shadow: 0 0 20px rgba(168,85,247,0.55);
        }

        .glow-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 35px rgba(168,85,247,0.75);
        }

        .cancel-btn {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 18px;
          padding: 18px;
          font-size: 1.2rem;
        }

        /* Fade animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .ml-56 { margin-left: 0 !important; }
        }

      `}</style>
    </div>
  );
}
