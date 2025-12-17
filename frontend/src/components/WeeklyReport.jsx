import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000";

export default function WeeklyReport() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/reports/weekly`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Server error");

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Server error");
      }
    };

    if (token) load();
  }, [token]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>Loading weekly report...</p>;

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">📊 Weekly Report</h3>

      <p className="text-2xl font-bold mb-4">
        {data.totalCompletions} completions
      </p>

      <ul className="space-y-2">
        {data.breakdown.map((h, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{h.title}</span>
            <span className="font-medium">{h.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
