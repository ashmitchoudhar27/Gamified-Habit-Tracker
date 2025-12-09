import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import "chart.js/auto";
import { Line, Bar, Radar } from "react-chartjs-2";

export default function Analytics() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API}/api/analytics/advanced`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.success) setData(json);
    };

    load();
  }, []);

  if (!data) return <div className="ml-56 p-8">Loading analytics...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-56 p-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Analytics Dashboard</h1>

        {/* MONTHLY TREND */}
        <div className="glass-card p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Monthly Progress</h2>
          <Line
            data={{
              labels: data.monthly.labels,
              datasets: [
                {
                  label: "Completions",
                  data: data.monthly.values,
                  borderColor: "#8b5cf6",
                  backgroundColor: "rgba(139, 92, 246, 0.25)",
                  tension: 0.3,
                  fill: true,
                },
              ],
            }}
          />
        </div>

        {/* XP TREND */}
        <div className="glass-card p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">XP Growth</h2>
          <Line
            data={{
              labels: data.xp.labels,
              datasets: [
                {
                  label: "XP",
                  data: data.xp.values,
                  borderColor: "#06b6d4",
                  backgroundColor: "rgba(6, 182, 212, 0.3)",
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
          />
        </div>

        {/* CATEGORY STRENGTH */}
        <div className="glass-card p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Category Strength</h2>
          <Radar
            data={{
              labels: Object.keys(data.categoryStrength),
              datasets: [
                {
                  label: "Strength",
                  data: Object.values(data.categoryStrength),
                  backgroundColor: "rgba(168, 85, 247, 0.3)",
                  borderColor: "#a855f7",
                },
              ],
            }}
          />
        </div>

        {/* TOP HABITS */}
        <div className="glass-card p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Top Habits</h2>
          <Bar
            data={{
              labels: data.topHabits.map(h => h.title),
              datasets: [
                {
                  label: "Completions",
                  data: data.topHabits.map(h => h.totalCompletions),
                  backgroundColor: "#3b82f6",
                },
              ],
            }}
          />
        </div>

        {/* STREAK INTENSITY */}
        <div className="glass-card p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Streak Intensity</h2>
          <Bar
            data={{
              labels: data.streakIntensity.map(h => h.title),
              datasets: [
                {
                  label: "Streak",
                  data: data.streakIntensity.map(h => h.streak),
                  backgroundColor: "#ef4444",
                },
              ],
            }}
          />
        </div>
      </main>
    </div>
  );
}
