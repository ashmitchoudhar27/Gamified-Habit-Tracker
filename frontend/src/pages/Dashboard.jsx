import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { badgeDetails } from "../utils/badges";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1>Unauthorized. Please login.</h1>
      </div>
    );

  const xp = user.xp ?? 0;
  const level = user.level ?? 1;
  const xpRequired = level * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Top */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button onClick={logout} className="bg-red-600 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* XP Progress */}
      <div className="bg-gray-800 p-6 rounded-xl mb-6">
        <h2 className="text-xl font-bold mb-2">XP Progress</h2>

        <div className="w-full h-4 bg-gray-700 rounded overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${(xp / xpRequired) * 100}%` }}
          ></div>
        </div>

        <p className="mt-2">XP: {xp} / {xpRequired}</p>
        <p>Level: {level}</p>
      </div>

      {/* BADGES */}
      <div className="bg-gray-800 p-6 rounded-xl mb-6">
        <h2 className="text-xl font-bold mb-2">Your Badges</h2>

        {!user.badges?.length && (
          <p className="text-gray-400">No badges earned yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.badges?.map((key, index) => {
            const badge = badgeDetails[key];
            if (!badge) return null;

            return (
              <div
                key={index}
                className={`p-4 rounded-xl shadow ${badge.color} flex items-center gap-4`}
              >
                <div className="text-3xl">{badge.icon}</div>
                <div>
                  <h3 className="font-bold text-lg">{badge.title}</h3>
                  <p className="text-gray-200">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/add-habit")}
          className="bg-blue-600 p-6 rounded-xl"
        >
          + Add Habit
        </button>

        <button
          onClick={() => navigate("/habits")}
          className="bg-green-600 p-6 rounded-xl"
        >
          View Habits
        </button>
      </div>
    </div>
  );
}
