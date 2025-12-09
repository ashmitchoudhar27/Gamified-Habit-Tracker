import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CombinedHeatmap() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API}/api/analytics/combined-heatmap`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json);
    };
    load();
  }, []);

  if (!data) return <div>Loading heatmap...</div>;

  return (
    <div className="p-4">
      <div className="flex ml-12 mb-2">
        {data.monthLabels.map((m, i) => (
          <div key={i} className="w-5 text-xs text-gray-500">
            {m}
          </div>
        ))}
      </div>

      <div className="flex">
        {data.grid.map((week, wi) => (
          <div key={wi} className="mr-1">
            {week.map((day, di) => (
              <div
                key={di}
                className="w-4 h-4 mb-1 rounded-sm"
                style={{
                  background:
                    day.count === 0
                      ? "#ebedf0"
                      : day.count < 2
                      ? "#c6e48b"
                      : day.count < 4
                      ? "#7bc96f"
                      : "#239a3b",
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
