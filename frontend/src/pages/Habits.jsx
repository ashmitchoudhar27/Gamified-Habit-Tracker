import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const { token, setUser } = useAuth(); // include setUser so we can update XP & level globally
  const API = import.meta.env.VITE_BACKEND_URL;

  // Fetch all habits on page load
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch(`${API}/api/habits`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Failed to fetch habits");
          return;
        }

        setHabits(data);
      } catch (err) {
        console.error("Error loading habits:", err);
        alert("Something went wrong loading habits.");
      }
    };

    fetchHabits();
  }, [token]);

  // COMPLETE HABIT FUNCTION
  const completeHabit = async (id) => {
    try {
      const res = await fetch(`${API}/api/habits/${id}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Complete habit response:", data);

      if (!res.ok) {
        alert(data.error || "Error completing habit");
        return;
      }

      // Update habit UI
      setHabits((prev) =>
        prev.map((h) =>
          h._id === id
            ? {
                ...h,
                streak: data.streak,
                totalCompletions: data.totalCompletions,
              }
            : h
        )
      );

      // 🔥 Update global user XP & Level so Dashboard updates instantly
      setUser((prev) => ({
        ...prev,
        xp: data.xp, 
        level: data.level,
      }));

      alert(
        `Habit completed!\nXP: ${data.xp}\nLevel: ${data.level}\nStreak: ${data.streak}`
      );
    } catch (err) {
      console.error("Error completing habit:", err);
      alert("Something went wrong completing the habit.");
    }
  };

  // DELETE HABIT FUNCTION
  const deleteHabit = async (id) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    try {
      const res = await fetch(`${API}/api/habits/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete habit");
        return;
      }

      setHabits((prev) => prev.filter((h) => h._id !== id));
      alert("Habit deleted successfully!");
    } catch (err) {
      console.error("Error deleting habit:", err);
      alert("Something went wrong deleting the habit.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Your Habits</h1>

      {habits.length === 0 && (
        <p className="text-gray-400">No habits added yet.</p>
      )}

      <div className="space-y-4">
        {habits.map((habit) => (
          <div
            key={habit._id}
            className="bg-gray-800 p-5 rounded-xl shadow flex justify-between items-center"
          >
            {/* Habit Info */}
            <div>
              <h2 className="text-xl font-semibold">{habit.title}</h2>
              <p className="text-gray-400">Category: {habit.category}</p>
              <p className="text-gray-400">
                Streak: 🔥 {habit.streak ?? 0} days
              </p>
              <p className="text-gray-600 text-sm">
                Total Completions: {habit.totalCompletions ?? 0}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => completeHabit(habit._id)}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                Complete ✓
              </button>

              <button
                onClick={() => deleteHabit(habit._id)}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Delete 🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
