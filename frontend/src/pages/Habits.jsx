// src/pages/Habits.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Habits() {
  const { token, user, setUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const API = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) return;
    const fetchHabits = async () => {
      try {
        const res = await fetch(`${API}/api/habits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setHabits(data || []);
      } catch (err) {
        console.error("fetchHabits error", err);
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
      if (!res.ok) {
        const t = await res.text();
        alert("Something went wrong completing the habit: " + (t || res.status));
        return;
      }
      const data = await res.json();
      // server returns xp/level/badges etc.
      if (data) {
        // update user object in context with returned fields if present
        setUser((u) => ({ ...(u || {}), xp: data.xp ?? u?.xp, level: data.level ?? u?.level, badges: data.badges ?? u?.badges }));
      }
      // refresh habit list
      setHabits((prev) => prev.map(h => (h._id === id ? { ...h, streak: data?.streak ?? h.streak, totalCompletions: data?.totalCompletions ?? h.totalCompletions, lastCompleted: new Date().toISOString() } : h)));
    } catch (err) {
      console.error("completeHabit error", err);
      alert("Something went wrong completing the habit.");
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
            <div key={h._id} className="bg-white p-6 rounded-lg shadow mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{h.title}</h3>
                <div className="text-sm text-gray-500">Category: {h.category}</div>
                <div className="mt-2 text-sm text-gray-600">Streak: 🔥 {h.streak ?? 0} days • Completions: {h.totalCompletions ?? 0}</div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => completeHabit(h._id)} className="bg-purple-600 text-white px-4 py-2 rounded-md">Complete ✔</button>
                <button onClick={async () => {
                  if(!confirm("Delete habit?")) return;
                  try {
                    const res = await fetch(`${API}/api/habits/${h._id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
                    if (res.ok) setHabits((prev) => prev.filter(x => x._id !== h._id));
                  } catch (err) { console.error(err); alert("Failed to delete");}
                }} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete 🗑</button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
