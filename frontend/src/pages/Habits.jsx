// src/pages/Habits.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Habits() {
  const { token, user, setUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const API = import.meta.env.VITE_BACKEND_URL;

  // ---------------------------
  // 📌 Fetch my habits
  // ---------------------------
  useEffect(() => {
    if (!token) return;

    const fetchHabits = async () => {
      try {
        const res = await fetch(`${API}/api/habits/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Fetch habits failed:", res.status);
          return;
        }

        const data = await res.json();
        setHabits(data.habits || []);
      } catch (err) {
        console.error("fetchHabits error", err);
      }
    };

    fetchHabits();
  }, [token]);

  // ---------------------------
  // 📌 Complete Habit
  // ---------------------------
  const completeHabit = async (id) => {
    try {
      const res = await fetch(`${API}/api/habits/${id}/complete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to complete habit");
        return;
      }

      // Update streak + completions
      setHabits((prev) =>
        prev.map((h) =>
          h._id === id
            ? {
                ...h,
                currentStreak: data.habit.currentStreak,
                totalCompletions: data.habit.totalCompletions,
                lastCompletedAt: data.habit.lastCompletedAt,
              }
            : h
        )
      );

      // Update XP/Level if backend returns them
      if (data.user) {
        setUser((u) => ({ ...u, ...data.user }));
      }
    } catch (err) {
      console.error("completeHabit error:", err);
      alert("Something went wrong completing the habit.");
    }
  };

  // ---------------------------
  // 📌 Delete Habit
  // ---------------------------
  const deleteHabit = async (id, title) => {
    const ok = confirm(`Delete habit "${title}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`${API}/api/habits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert("Failed to delete habit");
        return;
      }

      // Remove from UI
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error("deleteHabit error:", err);
      alert("Error deleting habit.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-56 p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Habits</h1>

        {habits.length === 0 ? (
          <div className="text-gray-600">No habits yet. Add one!</div>
        ) : (
          habits.map((h) => (
            <div
              key={h._id}
              className="bg-white p-6 rounded-xl shadow mb-4 flex justify-between items-center"
            >
              {/* LEFT SECTION */}
              <div>
                <h3 className="text-xl font-semibold">{h.title}</h3>

                <div className="text-sm text-gray-500">
                  Category: {h.category}
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  🔥 Streak: {h.currentStreak ?? 0} days • Total completions:{" "}
                  {h.totalCompletions ?? 0}
                </div>
              </div>

              {/* RIGHT BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => completeHabit(h._id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
                >
                  Complete ✔
                </button>

                <button
                  onClick={() => deleteHabit(h._id, h.title)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                >
                  Delete 🗑
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
