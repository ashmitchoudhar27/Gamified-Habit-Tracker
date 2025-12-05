import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AddHabit() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("health");
  const [frequency, setFrequency] = useState("daily");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/habits",
        { title, category, frequency },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Habit Added Successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add habit");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Add New Habit</h1>

        {/* TITLE */}
        <label className="block mb-2 text-gray-300">Habit Title</label>
        <input
          type="text"
          required
          placeholder="Drink water, morning exercise, etc."
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* CATEGORY */}
        <label className="block mb-2 text-gray-300">Category</label>
        <select
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="health">Health</option>
          <option value="productivity">Productivity</option>
        </select>

        {/* FREQUENCY */}
        <label className="block mb-2 text-gray-300">Frequency</label>
        <select
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded mt-4"
        >
          Create Habit
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded mt-3"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
