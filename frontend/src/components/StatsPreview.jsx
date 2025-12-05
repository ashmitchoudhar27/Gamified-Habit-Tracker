// frontend/src/components/StatsPreview.jsx
import React, { useMemo } from "react";

/**
 * Clean Zen stats preview — circular ring + small badges.
 * Expects `user` object with xp, level, streak, badges.
 */
export default function StatsPreview({ user }) {
  const xp = user?.xp ?? 0;
  const level = user?.level ?? 1;
  const streak = user?.streak ?? 0;
  const badges = user?.badges ?? [];

  const xpRequired = level * 100;
  const percent = Math.min(Math.round((xp / xpRequired) * 100), 100);

  // ring path (simple arc) using stroke-dasharray technique
  const circumference = 2 * Math.PI * 16; // radius 16
  const dash = (percent / 100) * circumference;

  const badgePreview = useMemo(() => badges.slice(0, 2), [badges]);

  return (
    <div className="w-full max-w-sm">
      <div
        className="p-6 rounded-2xl bg-white/4 border border-white/6 backdrop-blur-sm"
        style={{ boxShadow: "0 10px 30px rgba(2,6,23,0.6)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm text-gray-200 font-medium">Quick preview</h4>
            <p className="text-xs text-gray-400 mt-0.5">Your current progress</p>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-400">Level</div>
            <div className="text-lg font-semibold text-white">{level}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-none">
            <svg className="w-20 h-20" viewBox="0 0 40 40">
              <defs>
                <linearGradient id="sgrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none" />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="url(#sgrad)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                transform="rotate(-90 20 20)"
                style={{ transition: "stroke-dasharray 700ms ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-sm font-semibold text-white">{percent}%</div>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-xs text-gray-400">XP</div>
            <div className="text-lg font-medium text-white">{xp} / {xpRequired}</div>

            <div className="mt-3 text-xs text-gray-400">Streak</div>
            <div className="text-lg font-semibold text-white">🔥 {streak}</div>
          </div>
        </div>

        <div className="mt-5 flex gap-3 items-center">
          {badgePreview.length === 0 ? (
            <div className="text-xs text-gray-400">No badges yet</div>
          ) : (
            badgePreview.map((b, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg bg-white/6 border border-white/6 text-xs text-gray-100"
                style={{ animation: `floatIn 400ms ${i * 120}ms both` }}
              >
                {b}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
