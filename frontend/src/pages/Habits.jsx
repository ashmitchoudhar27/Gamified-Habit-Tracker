import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Habits() {
  const { token } = useAuth();
  const [habits, setHabits] = useState([]);

  const API = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch(`${API}/api/habits`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setHabits(data);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };

    fetchHabits();
  }, [token]);

  const completeHabit = async (id) => {
    try {
      const res = await fetch(`${API}/api/habits/${id}/complete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong completing habit.");
        return;
      }

      setHabits((prev) =>
        prev.map((h) => (h._id === id ? { ...h, ...data } : h))
      );
    } catch (err) {
      console.error("Error completing habit:", err);
    }
  };

  const deleteHabit = async (id) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    try {
      const res = await fetch(`${API}/api/habits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete habit.");
        return;
      }

      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0D0D10] px-6 py-10 overflow-x-hidden">
      
      <h1 className="text-4xl font-bold mb-10 tracking-wide text-white">
        Your Habits
      </h1>

      {habits.length === 0 ? (
        <p className="text-gray-400 text-lg">No habits added yet.</p>
      ) : (
        <div className="space-y-6">
          {habits.map((habit) => (
            <div
              key={habit._id}
              className="
                p-6 rounded-2xl border border-white/10 
                backdrop-blur-xl 
                bg-white/5
                shadow-[0_0_25px_rgba(80,0,200,0.15)]
                hover:shadow-[0_0_40px_rgba(120,0,255,0.35)]
                transition-all duration-300
              "
            >
              <h2 className="text-2xl font-semibold text-white drop-shadow-sm">
                {habit.title}
              </h2>

              <p className="text-gray-300 mt-1">
                <span className="font-medium text-gray-200">Category:</span>{" "}
                {habit.category}
              </p>

              <p className="text-gray-300 mt-2">
                <span className="font-medium text-gray-200">Streak:</span> 🔥{" "}
                {habit.streak} days
                <span className="ml-4 font-medium text-gray-200">
                  Completions:
                </span>{" "}
                {habit.totalCompletions}
              </p>

              <div className="flex gap-4 mt-6">
                {/* Complete Button */}
                <button
                  onClick={() => completeHabit(habit._id)}
                  className="
                    px-6 py-2 rounded-xl 
                    bg-purple-600 hover:bg-purple-700 
                    text-white font-medium 
                    shadow-[0_0_10px_rgba(150,0,255,0.4)]
                    hover:shadow-[0_0_20px_rgba(180,0,255,0.7)]
                    transition-all duration-300
                  "
                >
                  Complete ✓
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteHabit(habit._id)}
                  className="
                    px-6 py-2 rounded-xl 
                    bg-red-600 hover:bg-red-700 
                    text-white font-medium
                    shadow-[0_0_10px_rgba(255,40,40,0.5)]
                    hover:shadow-[0_0_20px_rgba(255,40,40,0.8)]
                    transition-all duration-300
                  "
                >
                  Delete 🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
