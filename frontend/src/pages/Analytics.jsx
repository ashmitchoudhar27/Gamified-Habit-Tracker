// src/pages/Analytics.jsx

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

// Chart.js Imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setData(json);
    };

    load();
  }, []);

  if (!data) return <div className="ml-56 p-8">Loading analytics...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-56 p-10 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Analytics</h1>

        {/* WEEKLY COMPLETION BAR CHART */}
        <div className="glass-card p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Weekly Completions</h2>
          <Bar
            data={{
              labels: data.weekly.map((d) => d.date),
              datasets: [
                {
                  label: "Completions",
                  data: data.weekly.map((d) => d.count),
                  backgroundColor: "#a855f7",
                },
              ],
            }}
          />
        </div>

        {/* CATEGORY DONUT */}
        <div className="glass-card p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Category Breakdown</h2>
          <Doughnut
            data={{
              labels: Object.keys(data.categories),
              datasets: [
                {
                  data: Object.values(data.categories),
                  backgroundColor: ["#6366f1", "#22c55e", "#eab308", "#ef4444"],
                  hoverOffset: 4,
                },
              ],
            }}
          />
        </div>

        {/* STREAK LEADERBOARD */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Top Streaks</h2>

          {data.streakLeaders.map((h, idx) => (
            <div
              key={idx}
              className="flex justify-between py-3 border-b last:border-none"
            >
              <span className="font-medium">{h.title}</span>
              <span>🔥 {h.streak} days</span>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(18px);
          border-radius: 18px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
          border: 1px solid rgba(255,255,255,0.4);
        }
      `}</style>
    </div>
  );
}
