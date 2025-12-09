// src/components/CombinedHeatmap.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CombinedHeatmap() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [grid, setGrid] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/analytics/combined-heatmap`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (json.success) {
          setGrid(json.grid);
          setMonthLabels(json.monthLabels);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <div className="overflow-x-auto mt-6">
      {/* Month Labels */}
      <div className="flex ml-[32px]">
        {monthLabels.map((label, i) => (
          <div
            key={i}
            className="w-4 text-[10px] text-gray-500 text-center"
          >
            {label}
          </div>
        ))}
      </div>

      {/* GitHub-Style Heatmap Grid */}
      <div className="flex gap-[2px] mt-1">
        {grid.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-[2px]">
            {week.map((day, dayIdx) => {
              const intensity = day.count;

              let color = "#ebedf0"; // GitHub light theme base
              if (intensity > 0) color = "#9be9a8";
              if (intensity > 2) color = "#40c463";
              if (intensity > 4) color = "#30a14e";
              if (intensity > 6) color = "#216e39";

              return (
                <div
                  key={dayIdx}
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: color }}
                ></div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
        <span>Less</span>
        <div className="w-4 h-4 rounded-sm bg-[#ebedf0]"></div>
        <div className="w-4 h-4 rounded-sm bg-[#9be9a8]"></div>
        <div className="w-4 h-4 rounded-sm bg-[#40c463]"></div>
        <div className="w-4 h-4 rounded-sm bg-[#30a14e]"></div>
        <div className="w-4 h-4 rounded-sm bg-[#216e39]"></div>
        <span>More</span>
      </div>
    </div>
  );
}
