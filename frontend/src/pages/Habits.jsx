import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Habits() {
  const { token, user, setUser } = useAuth();
  const [habits, setHabits] = useState([]);

  const API = import.meta.env.VITE_BACKEND_URL;

  // Load habits list
  const loadHabits = async () => {
    const res = await fetch(`${API}/api/habits`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setHabits(data);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  // COMPLETE HABIT
  const completeHabit = async (id) => {
    try {
      const res = await fetch(`${API}/api/habits/${id}/complete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("Complete habit response:", data);

      if (data.error) {
        alert("Something went wrong completing the habit.");
        return;
      }

      // ⭐ UPDATE AUTH USER XP/LEVEL/BADGES
      setUser((prev) => ({
        ...prev,
        xp: data.xp,
        level: data.level,
        badges: data.badges ?? prev.badges,
      }));

      loadHabits();
    } catch (err) {
      console.error("Error completing habit:", err);
      alert("Something went wrong completing the habit.");
    }
  };

  // DELETE HABIT
  const deleteHabit = async (id) => {
    await fetch(`${API}/api/habits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadHabits();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Your Habits</h1>

      {habits.map((habit) => (
        <div key={habit._id} className="bg-gray-800 p-5 rounded-xl mb-4">
          <h2 className="text-2xl font-semibold">{habit.title}</h2>
          <p className="text-gray-400">Category: {habit.category}</p>
          <p className="text-gray-400">Streak: 🔥 {habit.streak} days</p>
          <p className="text-gray-400">Total Completions: {habit.totalCompletions}</p>

          <div className="flex gap-3 mt-3">
            <button
              onClick={() => completeHabit(habit._id)}
              className="bg-green-600 px-4 py-2 rounded"
            >
              Complete ✓
            </button>

            <button
              onClick={() => deleteHabit(habit._id)}
              className="bg-red-600 px-4 py-2 rounded"
            >
              Delete 🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
