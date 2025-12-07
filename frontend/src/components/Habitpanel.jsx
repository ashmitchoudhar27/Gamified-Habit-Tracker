// src/components/HabitPanel.jsx
import React from "react";

export default function HabitPanel({ title, subtitle, children }) {
  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
