import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddHabit() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("health");
  const API = import.meta.env.VITE_BACKEND_URL;

  const create = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API}/api/habits`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, category, frequency: "daily" })
      });
      navigate("/habits");
    } catch (err) {
      console.error(err);
      alert("Failed to create habit");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07080a] to-[#0b0f14] p-8 text-white flex items-center justify-center">
      <form onSubmit={create} className="w-full max-w-lg p-8 rounded-2xl"
        style={{
          background: "linear-gradient(180deg, rgba(18,8,30,0.6), rgba(10,6,18,0.45))",
          border: "1px solid rgba(167,139,250,0.06)",
          boxShadow: "0 12px 40px rgba(99,102,241,0.06)"
        }}>
        <h1 className="text-3xl font-bold mb-6">Add New Habit</h1>

        <label className="block mb-3">
          <span className="text-sm text-gray-300">Habit Title</span>
          <input required value={title} onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-lg bg-[#0f1724] border border-[#24102f] focus:outline-none" placeholder="Drink water, read, exercise..." />
        </label>

        <label className="block mb-6">
          <span className="text-sm text-gray-300">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-lg bg-[#0f1724] border border-[#24102f]">
            <option value="health">Health</option>
            <option value="productivity">Productivity</option>
            <option value="study">Study</option>
          </select>
        </label>

        <div className="flex gap-4">
          <button className="flex-1 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] px-4 py-3 rounded-lg font-semibold">Create Habit</button>
          <button type="button" onClick={() => navigate("/dashboard")} className="flex-1 bg-[#1f2937] px-4 py-3 rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  );
}
