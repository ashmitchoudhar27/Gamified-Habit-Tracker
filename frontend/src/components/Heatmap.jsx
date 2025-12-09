import React, { useEffect, useState } from "react";

export default function HabitHeatmap({ habitId, token, API }) {
  const [data, setData] = useState([]);
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    if (!habitId) return;

    fetch(`${API}/api/habits/${habitId}/heatmap?days=120`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
          processHeatmap(json.data);
        }
      });
  }, [habitId]);

  function processHeatmap(entries) {
    const weeksArr = [];

    // Initialize empty weeks
    for (let i = 0; i < 18; i++) weeksArr.push([]);

    let weekIndex = 0;

    entries.forEach((entry, i) => {
      const date = new Date(entry.date);
      const weekday = date.getDay(); // Sun=0

      // If Sunday, start a new column (next week)
      if (weekday === 0 && i !== 0) weekIndex++;

      if (!weeksArr[weekIndex]) weeksArr[weekIndex] = [];

      weeksArr[weekIndex][weekday] = entry.count;
    });

    setWeeks(weeksArr);
  }

  const getColor = (count) => {
    if (count === 0) return "#e5e7eb"; // gray-200
    if (count === 1) return "#c084fc"; // light purple
    if (count === 2) return "#a855f7";
    if (count >= 3) return "#7e22ce"; // darkest purple
  };

  const monthLabels = () => {
    const labels = [];
    weeks.forEach((week, i) => {
      const firstDay = new Date(data[i * 7]?.date);
      const month = firstDay.toLocaleString("default", { month: "short" });
      if (i === 0 || monthLabels[labels.length - 1] !== month) {
        labels.push(month);
      } else {
        labels.push("");
      }
    });
    return labels;
  };

  return (
    <div className="p-6 glass-card">
      <h2 className="text-xl font-semibold mb-4">GitHub-Style Heatmap</h2>

      {/* MONTH NAMES */}
      <div className="flex ml-10 text-sm text-gray-500 mb-2 gap-[10px]">
        {monthLabels().map((m, i) => (
          <span key={i} className="w-3 text-center">
            {m}
          </span>
        ))}
      </div>

      <div className="flex">
        {/* Weekday Labels */}
        <div className="flex flex-col justify-between mr-2 text-xs text-gray-500">
          <span>Sun</span>
          <span>Tue</span>
          <span>Thu</span>
          <span>Sat</span>
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-[3px]">
          {weeks.map((week, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-[3px]">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <div
                  key={day}
                  className="w-4 h-4 rounded-sm"
                  style={{
                    background: getColor(week?.[day] || 0),
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 