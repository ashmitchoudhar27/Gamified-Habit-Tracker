import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function WeeklyReport() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const res = await fetch(`${API}/api/reports/weekly`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load report");
          return;
        }

        setReport(data);
      } catch {
        setError("Server error");
      }
    };

    load();
  }, [token]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!report) return <p className="text-gray-400">Loading weekly report...</p>;

  // 📊 Insights
  const mostConsistent = [...report.habits].sort((a, b) => b.count - a.count)[0];
  const leastConsistent = [...report.habits].sort((a, b) => a.count - b.count)[0];

  return (
    <div className="glass-card mt-10 fade-in">

      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
        🧾 Weekly Report
      </h2>

      {/* Total */}
      <div className="mb-8">
        <p className="text-sm text-gray-500">Total Completions</p>
        <p className="text-3xl font-bold text-gray-900">
          {report.totalCompletions}
        </p>
      </div>

      {/* Habit List */}
      <div className="space-y-5">
        {report.habits.map((h, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 font-medium">{h.title}</span>
              <span className="text-gray-500">{h.count}</span>
            </div>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-800 transition-all duration-500"
                style={{ width: `${h.count * 20}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

        <div className="p-4 rounded-xl border bg-gray-50">
          ✅ <b>Most Consistent</b>
          <p className="mt-1 text-gray-700">{mostConsistent.title}</p>
        </div>

        <div className="p-4 rounded-xl border bg-gray-50">
          ⚠️ <b>Least Consistent</b>
          <p className="mt-1 text-gray-700">{leastConsistent.title}</p>
        </div>

        <div className="p-4 rounded-xl border bg-gray-50">
          🔥 <b>Consistency Tip</b>
          <p className="mt-1 text-gray-700">
            Try improving <b>{leastConsistent.title}</b> next week
          </p>
        </div>

      </div>
    </div>
  );
}
