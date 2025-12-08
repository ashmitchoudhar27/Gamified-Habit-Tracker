import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Heatmap({ habitId, days = 90 }) {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!habitId) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/habits/${habitId}/heatmap?days=${days}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    load();
  }, [habitId, days, token]);

  if (!habitId) return <p className="text-gray-500">Select a habit</p>;
  if (loading) return <p className="text-gray-500">Loading heatmap…</p>;

  const weeks = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));

  const max = Math.max(...data.map((d) => d.count), 1);

  const color = (count) => {
    if (count === 0) return "bg-gray-100 border";
    const pct = count / max;
    if (pct >= 0.8) return "bg-purple-600";
    if (pct >= 0.5) return "bg-purple-400";
    return "bg-purple-300";
  };

  return (
    <div className="flex gap-1 overflow-x-auto">
      {weeks.map((week, i) => (
        <div key={i} className="flex flex-col gap-1">
          {week.map((day, j) => (
            <div
              key={j}
              title={`${day.date}: ${day.count}`}
              className={`w-6 h-6 rounded-md ${color(day.count)}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
