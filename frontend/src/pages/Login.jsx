// frontend/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatsPreview from "../components/StatsPreview";
import WaveBackground from "../components/WaveBackground";

const QUOTES = [
  "Small habits, big results.",
  "Consistency > intensity.",
  "Do it today, thank yourself tomorrow.",
  "A streak is momentum — protect it.",
];

export default function Login() {
  const navigate = useNavigate();
  const { login, setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [previewUser, setPreviewUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(QUOTES[0]);

  // rotate quote every 6s
  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      idx = (idx + 1) % QUOTES.length;
      setQuote(QUOTES[idx]);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  // load preview user if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!cancelled && data?.user) setPreviewUser(data.user);
      } catch (err) {
        // ignore silently
        console.debug("Preview fetch failed", err);
      }
    };
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        login(data.token, data.user);
        setUser?.(data.user);
        navigate("/dashboard");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#07101a] flex items-center justify-center px-6">
      <WaveBackground />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 z-10">
        {/* Form (L3 Ultra minimal center panel) */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md p-8 rounded-2xl bg-white/4 border border-white/6 backdrop-blur-sm">
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-white">Welcome back</h1>
              <p className="mt-1 text-gray-300">{quote}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="text-xs text-gray-300">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="you@domain.com"
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-[#0f1720] border border-white/8 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>

              <label className="block">
                <span className="text-xs text-gray-300">Password</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  placeholder="your password"
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-[#0f1720] border border-white/8 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-300 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Right: small Stats preview / mascot */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* small mascot + card */}
            <div className="mb-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-[#06121b] to-[#0b1720] flex items-center justify-center border border-white/6" style={{ boxShadow: "0 10px 30px rgba(2,6,23,0.6)" }}>
                {/* Minimal mascot SVG */}
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" fill="#0f1720"/>
                  <path d="M8 13c.7-1.5 2.2-2 4-2s3.3.5 4 2" stroke="#8b5cf6" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M9.5 9a.5.5 0 11-1 0 .5.5 0 011 0zm6 0a.5.5 0 11-1 0 .5.5 0 011 0z" fill="#06b6d4"/>
                </svg>
              </div>

              <div>
                <div className="text-xs text-gray-300">Habit Tracker</div>
                <div className="text-lg font-semibold text-white">Calm Streaks</div>
              </div>
            </div>

            <StatsPreview user={previewUser} />

            {/* Motivational CTA */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Protect your streak — start with one tiny habit today.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
