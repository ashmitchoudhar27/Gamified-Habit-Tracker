import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <h1 className="text-white text-2xl">Unauthorized. Please Login.</h1>
      </div>
    );
  }

  // Read XP + Level directly from global AuthContext
  const xp = user?.xp ?? 0;
  const level = user?.level ?? 1;

  // XP Progress Calculation
  const xpRequired = level * 100;
  const progressPercent = Math.min((xp / xpRequired) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Top */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Welcome Card */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome Back! 🎉</h2>
        <p className="text-gray-400">Track habits, earn XP, level up daily.</p>
      </div>

      {/* XP Card */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Your XP Progress</h2>

        <div className="w-full h-4 bg-gray-700 rounded overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <p className="mt-2 text-gray-300">
          XP: <span className="font-bold">{xp}</span> / {xpRequired}
        </p>

        <p className="mt-1 text-gray-300">
          Level: <span className="font-bold">{level}</span>
        </p>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <button
          onClick={() => navigate("/add-habit")}
          className="bg-blue-600 p-6 rounded-xl shadow-lg hover:bg-blue-700 text-left"
        >
          <h3 className="text-xl font-bold">+ Add New Habit</h3>
          <p className="text-gray-300">Create habits to track daily progress.</p>
        </button>

        <button
          onClick={() => navigate("/habits")}
          className="bg-green-600 p-6 rounded-xl shadow-lg hover:bg-green-700 text-left"
        >
          <h3 className="text-xl font-bold">View Habits</h3>
          <p className="text-gray-300">See all your active habits.</p>
        </button>

      </div>
    </div>
  );
}
