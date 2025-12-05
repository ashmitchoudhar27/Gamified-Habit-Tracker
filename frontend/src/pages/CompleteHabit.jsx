import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function CompleteHabit() {
  const { id } = useParams(); // habit id
  const { token } = useAuth();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);

  useEffect(() => {
    const completeHabit = async () => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/habits/${id}/complete`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setResult(res.data);
        setTimeout(() => navigate("/habits"), 2000); // Auto redirect
      } catch (error) {
        console.log(error);
      }
    };

    completeHabit();
  }, [id, token, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-6">
      {!result ? (
        <h2 className="text-2xl">Marking habit as complete...</h2>
      ) : (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-4">Habit Completed! 🎉</h1>
          <p className="text-lg">+{result.xpAwarded} XP gained</p>
          <p className="text-lg">Current Streak: {result.streak}</p>
          <p className="text-lg">Total Completions: {result.totalCompletions}</p>

          {result.leveledUp && (
            <p className="text-green-400 text-xl font-bold mt-4">
              🎉 LEVEL UP! You are now Level {result.newLevel}!
            </p>
          )}

          <p className="text-gray-400 mt-4">Redirecting to your habits...</p>
        </div>
      )}
    </div>
  );
}
